import React, {Component} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import PropTypes from 'prop-types';
// configs
import config from '../../config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import EventTracker from 'app-helper/EventTracker';
import {mergeStyles} from 'src/Themes/helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {BaseButton, Container, Typography} from 'src/components/base';
import Button from 'src/components/Button';
import Header from './Header';

const ANIMATION_TIME = 250;
const ANIMATION_CLOSE_TIME = 150;

const defaultListener = () => {};

class AlreadyVoucher extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onClose: PropTypes.func,
    onCheckMyVoucher: PropTypes.func,
    heading: PropTypes.string,
    message: PropTypes.string,
  };

  static defaultProps = {
    onClose: defaultListener,
    onCheckMyVoucher: defaultListener,
    heading: '',
    message: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      bottom: new Animated.Value(-20),
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

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  startAnimation(animation, toValue, duration) {
    Animated.timing(animation, {toValue, duration}).start();
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

  onCheckMyVoucher = () => {
    if (this.closing) return;
    this.closing = true;

    this.runCloseAnimation();

    setTimeout(() => {
      this.props.onCheckMyVoucher();
    }, ANIMATION_CLOSE_TIME);
  };

  get containerStyle() {
    return mergeStyles(styles.container, {
      backgroundColor: this.theme.color.overlay30,
    });
  }

  get contentStyle() {
    return mergeStyles(styles.content, {
      borderTopLeftRadius: this.theme.layout.borderRadiusSmall,
      borderTopRightRadius: this.theme.layout.borderRadiusSmall,
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
      containerStyle.bottom = this.state.keyboardHeight;
    }
    return (
      <Container animated style={[this.containerStyle, containerStyle]}>
        <BaseButton
          containerStyle={styles.btnCloseTransparent}
          onPress={this.onClose}
        />

        <Container style={this.contentStyle}>
          <Header
            onClose={this.onClose}
            closeTitle={t('modal.close')}
            title={this.props.heading}
          />

          <View style={styles.body}>
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={styles.message}>
              {this.props.message}
            </Typography>
          </View>

          <Button onPress={this.onCheckMyVoucher}>
            {t('alreadyTaken.btnTitle')}
          </Button>
        </Container>
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
    marginBottom: config.device.bottomSpace,
  },
  body: {
    padding: 15,
    paddingBottom: 0,
  },
  message: {
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default withTranslation('voucher')(AlreadyVoucher);
