import React, { Component } from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Circle } from 'react-native-svg';
import appConfig from 'app-config';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import Button from '../../components/Button';
import ComboSlidingButton from './ComboSlidingButton';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import store from 'app-store';
const timer = require('react-timer-mixin');

const AREA_SIZE = 180;
const CENTER_POINT_COOR = AREA_SIZE / 2;
const OTP_TIME_REQUEST = 30;
const INPUT_TYPE = {
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword'
};

class ResetPassword extends Component {
  state = {
    selectedItems: [],
    requestNewOtpCounter: OTP_TIME_REQUEST,
    confirmResult: false,
    [INPUT_TYPE.PASSWORD]: '',
    [INPUT_TYPE.CONFIRM_PASSWORD]: ''
  };
  timerID = 0;
  refScrollView = null;
  refOTP = React.createRef();
  unmounted = false;

  componentWillUnmount() {
    this.unmounted = true;
    timer.clearInterval(this.timerID);
  }

  onBack() {}

  onRequestOTP(id) {
    const state = { ...this.state };
    state.loading = true;
    // state.selectedItems.push(id);
    this.setState(state, () => {
      state.loading = false;
      state.confirmResult = true;
      state.selectedItems = [id];
      state.requestNewOtpCounter = OTP_TIME_REQUEST;
      setTimeout(() => {
        !this.unmounted && this.setState(state);
      }, 500);
    });
    // const loginMode = store.user_info.loginMode;
    // Actions.push('phone_auth', {
    //     showOTP: true,
    //     tel: '0945310445',
    //     loginMode: loginMode ? loginMode : 'FIREBASE', //FIREBASE / SMS_BRAND_NAME
    //     onCloseOTP: Actions.pop
    // })
  }

  onOTPFocus() {
    setTimeout(() => {
      !this.unmounted && this.refScrollView.scrollToEnd();
    }, 600);
  }

  onVerifyPress(id) {
    Keyboard.dismiss();
    const state = { ...this.state };
    state.confirmResult = false;
    state.loading = false;
    state.selectedItems = [id];
    this.setState(state);
    timer.clearInterval(this.timerID);
  }

  handleFinishAnimation(item, isClosed) {
    if (item.id === 1 && isClosed) {
      if (this.refOTP.current) {
        this.refOTP.current.focus();
      }
      this.startCountDown();
    }
  }

  handleInput(value, type) {
    const state = { ...this.state };
    state[type] = value;
    this.setState(state);

    switch (type) {
      case INPUT_TYPE.PASSWORD:
        break;
      case INPUT_TYPE.CONFIRM_PASSWORD:
        break;
    }
  }

  _onPressRequestNewOtp() {
    this.setState({ requestNewOtpCounter: OTP_TIME_REQUEST });
    this.startCountDown();
  }

  startCountDown() {
    this.timerID = timer.setInterval(() => {
      const { requestNewOtpCounter } = this.state;
      if (requestNewOtpCounter > 0) {
        this.setState({ requestNewOtpCounter: requestNewOtpCounter - 1 });
      } else {
        timer.clearInterval(this.timerID);
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

  render() {
    const { requestNewOtpCounter } = this.state;
    const { t } = this.props;
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.nav}>
            <LinearGradient
              style={styles.mask}
              colors={[hexToRgbA('#fafafa', 0.3), hexToRgbA('#fafafa', 0)]}
              locations={[0, 1]}
            >
              <TouchableOpacity
                hitSlop={HIT_SLOP}
                style={styles.backBtn}
                onPress={this.onBack.bind(this)}
              >
                <Ionicons name="ios-arrow-round-back" style={styles.backIcon} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <ScrollView
            ref={ref => (this.refScrollView = ref)}
            style={styles.scrollView}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Svg style={styles.iconBackground}>
                  <Circle
                    strokeWidth={10}
                    stroke={hexToRgbA(DEFAULT_COLOR, 0.3)}
                    cx={CENTER_POINT_COOR}
                    cy={CENTER_POINT_COOR}
                    r="50"
                    fill={DEFAULT_COLOR}
                  />
                  <Circle
                    strokeWidth={3}
                    stroke={hexToRgbA(DEFAULT_COLOR, 0.4)}
                    strokeDasharray={[3, 15]}
                    strokeLinecap="round"
                    cx={CENTER_POINT_COOR}
                    cy={CENTER_POINT_COOR}
                    r={CENTER_POINT_COOR - 13}
                    fill="transparent"
                  />
                  <Circle
                    strokeWidth={2.5}
                    stroke={hexToRgbA(DEFAULT_COLOR, 0.3)}
                    cx={13}
                    cy={CENTER_POINT_COOR - 8}
                    r={8}
                    fill="#fff"
                  />
                </Svg>
                <Icon name="key" style={styles.icon} />
              </View>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.description}>
                Enter your new password, confirm it and type an OTP to finish
              </Text>
            </View>
            <View style={styles.body}>
              <FloatingLabelInput
                label="New password"
                keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
                secureTextEntry
                editable={!this.state.confirmResult}
                inputStyle={this.state.confirmResult && styles.inputDisabled}
                onChangeText={password =>
                  this.handleInput(password, INPUT_TYPE.PASSWORD)
                }
                value={this.state[INPUT_TYPE.PASSWORD]}
              />
              <FloatingLabelInput
                label="Confirm password"
                keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
                secureTextEntry
                editable={!this.state.confirmResult}
                inputStyle={this.state.confirmResult && styles.inputDisabled}
                onChangeText={confirmPassword =>
                  this.handleInput(confirmPassword, INPUT_TYPE.CONFIRM_PASSWORD)
                }
                value={this.state[INPUT_TYPE.CONFIRM_PASSWORD]}
              />
            </View>

            <View style={styles.comboBtn}>
              <ComboSlidingButton
                selectedItems={this.state.selectedItems}
                comboContainerStyle={styles.comboContainerStyle}
                onFinishAnimation={this.handleFinishAnimation.bind(this)}
                data={[
                  {
                    id: 0,
                    view: (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          borderWidth: 1
                        }}
                      >
                        <TextInput
                          ref={this.refOTP}
                          style={{
                            flex: 1,
                            paddingHorizontal: 15,
                            marginVertical: 10,
                            borderRightWidth: 0.2,
                            fontWeight: 'bold',
                            fontSize: 20,
                            textAlign: 'center'
                          }}
                          onFocus={this.onOTPFocus.bind(this)}
                          placeholder="Nhập mã OTP..."
                          keyboardType={
                            appConfig.device.isIOS ? 'number-pad' : 'numeric'
                          }
                        />
                        <View>
                          <Button
                            containerStyle={styles.confirmOTPbtnContainer}
                            btnContainerStyle={[
                              styles.confirmOTPbtn,
                              { width: 60, backgroundColor: '#fff' }
                            ]}
                            disabled={this.state.loading}
                            // title="SEND"
                            iconRight={
                              <Ionicons
                                name="ios-send"
                                style={{
                                  color: DEFAULT_COLOR,
                                  fontSize: 30,
                                  top: 2
                                }}
                              />
                            }
                            onPress={() => this.onVerifyPress(0)}
                          />
                        </View>
                      </View>
                    )
                  },
                  {
                    id: 1,
                    view: (
                      <Button
                        containerStyle={styles.confirmOTPbtnContainer}
                        btnContainerStyle={styles.confirmOTPbtn}
                        disabled={this.state.loading}
                        title="XÁC THỰC OTP"
                        iconRight={
                          this.state.loading && (
                            <ActivityIndicator
                              animating={true}
                              style={styles.loading}
                              size="small"
                            />
                          )
                        }
                        onPress={() => this.onRequestOTP(1)}
                      />
                    )
                  }
                ]}
              />
              {this.state.confirmResult && (
                <>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '200',
                      color: 'black',
                      marginTop: 20
                    }}
                  >
                    {t('phoneAuth:notReceiveCode')}
                  </Text>
                  <TouchableOpacity
                    onPress={this._onPressRequestNewOtp.bind(this)}
                    disabled={requestNewOtpCounter > 0}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#528BC5',
                        fontWeight: '700',
                        marginTop: 8
                      }}
                    >
                      {requestNewOtpCounter > 0
                        ? `${t(
                            'phoneAuth:requestNewCodeWithTime'
                          )} ${this.convertSecondToMinute(
                            requestNewOtpCounter
                          )}`
                        : t('phoneAuth:requestNewCode')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa'
  },
  nav: {
    width: '100%',
    justifyContent: 'center',
    zIndex: 1
  },
  mask: {
    top: 0,
    height: 50,
    width: '100%',
    position: 'absolute'
  },
  header: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 40,
    marginBottom: 20
  },
  backBtn: {
    top: 10,
    left: 20
  },
  backIcon: {
    fontSize: 40,
    color: '#5f5f5f'
  },
  headerContent: {
    height: AREA_SIZE,
    width: AREA_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  iconBackground: {
    position: 'absolute',
    zIndex: 0
  },
  icon: {
    fontSize: 40,
    color: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#242424'
  },
  description: {
    marginTop: 5,
    maxWidth: 300,
    fontSize: 13,
    textAlign: 'center',
    color: '#666'
  },
  body: {
    flex: 1,
    paddingVertical: 15
  },
  scrollView: {
    paddingBottom: 15
  },
  loading: {
    left: 15
  },
  inputDisabled: {
    color: '#eee',
    backgroundColor: '#eee'
  },
  comboBtn: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 8
  },
  comboContainerStyle: {
    height: 55,
    borderRadius: 10
  },
  confirmOTPbtnContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  confirmOTPbtn: {
    height: '100%',
    paddingVertical: 0
  }
});

export default withTranslation(['resetPassword', 'phoneAuth'])(ResetPassword);
