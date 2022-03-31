import React, { Component } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

class SkeletonLoading extends Component {
  state = {
    width: 0,
    height: 0
  };

  handleContainerLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    this.setState({
      width,
      height
    });
  };

  render() {
    const {
      loading,
      children,
      style,
      backgroundColor,
      foregroundColor,
      ...props
    } = this.props;

    const { width, height } = this.state;
    const hightlightWidth = width * 0.8;

    return (
      <>
        {loading ? (
          <View
            onLayout={this.handleContainerLayout}
            style={[styles.container, style]}
            {...props}
          >
            {!!width && (
              <Hightlight
                width={hightlightWidth}
                height="100%"
                start={-hightlightWidth}
                end={width + hightlightWidth}
              />
            )}
          </View>
        ) : (
          children
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd'
  }
});

export default SkeletonLoading;

class Hightlight extends Component {
  static defaultProps = {
    style: {}
  };
  state = {
    hightlightAnimated: new Animated.Value(this.props.start)
  };
  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.hightlightAnimated, {
          toValue: this.props.end,
          duration: 800,
          easing: Easing.cubic,
          useNativeDriver: true
        }),
        Animated.timing(this.state.hightlightAnimated, {
          toValue: this.props.start,
          duration: 0,
          useNativeDriver: true
        }),
        Animated.timing(this.state.hightlightAnimated, {
          toValue: this.props.end,
          duration: 600,
          easing: Easing.cubic,
          useNativeDriver: true
        }),
        Animated.timing(this.state.hightlightAnimated, {
          toValue: this.props.start,
          duration: 0,
          useNativeDriver: true
        }),
        Animated.delay(1000)
      ])
    ).start();
  }

  render() {
    const { width, height, style, start, end } = this.props;
    const animatedStyle = {
      transform: [{ translateX: this.state.hightlightAnimated }]
    };
    const containerStyle = [{ width, height, ...style }, animatedStyle];
    return (
      <AnimatedLinearGradient
        style={containerStyle}
        colors={[
          'rgba(255,255,255,0)',
          'rgba(255,255,255,.4)',
          'rgba(255,255,255,.4)',
          'rgba(255,255,255,0)'
        ]}
        locations={[0.15, 0.45, 0.55, 0.85]}
        useAngle
        angle={90}
      />
    );
  }
}
