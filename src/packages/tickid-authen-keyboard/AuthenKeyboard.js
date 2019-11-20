import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated
} from 'react-native';
import FingerprintButton from './FingerprintButton';
import PasswordInput from './PasswordInput';
import Keyboard from './Keyboard';
import Header from './Header';
import {
  SHOW_VALUE,
  HIDE_VALUE,
  HIDE_BOTTOM_POSITION,
  SHOW_BUTTON_POSITION,
  ANIMATION_DURATION
} from './constants';

const defaultListener = () => {};

class AuthenKeyboard extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onPressKeyboard: PropTypes.func,
    onClearPassword: PropTypes.func,
    onForgotPress: PropTypes.func,
    onOpenFingerprint: PropTypes.func,
    passwordValue: PropTypes.string,
    headerTitle: PropTypes.string,
    forgotText: PropTypes.string,
    errorMessage: PropTypes.string,
    fingerprintLabel: PropTypes.string,
    visible: PropTypes.bool,
    hideClose: PropTypes.bool,
    showFingerprint: PropTypes.bool,
    showForgotPassword: PropTypes.bool
  };

  static defaultProps = {
    onClose: defaultListener,
    onPressKeyboard: defaultListener,
    onClearPassword: defaultListener,
    onForgotPress: defaultListener,
    onOpenFingerprint: defaultListener,
    passwordValue: '',
    headerTitle: 'Nhập mật khẩu',
    forgotText: 'Quên mật khẩu?',
    errorMessage: '',
    fingerprintLabel: undefined,
    visible: false,
    hideClose: false,
    showFingerprint: true,
    showForgotPassword: true
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      sideUp: new Animated.Value(
        props.visible ? SHOW_BUTTON_POSITION : HIDE_BOTTOM_POSITION
      ),
      opacity: new Animated.Value(props.visible ? SHOW_VALUE : HIDE_VALUE)
    };
  }

  async componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        await this.setState({
          visible: true
        });
        this.runAnimation(
          this.state.sideUp,
          SHOW_BUTTON_POSITION,
          ANIMATION_DURATION
        );
        this.runAnimation(this.state.opacity, SHOW_VALUE, ANIMATION_DURATION);
      } else {
        this.runAnimation(this.state.opacity, HIDE_VALUE, ANIMATION_DURATION);
        await this.runAnimation(
          this.state.sideUp,
          HIDE_BOTTOM_POSITION,
          ANIMATION_DURATION
        );
        this.setState({
          visible: false
        });
      }
    }
  }

  runAnimation(animation, toValue, duration, onDone = () => {}) {
    return new Promise(resolve => {
      Animated.timing(animation, { toValue, duration }).start(() => {
        resolve();
        onDone();
      });
    });
  }

  render() {
    return (
      <Modal
        transparent
        animationType="fade"
        visible={this.state.visible}
        onRequestClose={this.props.onClose}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.closeOverlay}
            onPress={this.props.onClose}
          />

          <Animated.View
            style={[
              styles.content,
              {
                bottom: this.state.sideUp,
                opacity: this.state.opacity
              }
            ]}
          >
            <Header
              title={this.props.headerTitle}
              onClose={this.props.onClose}
              hideClose={this.props.hideClose}
            />

            <PasswordInput value={this.props.passwordValue} />

            <FingerprintButton
              onPress={this.props.onOpenFingerprint}
              label={this.props.fingerprintLabel}
              visible={this.props.showFingerprint}
            />

            {this.props.showForgotPassword && (
              <TouchableOpacity
                style={styles.forgotBtn}
                onPress={this.props.onForgotPress}
              >
                <Text style={styles.forgotText}>{this.props.forgotText}</Text>
              </TouchableOpacity>
            )}

            {!!this.props.errorMessage && (
              <View style={styles.errorMessageWrap}>
                <Text style={styles.errorMessage}>
                  {this.props.errorMessage}
                </Text>
              </View>
            )}

            <Keyboard
              onPress={this.props.onPressKeyboard}
              onClear={this.props.onClearPassword}
            />
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  closeOverlay: {
    flex: 1
  },
  content: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: getBottomSpace()
  },
  forgotBtn: {
    marginTop: 12,
    marginBottom: 4,
    paddingVertical: 8
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0084ff',
    textAlign: 'center'
  },
  errorMessageWrap: {
    marginBottom: 16
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: 'red',
    textAlign: 'center'
  }
});

export default AuthenKeyboard;
