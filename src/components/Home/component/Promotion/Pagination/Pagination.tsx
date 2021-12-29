import React, {Component} from 'react';
import {StyleSheet, Animated, Easing} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {
  PAGINATION_WIDTH,
  PAGINATION_SHADOW,
  PAGINATION_COLOR,
} from './constants';

const styles = StyleSheet.create({
  pagination: {
    height: 1,
    width: PAGINATION_WIDTH,
    backgroundColor: PAGINATION_COLOR,
    ...PAGINATION_SHADOW,
  },
});

class Pagination extends Component<any> {
  static contextType = ThemeContext;

  state = {};
  animatedShow = new Animated.Value(this.animatedValue);

  get theme() {
    return getTheme(this);
  }

  get animatedValue() {
    if (this.props.active) {
      return 0;
    }

    return 1;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.active !== this.props.active) {
      Animated.timing(this.animatedShow, {
        toValue: nextProps.active ? 0 : 1,
        easing: Easing.quad,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }

    return true;
  }

  render() {
    const animatedStyle = {
      opacity: this.animatedShow,
    };

    return (
      <Animated.View
        style={[styles.pagination, animatedStyle, this.props.style]}
      />
    );
  }
}

export default Pagination;
