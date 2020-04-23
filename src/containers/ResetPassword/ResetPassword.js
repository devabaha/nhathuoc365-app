import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import { default as ResetPasswordComponent } from '../../components/ResetPassword';
import { Actions } from 'react-native-router-flux';
import store from 'app-store';
import Modal from '../../components/account/Transfer/Payment/Modal';

import {
  OTP_TIME_REQUEST,
  INPUT_TYPE,
  PASSWORD_LENGTH,
  OTP_LENGTH
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

  onRequestOTP(id = null) {
    const phoneNumber = store.user_info.tel;
    this.smsBrandNameSendCode(phoneNumber, id);
  }

  smsBrandNameSendCode = async (phoneNumber, id) => {
    const { t } = this.props;
    const state = { ...this.state };
    state[INPUT_TYPE.OTP].error = '';
    state.loading = true;
    this.setState(state);

    try {
      const formData = {
        username: phoneNumber
      };
      const response = await APIHandler.user_login_sms(formData);

      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS) {
          this.setState(prevState => ({
            confirmResult: phoneNumber,
            loading: false,
            selectedItems: id ? [id] : prevState.selectedItems,
            requestNewOtpCounter: OTP_TIME_REQUEST
          }));
        } else {
          console.log('errr', error);
          const state = { ...this.state };
          state[INPUT_TYPE.OTP].error = t(
            'phoneAuth:smsBrandNameSendCodeFailMessage'
          );
          state.loading = false;
          this.setState(state);
        }
      }
    } catch (error) {
      console.log('errr', error);
      if (!this.unmounted) {
        const state = { ...this.state };
        state[INPUT_TYPE.OTP].error = t(
          'phoneAuth:smsBrandNameSendCodeFailMessage'
        );
        state.loading = false;
        this.setState(state);
      }
    }
  };

  onOTPFocus() {
    setTimeout(() => {
      !this.unmounted && this.refScrollView.current.scrollToEnd();
    }, 600);
  }

  onVerifyPress = async id => {
    Keyboard.dismiss();
    this.setState({ loading: true });
    const { t } = this.props;

    try {
      const codeInput = this.state[INPUT_TYPE.OTP].value;
      const newPass = this.state[INPUT_TYPE.PASSWORD].value;

      const formData = {
        pw4n: newPass,
        otp: codeInput
      };
      const response = await APIHandler.user_reset_password(formData);

      if (!this.unmounted) {
        const state = { ...this.state };
        state.loading = false;
        if (response && response.status === STATUS_SUCCESS) {
          this.setState({ loading: false });
          flashShowMessage({
            type: 'success',
            message: response.message
          });
          Actions.pop();
        } else {
          state[INPUT_TYPE.OTP].error = response.message;
        }
        this.setState(state);
      }
    } catch (err) {
      console.log('error', error);
      if (!this.unmounted) {
        const { state } = { ...this.state };
        state[INPUT_TYPE.OTP].error = t('smsBrandNameVerifyFailMessage');
        state.loading = false;
        this.setState(state);
      }
    }
  };

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
      state[INPUT_TYPE.PASSWORD].value &&
      state[INPUT_TYPE.CONFIRM_PASSWORD].value &&
      state[INPUT_TYPE.CONFIRM_PASSWORD].value !==
        state[INPUT_TYPE.PASSWORD].value
    ) {
      state[INPUT_TYPE.CONFIRM_PASSWORD].error = t(
        'form.confirmPass.error.notMatch'
      );
    } else {
      state[INPUT_TYPE.CONFIRM_PASSWORD].error = '';
    }

    this.setState(state);
  }

  _onPressRequestNewOtp() {
    this.setState({ requestNewOtpCounter: OTP_TIME_REQUEST });
    this.startCountDown();
    this.onRequestOTP();
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

  onCloseModal = () => {
    const state = { ...this.state };
    state[INPUT_TYPE.OTP].error = '';
    this.setState(state);
  };

  render() {
    const { t } = this.props;
    const sendOTPDisabled =
      this.state.loading ||
      !this.state[INPUT_TYPE.PASSWORD].value ||
      this.state[INPUT_TYPE.PASSWORD].error ||
      !this.state[INPUT_TYPE.CONFIRM_PASSWORD].value ||
      this.state[INPUT_TYPE.CONFIRM_PASSWORD].error;

    const verifyOTPDisabled =
      this.state.loading ||
      this.state[INPUT_TYPE.OTP].value.length === 0 ||
      this.state[INPUT_TYPE.OTP].value.length > OTP_LENGTH;

    return (
      <>
        {/* {this.state.loading && <Loading center />} */}
        <Modal
          visible={!!this.state[INPUT_TYPE.OTP].error}
          title={t('modal.title')}
          titleStyle={{ color: '#d20f0f', paddingHorizontal: 15 }}
          content={this.state[INPUT_TYPE.OTP].error}
          contentStyle={{ marginTop: 5, paddingHorizontal: 15 }}
          okText={t('modal.accept')}
          onRequestClose={this.onCloseModal}
          onOk={this.onCloseModal}
        />
        <ResetPasswordComponent
          refOTP={this.refOTP}
          refScrollView={this.refScrollView}
          loading={this.state.loading}
          confirmResult={this.state.confirmResult}
          sendOTPDisabled={sendOTPDisabled}
          verifyOTPDisabled={verifyOTPDisabled}
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
      </>
    );
  }
}

export default withTranslation(['resetPassword', 'phoneAuth'])(ResetPassword);
