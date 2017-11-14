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
  Alert
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';
import Modal from 'react-native-modalbox';

// components
import PopupConfirm from '../PopupConfirm';
import Sticker from '../Sticker';

@observer
export default class Login extends Component {
  constructor(props) {
    super(props);

    var edit_data = props.edit_data;

    if (edit_data) {
      this.state = {
        edit_mode: true,
        name: edit_data.name || '',
        tel: edit_data.tel || '',
        password: edit_data.password || '',
        finish_loading: false,
        verify_loadding: false
      }
    } else {
      this.state = {
        name: '',
        tel: '',
        password: '',
        finish_loading: false,
        verify_loadding: false,
        sticker_flag: false
      }
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
  }

  _unMount() {
    Keyboard.dismiss();
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
    var {name, tel, password} = this.state;

    name = name.trim();
    tel = tel.trim();
    password = password.trim();

    // if (!name) {
    //   return Alert.alert(
    //     'Thông báo',
    //     'Hãy điền tên của bạn',
    //     [
    //       {text: 'Đồng ý', onPress: () => {
    //         this.refs_name.focus();
    //       }},
    //     ],
    //     { cancelable: false }
    //   );
    // }

    if (!tel) {
      return Alert.alert(
        'Thông báo',
        'Hãy điền Số điện thoại',
        [
          {text: 'Đồng ý', onPress: () => {
            this.refs_tel.focus();
          }},
        ],
        { cancelable: false }
      );
    }

    if (!password) {
      return Alert.alert(
        'Thông báo',
        'Hãy điền Mật khẩu',
        [
          {text: 'Đồng ý', onPress: () => {
            this.refs_password.focus();
          }},
        ],
        { cancelable: false }
      );
    }

    if (this.successfully || this.state.finish_loading) {
      return;
    }

    this._login(name, tel, password);
  }

  _login(name, tel, password) {
    this.setState({
      finish_loading: true
    }, async () => {
      try {
        var response = await APIHandler.user_login_password({
          username: tel,
          password
        });

        if (response && response.status == STATUS_SUCCESS) {
          this.successfully = true;

          this._showSticker();

          this._unMount();

          this.setState({
            finish_loading: false
          }, () => {
            action(() => {
              store.setUserInfo(response.data);

              store.resetCartData();

              store.setRefreshHomeChange(store.refresh_home_change + 1);

              setTimeout(() => {
                Actions.pop();
              }, 2000);
            })();
          });

        } else {
          this.setState({
            finish_loading: false
          });

          if (response) {
            Toast.show(response.message, Toast.SHORT);
          }
        }

      } catch (e) {
        console.warn(e + ' user_login_password');

        return Alert.alert(
          'Thông báo',
          'Kết nối mạng bị lỗi',
          [
            {text: 'Thử lại', onPress: this._login.bind(this, name, tel, password)},
          ],
          { cancelable: false }
        );
      } finally {

      }
    });
  }

  render() {
    var { edit_mode, verify_loadding } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={{
          marginBottom: store.keyboardTop + 60
        }}>
          {/*<View style={styles.input_box}>
            <Text style={styles.input_label}>Tên</Text>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => this.refs_name = ref}
                style={styles.input_text}
                keyboardType="default"
                maxLength={30}
                placeholder="Điền họ và tên"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({
                    name: value
                  });
                }}
                value={this.state.name}
                />
            </View>
          </View>*/}

          <View style={styles.input_box}>
            <Text style={styles.input_label}>Tên đăng nhập</Text>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => this.refs_tel = ref}
                onLayout={() => {
                  if (this.refs_tel) {
                    setTimeout(() => this.refs_tel.focus(), 300);
                  }
                }}
                style={styles.input_text}
                keyboardType="phone-pad"
                maxLength={30}
                placeholder="Điền tên đăng nhập"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({
                    tel: value.replaceAll(' ', '')
                  });
                }}
                value={this.state.tel}
                />
            </View>
          </View>

          <View style={styles.input_box}>
            <Text style={styles.input_label}>Mật khẩu</Text>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => this.refs_password = ref}
                style={styles.input_text}
                keyboardType="default"
                maxLength={100}
                placeholder="Điền mật khẩu"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({
                    password: value
                  });
                }}
                secureTextEntry
                returnKeyType="go"
                value={this.state.password}
                onSubmitEditing={this._onSave.bind(this)}
                />
            </View>
          </View>

        </ScrollView>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this._onSave.bind(this)}
          style={[styles.address_continue, {bottom: store.keyboardTop}]}>
          <View style={styles.address_continue_content}>
            <View style={{
              minWidth: 20,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {this.state.finish_loading ? (
                <Indicator size="small" color="#ffffff" />
              ) : (
                <Icon name={this.state.edit_mode ? "save" : "sign-in"} size={20} color="#ffffff" />
              )}
            </View>
            <Text style={styles.address_continue_title}>{this.state.edit_mode ? "LƯU LẠI" : "ĐĂNG NHẬP"}</Text>
          </View>
        </TouchableHighlight>

        <Sticker
          active={this.state.sticker_flag}
          message="Đăng nhập thành công."
         />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    width: '90%',
    height: 169,
    borderRadius: 2,
    marginTop: -NAV_HEIGHT,
    alignItems: 'center'
  },
  verify_title: {
    fontSize: 14,
    marginTop: 16
  },
  input_text_verify: {
    borderWidth: Util.pixel,
    borderColor: "#cccccc",
    marginTop: 20,
    height: 40,
    width: '69%',
    paddingHorizontal: 15,
    textAlign: 'center',
    fontSize: 18,
    color: "#404040"
  },
  verify_btn: {
    backgroundColor: DEFAULT_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginTop: 20,
    flexDirection: 'row'
  },
  verify_btn_title: {
    color: "#ffffff",
    marginLeft: 4
  },

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
