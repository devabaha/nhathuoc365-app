import React, {PureComponent} from 'react';
import {StyleSheet, Animated, Easing} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
//constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';

class Notification extends PureComponent {
  static contextType = ThemeContext;

  static defaultProps = {
    animation: false,
    show: false,
    alert: false,
  };
  state = {};
  animatedShowValue = new Animated.Value(0);
  animatedNotifyValue = new Animated.Value(0);

  get theme() {
    return getTheme(this);
  }

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
            borderColor: this.alertColor,
            borderWidth: this.theme.layout.borderWidthSmall,
            borderRadius: this.theme.layout.borderRadiusSmall,
          },
          animatedAlerting,
        ]}>
        <Animated.View />
      </Animated.View>
    );
  }

  get alertColor() {
    return this.props.alertColor || this.theme.color.danger;
  }

  get color() {
    return this.props.color || this.theme.color.danger;
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
              backgroundColor: this.color,
            },
            this.props.containerStyle,
          ]}>
          {this.renderAlert()}
          <Typography
            type={TypographyType.LABEL_TINY}
            onPrimary
            style={this.props.labelStyle}>
            {this.props.label}
          </Typography>
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
  alertContainer: {
    position: 'absolute',
    width: 10,
    height: 10,
  },
});

export default Notification;
