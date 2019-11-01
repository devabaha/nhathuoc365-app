import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import { Actions, ActionConst } from 'react-native-router-flux';
import RNAccountKit, { Color } from 'react-native-facebook-account-kit';
import store from '../../store/Store';

import Sticker from '../Sticker';

const MAX_LENGTH_CODE = 4;
const MAX_LENGTH_NUMBER = 20;

// your brand's theme primary color
const brandColor = DEFAULT_COLOR;

export default class OpLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enterCode: false,
      spinner: false,
      country: {
        cca2: 'US',
        callingCode: '1'
      },
      sticker_flag: false
    };
  }

  componentWillMount() {}

  componentWillUnmount() {}

  onBackAndroid() {
    return true;
  }

  _showSticker() {
    this.setState(
      {
        sticker_flag: true
      },
      () => {
        setTimeout(() => {
          this.setState({
            sticker_flag: false
          });
        }, 2000);
      }
    );
  }

  _getCode = () => {
    var formData = this.refs.form.getValues();

    if (!formData.username) {
      return Alert.alert(
        'Thông báo',
        'Hãy điền Số điện thoại',
        [
          {
            text: 'Đồng ý',
            onPress: () => {
              this.refs.form.refs.textInput.focus();
            }
          }
        ],
        { cancelable: false }
      );
    }
    //validatePhonenumber
    if (!validatePhonenumber(formData.username)) {
      return Alert.alert(
        'Thông báo',
        'Số điện thoại chưa đúng, vui lòng điền lại. Ex: 0988123456',
        [
          {
            text: 'Đồng ý',
            onPress: () => {
              this.refs.form.refs.textInput.focus();
            }
          }
        ],
        { cancelable: false }
      );
    }
    this.setState({ spinner: true }, async () => {
      /*
      try {

        var response = await APIHandler.user_login_sms(formData);
        var response = {status: STATUS_SUCCESS}

        if (response && response.status == STATUS_SUCCESS) {
          setTimeout(() => {
            this.refs.form.refs.textInput.setNativeProps({ text: '' });
            this.setState({
              spinner: false,
              enterCode: true
            }, () => {
              this.refs.form.refs.textInput.focus();
              Actions.refresh({
                title: 'Xác minh'
              });
            });
          }, 1000);
        } else {

        }

      } catch (err) {
        console.log(e + ' user_login_sms');
        store.addApiQueue('user_login_sms', this._getCode);
      } finally {
        setTimeout(() => {
          this.setState({ spinner: false });
        }, 1000);
      }
      */

      // Configures the account kit SDK
      RNAccountKit.configure({
        responseType: 'token',
        titleType: 'login',
        initialAuthState: '',
        initialPhoneNumber: formData.username,
        initialPhoneCountryPrefix: '+84',
        facebookNotificationsEnabled: true,
        countryWhitelist: ['VN'],
        countryBlacklist: [],
        defaultCountry: 'VN',
        theme: {
          // for iOS only
          // hide title by setting this stuff
          titleColor: Color.hex('#fff')
        },
        viewControllerMode: 'show', // for iOS only, 'present' by default
        getACallEnabled: true,
        setEnableInitialSmsButton: false // true by default
      });
      // Shows the Facebook Account Kit view for login via SMS
      RNAccountKit.loginWithPhone().then(res => {
        if (res) {
          this._verifyFBAK(res);
        }
      });
    });
  };

  _verifyCode = () => {
    var formData = this.refs.form.getValues();

    this.setState({ spinner: true }, async () => {
      try {
        var response = await APIHandler.login_sms_verify(formData);
        if (response && response.status == STATUS_SUCCESS) {
          //STATUS_SUCCESS
          this.refs.form.refs.textInput.blur();

          this._showSticker();

          action(() => {
            store.setUserInfo(response.data);

            store.resetCartData();

            store.setRefreshHomeChange(store.refresh_home_change + 1);

            if (response.data.fill_info_user) {
              //hien thi chon site
              action(() => {
                this.setState(
                  {
                    finish: true
                  },
                  () => {
                    Actions.op_register({
                      type: ActionConst.RESET,
                      title: 'Đăng ký thông tin',
                      name_props: response.data.name
                    });
                  }
                );
              })();
            } else {
              action(() => {
                this.setState(
                  {
                    finish: true
                  },
                  () => {
                    Actions.primaryTabbar({
                      type: ActionConst.RESET
                    });
                  }
                );
              })();
            }

            setTimeout(() => {
              this.setState({ spinner: false }, Actions.pop);
            }, 2000);
          })();
        } else if (response) {
          setTimeout(() => {
            this.setState({ spinner: false });
          }, 2000);
          Toast.show(response.message, Toast.SHORT);
        }
      } catch (err) {
        setTimeout(() => {
          this.setState({ spinner: false });
        }, 2000);
        console.log(err + ' login_sms_verify');
        store.addApiQueue('login_sms_verify', this._verifyCode);
      }
    });
  };

  // verify facebook account kit token
  _verifyFBAK = fbres => {
    this.setState({ spinner: true }, async () => {
      try {
        var response = await APIHandler.login_fbak_verify(fbres);

        if (response && response.status == STATUS_SUCCESS) {
          this.refs.form.refs.textInput.blur();

          this._showSticker();

          action(() => {
            store.setUserInfo(response.data);

            store.resetCartData();

            store.setRefreshHomeChange(store.refresh_home_change + 1);

            if (!response.data.name) {
              //hien thi chon site
              action(() => {
                this.setState(
                  {
                    finish: true
                  },
                  () => {
                    Actions.op_register({
                      type: ActionConst.RESET,
                      title: 'Đăng ký thông tin'
                    });
                  }
                );
              })();
            } else {
              action(() => {
                this.setState(
                  {
                    finish: true
                  },
                  () => {
                    Actions.primaryTabbar({
                      type: ActionConst.RESET
                    });
                  }
                );
              })();
            }

            setTimeout(() => {
              this.setState({ spinner: false }, Actions.pop);
            }, 2000);
          })();
        } else if (response) {
          setTimeout(() => {
            this.setState({ spinner: false });
          }, 2000);
          Toast.show(response.message, Toast.SHORT);
        }
      } catch (e) {
        setTimeout(() => {
          this.setState({ spinner: false });
        }, 2000);
        console.log(e + ' login_fbak_verify');
        store.addApiQueue('login_fbak_verify', this._verifyFBAK);
      }
    });
  };

  _onChangeText = val => {
    if (!this.state.enterCode) return;
    if (val.length === MAX_LENGTH_CODE) this._verifyCode();
  };

  _tryAgain = () => {
    this.refs.form.refs.textInput.setNativeProps({ text: '' });
    this.refs.form.refs.textInput.focus();
    this.setState({ enterCode: false });
  };

  _getSubmitAction = () => {
    this.state.enterCode ? this._verifyCode() : this._getCode();
  };

  render() {
    let headerText = `Đăng nhập`;
    let buttonText = this.state.enterCode ? 'Xác minh' : 'Gửi mã xác thực';
    let textStyle = this.state.enterCode
      ? {
          height: 50,
          textAlign: 'center',
          fontSize: 40,
          fontWeight: 'bold',
          fontFamily: 'Courier'
        }
      : {};

    return (
      <View style={styles.container}>
        <Text style={styles.header}>{headerText}</Text>

        <Form ref={'form'} style={styles.form}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              ref={'textInput'}
              name={this.state.enterCode ? 'otp' : 'username'}
              type={'TextInput'}
              underlineColorAndroid={'transparent'}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={this._onChangeText}
              placeholder={
                this.state.enterCode
                  ? '_ _ _ _'
                  : 'Nhập số điện thoại (Ex:0988123456)'
              }
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
              style={[styles.textInput, textStyle]}
              returnKeyType="go"
              autoFocus
              placeholderTextColor="#999999"
              selectionColor="#999999"
              maxLength={
                this.state.enterCode ? MAX_LENGTH_CODE : MAX_LENGTH_NUMBER
              }
              onSubmitEditing={this._getSubmitAction}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={this._getSubmitAction}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>

          {this._renderFooter()}
        </Form>

        <Spinner visible={this.state.spinner} />

        <Sticker
          active={this.state.sticker_flag}
          message="Đăng nhập thành công."
        />
      </View>
    );
  }

  _renderFooter = () => {
    if (this.state.enterCode)
      return (
        <View>
          <Text style={styles.wrongNumberText}>
            Nhập mã xác thực đã gửi tới số điện thoại của bạn!
          </Text>
          <Text
            style={[
              styles.wrongNumberText,
              { color: DEFAULT_COLOR, fontSize: 12 }
            ]}
            onPress={this._tryAgain}
          >
            Chưa nhận được mã, thử lại!
          </Text>
        </View>
      );

    return (
      <View>
        <Text style={styles.disclaimerText}>
          Nhập số điện thoại và "Gửi mã xác thực", {global.APP_NAME_SHOW} sẽ gửi
          mã xác minh về số điện thoại của bạn. Nhập mã xác thực và đăng nhập
          hoàn tất.
        </Text>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    marginTop: NAV_HEIGHT
  },
  header: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 22,
    margin: 20,
    color: '#4A4A4A'
  },
  form: {
    margin: 20
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 20,
    color: '#333333'
  },
  button: {
    marginTop: 20,
    height: 50,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold'
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center'
  },
  disclaimerText: {
    marginTop: 30,
    fontSize: 12,
    color: 'grey'
  },
  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  callingCodeText: {
    fontSize: 20,
    color: brandColor,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingRight: 10
  }
});
