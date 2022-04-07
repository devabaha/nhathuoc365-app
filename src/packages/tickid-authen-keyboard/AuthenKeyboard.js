import React, {Component} from 'react';
import {View, Modal, StyleSheet, Animated} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {withTranslation} from 'react-i18next';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {
  SHOW_VALUE,
  HIDE_VALUE,
  HIDE_BOTTOM_POSITION,
  SHOW_BUTTON_POSITION,
  ANIMATION_DURATION,
} from './constants';
// custom components
import {
  BaseButton,
  Container,
  TextButton,
  Typography,
  TypographyType,
} from 'src/components/base';
import FingerprintButton from './FingerprintButton';
import PasswordInput from './PasswordInput';
import Keyboard from './Keyboard';
import Header from './Header';

const defaultListener = () => {};

class AuthenKeyboard extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onClose: PropTypes.func,
    onPressKeyboard: PropTypes.func,
    onClearPassword: PropTypes.func,
    onForgotPress: PropTypes.func,
    onOpenFingerprint: PropTypes.func,
    description: PropTypes.string,
    passwordValue: PropTypes.string,
    headerTitle: PropTypes.string,
    forgotText: PropTypes.string,
    errorMessage: PropTypes.string,
    fingerprintLabel: PropTypes.string,
    visible: PropTypes.bool,
    hideClose: PropTypes.bool,
    showFingerprint: PropTypes.bool,
    showForgotPassword: PropTypes.bool,
  };

  static defaultProps = {
    onClose: defaultListener,
    onPressKeyboard: defaultListener,
    onClearPassword: defaultListener,
    onForgotPress: defaultListener,
    onOpenFingerprint: defaultListener,
    description: '',
    passwordValue: '',
    errorMessage: '',
    fingerprintLabel: undefined,
    visible: false,
    hideClose: false,
    showFingerprint: true,
    showForgotPassword: true,
  };

  state = {
    visible: this.props.visible,
    sideUp: new Animated.Value(
      this.props.visible ? SHOW_BUTTON_POSITION : HIDE_BOTTOM_POSITION,
    ),
    opacity: new Animated.Value(this.props.visible ? SHOW_VALUE : HIDE_VALUE),
  };

  get theme() {
    return getTheme(this);
  }

  get headerTitle() {
    return this.props.headerTitle || this.props.t('enterPassword');
  }

  get forgotText() {
    return this.props.forgotText || this.props.t('forgetPassword') + '?';
  }

  async componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        await this.setState({
          visible: true,
        });
        this.runAnimation(
          this.state.sideUp,
          SHOW_BUTTON_POSITION,
          ANIMATION_DURATION,
        );
        this.runAnimation(this.state.opacity, SHOW_VALUE, ANIMATION_DURATION);
      } else {
        this.runAnimation(this.state.opacity, HIDE_VALUE, ANIMATION_DURATION);
        await this.runAnimation(
          this.state.sideUp,
          HIDE_BOTTOM_POSITION,
          ANIMATION_DURATION,
        );
        this.setState({
          visible: false,
        });
      }
    }
  }

  runAnimation(animation, toValue, duration, onDone = () => {}) {
    return new Promise((resolve) => {
      Animated.timing(animation, {
        toValue,
        duration,
        useNativeDriver: true,
      }).start(() => {
        resolve();
        onDone();
      });
    });
  }

  get overlayStyle() {
    return {
      backgroundColor: this.theme.color.overlay30,
    };
  }

  get forgotTextStyle() {
    return {
      color: this.theme.color.accent2,
    };
  }

  get errorMessageStyle() {
    return {color: this.theme.color.danger};
  }

  get contentStyle() {
    return {
      borderTopLeftRadius: this.theme.layout.borderRadiusMedium,
      borderTopRightRadius: this.theme.layout.borderRadiusMedium,
    };
  }

  render() {
    return (
      <Modal
        transparent
        animationType="fade"
        visible={this.state.visible}
        onRequestClose={this.props.onClose}>
        <View style={[styles.overlay, this.overlayStyle]}>
          <BaseButton
            style={styles.closeOverlay}
            onPress={this.props.onClose}
          />

          <Container
            safeLayout
            animated
            style={[
              styles.content,
              this.contentStyle,
              {
                transform: [
                  {
                    translateY: this.state.sideUp,
                  },
                ],
                opacity: this.state.opacity,
              },
            ]}>
            <Header
              title={this.headerTitle}
              onClose={this.props.onClose}
              hideClose={this.props.hideClose}
            />

            {!!this.props.description && (
              <Typography
                type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
                style={styles.description}>
                {this.props.description}
              </Typography>
            )}

            <PasswordInput value={this.props.passwordValue} />

            <FingerprintButton
              onPress={this.props.onOpenFingerprint}
              label={this.props.fingerprintLabel}
              visible={this.props.showFingerprint}
            />

            {this.props.showForgotPassword && (
              <TextButton
                titleStyle={this.forgotTextStyle}
                style={styles.forgotBtn}
                onPress={this.props.onForgotPress}>
                {this.forgotText}
              </TextButton>
            )}

            {!!this.props.errorMessage && (
              <View style={styles.errorMessageWrap}>
                <Typography
                  type={TypographyType.LABEL_MEDIUM}
                  style={[styles.errorMessage, this.errorMessageStyle]}>
                  {this.props.errorMessage}
                </Typography>
              </View>
            )}

            <Keyboard
              onPress={this.props.onPressKeyboard}
              onClear={this.props.onClearPassword}
            />
          </Container>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  closeOverlay: {
    flex: 1,
  },
  content: {
    overflow: 'hidden',
  },
  forgotBtn: {
    marginTop: 12,
    marginBottom: 4,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  forgotText: {
    textAlign: 'center',
  },
  errorMessageWrap: {
    marginBottom: 16,
  },
  errorMessage: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginTop: 12,
  },
});

export default withTranslation('phoneCard')(AuthenKeyboard);
