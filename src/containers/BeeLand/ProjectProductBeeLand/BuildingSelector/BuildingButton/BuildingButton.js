import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Animated, {
  useCode,
  set,
  concat,
  Easing,
  Extrapolate
} from 'react-native-reanimated';
import { useValue, timing } from 'react-native-redash/lib/module/v1';

import appConfig from 'app-config';

const AinmatedIcon = Animated.createAnimatedComponent(Icon);
const styles = StyleSheet.create({
  container: {
    padding: 10,
    minWidth: appConfig.device.width / 3
  },
  buildingWrapper: {
    borderRadius: 8,
    backgroundColor: '#fff',
    ...elevationShadowStyle(5)
  },
  buildingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    overflow: 'hidden'
  },
  buildingIcon: {
    fontSize: 28,
    color: appConfig.colors.primary,
    borderRightWidth: 1,
    borderRightColor: appConfig.colors.primary,
    position: 'absolute',
    bottom: '-70%',
    left: '10%'
  },
  buildingText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#242424',
    backgroundColor: hexToRgbA('#fff', 0.2),
    textAlign: 'center'
  }
});

const BuildingButton = ({
  title,
  titleStyle,
  containerStyle,
  wrapperStyle,
  iconStyle,
  iconName = 'building',
  onPress,
  active = false
}) => {
  const iconAnimated = useValue(0);

  useCode(() => {
    return set(
      iconAnimated,
      timing({
        from: iconAnimated,
        to: active ? 1 : 0,
        duration: 500,
        easing: Easing.quad
      })
    );
  }, [active]);

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.buildingWrapper, wrapperStyle]}
        onPress={onPress}
      >
        <View style={styles.buildingContainer}>
          <AinmatedIcon
            name={iconName}
            style={[
              styles.buildingIcon,
              {
                bottom: concat(
                  iconAnimated.interpolate({
                    inputRange: [0, 0.8],
                    outputRange: [-70, -5],
                    extrapolate: Extrapolate.CLAMP
                  }),
                  '%'
                ),
                opacity: iconAnimated.interpolate({
                  inputRange: [0, 0.8],
                  outputRange: [0.3, 1],
                  extrapolate: Extrapolate.CLAMP
                }),
                transform: [
                  {
                    scaleX: iconAnimated.interpolate({
                      inputRange: [0, 0.5, 0.8, 1],
                      outputRange: [1, 0.7, 1.3, 1]
                    })
                  },
                  {
                    scaleY: iconAnimated.interpolate({
                      inputRange: [0, 0.5, 0.8, 1],
                      outputRange: [1, 1.3, 0.7, 1]
                    })
                  },
                  {
                    translateY: iconAnimated.interpolate({
                      inputRange: [0, 0.5, 0.8, 1],
                      outputRange: [0, -3, 3, 0]
                    })
                  }
                ]
              },
              iconStyle
            ]}
          />
          <View style={styles.buildingTextContainer}>
            <Text numberOfLines={2} style={[styles.buildingText, titleStyle]}>
              {title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BuildingButton;
