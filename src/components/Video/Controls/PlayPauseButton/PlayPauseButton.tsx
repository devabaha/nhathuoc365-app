import React, {useCallback, useMemo, useRef} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import Animated, {
  call,
  Easing,
  useCode,
  useValue,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
// helpers
import {hexToRgba} from 'app-helper';
import {getThemes} from '../themes';
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {HIT_SLOP} from 'src/constants';
// custom components
import {BaseButton} from 'src/components/base';

const MAIN_ICON_ACTUAL_SIZE = 512;
const MAIN_ICON_SIZE = 42;
const MAIN_ICON_SCALE_RATIO = MAIN_ICON_SIZE / MAIN_ICON_ACTUAL_SIZE;

const CONTAINER_SIZE = MAIN_ICON_SIZE + 15;

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    borderRadius: CONTAINER_SIZE / 2,

    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
  },
});

const PlayPauseButton = ({onPress, refPath, path, fill = undefined, strokeWidth = 0}) => {
  const {theme} = useTheme();

  const themes = useMemo(() => {
    return getThemes(theme);
  }, [theme]);

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

  const containerStyle = useMemo(() => {
    return mergeStyles(styles.container, {
      borderColor: hexToRgba(themes.colors.primary, 0.2),
      borderWidth: animatedPressOutValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 2, 0],
      }),
    });
  }, [themes]);

  const maskStyle = useMemo(() => {
    return mergeStyles(styles.mask, {
      backgroundColor: themes.colors.primary,
      opacity: animatedPressInValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.2],
      }),
    });
  }, [themes]);

  return (
    <BaseButton
      useGestureHandler
      onPress={onPress}
      hitSlop={HIT_SLOP}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      //@ts-ignore
      disallowInterruption>
      <Animated.View style={containerStyle}>
        <Animated.View style={maskStyle} />
        <Svg width={MAIN_ICON_SIZE} height={MAIN_ICON_SIZE}>
          <Path
            ref={refPath}
            d={path}
            fill={fill || themes.colors.primary}
            stroke={themes.colors.primary}
            strokeWidth={strokeWidth}
            scale={MAIN_ICON_SCALE_RATIO}
          />
        </Svg>
      </Animated.View>
    </BaseButton>
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
