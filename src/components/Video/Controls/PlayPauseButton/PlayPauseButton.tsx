import React, {useCallback, useRef} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {interpolate} from 'flubber';
import {interpolateColor, timing} from 'react-native-redash';
import extractBrush from 'react-native-svg/lib/module/lib/extract/extractBrush';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  block,
  call,
  Easing,
  eq,
  set,
  useCode,
  useValue,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';

import appConfig from 'app-config';

const MAIN_ICON_ACTUAL_SIZE = 512;
const MAIN_ICON_SIZE = 42;
const MAIN_ICON_SCALE_RATIO = MAIN_ICON_SIZE / MAIN_ICON_ACTUAL_SIZE;

const CONTAINER_SIZE = MAIN_ICON_SIZE + 15;

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    borderRadius: CONTAINER_SIZE / 2,
    //@ts-ignore
    borderColor: hexToRgbA(appConfig.colors.white, 0.5),

    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: appConfig.colors.white,
  },
});

const PlayPauseButton = ({onPress, refPath, path}) => {
  const isPressOut = useRef(true);
  const pressInValue = useRef(0);
  const isAnimatedPressInFinished = useRef(true);

  const animatedPressInValue = useValue(0);
  const animatedPressOutValue = useValue(0);

  const handlePressIn = useCallback(() => {
    isPressOut.current = false;
    isAnimatedPressInFinished.current = false;
    Animated.timing(animatedPressInValue, {
      toValue: 1,
      duration: 200,
      easing: Easing.quad,
    }).start(({finished}) => (isAnimatedPressInFinished.current = true));
  }, []);

  const handlePressOut = useCallback(() => {
    isPressOut.current = true;
    if (pressInValue.current === 1) {
      animateBackground();
    }
  }, []);

  const handlePresInValueChange = useCallback(([value]) => {
    pressInValue.current = value;
    if (
      value === 1 &&
      !!isPressOut.current &&
      isAnimatedPressInFinished.current
    ) {
      animateBackground();
    }

    if (value === 0) {
      animatedPressOutValue.setValue(0);
    }
  }, []);

  const animateBackground = useCallback(() => {
    Animated.timing(animatedPressOutValue, {
      toValue: 1,
      duration: 200,
      easing: Easing.quad,
    }).start();
    Animated.timing(animatedPressInValue, {
      toValue: 0,
      duration: 200,
      easing: Easing.quad,
    }).start();
  }, []);

  useCode(() => {
    return [call([animatedPressInValue], handlePresInValueChange)];
  }, []);

  return (
    <Pressable
      //@ts-ignore
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.container,
          {
            borderWidth: animatedPressOutValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 1, 0],
            }),
          },
        ]}>
        <Animated.View
          style={[
            styles.mask,
            {
              opacity: animatedPressInValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1],
              }),
            },
          ]}
        />
        <Svg width={MAIN_ICON_SIZE} height={MAIN_ICON_SIZE}>
          <Path
            ref={refPath}
            d={path}
            fill={appConfig.colors.white}
            scale={MAIN_ICON_SCALE_RATIO}
          />
        </Svg>
      </Animated.View>
    </Pressable>
  );
};

const areEquals = (prevProps, nextProps) => {
  return prevProps.path === nextProps.path;
};

export default React.memo(PlayPauseButton, areEquals);
