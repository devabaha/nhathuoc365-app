import React, {Component} from 'react';
import {Animated, StyleSheet, Easing} from 'react-native';
// custom components
import {Container} from 'src/components/base';

class SlidingView extends Component {
  static defaultProps = {
    slide: false,
    duration: 300,
    easing: Easing.cubic,
    transparentElement: false,
    onFinishAnimation: () => {},
  };
  state = {
    animatedSliding: new Animated.Value(0),
    height: 0,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.slide !== this.props.slide) {
      Animated.timing(this.state.animatedSliding, {
        toValue: nextProps.slide ? 1 : 0,
        duration: nextProps.duration,
        easing: nextProps.easing,
        useNativeDriver: true,
      }).start(({finished}) => {
        finished && this.props.onFinishAnimation(nextProps.slide);
      });
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  onLayout(e) {
    this.setState({height: e.nativeEvent.layout.height});
  }

  render() {
    const extraStyle = {
      transform: [
        {
          translateY: this.state.animatedSliding.interpolate({
            inputRange: [0, 1],
            outputRange: [0, this.state.height],
          }),
        },
      ],
      opacity: this.state.animatedSliding.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1, 0],
      }),
    };
    return (
      <Animated.View
        onLayout={this.onLayout.bind(this)}
        style={[styles.container, extraStyle, this.props.containerStyle]}>
        {!this.props.transparentElement && <Container style={styles.bg} />}
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  bg: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});

export default SlidingView;
