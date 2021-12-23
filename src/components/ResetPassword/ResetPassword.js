import React, {useMemo} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  View,
} from 'react-native';
// configs
import appConfig from 'app-config';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {
  PASSWORD_LENGTH,
  INPUT_TYPE,
} from 'src/components/ResetPassword/constants';
// custom components
import OTPRequestMessage from 'src/components/ResetPassword/OTPRequestMessage';
import FloatingLabelInput from 'src/components/FloatingLabelInput';
import Button from 'src/components/Button';
import Header from 'src/components/ResetPassword/Header';
import ComboSlidingButton from 'src/components/ComboSlidingButton';
import {Container, ScreenWrapper, ScrollView} from 'src/components/base';
import OTPInput from 'src/components/ResetPassword/OTPInput';
import NavBar from './NavBar';

const ResetPassword = (props) => {
  const {theme} = useTheme();

  const {t} = useTranslation('resetPassword');

  const comboBtnData = [
    {
      id: 0,
      view: (
        <OTPInput
          refOTP={props.refOTP}
          onFocus={props.onOTPFocus}
          onChangeText={(otp) => props.onInputChange(otp, INPUT_TYPE.OTP)}
          placeholder={t('btn.typeOTP.placeholder')}
          value={props.OTPValue}
          loading={props.loading}
          disabled={props.verifyOTPDisabled}
          onSendPress={() => props.onVerifyPress(0)}
        />
      ),
    },
    {
      id: 1,
      view: (
        <Button
          containerStyle={styles.confirmOTPbtnContainer}
          disabled={props.sendOTPDisabled}
          title={t('btn.sendOTP')}
          iconRight={
            props.loading && (
              <ActivityIndicator
                color={theme.color.onPersistPrimary}
                animating={true}
                style={styles.loading}
                size="small"
              />
            )
          }
          onPress={() => props.onRequestOTP(1)}
        />
      ),
    },
  ];

  const comboContainerStyle = useMemo(() => {
    return {
      borderRadius: theme.layout.borderRadiusMedium,
    };
  }, [theme]);

  const inputDisabledStyle = useMemo(() => {
    return {
      color: theme.color.onDisabled,
      backgroundColor: theme.color.disabled,
    };
  }, [theme]);

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={appConfig.device.isIOS ? 'padding' : null}
        style={{flex: 1}}>
        <Container style={styles.container}>
          <NavBar navigation={props.navigation} />

          <ScrollView
            ref={props.refScrollView}
            style={styles.scrollView}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled">
            <ScreenWrapper safeTopLayout noBackground>
              <Header />

              <View style={styles.body}>
                <FloatingLabelInput
                  label={t('form.newPass.title')}
                  keyboardType={
                    appConfig.device.isIOS ? 'number-pad' : 'numeric'
                  }
                  secureTextEntry
                  editable={!props.confirmResult}
                  inputStyle={props.confirmResult && inputDisabledStyle}
                  onChangeText={(password) =>
                    props.onInputChange(password, INPUT_TYPE.PASSWORD)
                  }
                  maxLength={PASSWORD_LENGTH}
                  value={props.newPassValue}
                  error={props.newPassError}
                  onBlur={() => props.onInputBlur(INPUT_TYPE.PASSWORD)}
                />
                <FloatingLabelInput
                  label={t('form.confirmPass.title')}
                  keyboardType={
                    appConfig.device.isIOS ? 'number-pad' : 'numeric'
                  }
                  secureTextEntry
                  editable={!props.confirmResult}
                  inputStyle={props.confirmResult && inputDisabledStyle}
                  onChangeText={(confirmPassword) =>
                    props.onInputChange(
                      confirmPassword,
                      INPUT_TYPE.CONFIRM_PASSWORD,
                    )
                  }
                  maxLength={PASSWORD_LENGTH}
                  value={props.confirmPassValue}
                  error={props.confirmPassError}
                  onBlur={() => props.onInputBlur(INPUT_TYPE.CONFIRM_PASSWORD)}
                />
              </View>

              <Container noBackground style={styles.comboBtn}>
                <ComboSlidingButton
                  selectedItems={props.selectedComboBtns}
                  comboContainerStyle={[
                    styles.comboContainer,
                    comboContainerStyle,
                  ]}
                  onFinishAnimation={props.onFinishAnimation}
                  data={comboBtnData}
                />
                {props.confirmResult && (
                  <OTPRequestMessage
                    requestNewOtpCounter={props.requestNewOtpCounter}
                    onPressRequestNewOtp={props.onPressRequestNewOtp}
                  />
                )}
              </Container>
            </ScreenWrapper>
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nav: {
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
  },
  mask: {
    top: 0,
    height: 50,
    width: '100%',
    position: 'absolute',
  },
  backBtn: {
    backgroundColor: 'transparent',
    zIndex: 1,
    left: 20,
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 35,
  },
  body: {
    flex: 1,
    paddingVertical: 15,
  },
  scrollView: {
    zIndex: appConfig.device.isIOS ? undefined : -1,
    paddingTop: 40,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loading: {
    left: 15,
  },
  comboBtn: {
    paddingHorizontal: 15,
    paddingBottom: 80,
  },
  inputDisabled: {},
  comboContainer: {
    height: 55,
  },
  confirmOTPbtnContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  disabledConfirmOTP: {},
  btn: {
    height: '100%',
    paddingVertical: 0,
  },
  confirmOTPBtn: {
    width: 60,
  },
});

export default ResetPassword;
