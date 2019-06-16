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

@observer
export default class OpRegister extends Component {
  constructor(props) {
    super(props);

    var edit_data = props.edit_data;

    if (edit_data) {
      this.state = {
        edit_mode: true,
        name: edit_data.name || '',
        email: edit_data.email || '',
        // password: edit_data.password || '',
        // refer: edit_data.refer,
        finish_loading: false,
        verify_loadding: false
      }
    } else {
      this.state = {
        name: props.name_props || '',
        email: props.email_props || '',
        // password: props.password_props || '',
        // refer: props.refer_props || '',
        finish_loading: false,
        verify_loadding: false
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

    // from confirm screen
    if (this.props.registerNow) {
      setTimeout(() => {
        this._onSave();
      }, 500);
    }
  }

  _unMount() {
    Keyboard.dismiss();
  }

  _onSave() {
    var {name, email} = this.state;//, password, refer

    name = name.trim();
    email = email.trim();

    if (!name) {
      return Alert.alert(
        'Thông báo',
        'Hãy điền tên của bạn',
        [
          {text: 'Đồng ý', onPress: () => {
            this.refs_name.focus();
          }},
        ],
        { cancelable: false }
      );
    }

    if (!email) {
      return Alert.alert(
        'Thông báo',
        'Hãy điền Số Email, sử dụng để lấy lại tài khoản và hỗ trợ',
        [
          {text: 'Đồng ý', onPress: () => {
            this.refs_email.focus();
          }},
        ],
        { cancelable: false }
      );
    }


    if (!validateEmail(email)) {
      return Alert.alert(
        'Thông báo',
        'Email không chính xác, vui lòng điền lại',
        [
          {text: 'Đồng ý', onPress: () => {
            this.refs_email.focus();
          }},
        ],
        { cancelable: false }
      );
    }


    // if (!password) {
    //   return Alert.alert(
    //     'Thông báo',
    //     'Hãy điền Mật khẩu',
    //     [
    //       {text: 'Đồng ý', onPress: () => {
    //         this.refs_password.focus();
    //       }},
    //     ],
    //     { cancelable: false }
    //   );
    // }

    // if (!validate4DigiPassword(password)) {
    //   return Alert.alert(
    //     'Thông báo',
    //     'Hãy điền Mật khẩu gồm 4 chữ số',
    //     [
    //       {text: 'Đồng ý', onPress: () => {
    //         this.refs_password.focus();
    //       }},
    //     ],
    //     { cancelable: false }
    //   );  
    // }

      // if (!refer) {
      //   return Alert.alert(
      //     'Thông báo',
      //     'Hãy điền mã của quản lý vùng trực tiếp.',
      //     [
      //       {text: 'Đồng ý', onPress: () => {
      //         this.refs_refer.focus();
      //       }},
      //     ],
      //     { cancelable: false }
      //   );
      // }

    if (this.successfully || this.state.finish_loading) {
      return;
    }

    this._op_register(name, email);//, password, refer
  }

  _op_register(name, email) {//, password, refer
    this.setState({
      finish_loading: true
    }, async () => {
      try {
        var response = await APIHandler.user_op_register({
          name: name,
          email: email
        });
        if (response && response.status == STATUS_SUCCESS) {
          if (response.data.site_id === 0) {//hien thi chon site
            action(() => {
              this.setState({
                finish: true
              }, () => {
                Actions.choose_location({
                  type: ActionConst.RESET,
                  title: "CHỌN CỬA HÀNG"
                });
              });
            })();
          }else{
            store.setUserInfo(response.data);
            action(() => {
              this.setState({
                finish: true
              }, () => {
                Actions.myTabBar({
                  type: ActionConst.RESET
                });
              });
            })();
          }

        } else {
          if (response && response.status == STATUS_SYNC_FLAG) {
            store.setUserInfo(response.data);
            action(() => {
              this.setState({
                finish: true
              }, () => {
                Actions.sync_ndt({
                  type: ActionConst.RESET,
                  title: "Nhập mã đồng bộ"
                });
              });
            })();
          }else{
            this.setState({
              finish_loading: true
            });
          }
        }

        if (response) {
          Toast.show(response.message, Toast.SHORT);
        }

      } catch (e) {
        this.setState({
          finish_loading: true
        });
        alert("catch" + e);

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
          <View style={styles.input_box}>
            <Text style={styles.input_label}>Tên (*)</Text>

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
                onLayout={() => {
                  if (this.refs_name && !this.props.registerNow) {
                    setTimeout(() => this.refs_name.focus(), 300);
                  }
                }}
                onSubmitEditing={() => {
                  if (this.refs_email) {
                    this.refs_email.focus();
                  }
                }}
                returnKeyType="next"
                />
            </View>
          </View>

          <View style={styles.input_box}>
            <Text style={styles.input_label}>Email (*)</Text>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => this.refs_email = ref}
                style={styles.input_text}
                keyboardType="default"
                maxLength={30}
                placeholder="Điền email, sử dụng để lấy lại tài khoản"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({
                    email: value.replaceAll(' ', '')
                  });
                }}
                value={this.state.email}
                />
            </View>
          </View>

{/*          <View style={styles.input_box}>
            <Text style={styles.input_label}>Mật khẩu bán hàng (*)</Text>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => this.refs_password = ref}
                style={styles.input_text}
                keyboardType="phone-pad"
                maxLength={30}
                placeholder="Tạo mật khẩu (4 chữ số)"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({
                    password: value.replaceAll(' ', '')
                  });
                }}
                value={this.state.password}
                />
            </View>
          </View>

          <View style={styles.input_box}>
            <Text style={styles.input_label}>Mã giới thiệu</Text>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => this.refs_refer = ref}
                style={styles.input_text}
                keyboardType="default"
                maxLength={30}
                placeholder="Điền mã của người giới thiệu"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({
                    refer: value.replaceAll(' ', '')
                  });
                }}
                value={this.state.refer}
                />
            </View>
          </View>
  */}
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
                <Icon name={this.state.edit_mode ? "save" : "user-plus"} size={20} color="#ffffff" />
              )}
            </View>
            <Text style={styles.address_continue_title}>{this.state.edit_mode ? "LƯU LẠI" : "ĐĂNG KÝ"}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    width: '90%',
    height: 210,
    borderRadius: 2,
    marginTop: -(NAV_HEIGHT/2),
    alignItems: 'center'
  },
  verify_title: {
    fontSize: 14,
    marginTop: 16
  },
  verify_desc: {
    marginTop: 8,
    fontSize: 12,
    paddingHorizontal: 16,
    color: "#666666"
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
