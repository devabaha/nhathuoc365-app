import React, { memo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appConfig from 'app-config';
import { PASSWORD_LENGTH, INPUT_TYPE, OTP_LENGTH } from './constants';
import OTPRequestMessage from './OTPRequestMessage';
import FloatingLabelInput from '../FloatingLabelInput';
import Button from '../Button';
import Header from './Header';
import ComboSlidingButton from '../ComboSlidingButton';

const ResetPassword = props => {
  const { t } = useTranslation('resetPassword');
  const comboBtnData = [
    {
      id: 0,
      view: (
        <OTPInput
          refOTP={props.refOTP}
          onFocus={props.onOTPFocus}
          onChangeText={otp => props.onInputChange(otp, INPUT_TYPE.OTP)}
          placeholder={t('btn.typeOTP.placeholder')}
          value={props.OTPValue}
          disabled={props.loading}
          onSendPress={() => props.onVerifyPress(0)}
        />
      )
    },
    {
      id: 1,
      view: (
        <Button
          containerStyle={styles.confirmOTPbtnContainer}
          btnContainerStyle={[
            styles.btn,
            props.sendOTPDisabled && styles.disabledConfirmOTP
          ]}
          disabled={props.sendOTPDisabled}
          title={t('btn.sendOTP')}
          iconRight={
            props.loading && (
              <ActivityIndicator
                animating={true}
                style={styles.loading}
                size="small"
              />
            )
          }
          onPress={() => props.onRequestOTP(1)}
        />
      )
    }
  ];

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
              onPress={props.onBack}
            >
              <Ionicons name="ios-arrow-round-back" style={styles.backIcon} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <ScrollView
          ref={props.refScrollView}
          style={styles.scrollView}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
        >
          <Header />

          <View style={styles.body}>
            <FloatingLabelInput
              label={t('form.newPass.title')}
              keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
              secureTextEntry
              editable={!props.confirmResult}
              inputStyle={props.confirmResult && styles.inputDisabled}
              onChangeText={password =>
                props.onInputChange(password, INPUT_TYPE.PASSWORD)
              }
              maxLength={PASSWORD_LENGTH}
              value={props.newPassValue}
              error={props.newPassError}
              onBlur={() => props.onInputBlur(INPUT_TYPE.PASSWORD)}
            />
            <FloatingLabelInput
              label={t('form.confirmPass.title')}
              keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
              secureTextEntry
              editable={!props.confirmResult}
              inputStyle={props.confirmResult && styles.inputDisabled}
              onChangeText={confirmPassword =>
                props.onInputChange(
                  confirmPassword,
                  INPUT_TYPE.CONFIRM_PASSWORD
                )
              }
              maxLength={PASSWORD_LENGTH}
              value={props.confirmPassValue}
              error={props.confirmPassError}
              onBlur={() => props.onInputBlur(INPUT_TYPE.CONFIRM_PASSWORD)}
            />
          </View>

          <View style={styles.comboBtn}>
            <ComboSlidingButton
              selectedItems={props.selectedComboBtns}
              comboContainerStyle={styles.comboContainerStyle}
              onFinishAnimation={props.onFinishAnimation}
              data={comboBtnData}
            />
            {props.confirmResult && (
              <OTPRequestMessage
                requestNewOtpCounter={props.requestNewOtpCounter}
                onPressRequestNewOtp={props.onPressRequestNewOtp}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

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
  backBtn: {
    top: 10,
    left: 20
  },
  backIcon: {
    fontSize: 40,
    color: '#5f5f5f'
  },
  body: {
    flex: 1,
    paddingVertical: 15
  },
  scrollView: {},
  loading: {
    left: 15
  },
  comboBtn: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    paddingBottom: 30
  },
  inputDisabled: {
    color: '#eee',
    backgroundColor: '#eee'
  },
  comboContainerStyle: {
    height: 55,
    borderRadius: 10
  },
  confirmOTPbtnContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  disabledConfirmOTP: {
    backgroundColor: '#aaa'
  },
  btn: {
    height: '100%',
    paddingVertical: 0
  },
  confirmOTPBtn: {
    width: 60,
    backgroundColor: '#fff'
  },
  confirmOTPIcon: {
    color: DEFAULT_COLOR,
    fontSize: 30,
    top: 2
  },
  OTPInputContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1
  },
  OTPInput: {
    flex: 1,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderRightWidth: 0.2,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center'
  }
});

export default ResetPassword;

const OTPInput = memo(props => {
  return (
    <View style={styles.OTPInputContainer}>
      <TextInput
        ref={props.refOTP}
        style={styles.OTPInput}
        onFocus={props.onFocus}
        placeholder={props.placeholder}
        keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
        maxLength={OTP_LENGTH}
        onChangeText={props.onChangeText}
        value={props.value}
      />
      <View>
        <Button
          containerStyle={styles.confirmOTPbtnContainer}
          btnContainerStyle={[styles.btn, styles.confirmOTPBtn]}
          disabled={props.disabled}
          iconRight={<Ionicons name="ios-send" style={styles.confirmOTPIcon} />}
          onPress={props.onSendPress}
        />
      </View>
    </View>
  );
});
