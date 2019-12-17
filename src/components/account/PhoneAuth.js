import { empty } from '../../util/stringHelper';

console.disableYellowBox = true;
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import { Actions } from 'react-native-router-flux';
import { showMessage } from 'react-native-flash-message';
import firebase from 'react-native-firebase';
import config from '../../config';

class PhoneAuth extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '+84988888889',
      confirmResult: null,
      isShowIndicator: false
    };
  }

  componentDidMount() {
    // this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
    //     if (user) {
    //         this.setState({user: user.toJSON()});
    //         user.getIdToken(true).then(async (idToken) => {
    //             const response = await APIHandler.login_firebase_vertify({token: idToken});
    //             console.log("res", response, idToken);
    //             if (response.data) {
    //                 Actions.replace(config.routes.primaryTabbar);
    //             } else {
    //                 firebase.auth().signOut();
    //             }
    //         }).catch((error) => {
    //         })
    //     } else {
    //         // User has been signed out, reset the state
    //         this.setState({
    //             user: null,
    //             message: '',
    //             codeInput: '',
    //             phoneNumber: '+84',
    //             confirmResult: null,
    //             isShowIndicator: false
    //         });
    //     }
    // });
  }

  componentWillUnmount() {
    // if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    Keyboard.dismiss();
    setTimeout(() => {
      this.setState({ isShowIndicator: true });
      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber)
        .then(confirmResult =>
          this.setState({
            confirmResult,
            message: '',
            isShowIndicator: false
          })
        )
        .catch(error => {
          console.log('errr', error);
          this.setState({
            message: 'Lỗi xác thực, vui lòng thử lại.',
            isShowIndicator: false
          });
        });
    }, 300);
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;
    Keyboard.dismiss();

    if (confirmResult && codeInput.length) {
      this.setState({ isShowIndicator: true });
      confirmResult
        .confirm(codeInput)
        .then(user => {
          if (user) {
            this.setState({
              user: user.toJSON(),
              message: ``,
              isShowIndicator: false
            });
            user
              .getIdToken(true)
              .then(async idToken => {
                const response = await APIHandler.login_firebase_vertify({
                  token: idToken
                });
                console.log('res', response, idToken);
                if (response.data) {
                  Actions.replace(config.routes.primaryTabbar);
                } else {
                  firebase.auth().signOut();
                  this.setState({
                    message: response.message,
                    confirmResult: null
                  });
                }
              })
              .catch(error => {});
          }
        })
        .catch(error => {
          console.log('error', error);
          this.setState({
            message: `Mã xác minh không hợp lệ. Vui lòng thử lại`,
            isShowIndicator: false
          });
        });
    }
  };

  _onChangePhoneNumber(phoneNumber) {
    if (phoneNumber.substring(0, 3) !== '+84') return;
    this.setState({ phoneNumber });
  }

  renderPhoneNumberInput() {
    const { phoneNumber, isShowIndicator } = this.state;
    const textProps = {
      placeholder: '87654321',
      keyboardType: 'phone-pad',
      maxLength: 15
    };
    return (
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.welcomeText}>Xin chào!</Text>
        <Text style={styles.desText}>Nhập số điện thoại của để tiếp tục</Text>
        <PhoneInput
          initialCountry="vn"
          textStyle={styles.phoneTextInput}
          flagStyle={styles.flagStyle}
          textProps={textProps}
          cancelText="Huỷ bỏ"
          confirmText="Xác nhận"
          autoFormat
          allowZeroAfterCountryCode={false}
          onChangePhoneNumber={phone => this._onChangePhoneNumber(phone)}
          // onPressFlag={this._onPressFlag}
          // value={this.state.phoneNumber}
        />
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.signIn}
          disabled={empty(phoneNumber)}
        >
          <Text
            style={[
              styles.continueText,
              { color: !empty(phoneNumber) ? 'white' : 'lightgray' }
            ]}
          >
            Tiếp tục
          </Text>
        </TouchableOpacity>
        {isShowIndicator && <Indicator color="#fff" />}
      </View>
    );
  }

  renderVerificationCodeInput() {
    const { codeInput, isShowIndicator } = this.state;

    return (
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.desText}>Nhập mã code:</Text>
        <View style={{ backgroundColor: '#fff', borderRadius: 5 }}>
          <TextInput
            autoFocus
            onChangeText={value => this.setState({ codeInput: value })}
            placeholder={'Nhập mã code ...'}
            value={codeInput}
            keyboardType={'numeric'}
            style={styles.txtCode}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.confirmCode}
          disabled={empty(codeInput)}
        >
          <Text
            style={[
              styles.continueText,
              { color: !empty(codeInput) ? 'white' : 'lightgray' }
            ]}
          >
            Tiếp tục
          </Text>
        </TouchableOpacity>
        {isShowIndicator && <Indicator color="#fff" />}
      </View>
    );
  }

  render() {
    const { user, confirmResult, message } = this.state;
    console.log('user', user);
    return (
      <View style={styles.container}>
        {!user && !confirmResult && this.renderPhoneNumberInput()}
        {!user && confirmResult && this.renderVerificationCodeInput()}
        {message != '' && <Text style={styles.txtNote}>{message}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DEFAULT_COLOR,
    justifyContent: 'center'
  },
  welcomeText: {
    color: 'white',
    fontSize: 26,
    fontWeight: '600'
  },
  desText: {
    color: 'white',
    fontSize: 18,
    marginTop: 8,
    marginBottom: 10,
    fontWeight: '200'
  },
  phoneTextInput: {
    backgroundColor: 'white',
    fontWeight: '800',
    fontSize: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 15
  },
  flagStyle: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  continueText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 20
  },
  txtNote: {
    color: '#fff',
    marginTop: 10,
    paddingHorizontal: 20
  },
  txtCode: {
    fontWeight: '800',
    fontSize: 20
  }
});

export default PhoneAuth;
