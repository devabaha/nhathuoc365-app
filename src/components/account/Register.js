import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Keyboard,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import store from '../../store/Store';
import Modal from 'react-native-modalbox';
import EventTracker from '../../helper/EventTracker';

class Register extends Component {
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
      };
    } else {
      this.state = {
        name: props.name_props || '',
        tel: props.tel_props || '',
        password: props.password_props || '',
        finish_loading: false,
        verify_loadding: false
      };
    }

    this.eventTracker = new EventTracker();
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

    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  _unMount() {
    Keyboard.dismiss();
  }

  _onSave() {
    var { name, tel, password } = this.state;

    name = name.trim();
    tel = tel.trim();
    password = password.trim();

    if (!name) {
      return Alert.alert(
        'Thông báo',
        'Hãy điền tên của bạn',
        [
          {
            text: 'Đồng ý',
            onPress: () => {
              this.refs_name.focus();
            }
          }
        ],
        { cancelable: false }
      );
    }

    if (!tel) {
      return Alert.alert(
        'Thông báo',
        'Hãy điền Số điện thoại',
        [
          {
            text: 'Đồng ý',
            onPress: () => {
              this.refs_tel.focus();
            }
          }
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

    if (this.successfully || this.state.finish_loading) {
      return;
    }

    this._register(name, tel, password);
  }

  _register(name, tel, password) {
    this.setState(
      {
        finish_loading: true
      },
      async () => {
        try {
          var response = await APIHandler.user_register({
            name,
            username: tel
          });

          if (response && response.status == STATUS_SUCCESS) {
            this.successfully = true;

            this._unMount();

            this.setState(
              {
                finish_loading: false
              },
              () => {
                if (this.refs_modal_verify) {
                  this.refs_modal_verify.open();

                  const onBack = () => {
                    Alert.alert(
                      'Huỷ đăng ký',
                      'Quá trình đăng ký chưa hoàn tất, bạn đã chắc chắn chưa?',
                      [
                        { text: 'Không', onPress: () => {} },
                        {
                          text: 'Có',
                          onPress: () => {
                            Actions.pop();
                          }
                        }
                      ],
                      { cancelable: false }
                    );
                  };

                  Actions.refresh({
                    onBack
                  });
                }
              }
            );

            flashShowMessage({
              type: 'success',
              message: response.message
            });
          } else {
            this.setState({
              finish_loading: false
            });

            flashShowMessage({
              type: 'danger',
              message: response.message
            });
          }
        } catch (e) {
          console.log(e + ' user_register');

          store.addApiQueue(
            'user_register',
            this._register.bind(this, name, tel, password)
          );
        }
      }
    );
  }

  render() {
    var { verify_loadding } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={{
            marginBottom: store.keyboardTop + 60
          }}
        >
          <View style={styles.input_box}>
            <Text style={styles.input_label}>Tên</Text>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => (this.refs_name = ref)}
                style={styles.input_text}
                keyboardType="default"
                maxLength={30}
                placeholder="Điền họ và tên"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={value => {
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
                  if (this.refs_tel) {
                    this.refs_tel.focus();
                  }
                }}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.input_box}>
            <Text style={styles.input_label}>Số điện thoại</Text>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => (this.refs_tel = ref)}
                style={styles.input_text}
                keyboardType="phone-pad"
                maxLength={30}
                placeholder="Điền số điện thoại"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={value => {
                  this.setState({
                    tel: value.replaceAll(' ', '')
                  });
                }}
                value={this.state.tel}
              />
            </View>
          </View>

          {/*<View style={styles.input_box}>
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
                value={this.state.password}
                onSubmitEditing={this._onSave.bind(this)}
                returnKeyType="go"
                />
            </View>
          </View>*/}
        </ScrollView>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this._onSave.bind(this)}
          style={[styles.address_continue, { bottom: store.keyboardTop }]}
        >
          <View style={styles.address_continue_content}>
            <View
              style={{
                minWidth: 20,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {this.state.finish_loading ? (
                <Indicator size="small" color="#ffffff" />
              ) : (
                <Icon
                  name={this.state.edit_mode ? 'save' : 'user-plus'}
                  size={20}
                  color="#ffffff"
                />
              )}
            </View>
            <Text style={styles.address_continue_title}>
              {this.state.edit_mode ? 'LƯU LẠI' : 'ĐĂNG KÝ'}
            </Text>
          </View>
        </TouchableHighlight>

        <Modal
          entry="top"
          style={[styles.modal]}
          swipeToClose={false}
          backdropPressToClose={false}
          backButtonClose={false}
          ref={ref => (this.refs_modal_verify = ref)}
        >
          <Text style={styles.verify_title}>NHẬP MÃ XÁC THỰC</Text>
          <Text style={styles.verify_desc}>
            Mã xác thực đang được gửi tới số điện thoại
            <Text
              style={{
                fontWeight: '500'
              }}
            >
              {'\n' + this.state.tel}
            </Text>
          </Text>

          <TextInput
            ref={ref => {
              if (ref) {
                this.refs_verify = ref;
              }
            }}
            onLayout={() => {
              if (this.refs_verify) {
                clearTimeout(this._verify_focus_timer);
                this._verify_focus_timer = setTimeout(() => {
                  this.refs_verify.focus();
                }, 3000);
              }
            }}
            style={styles.input_text_verify}
            keyboardType="numeric"
            maxLength={100}
            placeholder="Điền mã xác thực"
            placeholderTextColor="#999999"
            underlineColorAndroid="transparent"
            onChangeText={value => {
              this.setState({
                otp: value
              });
            }}
            value={this.state.otp}
          />

          <TouchableHighlight
            underlayColor="transparent"
            onPress={this._onVerify.bind(this)}
          >
            <View style={styles.verify_btn}>
              {verify_loadding ? (
                <View
                  style={{
                    width: 16
                  }}
                >
                  <Indicator size="small" />
                </View>
              ) : (
                <Icon name="check" size={16} color="#ffffff" />
              )}

              <Text style={styles.verify_btn_title}>HOÀN THÀNH</Text>
            </View>
          </TouchableHighlight>
        </Modal>
      </View>
    );
  }

  _onVerify() {
    if (this.successfully2 || this.state.verify_loadding) {
      return;
    }

    this._verify();
  }

  _verify() {
    this.setState(
      {
        verify_loadding: true
      },
      async () => {
        try {
          var response = await APIHandler.user_verify_otp({
            otp: this.state.otp
          });

          if (response && response.status == STATUS_SUCCESS) {
            this.successfully2 = true;

            action(() => {
              this._unMount();

              store.setUserInfo(response.data);

              store.resetCartData();

              store.setRefreshHomeChange(store.refresh_home_change + 1);

              if (this.props.registerNow) {
                Actions.pop({
                  popNum: 2
                });
              } else {
                Actions.pop();
              }
            })();
          }

          if (response) {
            flashShowMessage({
              type: 'success',
              message: response.message
            });
          }
        } catch (e) {
          console.log(e + ' user_verify_otp');

          store.addApiQueue('user_verify_otp', this._verify.bind(this));
        } finally {
          this.setState({
            verify_loadding: false
          });
        }
      }
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    width: '90%',
    height: 210,
    borderRadius: 2,
    marginTop: -(NAV_HEIGHT / 2),
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
    color: '#666666'
  },
  input_text_verify: {
    borderWidth: Util.pixel,
    borderColor: '#cccccc',
    marginTop: 20,
    height: 40,
    width: '69%',
    paddingHorizontal: 15,
    textAlign: 'center',
    fontSize: 18,
    color: '#404040'
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
    color: '#ffffff',
    marginLeft: 4
  },

  container: {
    flex: 1,

    marginBottom: 0
  },
  input_box: {
    width: '100%',
    height: 44,
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
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
    color: '#000000'
  },
  input_text: {
    width: '96%',
    height: 38,
    paddingLeft: 8,
    color: '#000000',
    fontSize: 14,
    textAlign: 'right',
    paddingVertical: 0
  },

  input_address_box: {
    width: '100%',
    minHeight: 100,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd'
  },
  input_label_help: {
    fontSize: 12,
    marginTop: 2,
    color: '#666666'
  },
  input_address_text: {
    width: '100%',
    color: '#000000',
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

export default observer(Register);