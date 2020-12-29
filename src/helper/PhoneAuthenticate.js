import firebaseAuth from '@react-native-firebase/auth';
import DeviceInfo from 'react-native-device-info';
import {LOGIN_MODE, LOGIN_STEP} from '../constants';
import {formatErrorEvents} from '../constants/analytics';
import {ANALYTICS_RAW_EVENTS_NAME} from '../constants/analytics/eventsName';
import EventTracker from './EventTracker';
import store from 'app-store';
import appConfig from 'app-config';
import {APIRequest} from '../network/Entity';

class PhoneAuthenticate {
  constructor(
    phoneNumber = '',
    loginMode = LOGIN_MODE.FIREBASE,
    countryCode = '+84',
    callBackSuccess = () => {},
    callBackFailure = () => {},
    callBackFinally = () => {},
    instantVerifySuccess = () => {},
    code = '',
    confirmResult = null,
    isCancel = false,
    eventTracker = new EventTracker(),
    slackErrorFirebaseRequest = new APIRequest(),
  ) {
    this.loginMode = loginMode;
    this.phoneNumber = phoneNumber;
    this.countryCode = countryCode;
    this.callBackSuccess = callBackSuccess;
    this.callBackFailure = callBackFailure;
    this.callBackFinally = callBackFinally;
    this.instantVerifySuccess = instantVerifySuccess;
    this.code = code;
    this.confirmResult = confirmResult;
    this.isCancel = isCancel;
    this.eventTracker = eventTracker;
    this.slackErrorFirebaseRequest = slackErrorFirebaseRequest;

    this.isFirebaseVerifying = false;
    this.firebaseAuthStateChangedListener = firebaseAuth().onAuthStateChanged(
      (user) => {
        console.log(user);
        if (user && this.phoneNumber) {
          this.getFirebaseUserIdToken(user, true);
        }
      },
    );

    this.phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
  }

  isValidPhoneNumberForRegion(p, c) {
    const number = this.phoneUtil.parseAndKeepRawInput(p, c);
    const isValid = this.phoneUtil.isValidNumberForRegion(number, c);
    return isValid;
  }

  get formattedPhoneNumber() {
    return this.formatPhoneNumber();
  }

  set setPhoneNumber(phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  set setCancel(isCancel) {
    this.isCancel = isCancel;
    if (isCancel) {
      cancelRequests([this.slackErrorFirebaseRequest]);
      this.firebaseAuthStateChangedListener();
    }
  }

  set setInstantVerifySuccess(instantVerifySuccess) {
    this.instantVerifySuccess = instantVerifySuccess;
  }

  updateRegisterData(
    phoneNumber = '',
    loginMode = LOGIN_MODE.FIREBASE,
    countryCode = '+84',
    callBackSuccess = () => {},
    callBackFailure = () => {},
    callBackFinally = () => {},
  ) {
    this.loginMode = loginMode;
    this.phoneNumber = phoneNumber;
    this.countryCode = countryCode;
    this.callBackSuccess = callBackSuccess;
    this.callBackFailure = callBackFailure;
    this.callBackFinally = callBackFinally;
  }

  updateConfirmData(
    callBackSuccess = () => {},
    callBackFailure = () => {},
    callBackFinally = () => {},
    code = '',
    confirmResult = null,
  ) {
    this.callBackSuccess = callBackSuccess;
    this.callBackFailure = callBackFailure;
    this.callBackFinally = callBackFinally;
    this.code = code;
    this.confirmResult = confirmResult;
  }

  formatPhoneNumber(
    phoneNumber = this.phoneNumber,
    countryCode = this.countryCode,
  ) {
    if (phoneNumber.substring(0, 2) === countryCode.replace('+', '')) {
      phoneNumber = phoneNumber.substr(2);
    } else if (phoneNumber.substring(0, 1) === '0') {
      phoneNumber = phoneNumber.substr(1);
    }

    return countryCode + phoneNumber;
  }

  signIn() {
    this.isFirebaseVerifying = false;
    if (this.phoneNumber.includes('912345678')) {
      this.backUpSignIn();
      return;
    }
    switch (this.loginMode) {
      case LOGIN_MODE.FIREBASE:
        this.firebaseSignIn();
        break;
      case LOGIN_MODE.CALL:
        this.backUpSignIn();
        break;
    }
  }

  firebaseSignIn() {
    this.loginMode = LOGIN_MODE.FIREBASE;
    const formattedPhoneNumber = this.formattedPhoneNumber;

    firebaseAuth()
      .signInWithPhoneNumber(formattedPhoneNumber)
      .then((confirmResult) => {
        if (this.isCancel) return;
        this.callBackSuccess(confirmResult);
      })
      .catch((error) => {
        console.log('%cphone_auth_error', 'color:red', error);
        this.handleErrorFirebase(error, LOGIN_STEP.REGISTER);
        this.callBackFailure(error);
        if (this.isCancel) return;
        this.backUpSignIn(formattedPhoneNumber);
      });
  }

  async backUpSignIn() {
    this.loginMode = LOGIN_MODE.CALL;

    try {
      let formattedPhoneNumber = this.formattedPhoneNumber;

      const formData = {
        username: formattedPhoneNumber,
      };

      const response = await APIHandler.user_login_sms(formData);
      if (this.isCancel) return;
      this.callBackSuccess(response);
    } catch (error) {
      if (this.isCancel) return;
      console.log('%cbackup_sign_in', 'color:red', error);
      this.callBackFailure(error);
    } finally {
      if (!this.isCancel) {
        this.callBackFinally();
      }
    }
  }

  confirmCode() {
    switch (this.loginMode) {
      case LOGIN_MODE.FIREBASE:
        this.firebaseConfirmCode();
        break;
      case LOGIN_MODE.CALL:
        this.smsBrandNameVerify();
        break;
    }
  }

  async smsBrandNameVerify() {
    try {
      const formData = {
        username: this.confirmResult,
        otp: this.code,
      };
      const response = await APIHandler.login_sms_verify(formData);
      if (this.isCancel) return;
      this.callBackSuccess(response);
    } catch (err) {
      if (this.isCancel) return;
      console.log('error', error);
      this.callBackFailure(err);
    }
  }

  firebaseConfirmCode() {
    if (this.confirmResult && this.code.length) {
      try {
        this.confirmResult
          .confirm(this.code)
          .then(({user}) => {
            this.getFirebaseUserIdToken(user);
          })
          .catch((error) => {
            console.log('error_firebase_get_user', error);
            this.handleErrorFirebase(error, LOGIN_STEP.CONFIRM);
            if (this.isCancel) return;

            this.callBackFailure(error, LOGIN_STEP.CONFIRM);
          });
      } catch (error) {
        console.log('error_firebase_confirm', error);
        this.callBackFinally();
      }
    }
  }

  getFirebaseUserIdToken(user, isInstantVerified = false) {
    console.log('1', this.isCancel, this.isFirebaseVerifying);
    if (this.isCancel || this.isFirebaseVerifying) return;
    console.log('user', user);
    this.isFirebaseVerifying = true;
    try {
      if (user) {
        user
          .getIdToken(true)
          .then(async (idToken) => {
            console.log('2', this.isCancel, this.isFirebaseVerifying, );
            if (this.isCancel) return;
            const response = await APIHandler.login_firebase_verify({
              token: idToken,
            });
            console.log('response', response, this.isCancel, isInstantVerified)
            if (this.isCancel) return;
            this.isFirebaseVerifying = false;

            if (isInstantVerified) {
              this.instantVerifySuccess(response);
            } else {
              this.callBackSuccess(response);
            }
          })
          .catch((error) => {
            console.log('error_firebase_confirm_user', error);
            this.handleErrorFirebase(error, LOGIN_STEP.GET_USER);
            if (this.isCancel) return;

            this.callBackFailure(error, LOGIN_STEP.GET_USER);
          })
          .finally(() => {
            if (this.isCancel) return;
            this.isFirebaseVerifying = false;
            this.callBackFinally();
          });
      } else {
        this.isFirebaseVerifying = false;
        this.callBackFailure(error, LOGIN_STEP.CONFIRM);
      }
    } catch (error) {
      this.isFirebaseVerifying = false;
      console.log('error_firebase_verifying', error);
    }
  }

  async handleErrorFirebase(error, step) {
    const errMess = error.message;
    let errMessForSlack = errMess,
      errMessForFirebase = errMess;
    if (typeof errMess === 'string') {
      errMessForFirebase = errMess.substring(0, 30);
    } else {
      errMessForFirebase = '';
      errMessForSlack = JSON.stringify(error);
    }
    this.eventTracker.logEvent(
      formatErrorEvents(ANALYTICS_RAW_EVENTS_NAME.error.phoneAuthFirebase),
      {
        params: {
          message: errMess,
        },
      },
    );
    const storeId = store && store.store_id ? `[${store.store_id}] ` : '';
    const brand = DeviceInfo.getBrand();
    const deviceId = DeviceInfo.getDeviceId();
    let apiLevel = await DeviceInfo.getApiLevel();
    apiLevel = apiLevel && apiLevel > 0 ? `  •  ${apiLevel}` : '';
    const headerMess = this.phoneNumber;
    const deviceInfo =
      brand + '  •  ' + deviceId + apiLevel + '  •  ' + headerMess;

    const errMessBlock = {
      type: 'section',
      text: {
        type: 'plain_text',
        text: errMessForSlack,
      },
    };
    if (store && store.store_data && store.store_data.logo_url) {
      errMessBlock.accessory = {
        type: 'image',
        image_url: store.store_data.logo_url,
        alt_text: 'logo app',
      };
    }
    const attachments = [
      {
        color: appConfig.colors.primary,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: step,
            },
          },
          {
            type: 'divider',
          },
          {...errMessBlock},
        ],
      },
    ];

    const data = {
      username: `${storeId}${APP_NAME_SHOW}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: deviceInfo,
          },
        },
      ],
      attachments,
    };

    this.slackErrorFirebaseRequest.data = APIHandler.slack_error_firebase(data);
    const response = await this.slackErrorFirebaseRequest.promise();
  }
}

export default PhoneAuthenticate;
