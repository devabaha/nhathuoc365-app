import React from 'react';
import {StyleSheet, Animated, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
    color: '#333',
  },
});

const NavBarAction = ({
  iconName = '',
  containerStyle = {},
  maskStyle = {},
  iconStyle = {},
  onPress = () => {},
}) => {
  return (
    <AnimatedTouchable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      style={[styles.iconContainer, containerStyle]}>
      {/* <Animated.View style={[styles.mask, maskStyle]} /> */}
      <Icon name={iconName} style={[styles.icon, iconStyle]} />
    </AnimatedTouchable>
  );
};

export default React.memo(NavBarAction);
