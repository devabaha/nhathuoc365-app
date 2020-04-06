import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const OTPRequestMessage = props => {
  function convertSecondToMinute(time) {
    let minute = (time / 60) % 60;
    let second = time % 60;
    return `${
      parseInt(minute) < 10 ? '0' + parseInt(minute) : parseInt(minute)
    } : ${parseInt(second) < 10 ? '0' + parseInt(second) : parseInt(second)}`;
  }

  const { t } = useTranslation('phoneAuth');
  const disabled = props.requestNewOtpCounter > 0;
  const requestNewOTPMess =
    props.requestNewOtpCounter > 0
      ? `${t('requestNewCodeWithTime')} ${convertSecondToMinute(
          props.requestNewOtpCounter
        )}`
      : t('requestNewCode');

  return (
    <>
      <Text style={styles.message}>{t('phoneAuth:notReceiveCode')}</Text>
      <TouchableOpacity
        onPress={props.onPressRequestNewOtp}
        disabled={disabled}
      >
        <Text style={styles.requestNewOTP}>{requestNewOTPMess}</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: 14,
    fontWeight: '200',
    color: 'black',
    marginTop: 20
  },
  requestNewOTP: {
    fontSize: 14,
    color: '#528BC5',
    fontWeight: '700',
    marginTop: 8
  }
});

export default OTPRequestMessage;
