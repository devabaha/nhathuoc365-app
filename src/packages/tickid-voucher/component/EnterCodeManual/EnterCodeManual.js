import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Animated, Keyboard} from 'react-native';
// configs
import config from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Container, Typography, Input, BaseButton} from 'src/components/base';
import Button from 'src/components/Button';
import Header from './Header';

const ANIMATION_TIME = 250;
const ANIMATION_CLOSE_TIME = 150;

const defaultListener = () => {};

class EnterCodeManual extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onClose: PropTypes.func,
    onSendCode: PropTypes.func,
    heading: PropTypes.string,
    message: PropTypes.string,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    onClose: defaultListener,
    onSendCode: defaultListener,
    heading: '',
    message: '',
    placeholder: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      bottom: new Animated.Value(-20),
      keyboardShow: false,
      code: '',
    };
    this.eventTracker = new EventTracker();
  }

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.startAnimation(this.state.opacity, 1, ANIMATION_TIME);
    this.startAnimation(this.state.bottom, 0, ANIMATION_TIME);
    this.eventTracker.logCurrentView();
  }

  UNSAFE_componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
    this.eventTracker.clearTracking();
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow = (e) => {
    this.setState({
      keyboardShow: true,
    });
    this.startAnimation(this.state.bottom, e.endCoordinates.height, 200);
  };

  keyboardWillHide = () => {
    this.setState({
      keyboardShow: false,
    });
    this.startAnimation(this.state.bottom, 0, 200);
  };

  startAnimation(animation, toValue, duration) {
    Animated.timing(animation, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start();
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

  handleChangeCode = (code) => {
    this.setState({code});
  };

  get codeInputStyle() {
    return mergeStyles(styles.codeInput, {
      color: this.theme.color.onSurface,
      borderBottomWidth: this.theme.layout.borderWidth,
      borderBottomColor: this.theme.color.border,
    });
  }

  get containerStyle() {
    return mergeStyles(styles.container, {
      backgroundColor: this.theme.color.overlay60,
    });
  }

  render() {
    const {t} = this.props;
    const containerStyle = {
      opacity: this.state.opacity,
      bottom: this.state.bottom,
    };
    if (this.state.keyboardShow) {
      containerStyle.top = 0;
    }
    return (
      <Container animated style={[this.containerStyle, containerStyle]}>
        <BaseButton style={styles.btnCloseTransparent} onPress={this.onClose} />
        <View
          style={[
            styles.content,
            {
              marginBottom: this.state.keyboardShow
                ? 0
                : config.device.bottomSpace,
            },
          ]}>
          <Header
            onClose={this.onClose}
            title={this.props.heading}
            closeTitle={t('modal.close')}
          />

          <Container style={styles.body}>
            <Input
              style={this.codeInputStyle}
              value={this.state.code}
              placeholder={this.props.placeholder}
              placeholderTextColor={this.theme.color.placeholder}
              onChangeText={this.handleChangeCode}
              autoFocus
            />
            <Typography
              type={TypographyType.DESCRIPTION_MEDIUM}
              style={styles.codeHelp}>
              {t('modal.enterCodeManually.description')}
            </Typography>
            <Button onPress={this.onSendCode}>
              {t('modal.enterCodeManually.btnTitle')}
            </Button>
          </Container>
        </View>
      </Container>
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
    zIndex: 99999,
  },
  btnCloseTransparent: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  content: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    minHeight: 40,
    zIndex: 2,
  },
  body: {
    padding: 16,
  },
  codeInput: {
    fontSize: 18,
    fontWeight: '600',
    paddingBottom: 16,
    marginTop: 12,
  },
  codeHelp: {
    fontWeight: '400',
    marginTop: 8,
    marginBottom: 20,
  },
  submitButtonTitle: {
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});

export default withTranslation('voucher')(EnterCodeManual);
