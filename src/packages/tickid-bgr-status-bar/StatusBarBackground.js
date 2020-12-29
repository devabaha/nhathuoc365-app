import React, { useEffect, useState } from 'react';
import { StyleSheet, Animated, Platform } from 'react-native';
import config from './config';

const SHOW_FLAG = 1;
const HIDE_FLAG = 0;
const DURATION = 250;

function StatusBarBackground(props) {
  const [opacity] = useState(
    new Animated.Value(props.visible ? SHOW_FLAG : HIDE_FLAG)
  );

  useEffect(() => {
    config.methods.show = show;
    config.methods.hide = hide;
  }, []);

  const show = () => {
    Animated.timing(opacity, {
      toValue: SHOW_FLAG,
      duration: DURATION,
      useNativeDriver: true
    }).start();
  };

  const hide = () => {
    Animated.timing(opacity, {
      toValue: HIDE_FLAG,
      duration: DURATION,
      useNativeDriver: true
    }).start();
  };

  if (Platform.OS !== 'ios') return null;

  return <Animated.View style={[styles.statusBar, { opacity }]} />;
}

const styles = StyleSheet.create({
  statusBar: {
    top: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: '#fff',
    height: config.device.statusBarHeight
  }
});

export default StatusBarBackground;
