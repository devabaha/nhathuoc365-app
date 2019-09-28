import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import Button from 'react-native-button';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Keyboard
} from 'react-native';
import Header from './Header';

const ANIMATION_TIME = 250;
const ANIMATION_CLOSE_TIME = 150;

const defaultListener = () => {};

class EnterCodeManual extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onSendCode: PropTypes.func,
    heading: PropTypes.string,
    message: PropTypes.string
  };

  static defaultProps = {
    onClose: defaultListener,
    onSendCode: defaultListener,
    heading: '',
    message: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      bottom: new Animated.Value(-20),
      keyboardShow: false,
      code: ''
    };
  }

  componentDidMount() {
    this.startAnimation(this.state.opacity, 1, ANIMATION_TIME);
    this.startAnimation(this.state.bottom, 0, ANIMATION_TIME);
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow = e => {
    this.setState({
      keyboardShow: true
    });
    this.startAnimation(this.state.bottom, e.endCoordinates.height, 200);
  };

  keyboardWillHide = () => {
    this.setState({
      keyboardShow: false
    });
    this.startAnimation(this.state.bottom, 0, 200);
  };

  startAnimation(animation, toValue, duration) {
    Animated.timing(animation, { toValue, duration }).start();
  }

  runCloseAnimation() {
    this.startAnimation(this.state.opacity, 0, ANIMATION_CLOSE_TIME);
    this.startAnimation(this.state.bottom, -20, ANIMATION_CLOSE_TIME);
  }

  closing;

  onClose = () => {
    if (this.closing) return;
    this.closing = true;

    this.runCloseAnimation();

    setTimeout(() => {
      this.props.onClose();
    }, ANIMATION_CLOSE_TIME);
  };

  onSendCode = () => {
    if (this.closing || !this.state.code) return;
    this.closing = true;

    this.runCloseAnimation();

    setTimeout(() => {
      this.props.onSendCode(this.state.code);
    }, ANIMATION_CLOSE_TIME);
  };

  handleChangeCode = code => {
    this.setState({ code });
  };

  render() {
    const containerStyle = {
      opacity: this.state.opacity,
      bottom: this.state.bottom
    };
    if (this.state.keyboardShow) {
      containerStyle.top = 0;
    }
    return (
      <Animated.View style={[styles.container, containerStyle]}>
        <Button
          containerStyle={styles.btnCloseTransparent}
          onPress={this.onClose}
        />

        <View style={styles.content}>
          <Header onClose={this.onClose} title={this.props.heading} />

          <View style={styles.body}>
            <TextInput
              style={styles.codeInput}
              value={this.state.code}
              placeholder="Nhập mã cửa hàng"
              placeholderTextColor="#c1c1c1"
              onChangeText={this.handleChangeCode}
              autoFocus
            />
            <Text style={styles.codeHelp}>
              Hãy hỏi nhân viên để được hướng dẫn
            </Text>
            <Button
              style={styles.submitButtonTitle}
              containerStyle={[
                styles.submitButton,
                {
                  backgroundColor: this.state.code
                    ? config.colors.primary
                    : '#c1c1c1'
                }
              ]}
              onPress={this.onSendCode}
            >
              Gửi mã
            </Button>
          </View>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 99999
  },
  btnCloseTransparent: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1
  },
  content: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: config.colors.white,
    minHeight: 40,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    zIndex: 2
  },
  body: {
    padding: 16
  },
  codeInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 12
  },
  codeHelp: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
    marginTop: 8,
    marginBottom: 20
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 14
  },
  submitButtonTitle: {
    color: config.colors.white,
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16
  }
});

export default EnterCodeManual;