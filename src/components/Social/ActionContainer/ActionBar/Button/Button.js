import React, {useCallback, useRef, useState, useEffect} from 'react';
import {StyleSheet, Animated, Easing as RNEasing} from 'react-native';
import Reanimated, {useValue, Easing} from 'react-native-reanimated';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Container from 'src/components/Layout/Container';
import Pressable from 'src/components/Pressable';

const AnimatedAntDesignIcon = Reanimated.createAnimatedComponent(AntDesignIcon);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  animatedWrapper: {
    flex: 1,
  },
  container: {
    padding: 15,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    color: '#666',
    marginRight: 10,
  },
  title: {
    color: '#666',
    fontWeight: '600',
  },
});

const Button = ({
  title,
  titleStyle,
  iconName,
  iconStyle,
  style,
  containerStyle,
  onPress,
}) => {
  // console.log('render button');

  return (
    <Pressable onPress={onPress} style={[styles.wrapper, containerStyle]}>
      <Container reanimated row style={[styles.container, style]}>
        <AnimatedAntDesignIcon
          name={iconName}
          style={[styles.icon, iconStyle]}
        />
        <Reanimated.Text style={[styles.title, titleStyle]}>
          {title}
        </Reanimated.Text>
      </Container>
    </Pressable>
  );
};

export default React.memo(Button);
