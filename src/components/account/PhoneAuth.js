import { empty } from '../../util/stringHelper';

console.disableYellowBox = true;
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Modal,
  FlatList,
  SafeAreaView,
  Dimensions,
  ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import config from '../../config';
import countries from 'world-countries';
import Icon from 'react-native-vector-icons/MaterialIcons';
import store from '../../store/Store';
import Loading from '../Loading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import appConfig from 'app-config';
const timer = require('react-timer-mixin');

const loginMode = {
  FIREBASE: 'FIREBASE',
  SMS_BRAND_NAME: 'SMS_BRAND_NAME'
};

class PhoneAuth extends Component {
  static defaultProps = {
    onCloseOTP: () => {}
  };

  constructor(props) {
    super(props);
    this.unsubscribe = null;
    // this.loginMode = props.loginMode
    //   ? props.loginMode
    //   : loginMode.SMS_BRAND_NAME;
    this.loginMode = loginMode.SMS_BRAND_NAME;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: this.props.tel || '',
      confirmResult: this.props.showOTP || null,
      isShowIndicator: false,
      modalVisible: false,
      currentCountry: countries.filter(country => country.cca2 == 'VN'),
      requestNewOtpCounter: requestSeconds
    };
  }

  componentDidMount() {
    if (this.props.showOTP) {
      this.signIn(this.state.phoneNumber);
    }
    this.startCountDown();
    EventTracker.logEvent('phone_auth_page');
  }

  componentWillUnmount() {}

  signIn = phoneNumber => {
    if (typeof phoneNumber == 'object') {
      var { phoneNumber } = this.state;
    }
    if (phoneNumber == '0912345678') {
      this.loginMode = loginMode.SMS_BRAND_NAME;
    }
    switch (this.loginMode) {
      case loginMode.FIREBASE:
        this.firebaseSignIn();
        break;
      case loginMode.SMS_BRAND_NAME:
        this.smsBrandNameSendCode(phoneNumber);
        break;
      default:
        break;
    }
  };

  confirmCode = () => {
    switch (this.loginMode) {
      case loginMode.FIREBASE:
        this.firebaseConfirmCode();
        break;
      case loginMode.SMS_BRAND_NAME:
        this.smsBrandNameVerify();
        break;
      default:
        break;
    }
  };

  smsBrandNameSendCode = async phoneNumber => {
    const { t } = this.props;

    try {
      this.setState({
        message: '',
        isShowIndicator: true
      });
      let formData;
      if (typeof phoneNumber == 'object') {
        let { phoneNumber, currentCountry } = this.state;
        let countryCode = '';
        if (currentCountry[0].idd.root) {
          countryCode += currentCountry[0].idd.root;
          if (currentCountry[0].idd.suffixes[0]) {
            countryCode += currentCountry[0].idd.suffixes[0];
          }
        }
        var phoneAuth = phoneNumber;
        console.log(phoneAuth);
        if (phoneAuth.substring(0, 2) === countryCode.replace('+', '')) {
          phoneAuth = phoneAuth.substr(2);
        } else if (phoneAuth.substring(0, 1) === '0') {
          phoneAuth = phoneAuth.substr(1);
        }
        phoneNumber = countryCode + phoneAuth;
        formData = {
          username: phoneNumber
        };
      } else {
        formData = {
          username: phoneNumber
        };
      }
      console.log(formData);
      const response = await APIHandler.user_login_sms(formData);
      if (response && response.status == STATUS_SUCCESS) {
        this.setState({
          confirmResult: phoneNumber,
          message: '',
          isShowIndicator: false,
          requestNewOtpCounter: requestSeconds
        });
      } else {
        console.log('errr', error);
        this.setState({
          message: t('smsBrandNameSendCodeFailMessage'),
          isShowIndicator: false
        });
      }
    } catch (error) {
      console.log('errr', error);
      this.setState({
        message: t('smsBrandNameSendCodeFailMessage'),
        isShowIndicator: false
      });
    }
  };

  smsBrandNameVerify = async () => {
    const { t } = this.props;

    try {
      this.setState({ isShowIndicator: true });
      const { codeInput, confirmResult } = this.state;
      const formData = {
        username: confirmResult,
        otp: codeInput
      };
      const response = await APIHandler.login_sms_verify(formData);
      if (response && response.status == STATUS_SUCCESS) {
        this.setState(
          {
            message: ``,
            isShowIndicator: false
          },
          () => this._verifyResponse(response)
        );
      } else {
        this.setState({
          message: response.message,
          isShowIndicator: false
        });
      }
    } catch (err) {
      console.log('error', error);
      this.setState({
        message: t('smsBrandNameVerifyFailMessage'),
        isShowIndicator: false
      });
    }
  };

  firebaseSignIn = () => {
    Keyboard.dismiss();
    this.setState({ isShowIndicator: true });
    const { phoneNumber, currentCountry } = this.state;
    var countryCode = '';
    if (currentCountry[0].idd.root) {
      countryCode += currentCountry[0].idd.root;
      if (currentCountry[0].idd.suffixes[0]) {
        countryCode += currentCountry[0].idd.suffixes[0];
      }
    }
    var phoneAuth = phoneNumber;
    if (phoneAuth.substring(0, 2) === countryCode.replace('+', '')) {
      phoneAuth = phoneAuth.substr(2);
    } else if (phoneAuth.substring(0, 1) === '0') {
      phoneAuth = phoneAuth.substr(1);
    }
    setTimeout(() => {
      firebase
        .auth()
        .signInWithPhoneNumber(countryCode + phoneAuth)
        .then(confirmResult =>
          this.setState({
            confirmResult,
            message: '',
            isShowIndicator: false,
            requestNewOtpCounter: requestSeconds
          })
        )
        .catch(error => {
          this.loginMode = loginMode.SMS_BRAND_NAME;
          this.signIn(countryCode + phoneAuth);
        });
    }, 300);
  };

  firebaseConfirmCode = () => {
    const { codeInput, confirmResult } = this.state;
    const { t } = this.props;
    Keyboard.dismiss();
    if (confirmResult && codeInput.length) {
      this.setState({ isShowIndicator: true });
      confirmResult
        .confirm(codeInput)
        .then(user => {
          if (user) {
            this.setState({
              user: user.toJSON(),
              message: ``,
              isShowIndicator: false
            });
            user
              .getIdToken(true)
              .then(async idToken => {
                const response = await APIHandler.login_firebase_vertify({
                  token: idToken
                });
                if (response && response.status == STATUS_SUCCESS) {
                  this.setState(
                    {
                      message: response.message,
                      isShowIndicator: false
                    },
                    () => this._verifyResponse(response)
                  );
                } else {
                  this.setState({
                    message: response.message,
                    isShowIndicator: false
                  });
                }
              })
              .catch(error => {
                this.setState({
                  message: t('firebaseConfirmCodeFailMessage01'),
                  isShowIndicator: false
                });
              });
          }
        })
        .catch(error => {
          console.log('error', error);
          this.setState({
            message: t('firebaseConfirmCodeFailMessage02'),
            isShowIndicator: false
          });
        });
    }
  };

  _verifyResponse = response => {
    store.setUserInfo(response.data);
    EventTracker.setUserId(response.data.id);
    store.resetCartData();
    const { t } = this.props;
    if (response.data && response.data.fill_info_user) {
      //hien thi chon site
      Actions.replace('op_register', {
        title: t('common:screen.register.mainTitle'),
        name_props: response.data.name
      });
    } else {
      Actions.replace(config.routes.primaryTabbar);
      if (response.data.room) {
        Actions.jump(appConfig.routes.roomTab);
      }
    }
  };

  _onPressPickCountry() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  _onPressChooseCountry(item) {
    this.setState({
      modalVisible: !this.state.modalVisible,
      currentCountry: [item]
    });
  }

  _onPressCloseCountryPicker() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  _renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback
        onPress={this._onPressChooseCountry.bind(this, item)}
      >
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 0.5,
            borderBottomColor: 'lightgray',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 25, marginHorizontal: 10 }}>
            {item.flag || ''}
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginLeft: 10,
              marginRight: 10,
              marginVertical: 10
            }}
          >
            {item.name.common || ''}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderCountryPicker() {
    const { t } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
      >
        <SafeAreaView
          style={{ backgroundColor: DEFAULT_COLOR, paddingBottom: 30 }}
        >
          <View
            style={{
              width: '100%',
              height: headerHeight.height,
              backgroundColor: 'transparent'
            }}
          >
            <View style={{ flex: 1 }} />
            <View style={{ marginLeft: 10, marginBottom: 10 }}>
              <TouchableWithoutFeedback
                onPress={this._onPressCloseCountryPicker.bind(this)}
              >
                <Icon name="close" size={30} color="#ffffff" />
              </TouchableWithoutFeedback>
              <Text style={[styles.title]}>{t('countrySelectionTitle')}</Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#ffffff',
              height: deviceHeight - headerHeight.height - (isIPhoneX ? 70 : 20)
            }}
          >
            <FlatList data={countries} renderItem={this._renderItem} />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  renderPhoneNumberInput() {
    const { phoneNumber, currentCountry, message } = this.state;
    const { t } = this.props;

    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{ paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingTop: 115 }}
      >
        <Image
          resizeMode="contain"
          style={styles.image}
          source={require('../../images/logo-640x410.jpg')}
        />
        <Text style={styles.welcomeText}>{t('phoneWelcomeMessage')}</Text>
        <Text style={styles.desText}>{t('phoneDescription')}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableWithoutFeedback
            onPress={this._onPressPickCountry.bind(this)}
          >
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 5,
                backgroundColor: '#dddddd',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 8
              }}
            >
              <Text style={{ fontSize: 25 }}>
                {currentCountry ? currentCountry[0].flag : ''}
              </Text>
              <Text style={{ fontSize: 15 }}>
                {currentCountry
                  ? (currentCountry[0].idd.root
                      ? currentCountry[0].idd.root
                      : '') +
                    (currentCountry[0].idd.suffixes[0]
                      ? currentCountry[0].idd.suffixes[0]
                      : '')
                  : ''}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TextInput
            style={{
              flex: 1,
              borderRadius: 5,
              backgroundColor: '#dddddd',
              fontSize: 25,
              padding: 5,
              marginLeft: 10,
              fontWeight: 'bold'
            }}
            value={this.state.phoneNumber}
            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
            placeholder={t('phonePlaceholder')}
            onChangeText={text => {
              if (text.length <= 13) this.setState({ phoneNumber: text });
            }}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.signIn}
          disabled={empty(phoneNumber)}
        >
          <Text
            style={[
              styles.continueText,
              { color: !empty(phoneNumber) ? 'black' : 'lightgray' }
            ]}
          >
            {t('phoneConfirmMessage')}
          </Text>
        </TouchableOpacity>
        {message != '' && <Text style={styles.txtNote}>{message}</Text>}
      </ScrollView>
    );
  }

  _onPressRequestNewOtp(username) {
    this.loginMode = loginMode.SMS_BRAND_NAME;
    this.signIn(username);
    this.setState({ requestNewOtpCounter: requestSeconds });
  }

  _onPressBackToPhoneInput() {
    this.props.onCloseOTP();
    // this.loginMode = loginMode.FIREBASE;
    this.setState({ confirmResult: null, message: '' });
  }

  startCountDown() {
    timer.setInterval(() => {
      const { requestNewOtpCounter, confirmResult } = this.state;
      if (requestNewOtpCounter > 0 && confirmResult) {
        this.setState({ requestNewOtpCounter: requestNewOtpCounter - 1 });
      }
    }, 1000);
  }

  convertSecondToMinute(time) {
    let minute = (time / 60) % 60;
    let second = time % 60;
    return `${
      parseInt(minute) < 10 ? '0' + parseInt(minute) : parseInt(minute)
    } : ${parseInt(second) < 10 ? '0' + parseInt(second) : parseInt(second)}`;
  }

  renderVerificationCodeInput() {
    const {
      codeInput,
      phoneNumber,
      currentCountry,
      requestNewOtpCounter,
      message
    } = this.state;
    let countryCode = '';
    if (currentCountry[0].idd.root) {
      countryCode += currentCountry[0].idd.root;
      if (currentCountry[0].idd.suffixes[0]) {
        countryCode += currentCountry[0].idd.suffixes[0];
      }
    }
    let phoneAuth = phoneNumber;
    if (phoneAuth.substring(0, 2) === '84') {
      phoneAuth = phoneAuth.substr(2);
    } else if (phoneAuth.substring(0, 1) === '0') {
      phoneAuth = phoneAuth.substr(1);
    }
    const { t } = this.props;

    return (
      <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
        <View
          style={{
            width: '100%',
            height: headerHeight.height + (isIPhoneX ? 40 : 20),
            backgroundColor: 'transparent'
          }}
        >
          <View style={{ flex: 1 }} />
          <View style={{ marginLeft: 10, marginBottom: 10 }}>
            <TouchableWithoutFeedback
              onPress={this._onPressBackToPhoneInput.bind(this)}
            >
              <Icon name="chevron-left" size={30} color="black" />
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <Text style={[styles.desText, { marginBottom: 10, fontSize: 15 }]}>
            {t('verifyCodeInputTitle')}
          </Text>
          <Text
            style={[
              styles.desText,
              {
                fontSize: 17,
                fontWeight: '500',
                marginTop: 0,
                marginBottom: 20
              }
            ]}
          >
            {countryCode + phoneAuth}
          </Text>
          <View style={{ backgroundColor: '#fff', borderRadius: 5 }}>
            <TextInput
              autoFocus
              onChangeText={value => this.setState({ codeInput: value })}
              placeholder={t('verifyCodeInputPlaceholder')}
              value={codeInput}
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
              style={styles.txtCode}
              maxLength={6}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={this.confirmCode}
            disabled={empty(codeInput)}
          >
            <Text
              style={[
                styles.continueText,
                { color: !empty(codeInput) ? 'black' : 'lightgray' }
              ]}
            >
              {t('verifyCodeInputConfirmMessage')}
            </Text>
          </TouchableOpacity>
          {message != '' && <Text style={styles.txtNote}>{message}</Text>}
          <Text
            style={{
              fontSize: 17,
              fontWeight: '200',
              color: 'black',
              marginTop: 20
            }}
          >
            {t('notReceiveCode')}
          </Text>
          <TouchableOpacity
            onPress={this._onPressRequestNewOtp.bind(
              this,
              countryCode + phoneAuth
            )}
            disabled={requestNewOtpCounter > 0}
          >
            <Text
              style={{
                fontSize: 17,
                color: '#528BC5',
                fontWeight: '700',
                marginTop: 8
              }}
            >
              {requestNewOtpCounter > 0
                ? `${t('requestNewCodeWithTime')} ${this.convertSecondToMinute(
                    requestNewOtpCounter
                  )}`
                : t('requestNewCode')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  render() {
    const { user, confirmResult, modalVisible, isShowIndicator } = this.state;
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={styles.container}
      >
        {isShowIndicator && <Loading center style={{ marginBottom: 64 }} />}
        {modalVisible && this.renderCountryPicker()}
        {!user && !confirmResult && this.renderPhoneNumberInput()}
        {!user && confirmResult && this.renderVerificationCodeInput()}
        {appConfig.device.isIOS && <KeyboardSpacer />}
      </KeyboardAwareScrollView>
    );
  }
}

const requestSeconds = 30;
const deviceHeight = Dimensions.get('window').height;
const headerHeight = Platform.select({
  ios: {
    height: 44
  },
  android: {
    height: 54
  },
  windows: {
    height: 54
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  image: {
    width: 128,
    height: 82,
    top: -30
  },
  welcomeText: {
    color: 'black',
    fontSize: 26,
    fontWeight: '800'
  },
  desText: {
    color: 'black',
    fontSize: 18,
    marginTop: 8,
    marginBottom: 22,
    fontWeight: '300'
  },
  phoneTextInput: {
    backgroundColor: 'black',
    fontWeight: '800',
    fontSize: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 15
  },
  flagStyle: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  continueText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 20
  },
  txtNote: {
    color: 'red',
    marginTop: 20
  },
  txtCode: {
    fontWeight: '800',
    fontSize: 20,
    padding: 10
  },
  title: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default withTranslation(['phoneAuth', 'common'])(PhoneAuth);
