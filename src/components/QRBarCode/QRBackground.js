import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';

const SCANNER_HEIGHT = 2;

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
  },
  scanAreaContainer: {
    position: 'absolute',
    ...elevationShadowStyle(1, 0, 0, 1, appConfig.colors.primary),
  },
  scanArea: {
    flex: 1,
    overflow: 'hidden',
  },
  scanner: {
    height: SCANNER_HEIGHT,
    width: '100%',
    ...(appConfig.device.isAndroid
      ? elevationShadowStyle(1, 0, 0, 1, appConfig.colors.primary)
      : {}),
  },
});

const QRBackground = ({
  opacity = 0.6,
  containerWidth = appConfig.device.width,
  containerHeight = appConfig.device.height,
  scanAreaTop = appConfig.device.height * 0.25,
  scanAreaLeft = appConfig.device.width * 0.25,
  scanAreaHeight = appConfig.device.width * 0.5,
  scanAreaWidth = appConfig.device.width * 0.5,
}) => {
  const animatedTranslateY = new Animated.Value(0);
  const animatedRotate = new Animated.Value(0);

  const {theme} = useTheme();

  useEffect(() => {
    animateScanner();

    return () => {
      animatedTranslateY.stopAnimation();
    };
  }, []);

  const animateScanner = () => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(animatedTranslateY, {
          toValue: 1,
          duration: 3000,
          easing: Easing.elastic(120),
          useNativeDriver: true,
        }),
        Animated.timing(animatedRotate, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(animatedTranslateY, {
          toValue: 0,
          duration: 3000,
          easing: Easing.elastic(120),
          useNativeDriver: true,
        }),
        Animated.timing(animatedRotate, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
      ]),
    ).start();
  };

  const backgroundStyle = useMemo(() => {
    return mergeStyles(styles.background, {
      backgroundColor: theme.color.black,
    });
  }, [theme]);

  const scanAreaContainerStyle = useMemo(() => {
    return {
      borderWidth: theme.layout.borderWidthSmall,
      borderColor: theme.color.white,
    };
  }, [theme]);

  const scannerStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.white,
    };
  }, [theme]);

  return (
    <>
      {/* Background Overlay */}
      <View
        style={[
          styles.background,
          backgroundStyle,
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
          backgroundStyle,
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
          backgroundStyle,
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
          backgroundStyle,
          {
            opacity,
            top: scanAreaTop + scanAreaHeight,
            height: containerHeight - scanAreaTop - scanAreaHeight,
            width: containerWidth,
          },
        ]}
      />

      {/* Scan Area */}
      <View
        style={[
          styles.scanAreaContainer,
          scanAreaContainerStyle,
          {
            left: scanAreaLeft,
            top: scanAreaTop,
            width: scanAreaWidth,
            height: scanAreaHeight,
          },
        ]}>
        <View style={styles.scanArea}>
          <Animated.View
            style={[
              styles.scanner,
              scannerStyle,
              {
                transform: [
                  {
                    translateY: animatedTranslateY.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        -SCANNER_HEIGHT,
                        scanAreaHeight + SCANNER_HEIGHT,
                      ],
                    }),
                  },
                  {
                    rotate: animatedRotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                    }),
                  },
                ],
              },
            ]}>
            {/* <LinearGradient
              style={{flex: 1}}
              colors={[
                hexToRgba(appConfig.colors.primary, 0),
                hexToRgba(appConfig.colors.primary, 1),
              ]}
              locations={[0.4, 0.8]}
            /> */}
          </Animated.View>
        </View>
      </View>
    </>
  );
};

export default React.memo(QRBackground);
