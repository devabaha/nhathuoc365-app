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
    this.state = {
      name: props.name_props || '',
      // email: props.email_props || '',
      // password: props.password_props || '',
      refer: props.refer_props || '',
      loading: false
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
    var {name, refer} = this.state;//email, password, refer

    name = name.trim();
    refer = refer.trim();

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

    if (this.state.loading) {
      return;
    }

    this._op_register(name, refer);//email, password, refer
  }

  _op_register(name, refer) {//, password, refer
    this.setState({
      loading: true,
    }, async () => {
      try {
        var response = await APIHandler.user_op_register({
          name: name,
          refer: refer
        });
        if (response && response.status == STATUS_SUCCESS) {
          store.setUserInfo(response.data);
          action(() => {
            this.setState({
              loading: false
            }, () => {
              Actions.myTabBar({
                type: ActionConst.RESET
              });
            });
          })();
        } else {
          this.setState({
            loading: false
          });
        }

        if (response) {
          Toast.show(response.message, Toast.SHORT);
        }

      } catch (e) {
        this.setState({
          loading: false
        });
      } finally {
        this.setState({
          loading: false
        });
      }
    });
  }

  render() {
    var { name, email, loading } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={{
          marginBottom: store.keyboardTop + 60
        }}>
          <View style={styles.input_box}>
            <Text style={styles.input_label}>Tên của bạn (*)</Text>

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
                  if (this.refs_refer) {
                    this.refs_refer.focus();
                  }
                }}
                returnKeyType="next"
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
                placeholder="Điền số điện thoại người giới thiệu"
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
          <Text style={styles.disclaimerText}>Nhập số điện thoại người giới thiệu, cùng nhau nhận thưởng tại {global.APP_NAME_SHOW} nhé</Text>

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
              {this.state.loading ? (
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
  },

  disclaimerText: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 12,
    color: 'grey'
  },
});
