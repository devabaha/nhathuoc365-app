import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useCode,
  cond,
  eq,
  set,
  interpolate,
  concat,
  startClock,
  stopClock,
  block,
  Extrapolate
} from 'react-native-reanimated';
import { useValue, useClock, loop, timing } from 'react-native-redash';

const AnimatedImageBackground = Animated.createAnimatedComponent(
  ImageBackground
);
const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
});

const ImgBackground = ({ blurRadius = 0, source, isAnimating = true }) => {
  const animatedBreathing = useValue(0);
  const animatedBreathingClock = useClock(0);

  useCode(() => {
    return set(
      animatedBreathing,
      loop({
        clock: animatedBreathingClock,
        easing: Easing.quad,
        duration: 3000,
        boomerang: true,
        autoStart: false
      })
    );
  }, []);

  useCode(() => {
    return cond(
      eq(isAnimating ? 1 : 0, 0),
      block([
        stopClock(animatedBreathingClock),
        set(
          animatedBreathing,
          timing({
            from: animatedBreathing,
            to: 0,
            duration: 300,
            easing: Easing.quad
          })
        )
      ]),
      block([
        set(animatedBreathing, 0),
        set(
          animatedBreathing,
          loop({
            clock: animatedBreathingClock,
            easing: Easing.quad,
            duration: 3000,
            boomerang: true,
            autoStart: false
          })
        ),
        startClock(animatedBreathingClock)
      ])
    );
  }, [isAnimating]);

  return (
    <Animated.View
      style={[
        styles.imageBackground,
        {
          transform: [
            {
              scale: interpolate(animatedBreathing, {
                inputRange: [0, 1],
                outputRange: [1, 1.3]
              })
            },
            {
              rotate: concat(
                interpolate(animatedBreathing, {
                  inputRange: [0, 1],
                  outputRange: [0, 3],
                  extrapolate: Extrapolate.CLAMP
                }),
                'deg'
              )
            }
          ]
        }
      ]}
    >
      <AnimatedImageBackground
        source={source}
        resizeMode="cover"
        style={[styles.imageBackground]}
        blurRadius={blurRadius}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.3)' }} />
      </AnimatedImageBackground>
    </Animated.View>
  );
};

function areEqual(prevProps, nextProps) {
  return prevProps.isAnimating === nextProps.isAnimating;
}

export default React.memo(ImgBackground, areEqual);
