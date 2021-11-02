import React, {useEffect, useMemo, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {Easing, Extrapolate, useValue} from 'react-native-reanimated';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import appConfig from 'app-config';
import {themes} from '../../themes';

const AnimatedAntDesignIcon = Animated.createAnimatedComponent(AntDesignIcon);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: themes.colors.background,
  },
  iconContainer: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#fff',
    marginHorizontal: 3,
  },
});

const Ripple = ({
  id,
  x,
  y,
  size = 100,
  scale = 10,
  direction = 'ltf',
  iconName,
  renderDescription = (animatedValue) => {
    return null;
  },
  onFinishAnimation = (id: any) => {},
}) => {
  const rippleId = useRef(id);
  const animatedShowIconValue = useValue(0);
  const animatedShowValue = useValue(0);
  const animatedHideValue = useValue(0);

  useEffect(() => {
    Animated.timing(animatedShowValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.in(Easing.ease),
    }).start(({finished}) => {
      if (finished) {
        Animated.timing(animatedHideValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.in(Easing.ease),
        }).start(({finished}) => {
          onFinishAnimation(rippleId.current);
        });
      }
    });

    Animated.timing(animatedShowIconValue, {
      toValue: 1,
      easing: Easing.ease,
      duration: 500,
    }).start();
  }, []);

  const renderIcons = (length = 3) => {
    return Array.from({length}).map((icon, index) => {
      const customRange = 1.5 / length; // interleaving divided equally range
      const standardRange = 1 / length; // adjacent divided equally range
      const rangeDiff1Side = (customRange - standardRange) / 2; // different between customRange and standardRange divided
      const initRange =
        Math.round((standardRange - rangeDiff1Side) * 100) / 100; // range from 0 to start

      const start = index * initRange;
      const middle = start + customRange / 2;
      const end = start + customRange;

      return (
        <RippleIcon
          key={index}
          iconName={iconName}
          style={{
            fontSize: Math.min(size / 8, 16),
            opacity: animatedShowIconValue.interpolate({
              inputRange: [start, middle, end],
              outputRange: [0, 1, 0],
            }),
          }}
        />
      );
    });
  };

  const extraIconContainerStyle = useMemo(() => {
    switch (direction) {
      case 'ltr':
        return {
          flexDirection: 'row-reverse',
        };
      case 'rtl':
        return {
          flexDirection: 'row',
        };
      default:
        return {
          flexDirection: 'row-reverse',
        };
    }
  }, [direction]);

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            left: x - size / 2,
            top: y - size / 2,
            width: size,
            height: size,
            borderRadius: size / 2,
            opacity: animatedHideValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0],
            }),
            transform: [
              {
                scale: animatedShowValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, scale],
                }),
              },
            ],
          },
        ]}></Animated.View>

      <View style={styles.iconContainer}>
        {/* @ts-ignore */}
        <Animated.View style={[extraIconContainerStyle]}>
          {renderIcons()}
        </Animated.View>
        {renderDescription(animatedShowValue)}
      </View>
    </>
  );
};

const areEquals = (prevProps, nextProps) => {
  return true;
};

export default React.memo(Ripple, areEquals);

const RippleIcon = ({style, iconName}) => {
  return (
    <AnimatedAntDesignIcon name={iconName} style={[styles.icon, style, {}]} />
  );
};
