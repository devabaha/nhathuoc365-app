/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Switch,
  Keyboard,
  ScrollView,
  Alert,
  AsyncStorage
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';
import Modal from 'react-native-modalbox';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

// components
import PopupConfirm from '../PopupConfirm';
import Sticker from '../Sticker';

@observer
export default class NewPass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      tel: props.tel,
      password: '',
      re_password: '',
      finish_loading: false,
      verify_loadding: false,
      sticker_flag: false
    }
  }

  componentDidMount() {
    Actions.refresh({
      onBack: () => {
        this._unMount();

        Actions.pop();
      }
    });

    if (!this.state.edit_mode && this.refs_name) {
      setTimeout(() => {
        this.refs_name.focus();
      }, 450);
    }

    MessageBarManager.registerMessageBar(this.refs.alert);
  }

  _unMount() {
    Keyboard.dismiss();

    MessageBarManager.unregisterMessageBar();

    if (this.props.onBackCustomer) {
      this.props.onBackCustomer();
    }
  }

  _showSticker() {
    this.setState({
      sticker_flag: true
    }, () => {
      setTimeout(() => {
        this.setState({
          sticker_flag: false
        });
      }, 2000);
    });
  }

  _onSave() {
    var {name, tel, password, finish_loading} = this.state;
    password = password.trim();

    if (finish_loading) {
      return;
    }

    if (!password) {
      return Alert.alert(
        'Thông báo',
        'Hãy điền mật khẩu mới',
        [
          {text: 'Đồng ý', onPress: () => {
            this.refs_password.focus();
          }},
        ],
        { cancelable: false }
      );
    }

    this.setState({
      finish_loading: true
    }, async () => {
      try {
        var response = await APIHandler.user_forget_new_password({
          username: tel,
          password
        });

        if (response && response.status == STATUS_SUCCESS) {
          MessageBarManager.showAlert({
            message: response.message + `. Đang đăng nhập...`,
            alertType: 'success'
          });

          Actions.refresh({
            onBack: () => false,
            hideBackImage: true
          });

          setTimeout(() => {
            this._login();
          }, 3000);
        } else if (response && response.message) {
          MessageBarManager.showAlert({
            message: response.message,
            alertType: 'warning',
            duration: 5000
          });
        }

      } catch (e) {
        console.warn(e + ' user_forget_new_password');

        store.addApiQueue('user_forget_new_password', this._onSave.bind(this));
      } finally {
        this.setState({
          finish_loading: false
        });
      }
    });
  }

  _login() {
    var {name, tel, password, finish_loading} = this.state;
    password = password.trim();

    this.setState({
      finish_loading: true
    }, async () => {
      try {
        var response = await APIHandler.user_login_password({
          username: tel,
          password
        });

        if (response && response.status == STATUS_SUCCESS) {
          try {
            await AsyncStorage.setItem('@username:key', tel);
          } catch (error) {
            console.warn(error);
          }

          action(() => {
            store.setUserInfo(response.data);

            store.resetCartData();

            store.setRefreshHomeChange(store.refresh_home_change + 1);

            Actions.pop({
              popNum: 4,
              refresh: {
                username: tel,
                password
              }
            });
          })();
        } else if (response && response.message) {
          MessageBarManager.showAlert({
            message: response.message,
            alertType: 'warning',
            duration: 5000
          });

          setTimeout(() => {
            this.setState({
              finish_loading: false
            });
          }, 5000);
        }

      } catch (e) {
        console.warn(e + ' user_login_password');

        this.setState({
          finish_loading: false
        });

        store.addApiQueue('user_login_password', this._login.bind(this, name, tel, password));
      } finally {

      }
    });
  }

  render() {
    var { edit_mode, verify_loadding, tel, finish_loading } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{
            marginBottom: store.keyboardTop + 60
          }}>

          <View style={{
            height: 60,
            width: Util.size.width,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              fontSize: 16,
              color: '#404040',
              fontWeight: '500'
            }}>{tel}</Text>
            <Text style={{
              fontSize: 12,
              marginTop: 4,
              color: '#666666'
            }}>Tạo mật khẩu mới cho tài khoản</Text>
          </View>

          <View style={styles.input_box}>
            <TouchableHighlight
              underlayColor="#ffffff"
              onPress={() => {
                if (this.refs_password) {
                  this.refs_password.focus();
                }
              }}>
              <Text style={styles.input_label}>Mật khẩu mới</Text>
            </TouchableHighlight>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => this.refs_password = ref}
                onLayout={() => {
                  if (this.refs_password) {
                    setTimeout(() => this.refs_password.focus(), 300);
                  }
                }}
                style={styles.input_text}
                keyboardType="default"
                maxLength={30}
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({
                    password: value
                  });
                }}
                value={this.state.password}
                />
            </View>
          </View>
        </ScrollView>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this._onSave.bind(this)}
          style={[styles.address_continue, {bottom: store.keyboardTop}]}>
          <View style={[styles.address_continue_content, {
            backgroundColor: finish_loading ? hexToRgbA(DEFAULT_COLOR, 0.6) : DEFAULT_COLOR
          }]}>
            <Text style={styles.address_continue_title}>HOÀN TẤT</Text>
          </View>
        </TouchableHighlight>

        <Sticker
          active={this.state.sticker_flag}
          message="Đăng nhập thành công."
         />

        <MessageBarAlert ref="alert" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0
  },
  input_box: {
    width: '100%',
    height: 44,
    backgroundColor: "#ffffff",
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  input_text_box: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  input_label: {
    fontSize: 14,
    color: "#000000"
  },
  input_text: {
    width: '96%',
    height: 38,
    paddingLeft: 8,
    color: "#000000",
    fontSize: 14,
    textAlign: 'right',
    paddingVertical: 0
  },

  input_address_box: {
    width: '100%',
    minHeight: 100,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd",
  },
  input_label_help: {
    fontSize: 12,
    marginTop: 2,
    color: "#666666"
  },
  input_address_text: {
    width: '100%',
    color: "#000000",
    fontSize: 14,
    marginTop: 4,
    paddingVertical: 0
  },

  address_continue: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 60
  },
  address_continue_content: {
    width: '100%',
    height: '100%',
    backgroundColor: DEFAULT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  address_continue_title: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 8
  }
});
