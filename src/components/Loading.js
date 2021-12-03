import React, {Component, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Animated, {Easing, useValue} from 'react-native-reanimated';

import {ActivityIndicator} from './base';

export default class Loading extends Component {
  render() {
    return (
      <View
        pointerEvents={this.props.pointerEvents}
        style={[
          styles.wrapper,
          this.props.center ? styles.centerContainer : {},
          this.props.wrapperStyle,
        ]}>
        {!!this.props.blur && (
          <BlurFilter visible blurType={this.props.blurType} />
        )}
        <View
          style={[
            styles.container,
            (this.props.blur || this.props.highlight) &&
              styles.blurContentContainer,
            this.props.containerStyle,
          ]}>
          <ActivityIndicator
            style={[
              styles.loading,
              this.props.style,
              this.props.center ? styles.center : {},
            ]}
            color={this.props.color}
            size={this.props.size || 'large'}
          />
          {this.props.message && (
            <Text style={[styles.message, this.props.textStyle]}>
              {this.props.message}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  blurContainer: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  blurContentContainer: {
    backgroundColor: '#eee',
    padding: 20,
    borderRadius: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    // height: 40,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    // position: 'absolute',
    // top: Util.size.height / 2 - LOADING_WIDTH / 2 - NAV_HEIGHT,
    // left: Util.size.width / 2 - LOADING_WIDTH / 2,
    zIndex: 999,
    // width: LOADING_WIDTH,
    // height: LOADING_WIDTH
  },
  message: {
    color: '#333',
    textAlign: 'center',
    fontSize: 12,
  },
});

export const BlurFilter = React.memo(({visible, blurType}) => {
  const animatedOpacity = useValue(0);

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      easing: Easing.quad,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.blurContainer, {opacity: animatedOpacity}]}>
      <BlurView
        style={styles.blurContainer}
        reducedTransparencyFallbackColor="#fff"
        blurType={blurType}
      />
    </Animated.View>
  );
});
