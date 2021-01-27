import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import countries from 'world-countries';
import appConfig from 'app-config';
import store from 'app-store';
import { RESEND_OTP_INTERVAL } from './constants';
import Loading from '../../components/Loading';
import EventTracker from '../../helper/EventTracker';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import PhoneRegister from './PhoneRegister';
import { Actions } from 'react-native-router-flux';
import AuthConfirm from './AuthConfirm';
import { APIRequest } from '../../network/Entity';
import { LOGIN_MODE, LOGIN_STEP } from '../../constants';
import PhoneAuthenticate from '../../helper/PhoneAuthenticate';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  }
});

class PhoneAuth extends Component {
  static defaultProps = {
    onCloseOTP: () => {}
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
      currentCountry: countries.filter(country => country.cca2 == 'VN')[0]
    };
    this.eventTracker = new EventTracker();
    this.slackErrorFirebaseRequest = new APIRequest();
    this.requests = [this.slackErrorFirebaseRequest];
    this.unmounted = false;

    this.phoneAuth = new PhoneAuthenticate();
    this.phoneAuth.setInstantVerifySuccess = this.firebaseConfirmCode.bind(this);
  }

  getGeoCurrentCountry() {
    fetch('https://get.geojs.io/v1/ip/country.json')
      .then(response => response.json())
      .then(({ country: cca2, country_3, ip, name }) => {
        const currentCountry = countries.filter(
          country => country.cca2 == cca2
        )[0];
        this.setState({ currentCountry });
      })
      .catch(error => {
        console.error(error);
      });
  }

  get isPhoneNumberValid() {
    try {
      return this.phoneAuth.isValidPhoneNumberForRegion(
        this.formatPhoneNumber(this.state.phoneNumber),
        this.state.currentCountry.cca2
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

  signIn() {
    const { t } = this.props;
    Keyboard.dismiss();
    this.setState({ isShowIndicator: true });
    this.phoneAuth.updateRegisterData(
      this.state.phoneNumber,
      LOGIN_MODE.FIREBASE,
      this.formatCountryCode(),
      response => {
        switch (this.phoneAuth.loginMode) {
          case LOGIN_MODE.FIREBASE:
            this.setState({
              confirmResult: response,
              message: '',
              isShowIndicator: false
            });
            break;
          case LOGIN_MODE.CALL:
            if (response && response.status == STATUS_SUCCESS) {
              this.setState(prevState => ({
                confirmResult: prevState.phoneNumber,
                message: ''
              }));
            } else {
              this.setState({
                message: response
                  ? response.message || t('smsBrandNameSendCodeFailMessage')
                  : t('smsBrandNameSendCodeFailMessage')
              });
            }
            break;
        }
      },
      error => {
        switch (this.phoneAuth.loginMode) {
          case LOGIN_MODE.FIREBASE:
            break;
          case LOGIN_MODE.CALL:
            this.setState({
              message: t('smsBrandNameSendCodeFailMessage')
            });
            break;
        }
      },
      () => {
        this.setState({
          isShowIndicator: false
        });
      }
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
    if (phoneNumber.substring(0, 2) === countryCode.replace('+', '')) {
      phoneNumber = phoneNumber.substr(2);
    } else if (phoneNumber.substring(0, 1) === '0') {
      phoneNumber = phoneNumber.substr(1);
    }

    return countryCode + phoneNumber;
  }

  firebaseConfirmCode(response) {
    if (response && response.status == STATUS_SUCCESS) {
      this.verifyResponse(response);
    } else {
      this.setState({
        message: response.message
      });
    }
  }

  backUpConfirmCode(response) {
    this.setState({ isShowIndicator: true }, () => {
      if (response && response.status == STATUS_SUCCESS) {
        this.setState(
          {
            message: '',
            isShowIndicator: false
          },
          () => this.verifyResponse(response)
        );
      } else {
        this.setState({
          message: response.message,
          isShowIndicator: false
        });
      }
    });
  }

  confirmCode() {
    Keyboard.dismiss();
    this.setState({ isShowIndicator: true, message: '' });
    const { t } = this.props;
    this.phoneAuth.updateConfirmData(
      response => {
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
              isShowIndicator: false
            });
            break;
          case LOGIN_STEP.GET_USER:
            this.setState({
              message: t('firebaseConfirmCodeFailMessage01')
            });
            break;
          default:
            this.setState({
              message: t('smsBrandNameVerifyFailMessage'),
              isShowIndicator: false
            });
            break;
        }
      },
      () => {
        this.setState({
          isShowIndicator: false
        });
      },
      this.state.codeInput,
      this.state.confirmResult
    );
    this.phoneAuth.confirmCode();
  }

  requestOTP() {
    this.signIn();
    this.setState({ requestNewOtpCounter: RESEND_OTP_INTERVAL });
  }

  verifyResponse(response) {
    store.setUserInfo(response.data);
    store.setAnalyticsUser(response.data);
    store.resetCartData();
    const { t } = this.props;
    if (response.data && response.data.fill_info_user) {
      //hien thi chon site
      Actions.replace('op_register', {
        title: t('common:screen.register.mainTitle'),
        name_props: response.data.name
      });
    } else {
      this.props.setTabVisible({
        [appConfig.routes.roomTab]: !!response.data.view_beehome,
        [appConfig.routes.listBeeLand]: response.data.view_beeland
      });
      Actions.replace(appConfig.routes.primaryTabbar);
      if (response.data.room) {
        Actions.jump(appConfig.routes.roomTab);
      }
    }
  }

  handleChangeCodeInput(codeInput) {
    this.setState({ codeInput });
  }

  handleChangePhoneNumber(phoneNumber) {
    this.setState({ phoneNumber });
  }

  openCountryPicker() {
    Actions.push(appConfig.routes.countryPicker, {
      onPressCountry: this.handleSelectCountry.bind(this)
    });
  }

  handleSelectCountry(currentCountry) {
    this.setState({ currentCountry });
  }

  handleBackToPhoneInput() {
    this.setState({
      confirmResult: null,
      message: ''
    });
  }

  render() {
    const {
      confirmResult,
      isShowIndicator,
      phoneNumber,
      codeInput,
      message
    } = this.state;

    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
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
              onSignIn={this.signIn.bind(this)}
              message={message}
            />
          )}
          {appConfig.device.isIOS && <KeyboardSpacer />}
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

export default withTranslation(['phoneAuth', 'common'])(PhoneAuth);
