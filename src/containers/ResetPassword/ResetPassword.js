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
import ComboSlidingButton from '../../components/ComboSlidingButton';
import LinearGradient from 'react-native-linear-gradient';
import { default as ResetPasswordComponent } from '../../components/ResetPassword';
import { Actions } from 'react-native-router-flux';
import store from 'app-store';
import {
  AREA_SIZE,
  OTP_TIME_REQUEST,
  INPUT_TYPE,
  PASSWORD_LENGTH
} from '../../components/ResetPassword/constants';
const timer = require('react-timer-mixin');

class ResetPassword extends Component {
  state = {
    selectedItems: [],
    requestNewOtpCounter: OTP_TIME_REQUEST,
    confirmResult: false,
    [INPUT_TYPE.PASSWORD]: {
      value: '',
      error: ''
    },
    [INPUT_TYPE.CONFIRM_PASSWORD]: {
      value: '',
      error: ''
    },
    [INPUT_TYPE.OTP]: {
      value: '',
      error: ''
    }
  };
  timerID = 0;
  refScrollView = React.createRef();
  refOTP = React.createRef();
  unmounted = false;

  componentWillUnmount() {
    this.unmounted = true;
    timer.clearInterval(this.timerID);
  }

  onBack() {
    Actions.pop();
  }

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
  }

  onOTPFocus() {
    setTimeout(() => {
      !this.unmounted && this.refScrollView.current.scrollToEnd();
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
    setTimeout(() => {
      if (!this.unmounted) {
        if (item.id === 1 && isClosed) {
          if (this.refOTP.current) {
            this.refOTP.current.focus();
          }
          this.startCountDown();
        }
      }
    }, 100);
  }

  handleInput(value, type) {
    if (value.match(/^\d+$/) || !value) {
      const state = { ...this.state };
      state[type].value = value;
      state[type].error = '';
      this.setState(state, () => type !== INPUT_TYPE.OTP && this.validate());
    }
  }

  handleInputBlur() {
    this.validate();
  }

  validate() {
    const state = { ...this.state };
    const { t } = this.props;

    if (state[INPUT_TYPE.PASSWORD].value.length !== PASSWORD_LENGTH) {
      state[INPUT_TYPE.PASSWORD].error = t('form.newPass.error.length');
    }

    if (
      state[INPUT_TYPE.CONFIRM_PASSWORD].value &&
      state[INPUT_TYPE.CONFIRM_PASSWORD].value !==
        state[INPUT_TYPE.PASSWORD].value
    ) {
      state[INPUT_TYPE.CONFIRM_PASSWORD].error = t(
        'form.confirmPass.error.notMatch'
      );
    }

    this.setState(state);
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
    const sendOTPDisabled =
      this.state.loading ||
      !this.state[INPUT_TYPE.PASSWORD].value ||
      this.state[INPUT_TYPE.PASSWORD].error ||
      !this.state[INPUT_TYPE.CONFIRM_PASSWORD].value ||
      this.state[INPUT_TYPE.CONFIRM_PASSWORD].error;

    return (
      <ResetPasswordComponent
        refOTP={this.refOTP}
        refScrollView={this.refScrollView}
        loading={this.state.loading}
        confirmResult={this.state.confirmResult}
        sendOTPDisabled={sendOTPDisabled}
        newPassValue={this.state[INPUT_TYPE.PASSWORD].value}
        newPassError={this.state[INPUT_TYPE.PASSWORD].error}
        confirmPassValue={this.state[INPUT_TYPE.CONFIRM_PASSWORD].value}
        confirmPassError={this.state[INPUT_TYPE.CONFIRM_PASSWORD].error}
        OTPValue={this.state[INPUT_TYPE.OTP].value}
        requestNewOtpCounter={this.state.requestNewOtpCounter}
        selectedComboBtns={this.state.selectedItems}
        onFinishAnimation={this.handleFinishAnimation.bind(this)}
        onPressRequestNewOtp={this._onPressRequestNewOtp.bind(this)}
        onInputChange={this.handleInput.bind(this)}
        onInputBlur={this.handleInputBlur.bind(this)}
        onOTPFocus={this.onOTPFocus.bind(this)}
        onVerifyPress={this.onVerifyPress.bind(this)}
        onRequestOTP={this.onRequestOTP.bind(this)}
        onBack={this.onBack.bind(this)}
      />

      //     <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      //     <SafeAreaView style={styles.container}>
      //         <View style={styles.nav}>
      //             <LinearGradient
      //                 style={styles.mask}
      //                 colors={[hexToRgbA('#fafafa', 0.3), hexToRgbA('#fafafa', 0)]}
      //                 locations={[0, 1]}
      //             >
      //                 <TouchableOpacity
      //                     hitSlop={HIT_SLOP}
      //                     style={styles.backBtn}
      //                     onPress={this.onBack.bind(this)}
      //                 >
      //                     <Ionicons name="ios-arrow-round-back" style={styles.backIcon} />
      //                 </TouchableOpacity>
      //             </LinearGradient>
      //         </View>
      //         <ScrollView
      //             ref={ref => (this.refScrollView = ref)}
      //             style={styles.scrollView}
      //             scrollEventThrottle={16}
      //             keyboardShouldPersistTaps="handled"
      //         >
      //             <View style={styles.header}>
      //                 <View style={styles.headerContent}>
      //                     <Svg style={styles.iconBackground}>
      //                         <Circle
      //                             strokeWidth={10}
      //                             stroke={hexToRgbA(DEFAULT_COLOR, 0.3)}
      //                             cx={CENTER_POINT_COOR}
      //                             cy={CENTER_POINT_COOR}
      //                             r="50"
      //                             fill={DEFAULT_COLOR}
      //                         />
      //                         <Circle
      //                             strokeWidth={3}
      //                             stroke={hexToRgbA(DEFAULT_COLOR, 0.4)}
      //                             strokeDasharray={[3, 15]}
      //                             strokeLinecap="round"
      //                             cx={CENTER_POINT_COOR}
      //                             cy={CENTER_POINT_COOR}
      //                             r={CENTER_POINT_COOR - 13}
      //                             fill="transparent"
      //                         />
      //                         <Circle
      //                             strokeWidth={2.5}
      //                             stroke={hexToRgbA(DEFAULT_COLOR, 0.3)}
      //                             cx={13}
      //                             cy={CENTER_POINT_COOR - 8}
      //                             r={8}
      //                             fill="#fff"
      //                         />
      //                     </Svg>
      //                     <Icon name="key" style={styles.icon} />
      //                 </View>
      //                 <Text style={styles.title}>{t('common:screen.resetPassword.mainTitle')}</Text>
      //                 <Text style={styles.description}>
      //                     {t('instruction')}
      //                 </Text>
      //             </View>
      //             <View style={styles.body}>
      //                 <FloatingLabelInput
      //                     label={t('form.newPass.title')}
      //                     keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
      //                     secureTextEntry
      //                     editable={!this.state.confirmResult}
      //                     inputStyle={this.state.confirmResult && styles.inputDisabled}
      //                     onChangeText={password =>
      //                         this.handleInput(password, INPUT_TYPE.PASSWORD)
      //                     }
      //                     maxLength={PASSWORD_LENGTH}
      //                     value={this.state[INPUT_TYPE.PASSWORD].value}
      //                     error={this.state[INPUT_TYPE.PASSWORD].error}
      //                     onBlur={() => this.handleInputBlur(INPUT_TYPE.PASSWORD)}
      //                 />
      //                 <FloatingLabelInput
      //                     label={t('form.confirmPass.title')}
      //                     keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
      //                     secureTextEntry
      //                     editable={!this.state.confirmResult}
      //                     inputStyle={this.state.confirmResult && styles.inputDisabled}
      //                     onChangeText={confirmPassword =>
      //                         this.handleInput(confirmPassword, INPUT_TYPE.CONFIRM_PASSWORD)
      //                     }
      //                     maxLength={PASSWORD_LENGTH}
      //                     value={this.state[INPUT_TYPE.CONFIRM_PASSWORD].value}
      //                     error={this.state[INPUT_TYPE.CONFIRM_PASSWORD].error}
      //                     onBlur={() => this.handleInputBlur(INPUT_TYPE.CONFIRM_PASSWORD)}
      //                 />
      //             </View>

      //             <View style={styles.comboBtn}>
      //                 <ComboSlidingButton
      //                     selectedItems={this.state.selectedItems}
      //                     comboContainerStyle={styles.comboContainerStyle}
      //                     onFinishAnimation={this.handleFinishAnimation.bind(this)}
      //                     data={[
      //                         {
      //                             id: 0,
      //                             view: (
      //                                 <View
      //                                     style={{
      //                                         flex: 1,
      //                                         flexDirection: 'row',
      //                                         borderWidth: 1
      //                                     }}
      //                                 >
      //                                     <TextInput
      //                                         ref={this.refOTP}
      //                                         style={{
      //                                             flex: 1,
      //                                             paddingHorizontal: 15,
      //                                             marginVertical: 10,
      //                                             borderRightWidth: 0.2,
      //                                             fontWeight: 'bold',
      //                                             fontSize: 20,
      //                                             textAlign: 'center'
      //                                         }}
      //                                         onFocus={this.onOTPFocus.bind(this)}
      //                                         placeholder={t('btn.typeOTP.placeholder')}
      //                                         keyboardType={
      //                                             appConfig.device.isIOS ? 'number-pad' : 'numeric'
      //                                         }
      //                                     />
      //                                     <View>
      //                                         <Button
      //                                             containerStyle={styles.confirmOTPbtnContainer}
      //                                             btnContainerStyle={[
      //                                                 styles.confirmOTPbtn,
      //                                                 { width: 60, backgroundColor: '#fff' },
      //                                             ]}
      //                                             disabled={this.state.loading}
      //                                             // title="SEND"
      //                                             iconRight={
      //                                                 <Ionicons
      //                                                     name="ios-send"
      //                                                     style={{
      //                                                         color: DEFAULT_COLOR,
      //                                                         fontSize: 30,
      //                                                         top: 2
      //                                                     }}
      //                                                 />
      //                                             }
      //                                             onPress={() => this.onVerifyPress(0)}
      //                                         />
      //                                     </View>
      //                                 </View>
      //                             )
      //                         },
      //                         {
      //                             id: 1,
      //                             view: (
      //                                 <Button
      //                                     containerStyle={styles.confirmOTPbtnContainer}
      //                                     btnContainerStyle={[styles.confirmOTPbtn,
      //                                     sendOTPDisabled && { backgroundColor: '#aaa' }
      //                                     ]}
      //                                     disabled={sendOTPDisabled}
      //                                     title={t('btn.sendOTP')}
      //                                     iconRight={
      //                                         this.state.loading && (
      //                                             <ActivityIndicator
      //                                                 animating={true}
      //                                                 style={styles.loading}
      //                                                 size="small"
      //                                             />
      //                                         )
      //                                     }
      //                                     onPress={() => this.onRequestOTP(1)}
      //                                 />
      //                             )
      //                         }
      //                     ]}
      //                 />
      //                 {this.state.confirmResult && (
      //                     <>
      //                         <Text
      //                             style={{
      //                                 fontSize: 14,
      //                                 fontWeight: '200',
      //                                 color: 'black',
      //                                 marginTop: 20
      //                             }}
      //                         >
      //                             {t('phoneAuth:notReceiveCode')}
      //                         </Text>
      //                         <TouchableOpacity
      //                             onPress={this._onPressRequestNewOtp.bind(this)}
      //                             disabled={requestNewOtpCounter > 0}
      //                         >
      //                             <Text
      //                                 style={{
      //                                     fontSize: 14,
      //                                     color: '#528BC5',
      //                                     fontWeight: '700',
      //                                     marginTop: 8
      //                                 }}
      //                             >
      //                                 {requestNewOtpCounter > 0
      //                                     ? `${t(
      //                                         'phoneAuth:requestNewCodeWithTime'
      //                                     )} ${this.convertSecondToMinute(
      //                                         requestNewOtpCounter
      //                                     )}`
      //                                     : t('phoneAuth:requestNewCode')}
      //                             </Text>
      //                         </TouchableOpacity>
      //                     </>
      //                 )}
      //             </View>
      //         </ScrollView>
      //     </SafeAreaView>
      // </KeyboardAvoidingView>
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
    // paddingBottom: 15
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
    paddingVertical: 8,
    paddingBottom: 30
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

export default withTranslation(['resetPassword', 'phoneAuth', 'common'])(
  ResetPassword
);
