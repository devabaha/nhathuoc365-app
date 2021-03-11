import React, {Component} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import appConfig from 'app-config';
import {HEADER_HEIGHT, RESEND_OTP_INTERVAL} from '../constants';

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
    color: 'black',
    fontSize: 18,
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
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 20,
  },
  backIcon: {
    fontSize: 36,
    color: '#333',
  },
  txtDesCode: {
    fontSize: 17,
    fontWeight: '200',
    color: 'black',
    marginTop: 20,
  },
  resSendOTP: {
    fontSize: 17,
    color: '#528BC5',
    fontWeight: '700',
    marginTop: 15,
  },
});

class AuthConfirm extends Component {
  static defaultProps = {
    onBackToPhoneInput: () => {},
  };

  state = {
    requestNewOtpCounter: RESEND_OTP_INTERVAL,
    message: '',
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

  reStartCountDown() {
    this.props.onRequestNewOtp();
    this.setState(
      {
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
      <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={this.onBack.bind(this)}>
            <Icon name="chevron-left" style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <Text style={[styles.desText, styles.codeInput]}>
            {t('verifyCodeInputTitle')}
          </Text>
          <Text style={[styles.desText, styles.phoneNumber]}>
            {phoneNumber}
          </Text>
          <TextInput
            autoFocus
            onChangeText={onChangeCode}
            placeholder={t('verifyCodeInputPlaceholder')}
            value={codeInput}
            keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
            style={styles.txtCode}
            maxLength={6}
            onSubmitEditing={!confirmDisabled ? onConfirmCode : () => {}}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={onConfirmCode}
            disabled={confirmDisabled}>
            <Text
              style={[
                styles.continueText,
                {color: !confirmDisabled ? 'black' : 'lightgray'},
              ]}>
              {t('verifyCodeInputConfirmMessage')}
            </Text>
          </TouchableOpacity>
          {!!message && <Text style={styles.txtNote}>{message}</Text>}
          <Text style={styles.txtDesCode}>{t('notReceiveCode')}</Text>
          <TouchableOpacity
            onPress={this.reStartCountDown.bind(this)}
            disabled={!this.isReSendable}>
            <Text style={styles.resSendOTP}>
              {!this.isReSendable
                ? `${t('requestNewCodeWithTime')} ${this.convertSecondToMinute(
                    requestNewOtpCounter,
                  )}`
                : t('requestNewCode')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default withTranslation('phoneAuth')(AuthConfirm);
