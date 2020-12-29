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
import { Actions } from 'react-native-router-flux';
import EventTracker from '../../helper/EventTracker';
import store from '../../store/Store';

// components
import Sticker from '../Sticker';

class ForgetActive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      tel: props.tel,
      finish_loading: false,
      verify_loadding: false,
      sticker_flag: false,
      count_down: 0
    };
    this.eventTracker = new EventTracker();
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
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  registerMsgBar = () => {};

  _unMount() {
    Keyboard.dismiss();

    clearInterval(this._countDownTimer);

    clearTimeout(this._timerEnableBtn);

    if (this.props.onBackCustomer) {
      this.props.onBackCustomer();
    }
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

  _onActive() {
    var { tel, code, finish_loading } = this.state;
    code = code.trim();

    if (finish_loading) {
      return;
    }

    if (!code) {
      return Alert.alert(
        'Thông báo',
        'Hãy điền Mã xác thực',
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

    this.setState(
      {
        finish_loading: true
      },
      async () => {
        try {
          var response = await APIHandler.user_forget_password_verify({
            username: tel,
            otp: code
          });

          if (response && response.status == STATUS_SUCCESS) {
            Actions.new_pass({
              tel,
              onBackCustomer: this.registerMsgBar
            });
          } else if (response && response.message) {
            //
          }
        } catch (e) {
          console.log(e + ' user_forget_password_verify');

          store.addApiQueue(
            'user_forget_password_verify',
            this._onActive.bind(this)
          );
        } finally {
          this._timerEnableBtn = setTimeout(() => {
            this.setState({
              finish_loading: false
            });
          }, 5000);
        }
      }
    );
  }

  async _reSendCode() {
    var { tel } = this.state;

    try {
      var response = await APIHandler.user_forget_password({
        username: tel
      });

      if (response && response.status == STATUS_SUCCESS) {
        this.setState({
          sended: true,
          count_down: 15
        });

        this._countDownTimer = setInterval(() => {
          this.setState(
            {
              count_down: this.state.count_down - 1
            },
            () => {
              if (this.state.count_down <= 0) {
                clearInterval(this._countDownTimer);
                this.setState({
                  sended: false
                });
              }
            }
          );
        }, 1000);
      } else if (response && response.message) {
        //
      }
    } catch (e) {
      console.log(e + ' user_forget_password');

      store.addApiQueue('user_forget_password', this._reSendCode.bind(this));
    }
  }

  render() {
    var { finish_loading, tel, count_down, sended } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{
            marginBottom: store.keyboardTop + 60
          }}
        >
          <View
            style={{
              height: 100,
              width: Util.size.width,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: '#404040',
                fontWeight: '500'
              }}
            >
              {tel}
            </Text>
            <Text
              style={{
                fontSize: 12,
                marginTop: 4,
                color: '#666666'
              }}
            >
              Nhập mã xác thực đã gửi đến số điện thoại của bạn
            </Text>
          </View>

          <View style={styles.input_box}>
            <TouchableHighlight
              underlayColor="#ffffff"
              onPress={() => {
                if (this.refs_tel) {
                  this.refs_tel.focus();
                }
              }}
            >
              <Text style={styles.input_label}>Mã xác thực</Text>
            </TouchableHighlight>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => (this.refs_tel = ref)}
                onLayout={() => {
                  if (this.refs_tel) {
                    setTimeout(() => this.refs_tel.focus(), 300);
                  }
                }}
                style={styles.input_text}
                keyboardType="numeric"
                maxLength={4}
                placeholder="Nhập mã xác thực"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={value => {
                  this.setState({
                    code: value.replaceAll(' ', '')
                  });
                }}
                value={this.state.code}
              />
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              marginTop: 24
            }}
          >
            {sended ? (
              <Text
                style={{
                  color: DEFAULT_COLOR
                }}
              >
                Bạn sẽ nhận được tin nhắn sau (
                {count_down < 10 ? `0${count_down}` : count_down}) giây
              </Text>
            ) : (
              <TouchableHighlight
                onPress={this._reSendCode.bind(this)}
                underlayColor="transparent"
              >
                <Text
                  style={{
                    color: DEFAULT_COLOR
                  }}
                >
                  Gửi lại
                </Text>
              </TouchableHighlight>
            )}
          </View>
        </ScrollView>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this._onActive.bind(this)}
          style={[styles.address_continue, { bottom: store.keyboardTop }]}
        >
          <View
            style={[
              styles.address_continue_content,
              {
                backgroundColor: finish_loading
                  ? hexToRgbA(DEFAULT_COLOR, 0.6)
                  : DEFAULT_COLOR
              }
            ]}
          >
            <Text style={styles.address_continue_title}>KÍCH HOẠT</Text>
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

export default observer(ForgetActive);