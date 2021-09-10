import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import appConfig from 'app-config';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const Toggle = ({ value, animatedIconStyle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <AnimatedIcon
        style={[styles.icon, animatedIconStyle]}
        name="angle-down"
        size={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  value: {
    color: appConfig.colors.primary
  },
  icon: {
    fontSize: 16,
    marginLeft: 5,
    color: appConfig.colors.primary
  }
});

export default Toggle;
