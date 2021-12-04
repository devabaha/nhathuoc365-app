import React, {Component} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  // Text,
  // TextInput,
  // TouchableOpacity,
} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

import appConfig from 'app-config';
import {HEADER_HEIGHT, RESEND_OTP_INTERVAL} from '../constants';

import {mergeStyles} from 'src/Themes/helper';
import {BaseButton} from 'src/components/base/Button';
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
import {Theme} from 'src/Themes/interface';
import {Typography, TypographyType} from 'src/components/base';
import {BundleIconSetName} from 'src/components/base/Icon/constants';

import Input from 'src/components/base/Input';
import Icon from 'src/components/base/Icon';
import ScreenWrapper from 'src/components/base/ScreenWrapper';

const styles = StyleSheet.create({
  container: {},
  header: {
    width: '100%',
    height: HEADER_HEIGHT + (appConfig.device.isIPhoneX ? 40 : 20),
    marginLeft: 10,
    marginBottom: 10,
  },
  contentContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  codeInput: {
    marginBottom: 10,
    fontSize: 15,
  },
  desText: {
    // color: 'black',
    // fontSize: 18,
    marginTop: 8,
    marginBottom: 22,
    fontWeight: '300',
  },
  phoneNumber: {
    fontSize: 17,
    fontWeight: '500',
    marginTop: 0,
    marginBottom: 20,
  },
  txtNote: {
    color: 'red',
    marginTop: 20,
  },
  txtCode: {
    fontWeight: '800',
    fontSize: 20,
    padding: 10,
  },
  continueText: {
    // color: 'black',
    // fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 20,
  },
  backIcon: {
    fontSize: 36,
    // color: '#333',
  },
  txtDesCode: {
    // fontSize: 17,
    fontWeight: '200',
    // color: 'black',
    marginTop: 20,
  },
  txtDescription: {
    // fontSize: 17,
    fontWeight: '200',
    // color: 'black',
    marginTop: 20,
  },
  resSendOTP: {
    // fontSize: 17,
    // color: '#528BC5',
    fontWeight: '700',
    marginTop: 15,
  },
});

class AuthConfirm extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    onBackToPhoneInput: () => {},
  };

  state = {
    requestNewOtpCounter: RESEND_OTP_INTERVAL,
    message: '',
    showDescription: false,
  };
  timer = -1;

  get isReSendable() {
    return this.state.requestNewOtpCounter <= 0;
  }

  componentDidMount() {
    this.startCountDown();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  get theme(): Theme {
    return getTheme(this);
  }

  reStartCountDown() {
    this.props.onRequestNewOtp();
    this.setState(
      {
        showDescription: true,
        requestNewOtpCounter: RESEND_OTP_INTERVAL,
      },
      () => this.startCountDown(),
    );
  }

  startCountDown() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      const {requestNewOtpCounter} = this.state;
      if (requestNewOtpCounter > 0) {
        this.setState({requestNewOtpCounter: requestNewOtpCounter - 1});
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  onBack() {
    this.setState({showDescription: false});
    this.props.onBackToPhoneInput();
  }

  convertSecondToMinute(time) {
    let minute = (time / 60) % 60;
    let second = time % 60;
    return `${
      parseInt(minute) < 10 ? '0' + parseInt(minute) : parseInt(minute)
    } : ${parseInt(second) < 10 ? '0' + parseInt(second) : parseInt(second)}`;
  }

  render() {
    const theme = this.theme;
    const {codeInput, requestNewOtpCounter} = this.state;
    const {
      t,
      phoneNumber,
      onConfirmCode,
      confirmDisabled,
      onChangeCode,
      message,
    } = this.props;

    const resSendOTPStyle = mergeStyles(styles.resSendOTP, {
      color: theme.color.neutral2,
    });
    const styleContinueText = mergeStyles(styles.continueText, {
      color: !confirmDisabled
        ? theme.color.textPrimary
        : theme.color.textInactive,
    });
    const txtNoteStyle = mergeStyles(styles.txtNote, {
      color: theme.color.danger,
    });

    return (
      <ScreenWrapper safeLayout>
        <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <BaseButton onPress={this.onBack.bind(this)}>
              <Icon
                bundle={BundleIconSetName.MATERIAL_ICONS}
                name="chevron-left"
                style={styles.backIcon}
              />
            </BaseButton>
          </View>
          <View style={styles.contentContainer}>
            <Typography
              type={TypographyType.TITLE_MEDIUM}
              style={[styles.desText, styles.codeInput]}>
              {t('verifyCodeInputTitle')}
            </Typography>
            <Typography
              type={TypographyType.TITLE_MEDIUM}
              style={[styles.desText, styles.phoneNumber]}>
              {phoneNumber}
            </Typography>
            <Input
              autoFocus
              onChangeText={onChangeCode}
              placeholder={t('verifyCodeInputPlaceholder')}
              value={codeInput}
              keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
              style={styles.txtCode}
              maxLength={6}
              onSubmitEditing={!confirmDisabled ? onConfirmCode : () => {}}
            />
            <BaseButton
              activeOpacity={0.5}
              onPress={onConfirmCode}
              disabled={confirmDisabled}>
              <Typography
                type={TypographyType.TITLE_LARGE}
                style={styleContinueText}>
                {t('verifyCodeInputConfirmMessage')}
              </Typography>
            </BaseButton>
            {!!message && (
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                style={txtNoteStyle}>
                {message}
              </Typography>
            )}
            <Typography
              type={TypographyType.TITLE_MEDIUM}
              style={styles.txtDesCode}>
              {t('notReceiveCode')}
            </Typography>
            <BaseButton
              onPress={this.reStartCountDown.bind(this)}
              disabled={!this.isReSendable}>
              <Typography
                type={TypographyType.TITLE_MEDIUM}
                style={resSendOTPStyle}>
                {!this.isReSendable
                  ? `${t(
                      'requestNewCodeWithTime',
                    )} ${this.convertSecondToMinute(requestNewOtpCounter)}`
                  : t('requestNewCode')}
              </Typography>
            </BaseButton>
            {this.state.showDescription && (
              <Typography
                type={TypographyType.TITLE_MEDIUM}
                style={styles.txtDescription}>
                {t('description')}
              </Typography>
            )}
          </View>
        </ScrollView>
      </ScreenWrapper>
    );
  }
}

export default withTranslation('phoneAuth')(AuthConfirm);
