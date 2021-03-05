import React from 'react';
import {View, StyleSheet} from 'react-native';
import appConfig from 'app-config';

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    backgroundColor: '#000',
  },
});

const QRBackground = ({
  opacity = 0.5,
  containerWidth = appConfig.device.width,
  containerHeight = appConfig.device.height,
  scanAreaTop = appConfig.device.height * 0.25,
  scanAreaLeft = appConfig.device.width * 0.25,
  scanAreaHeight = appConfig.device.width * 0.5,
  scanAreaWidth = appConfig.device.width * 0.5,
}) => {
  return (
    <>
      <View
        style={[
          styles.background,
          {
            opacity,
            height: scanAreaTop,
            width: containerWidth,
          },
        ]}
      />
      <View
        style={[
          styles.background,
          {
            opacity,
            top: scanAreaTop,
            height: scanAreaHeight,
            width: scanAreaLeft,
          },
        ]}
      />
      <View
        style={[
          styles.background,
          {
            opacity,
            top: scanAreaTop,
            // left: scanAreaWidth + scanAreaLeft,
            right: 0,
            height: scanAreaHeight,
            width: scanAreaLeft,
          },
        ]}
      />
      <View
        style={[
          styles.background,
          {
            opacity,
            top: scanAreaTop + scanAreaHeight,
            height: containerHeight - scanAreaTop - scanAreaHeight,
            width: containerWidth,
          },
        ]}
      />
    </>
  );
};

export default React.memo(QRBackground);
