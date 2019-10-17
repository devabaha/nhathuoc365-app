import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import RNAccountKit, { Color } from 'react-native-facebook-account-kit';
import store from '../../store/Store';
import Icon from 'react-native-vector-icons/FontAwesome';
import appConfig from 'app-config';
import { showMessage } from 'react-native-flash-message';

class Login extends Component {
  componentDidMount() {
    this._run_fbak();
  }

  _run_fbak() {
    // Configures the account kit SDK
    RNAccountKit.configure({
      responseType: 'token',
      titleType: 'login',
      initialAuthState: '',
      initialPhoneCountryPrefix: '+84',
      facebookNotificationsEnabled: true,
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
  }

  // verify facebook account kit token
  _verifyFBAK = fbres => {
    this.setState({ spinner: true }, async () => {
      try {
        var response = await APIHandler.login_fbak_verify(fbres);

        if (response && response.status == STATUS_SUCCESS) {
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
                    Actions.replace('op_register', {
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
                    Actions.replace(appConfig.routes.primaryTabbar);
                  }
                );
              })();
            }
          })();
          showMessage({
            message: response.message,
            type: 'info'
          });
        } else if (response) {
          setTimeout(() => {
            this.setState({ spinner: false });
          }, 2000);
          showMessage({
            message: response.message,
            type: 'info'
          });
        }
      } catch (err) {
        setTimeout(() => {
          this.setState({ spinner: false });
        }, 2000);
        console.log(e + ' login_fbak_verify');
        store.addApiQueue('login_fbak_verify', this._verifyFBAK);
      }
    });
  };

  _onFinish() {
    this._run_fbak();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image
            resizeMode="contain"
            style={styles.image}
            source={require('../../images/logo-640x410.jpg')}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TouchableHighlight
            style={styles.finish_btn_box}
            underlayColor="transparent"
            onPress={this._onFinish.bind(this)}
          >
            <View style={styles.finish_btn}>
              <Text style={styles.finish_text}>
                <Icon name="heart-o" size={16} color="#ffffff" /> TRẢI NGHIỆM{' '}
                {APP_NAME}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff'
  },
  image: {
    flex: 1,
    width: '80%',
    top: 50
  },
  finish_btn_box: {
    width: Util.size.width,
    height: 100,
    top: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  finish_btn: {
    backgroundColor: DEFAULT_COLOR,
    padding: 12,
    borderRadius: 2
  },
  finish_text: {
    color: '#ffffff',
    fontSize: 16
  }
});

export default Login;
