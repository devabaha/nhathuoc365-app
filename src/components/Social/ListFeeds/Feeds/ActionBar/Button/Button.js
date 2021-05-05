import React, {useCallback, useRef, useState, useEffect} from 'react';
import {StyleSheet, Pressable} from 'react-native';
import Animated, {useValue, Easing} from 'react-native-reanimated';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Container from 'src/components/Layout/Container';

const AnimatedAntDesignIcon = Animated.createAnimatedComponent(AntDesignIcon);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  animatedWrapper: {
    flex: 1,
  },
  container: {
    padding: 15,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    color: '#666',
    marginRight: 10,
  },
  title: {
    color: '#666',
    fontWeight: '600',
  },
});

const Button = ({
  title,
  titleStyle,
  iconName,
  iconStyle,
  style,
  containerStyle,
  onPress,
}) => {
//   console.log('render button');

  const animatedPressIn = useValue(0);

  const animateTimeout = useRef();

  useEffect(() => {
    return () => {
      clearTimeout(animateTimeout.current);
    };
  }, []);

  const animatingPressingIn = useCallback((toValue) => {
    Animated.timing(animatedPressIn, {
      toValue,
      duration: 250,
      easing: Easing.bezier(.67,.23,.89,.33),
    }).start(() => {});
  }, []);

  const handlePressIn = useCallback(() => {
    animateTimeout.current = setTimeout(() => animatingPressingIn(1), 300);
  }, []);

  const handlePressOut = useCallback(() => {
    clearTimeout(animateTimeout.current);
    animatingPressingIn(0);
  }, []);

  const animatedPressingStyle = {
    opacity: animatedPressIn.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.7],
    }),
    transform: [
      {
        scale: animatedPressIn.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.95],
        }),
      },
    ],
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[styles.wrapper, containerStyle]}>
      <Animated.View style={[styles.animatedWrapper, animatedPressingStyle]}>
        <Container reanimated row style={[styles.container, style]}>
          <AnimatedAntDesignIcon
            name={iconName}
            style={[styles.icon, iconStyle]}
          />
          <Animated.Text style={[styles.title, titleStyle]}>
            {title}
          </Animated.Text>
        </Container>
      </Animated.View>
    </Pressable>
  );
};

export default React.memo(Button);
