import React, {useEffect, useState, useCallback, memo, useMemo} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
// context
import {useTheme} from 'src/Themes/Theme.context';

const ProgressBar = (props) => {
  const {
    height,
    progress,
    animated,
    indeterminate,
    progressDuration,
    indeterminateDuration,
    onCompletion,
    onProgressChange = () => {},
    backgroundColor,
    foregroundColor: foregroundColorProp,
    containerStyle: containerStyleProp,
  } = props;
  const {theme} = useTheme();

  const foregroundColor = useMemo(() => {
    return foregroundColorProp || theme.color.background;
  }, [theme, foregroundColorProp]);

  const [timer] = useState(new Animated.Value(0));
  const [width] = useState(new Animated.Value(0));

  const indeterminateAnimation = Animated.timing(timer, {
    duration: indeterminateDuration,
    toValue: 1,
    useNativeDriver: true,
    isInteraction: false,
  });

  useEffect(() => {
    if (indeterminate || typeof progress === 'number') {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [indeterminate, progress, startAnimation, stopAnimation]);

  const startAnimation = useCallback(() => {
    if (indeterminate) {
      timer.setValue(0);
      Animated.loop(indeterminateAnimation).start();
    } else {
      Animated.timing(width, {
        duration: animated ? progressDuration : 0,
        toValue: progress,
      }).start(({finished}) => {
        onProgressChange();
        finished && onCompletion();
      });
    }
  }, [
    animated,
    indeterminate,
    indeterminateAnimation,
    onCompletion,
    onProgressChange,
    progress,
    progressDuration,
    timer,
    width,
  ]);

  const stopAnimation = useCallback(() => {
    if (indeterminateAnimation) indeterminateAnimation.stop();

    Animated.timing(width, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  }, [indeterminateAnimation, width]);

  const styleAnimation = () => {
    return indeterminate
      ? {
          transform: [
            {
              translateX: timer.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [-0.6 * 320, -0.5 * 0.8 * 320, 0.7 * 320],
              }),
            },
            {
              scaleX: timer.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.0001, 0.8, 0.0001],
              }),
            },
          ],
        }
      : {
          width: width.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
        };
  };

  const contentStyle = useMemo(() => {
    return [
      styles.container,
      {
        height,
        backgroundColor: foregroundColor,
        borderRadius: theme.layout.borderRadiusSmall,
      },
    ];
  }, [foregroundColor, height]);

  const progressBarStyle = useMemo(() => {
    return [
      styles.progressBar,
      {
        borderRadius: height / 2,
      },
    ];
  }, [height]);

  return (
    <View style={containerStyleProp}>
      <Animated.View style={contentStyle}>
        <Animated.View
          style={[
            progressBarStyle,
            {
              backgroundColor,
              ...styleAnimation(),
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  progressBar: {
    flex: 1,
  },
});

ProgressBar.defaultProps = {
  height: 2,
  progress: 0,
  animated: true,
  indeterminate: false,
  indeterminateDuration: 1100,
  progressDuration: 1100,
  onCompletion: () => {},
};

export default memo(ProgressBar);
