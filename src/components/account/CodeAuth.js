import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';

class CodeAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: props.phone || '',
      isShowIndicator: false
    };
  }

  _onChangeText(text) {
    if (text.length == 6) {
      this._codeAuth(text);
    }
  }

  _codeAuth(code) {
    Keyboard.dismiss();
    this.setState({ isShowIndicator: true });
    // TODOs: Handle auth code
    // If success: call api to store user data to database ( do the same Login.js )
    // If fail: call this._onAuthFail()
  }

  _onAuthFail() {
    this.setState({ isShowIndicator: false }, () => {
      flashShowMessage({
        message: 'Mã không đúng, vui lòng thử lại.',
        type: 'danger'
      });
      setTimeout(() => {
        this.codeAuthInput.setNativeProps({ text: '' });
        this.codeAuthInput.focus();
      }, 100);
    });
  }

  _doResendCodeAuth() {
    Keyboard.dismiss();
    this.setState({ isShowIndicator: true });
    // TODOs: Handle resend auth code
  }

  render() {
    const { phone } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.phoneDes}>Nhập mã xác thực được gửi tới:</Text>
        {phone === '' ? null : <Text style={styles.phoneText}>{phone}</Text>}
        <TextInput
          style={[
            styles.codeInputText,
            { marginBottom: this.state.isShowErrorText ? 0 : 20 }
          ]}
          placeholder="000000"
          autoFocus={true}
          keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
          onChangeText={text => this._onChangeText(text)}
          maxLength={6}
          ref={ref => (this.codeAuthInput = ref)}
        />
        <Text style={styles.notReceiveCode}>Không nhận được mã?</Text>
        <TouchableOpacity onPress={this._doResendCodeAuth.bind(this)}>
          <Text style={styles.resendCode}>Yêu cầu gửi lại mã</Text>
        </TouchableOpacity>
        {this.state.isShowIndicator == true && (
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'transparent'
            }}
          >
            <Indicator color="#fff" />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  phoneText: {
    color: 'black',
    fontSize: 18,
    marginHorizontal: 10,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  phoneDes: {
    color: 'black',
    fontSize: 18,
    marginHorizontal: 10,
    marginTop: 20
  },
  codeInputText: {
    color: 'black',
    fontSize: 26,
    width: '100%',
    paddingHorizontal: 10,
    fontWeight: '600'
  },
  incorrectCode: {
    color: 'red',
    fontWeight: '200',
    fontSize: 16,
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 20
  },
  notReceiveCode: {
    color: 'black',
    fontSize: 18,
    marginTop: 10,
    marginHorizontal: 10
  },
  resendCode: {
    color: '#147EFB',
    fontWeight: '500',
    fontSize: 18,
    marginHorizontal: 10
  }
});

export default CodeAuth;
