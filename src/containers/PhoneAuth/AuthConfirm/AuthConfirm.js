import React, {Component} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
import {HEADER_HEIGHT, RESEND_OTP_INTERVAL} from '../constants';
// customs components
import {
  Typography,
  Input,
  ScreenWrapper,
  IconButton,
  TextButton,
} from 'src/components/base';

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
  },
  desText: {
    marginTop: 8,
    marginBottom: 22,
    fontWeight: '300',
  },
  phoneNumber: {
    fontWeight: '500',
    marginTop: 0,
    marginBottom: 20,
  },
  txtNote: {
    marginTop: 20,
  },
  txtCode: {
    fontWeight: appConfig.device.isIOS ? '800' : 'bold',
    fontSize: 20,
    padding: 10,
  },
  continueText: {
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 20,
  },
  backIcon: {
    fontSize: 36,
  },
  txtDesCode: {
    fontWeight: '200',
    marginTop: 20,
  },
  txtDescription: {
    fontWeight: '200',
    marginTop: 20,
  },
  resSendOTP: {
    fontWeight: '700',
    marginTop: 15,
  },
  buttonStyle: {
    alignSelf: 'flex-start',
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

  get theme() {
    return getTheme(this);
  }

  get isReSendable() {
    return this.state.requestNewOtpCounter <= 0;
  }

  componentDidMount() {
    this.startCountDown();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  get theme() {
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

  resSendOTPStyle = mergeStyles(styles.resSendOTP, {
    color: this.theme.color.accent2,
  });

  styleContinueText = mergeStyles(styles.continueText, {
    color: !this.props.confirmDisabled
      ? this.theme.color.textPrimary
      : this.theme.color.textInactive,
  });

  txtNoteStyle = mergeStyles(styles.txtNote, {
    color: this.theme.color.danger,
  });

  resentOTPTypoProps = {type: TypographyType.TITLE_MEDIUM};
  continueBtnTypoProps = {type: TypographyType.TITLE_LARGE};

  render() {
    const {codeInput, requestNewOtpCounter} = this.state;
    const {
      t,
      phoneNumber,
      onConfirmCode,
      confirmDisabled,
      onChangeCode,
      message,
    } = this.props;

    return (
      <ScreenWrapper safeLayout>
        <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <IconButton
              style={styles.buttonStyle}
              onPress={this.onBack.bind(this)}
              bundle={BundleIconSetName.MATERIAL_ICONS}
              name="chevron-left"
              iconStyle={styles.backIcon}
            />
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
            <TextButton
              onPress={onConfirmCode}
              disabled={confirmDisabled}
              title={t('verifyCodeInputConfirmMessage')}
              style={this.styleContinueText}
              typoProps={this.continueBtnTypoProps}
            />
            {!!message && (
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                style={this.txtNoteStyle}>
                {message}
              </Typography>
            )}
            <Typography
              type={TypographyType.TITLE_MEDIUM}
              style={styles.txtDesCode}>
              {t('notReceiveCode')}
            </Typography>

            <TextButton
              style={styles.buttonStyle}
              titleStyle={this.resSendOTPStyle}
              onPress={this.reStartCountDown.bind(this)}
              disabled={!this.isReSendable}
              typoProps={this.resentOTPTypoProps}>
              {!this.isReSendable
                ? `${t('requestNewCodeWithTime')} ${this.convertSecondToMinute(
                    requestNewOtpCounter,
                  )}`
                : t('requestNewCode')}
            </TextButton>
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
