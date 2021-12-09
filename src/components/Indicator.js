import React, {Component} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import PropTypes from 'prop-types';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import {ActivityIndicator} from './base';

const FADE_SHOW_VALUE = 1;
const FADE_HIDE_VALUE = 0;
const FADE_DURATION = 1000;

class Indicator extends Component {
  static contextType = ThemeContext;

  state = {
    animating: true,
    fadeIn: new Animated.Value(FADE_HIDE_VALUE),
  };

  get theme() {
    return getTheme(this);
  }
  componentDidMount() {
    Animated.timing(this.state.fadeIn, {
      toValue: FADE_SHOW_VALUE,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start();
  }

  loadingBoxStyle = mergeStyles(styles.loading_box, {
    backgroundColor: this.theme.color.overlay60,
    borderRadius: this.theme.layout.borderRadiusSmall,
  });

  render() {
    const containerStyle = {
      opacity: this.state.fadeIn,
    };

    if (this.props.size == 'small') {
      return (
        <Animated.View
          style={[styles.container, this.props.style, containerStyle]}>
          <ActivityIndicator
            animating={this.state.animating}
            color={this.props.color}
            size="small"
          />
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={[styles.container, this.props.style, containerStyle]}>
        <View style={this.loadingBoxStyle}>
          <ActivityIndicator
            animating={this.state.animating}
            color={this.props.color}
            size="large"
          />
        </View>
      </Animated.View>
    );
  }
}

Indicator.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  loading_box: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 69,
    height: 69,
    marginTop: -NAV_HEIGHT / 2,
  },
});

export default Indicator;
