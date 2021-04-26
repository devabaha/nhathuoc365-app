import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import appConfig from 'app-config';

const WIDTH = 15;
const HEIGHT = 3;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 30
  },
  frameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    borderRadius: HEIGHT,
    overflow: 'hidden',
  },
  title: {
    position: 'absolute',
    top: -15,
    color: appConfig.colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
    textTransform: 'uppercase',
    letterSpacing: .3
  },
  frame: {
    position: 'absolute',
    backgroundColor: appConfig.colors.primary,
  },
  frameTopLeftHorizontal: {
    top: 0,
    left: 0,
    width: WIDTH,
    height: HEIGHT,
  },
  frameTopLeftVertical: {
    top: 0,
    left: 0,
    width: HEIGHT,
    height: WIDTH,
  },
  frameTopRightHorizontal: {
    top: 0,
    right: 0,
    width: WIDTH,
    height: HEIGHT,
  },
  frameTopRightVertical: {
    top: 0,
    right: 0,
    width: HEIGHT,
    height: WIDTH,
  },
  frameBottomLeftHorizontal: {
    bottom: 0,
    left: 0,
    width: WIDTH,
    height: HEIGHT,
  },
  frameBottomLeftVertical: {
    bottom: 0,
    left: 0,
    width: HEIGHT,
    height: WIDTH,
  },
  frameBottomRightHorizontal: {
    bottom: 0,
    right: 0,
    width: WIDTH,
    height: HEIGHT,
  },
  frameBottomRightVertical: {
    bottom: 0,
    right: 0,
    width: HEIGHT,
    height: WIDTH,
  },
});

const QRPayFrame = ({children, style}) => {
  return (
    <View style={[styles.container, style]}>
      {children}
      <Text style={styles.title}>QR Pay</Text>
      <View style={styles.frameContainer}>
        <View style={[styles.frame, styles.frameTopLeftHorizontal]} />
        <View style={[styles.frame, styles.frameTopLeftVertical]} />

        <View style={[styles.frame, styles.frameTopRightHorizontal]} />
        <View style={[styles.frame, styles.frameTopRightVertical]} />

        <View style={[styles.frame, styles.frameBottomLeftHorizontal]} />
        <View style={[styles.frame, styles.frameBottomLeftVertical]} />

        <View style={[styles.frame, styles.frameBottomRightHorizontal]} />
        <View style={[styles.frame, styles.frameBottomRightVertical]} />
      </View>
    </View>
  );
};

export default QRPayFrame;
