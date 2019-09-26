import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import Button from 'react-native-button';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Header from './Header';

const ANIMATION_TIME = 250;
const ANIMATION_CLOSE_TIME = 150;

const defaultListener = () => {};

class AlreadyVoucher extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onCheckMyVoucher: PropTypes.func,
    heading: PropTypes.string,
    message: PropTypes.string
  };

  static defaultProps = {
    onClose: defaultListener,
    onCheckMyVoucher: defaultListener,
    heading: '',
    message: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      bottom: new Animated.Value(-20)
    };
  }

  componentDidMount() {
    this.startAnimation(this.state.opacity, 1, ANIMATION_TIME);
    this.startAnimation(this.state.bottom, 0, ANIMATION_TIME);
  }

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

  onCheckMyVoucher = () => {
    if (this.closing) return;
    this.closing = true;

    this.runCloseAnimation();

    setTimeout(() => {
      this.props.onCheckMyVoucher();
    }, ANIMATION_CLOSE_TIME);
  };

  render() {
    const containerStyle = {
      opacity: this.state.opacity,
      bottom: this.state.bottom
    };
    if (this.state.keyboardShow) {
      containerStyle.top = 0;
      containerStyle.bottom = this.state.keyboardHeight;
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
            <Text style={styles.message}>{this.props.message}</Text>
            <Button
              style={styles.submitButtonTitle}
              containerStyle={styles.submitButton}
              onPress={this.onCheckMyVoucher}
            >
              Kiểm tra mã của tôi
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
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
  message: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center'
  },
  submitButton: {
    backgroundColor: config.colors.primary,
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

export default AlreadyVoucher;
