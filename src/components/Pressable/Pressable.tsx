import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Pressable as RNPressable,
  Animated,
  Easing as RNEasing,
} from 'react-native';
import {PressableProps} from '.';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  animatedWrapper: {
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

const Pressable = ({
  style,
  onPress,
  children,
  refAnimationValue,
  contentStyle,
  setAnimatedPressingStyle,
}: PressableProps) => {
  const [animatedPressIn] = useState(new Animated.Value(0));

  useEffect(() => {
    if (refAnimationValue) {
      refAnimationValue(animatedPressIn);
    }
  }, []);

  const animatingPressingIn = useCallback((toValue, delay = 0) => {
    Animated.timing(animatedPressIn, {
      toValue,
      duration: 250,
      delay,
      easing: RNEasing.quad,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = useCallback(() => {
    animatingPressingIn(1, 150);
  }, []);

  const handlePressOut = useCallback(() => {
    // @ts-ignore
    Animated.timing(animatedPressIn).stop();
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
          outputRange: [1, 0.92],
        }),
      },
    ],
  };

  return (
    <RNPressable
      //@ts-ignore
      hitSlop={HIT_SLOP}
      disabled={!onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={style}>
      <Animated.View
        style={[
          styles.animatedWrapper,
          setAnimatedPressingStyle
            ? setAnimatedPressingStyle(animatedPressIn)
            : animatedPressingStyle,
          contentStyle,
        ]}>
        {children}
      </Animated.View>
    </RNPressable>
  );
};

export default React.memo(Pressable);
