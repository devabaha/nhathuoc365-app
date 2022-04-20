import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import Animated, {Easing} from 'react-native-reanimated';
// types
import {HorizontalIndicatorProps} from '.';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {hexToRgba} from 'app-helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    height: 3,
    width: 50,
    overflow: 'hidden',
  },
  indicator: {
    borderRadius: 2,
    height: '100%',
    width: '30%',
  },
});

class HorizontalIndicator extends Component<HorizontalIndicatorProps> {
  static contextType = ThemeContext;

  state = {};
  animatedIndicatorWidth = new Animated.Value(0);

  get theme() {
    return getTheme(this);
  }

  get indicatorColor() {
    return (
      this.props.indicatorColor ||
      this.props.color ||
      this.theme.color.persistPrimary
    );
  }

  get foregroundColor() {
    return (
      this.props.foregroundColor ||
      this.props.color ||
      this.theme.color.primaryHighlight
    );
  }

  componentDidMount() {
    setTimeout(() =>
      Animated.timing(this.animatedIndicatorWidth, {
        toValue: this.props.indicatorWidth,
        easing: Easing.quad,
        duration: 200,
      }).start(),
    );
  }

  componentDidUpdate() {
    setTimeout(() =>
      Animated.timing(this.animatedIndicatorWidth, {
        toValue: this.props.indicatorWidth,
        easing: Easing.quad,
        duration: 200,
      }).start(),
    );
  }

  get containerStyle() {
    return {
      backgroundColor: hexToRgba(this.foregroundColor, 0.25),
    };
  }

  get indicatorStyle() {
    return {
      backgroundColor: this.indicatorColor as string,
      width: this.animatedIndicatorWidth,
    };
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          this.containerStyle,
          this.props.containerStyle,
        ]}>
        <Animated.View
          style={[
            styles.indicator,
            this.indicatorStyle,
            this.props.indicatorStyle,
          ]}
        />
      </View>
    );
  }
}

export default HorizontalIndicator;
