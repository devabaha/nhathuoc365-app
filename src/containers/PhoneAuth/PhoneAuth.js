import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Keyboard,
  Text,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import countries from 'world-countries';
import appConfig from 'app-config';
import store from 'app-store';
import {RESEND_OTP_INTERVAL} from './constants';
import Loading from '../../components/Loading';
import EventTracker from '../../helper/EventTracker';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import PhoneRegister from './PhoneRegister';
import {Actions} from 'react-native-router-flux';
import AuthConfirm from './AuthConfirm';
import {APIRequest} from '../../network/Entity';
import {LOGIN_MODE, LOGIN_STEP} from '../../constants';
import PhoneAuthenticate from '../../helper/PhoneAuthenticate';
import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';
import firebaseAuth from '@react-native-firebase/auth';
import {servicesHandler, SERVICES_TYPE} from 'app-helper/servicesHandler';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  eulaTextContainer: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop:
      appConfig.device.height -
      30 -
      (appConfig.device.isAndroid
        ? appConfig.device.statusBarHeight
        : appConfig.device.bottomSpace),
  },
  eulaText: {
    color: appConfig.colors.text,
  },
});

class PhoneAuth extends Component {
  static defaultProps = {
    onCloseOTP: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: this.props.tel || '',
      confirmResult: this.props.showOTP || null,
      isShowIndicator: false,
      modalVisible: false,
      currentCountry: countries.filter((country) => country.cca2 == 'VN')[0],
    };
    this.eventTracker = new EventTracker();
    this.slackErrorFirebaseRequest = new APIRequest();
    this.requests = [this.slackErrorFirebaseRequest];
    this.unmounted = false;

    this.phoneAuth = new PhoneAuthenticate();
    this.phoneAuth.setCountry = this.state.currentCountry;
    this.phoneAuth.setInstantVerifySuccess = this.firebaseConfirmCode.bind(
      this,
    );
  }

  getGeoCurrentCountry() {
    fetch('https://get.geojs.io/v1/ip/country.json')
      .then((response) => response.json())
      .then(({country: cca2, country_3, ip, name}) => {
        const currentCountry = countries.filter(
          (country) => country.cca2 == cca2,
        )[0];
        this.handleSelectCountry(currentCountry);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  get isPhoneNumberValid() {
    try {
      return this.phoneAuth.isValidPhoneNumberForRegion(
        this.formatPhoneNumber(this.state.phoneNumber),
        this.state.currentCountry.cca2,
      );
    } catch (error) {
      return false;
    }
  }

  componentDidMount() {
    this.getGeoCurrentCountry();
    if (this.props.showOTP) {
      this.signIn();
    }
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();
    cancelRequests(this.requests);
    this.phoneAuth.setCancel = true;
  }

  signIn(type = LOGIN_MODE.FIREBASE) {
    if (
      isConfigActive(CONFIG_KEY.DISABLE_GOOGLE_FIREBASE_OTP_KEY) &&
      type === LOGIN_MODE.FIREBASE
    ) {
      type = LOGIN_MODE.CALL;
    }

    const {t} = this.props;
    Keyboard.dismiss();
    this.setState({isShowIndicator: true});
    this.phoneAuth.updateRegisterData(
      this.state.phoneNumber,
      type,
      this.formatCountryCode(),
      async (response) => {
        switch (this.phoneAuth.loginMode) {
          case LOGIN_MODE.FIREBASE:
            if (!!firebaseAuth().currentUser) {
              await firebaseAuth().signOut();
            }

            this.setState({
              confirmResult: response,
              message: '',
              isShowIndicator: false,
            });
            break;
          case LOGIN_MODE.CALL:
            if (response && response.status == STATUS_SUCCESS) {
              this.setState((prevState) => ({
                confirmResult: prevState.phoneNumber,
                message: '',
              }));
            } else {
              this.setState({
                message: response
                  ? response.message || t('smsBrandNameSendCodeFailMessage')
                  : t('smsBrandNameSendCodeFailMessage'),
              });
            }
            break;
        }
      },
      (error) => {
        switch (this.phoneAuth.loginMode) {
          case LOGIN_MODE.FIREBASE:
            break;
          case LOGIN_MODE.CALL:
            this.setState({
              message: t('smsBrandNameSendCodeFailMessage'),
            });
            break;
        }
      },
      () => {
        this.setState({
          isShowIndicator: false,
        });
      },
    );
    this.phoneAuth.signIn();
  }

  formatCountryCode(country = this.state.currentCountry) {
    let countryCode = '';
    if (country.idd.root) {
      countryCode += country.idd.root;
      if (country.idd.suffixes[0]) {
        countryCode += country.idd.suffixes[0];
      }
    }

    return countryCode;
  }

  formatPhoneNumber(phoneNumber, countryCode = this.formatCountryCode()) {
    if (phoneNumber.substring(0, 1) === '0') {
      phoneNumber = phoneNumber.substr(1);
    }

    return countryCode + phoneNumber;
  }

  firebaseConfirmCode(response) {
    this.verifyResponse(response);
  }

  backUpConfirmCode(response) {
    this.verifyResponse(response);
  }

  confirmCode() {
    Keyboard.dismiss();
    this.setState({isShowIndicator: true, message: ''});
    const {t} = this.props;
    this.phoneAuth.updateConfirmData(
      (response) => {
        console.log(response);
        switch (this.phoneAuth.loginMode) {
          case LOGIN_MODE.FIREBASE:
            this.firebaseConfirmCode(response);
            break;
          case LOGIN_MODE.CALL:
            this.backUpConfirmCode(response);
            break;
        }
      },
      (error, step) => {
        switch (step) {
          case LOGIN_STEP.REGISTER:
            break;
          case LOGIN_STEP.CONFIRM:
            this.setState({
              message: t('firebaseConfirmCodeFailMessage02'),
              isShowIndicator: false,
            });
            break;
          case LOGIN_STEP.GET_USER:
            this.setState({
              message: t('firebaseConfirmCodeFailMessage01'),
            });
            break;
          default:
            this.setState({
              message: t('smsBrandNameVerifyFailMessage'),
              isShowIndicator: false,
            });
            break;
        }
      },
      () => {
        this.setState({
          isShowIndicator: false,
        });
      },
      this.state.codeInput,
      this.state.confirmResult,
    );
    this.phoneAuth.confirmCode();
  }

  requestOTP() {
    this.signIn(LOGIN_MODE.CALL);
    this.setState({requestNewOtpCounter: RESEND_OTP_INTERVAL});
  }

  verifyResponse = (response) => {
    const user = response.data;
    store.setUserInfo(user);
    store.setAnalyticsUser(user);
    store.resetCartData();

    switch (response.status) {
      case STATUS_FILL_INFO_USER:
        this.goToRegister(response.data.name);

        break;
      case STATUS_SYNC_FLAG:
        Actions.replace(appConfig.routes.rootGpsStoreLocation);
        break;
      case STATUS_SUCCESS:
        if (response.data?.fill_info_user) {
          this.goToRegister(response.data.name);
        } else {
          Actions.replace(appConfig.routes.primaryTabbar);
        }
        break;
      default:
        this.setState({
          message: response.message,
        });
        break;
    }
  };

  goToRegister = (nameProps) => {
    const {t} = this.props;

    Actions.replace('op_register', {
      title: t('common:screen.register.mainTitle'),
      name_props: nameProps,
    });
  };

  handleChangeCodeInput(codeInput) {
    this.setState({codeInput});
  }

  handleChangePhoneNumber(phoneNumber) {
    this.setState({phoneNumber});
  }

  openCountryPicker() {
    Actions.push(appConfig.routes.countryPicker, {
      onPressCountry: this.handleSelectCountry.bind(this),
    });
  }

  handleSelectCountry(currentCountry) {
    this.setState({currentCountry});
    this.phoneAuth.setCountry = currentCountry;
  }

  handleBackToPhoneInput() {
    this.setState({
      confirmResult: null,
      message: '',
    });
  }

  openEULAAgreement = () => {
    Keyboard.dismiss();

    servicesHandler({
      type: SERVICES_TYPE.EULA_AGREEMENT,
    });
  };

  render() {
    const {
      confirmResult,
      isShowIndicator,
      phoneNumber,
      codeInput,
      message,
    } = this.state;

    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={styles.container}
        contentContainerStyle={{flexGrow: 1}}>
        <SafeAreaView style={styles.container}>
          {isShowIndicator && <Loading center />}
          {!!confirmResult ? (
            <AuthConfirm
              confirmDisabled={!codeInput}
              phoneNumber={this.formatPhoneNumber(phoneNumber)}
              onChangeCode={this.handleChangeCodeInput.bind(this)}
              onConfirmCode={this.confirmCode.bind(this)}
              onRequestNewOtp={this.requestOTP.bind(this)}
              onBackToPhoneInput={this.handleBackToPhoneInput.bind(this)}
              message={message}
            />
          ) : (
            <PhoneRegister
              country={this.state.currentCountry}
              phoneNumber={this.state.phoneNumber}
              registerDisabled={!this.isPhoneNumberValid}
              onPressCountry={this.openCountryPicker.bind(this)}
              onChangePhoneNumber={this.handleChangePhoneNumber.bind(this)}
              onSignIn={() => this.signIn()}
              message={message}
            />
          )}
          {appConfig.device.isIOS && <KeyboardSpacer />}

          <TouchableOpacity
            style={styles.eulaTextContainer}
            onPress={this.openEULAAgreement}>
            <Text style={styles.eulaText}>
              {this.props.t('common:eulaAgreement')}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

export default withTranslation(['phoneAuth', 'common'])(PhoneAuth);
