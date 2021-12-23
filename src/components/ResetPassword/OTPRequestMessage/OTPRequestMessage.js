import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {TextButton, Typography} from 'src/components/base';

const OTPRequestMessage = (props) => {
  const {theme} = useTheme();

  const {t} = useTranslation('phoneAuth');

  const disabled = props.requestNewOtpCounter > 0;

  const btnTypoProps = {type: TypographyType.LABEL_MEDIUM};

  function convertSecondToMinute(time) {
    let minute = (time / 60) % 60;
    let second = time % 60;
    return `${
      parseInt(minute) < 10 ? '0' + parseInt(minute) : parseInt(minute)
    } : ${parseInt(second) < 10 ? '0' + parseInt(second) : parseInt(second)}`;
  }

  const requestNewOTPMess =
    props.requestNewOtpCounter > 0
      ? `${t('requestNewCodeWithTime')} ${convertSecondToMinute(
          props.requestNewOtpCounter,
        )}`
      : t('requestNewCode');

  const requestNewOTPStyle = useMemo(() => {
    return mergeStyles(styles.requestNewOTP, {color: theme.color.accent2});
  }, [theme]);

  return (
    <>
      <Typography type={TypographyType.LABEL_MEDIUM} style={styles.message}>
        {t('phoneAuth:notReceiveCode')}
      </Typography>
      <TextButton
        style={styles.textContainer}
        typoProps={btnTypoProps}
        onPress={props.onPressRequestNewOtp}
        disabled={disabled}
        titleStyle={requestNewOTPStyle}>
        {requestNewOTPMess}
      </TextButton>
    </>
  );
};

const styles = StyleSheet.create({
  message: {
    fontWeight: '200',
    marginTop: 20,
  },
  requestNewOTP: {
    fontWeight: '700',
    marginTop: 8,
  },
  textContainer: {
    justifyContent: 'flex-start',
  },
});

export default OTPRequestMessage;
