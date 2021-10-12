import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Animated, {Easing, useValue} from 'react-native-reanimated';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';

const CONTAINER_HEIGHT = 15;
const CONTAINER_TOP_SPACING = 5;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,1)',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
    opacity: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: CONTAINER_HEIGHT,
  },
  label: {
    letterSpacing: 1,
    color: '#fff',
    textAlign: 'center',
    fontSize: 8,
  },
  iconContainer: {
    paddingHorizontal: 10,
    marginRight: -10,
  },
});

const DomainItem = ({
  index = 0,
  totalDomains = 1,
  title,
  visible,
  iconName = 'down',
  onPress,
  containerStyle,
}) => {
  const animatedTranslate = useValue(visible ? 1 : 0);

  useEffect(() => {
    Animated.timing(animatedTranslate, {
      toValue: visible ? 1 : 0,
      duration: 200 + index * 30,
      easing: Easing.ease,
    }).start();
  }, [visible, index]);

  return (
    <Animated.View
      pointerEvents={onPress ? 'auto' : 'none'}
      style={[
        styles.container,
        {
          opacity: animatedTranslate.interpolate({
            inputRange: [index / totalDomains, 1],
            outputRange: [0, 0.1],
          }),
          transform: [
            {
              translateY: animatedTranslate.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  0,
                  index * (CONTAINER_HEIGHT + CONTAINER_TOP_SPACING),
                ],
              }),
            },
          ],
        },
        containerStyle,
      ]}>
      <Text style={styles.label}>{title}</Text>
      {!!onPress && (
        <TouchableOpacity
          hitSlop={HIT_SLOP}
          style={styles.iconContainer}
          onPress={onPress}>
          <AntDesignIcon name={iconName} style={styles.label} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default React.memo(DomainItem);
