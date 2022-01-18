import React, {useCallback, useRef} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  call,
  Easing,
  useCode,
  useValue,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {themes} from '../themes';

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
    borderColor: hexToRgbA(themes.colors.primary, 0.2),

    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themes.colors.primary,
  },
});

const PlayPauseButton = ({
  onPress,
  refPath,
  path,
  fill = themes.colors.primary,
  strokeWidth = 0,
}) => {
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

  const handlePressInValueChange = useCallback(([value]) => {
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
    isAnimatedPressInFinished.current = false;
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
    return [call([animatedPressInValue], handlePressInValueChange)];
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      //@ts-ignore
      hitSlop={HIT_SLOP}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      //@ts-ignore
      disallowInterruption>
      <Animated.View
        style={[
          styles.container,
          {
            borderWidth: animatedPressOutValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 2, 0],
            }),
          },
        ]}>
        <Animated.View
          style={[
            styles.mask,
            {
              opacity: animatedPressInValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.2],
              }),
            },
          ]}
        />
        <Svg width={MAIN_ICON_SIZE} height={MAIN_ICON_SIZE}>
          <Path
            ref={refPath}
            d={path}
            fill={fill}
            stroke={themes.colors.primary}
            strokeWidth={strokeWidth}
            scale={MAIN_ICON_SCALE_RATIO}
          />
        </Svg>
      </Animated.View>
    </TouchableOpacity>
  );
};

const areEquals = (prevProps, nextProps) => {
  return (
    prevProps.path === nextProps.path &&
    prevProps.fill === nextProps.fill &&
    prevProps.strokeWidth === nextProps.strokeWidth
  );
};

export default React.memo(PlayPauseButton, areEquals);
