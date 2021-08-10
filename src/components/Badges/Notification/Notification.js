import React, {PureComponent} from 'react';
import {StyleSheet, Text, Animated, Easing} from 'react-native';

class Notification extends PureComponent {
  static defaultProps = {
    animation: false,
    show: false,
    alert: false,
    color: 'red',
    alertColor: 'red',
  };
  state = {};
  animatedShowValue = new Animated.Value(0);
  animatedNotifyValue = new Animated.Value(0);

  componentDidMount() {
    this.animating();
  }

  componentDidUpdate(prevProps, prevState) {
    this.animating();
  }

  animating() {
    if (!this.props.animation) {
      this.animatedShowValue.setValue(this.props.show ? 1 : 0);
      return;
    }
    Animated.parallel([
      Animated.timing(this.animatedShowValue, {
        toValue: this.props.show ? 1 : 0,
        duration: 300,
        easing: Easing.quad,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(this.animatedNotifyValue, {
          toValue: !!this.props.label ? 1 : 0,
          duration: 700,
          easing: Easing.quad,
          useNativeDriver: true,
        }),
        Animated.timing(this.animatedNotifyValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }

  renderAlert() {
    if (!this.props.alert) return;
    const animatedAlerting = {
      opacity: this.animatedNotifyValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
      transform: [
        {
          scale: this.animatedNotifyValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 4],
          }),
        },
      ],
    };

    return (
      <Animated.View
        style={[
          styles.alertContainer,
          {
            borderColor: this.props.alertColor,
          },
          animatedAlerting,
        ]}>
        <Animated.View />
      </Animated.View>
    );
  }

  render() {
    const extraStyle = {
      opacity: this.animatedShowValue,
      transform: [
        {
          scale: this.animatedShowValue,
        },
        {
          translateY: this.animatedNotifyValue.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [0, -5, 0, -3, 0],
          }),
        },
      ],
    };
    return (
      <Animated.View
        style={[styles.wrapper, extraStyle, this.props.wrapperStyle]}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: this.props.color,
            },
            this.props.containerStyle,
          ]}>
          {this.renderAlert()}
          <Text style={[styles.label, this.props.labelStyle]}>
            {this.props.label}
          </Text>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  container: {
    top: -5,
    right: 0,
    paddingHorizontal: 3,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 15,
    minWidth: 15,
  },
  label: {
    color: '#fff',
    fontSize: 10,
  },
  alertContainer: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: 'red',
    borderWidth: 0.5,
    borderRadius: 5,
  },
});

export default Notification;
