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
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

// components
import PopupConfirm from '../PopupConfirm';
import Sticker from '../Sticker';

@observer
export default class ForgetVerify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      tel: props.tel || '',
      password: '',
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

    this.registerMsgBar();
  }

  registerMsgBar = () => {
    MessageBarManager.registerMessageBar(this.refs.alert);
  }

  _unMount() {
    Keyboard.dismiss();

    MessageBarManager.unregisterMessageBar();
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
    var {tel} = this.state;
    tel = tel.trim();

    this.setState({
      finish_loading: true
    }, async () => {
      try {
        var response = await APIHandler.user_forget_password({
          username: tel
        });

        if (response && response.status == STATUS_SUCCESS) {
          Actions.forget_active({
            tel,
            onBackCustomer: this.registerMsgBar
          });
        } else if (response && response.message) {
          MessageBarManager.showAlert({
            message: response.message,
            alertType: 'warning',
            duration: 5000
          });
        }

      } catch (e) {
        console.warn(e + ' user_forget_password');

        store.addApiQueue('user_forget_password', this._onSave.bind(this));
      } finally {

      }
    });
  }

  _onContinue() {
    var {tel} = this.state;
    tel = tel.trim();

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

    Alert.alert(
      this.state.tel,
      'Chúng tôi sẽ gửi mã xác thực tới số điện thoại trên. Vui lòng xác nhận số điện thoại này là đúng.',
      [
        {text: 'Thay đổi', onPress: () => console.log('Cancel Pressed')},
        {text: 'Xác nhận', onPress: () => this._onSave()},
      ],
      { cancelable: false }
    );
  }

  render() {
    var { edit_mode, verify_loadding } = this.state;

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
              fontSize: 12,
              color: '#666666'
            }}>Nhập số điện thoại để nhận mã xác thực tài khoản</Text>
          </View>

          <View style={styles.input_box}>
            <Text style={styles.input_label}>Số điện thoại</Text>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => this.refs_tel = ref}
                onLayout={() => {
                  if (this.refs_tel) {
                    setTimeout(() => this.refs_tel.focus(), 300);
                  }
                }}
                style={styles.input_text}
                keyboardType="numeric"
                maxLength={30}
                placeholder="Điền số điện thoại"
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

        </ScrollView>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this._onContinue.bind(this)}
          style={[styles.address_continue, {bottom: store.keyboardTop}]}>
          <View style={styles.address_continue_content}>
            <Text style={styles.address_continue_title}>TIẾP TỤC</Text>
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
