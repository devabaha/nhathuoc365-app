import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ActivityIndicator, Animated } from 'react-native';

const FADE_SHOW_VALUE = 1;
const FADE_HIDE_VALUE = 0;
const FADE_DURATION = 1000;

class Indicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animating: true,
      fadeIn: new Animated.Value(FADE_HIDE_VALUE)
    };
  }

  componentDidMount() {
    Animated.timing(this.state.fadeIn, {
      toValue: FADE_SHOW_VALUE,
      duration: FADE_DURATION,
      useNativeDriver: true
    }).start();
  }

  render() {
    const containerStyle = {
      opacity: this.state.fadeIn
    };

    if (this.props.size == 'small') {
      return (
        <Animated.View
          style={[styles.container, this.props.style, containerStyle]}
        >
          <ActivityIndicator
            animating={this.state.animating}
            color={this.props.color || '#666666'}
            size="small"
          />
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={[styles.container, this.props.style, containerStyle]}
      >
        <View style={styles.loading_box}>
          <ActivityIndicator
            animating={this.state.animating}
            color={this.props.color || '#ffffff'}
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
  style: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading_box: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 69,
    height: 69,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 5,
    marginTop: -NAV_HEIGHT / 2
  }
});

export default Indicator;
