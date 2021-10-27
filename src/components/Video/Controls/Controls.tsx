import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import {interpolate} from 'flubber';
import extractBrush from 'react-native-svg/lib/module/lib/extract/extractBrush';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  block,
  call,
  Easing,
  eq,
  set,
  useCode,
  useValue,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';

import appConfig from 'app-config';
import {timing} from 'react-native-redash';

import PlayPauseButton from './PlayPauseButton';
import Tracker from './Tracker';

const PLAY_SVG_PATH =
  'M 133 440 a 35.37 35.37 0 0 1 -17.5 -4.67 c -12 -6.8 -19.46 -20 -19.46 -34.33 V 111 c 0 -14.37 7.46 -27.53 19.46 -34.33 a 35.13 35.13 0 0 1 35.77 0.45 l 247.85 148.36 a 36 36 0 0 1 0 61 l -247.89 148.4 A 35.5 35.5 0 0 1 133 440 Z';
const PAUSE_SVG_PATH =
  'M 208 432 h -48 a 16 16 0 0 1 -16 -16 V 96 a 16 16 0 0 1 16 -16 h 48 a 16 16 0 0 1 16 16 v 320 a 16 16 0 0 1 -16 16 Z M 352 432 h -48 a 16 16 0 0 1 -16 -16 V 96 a 16 16 0 0 1 16 -16 h 48 a 16 16 0 0 1 16 16 v 320 a 16 16 0 0 1 -16 16 Z';
const pathInterpolate = interpolate(PLAY_SVG_PATH, PAUSE_SVG_PATH, {
  maxSegmentLength: 1,
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    backgroundColor: appConfig.colors.overlay,
  },

  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  icon: {
    color: appConfig.colors.white,
    fontSize: 24,
  },
  playIcon: {
    fontSize: 48,
  },

  footer: {
    marginTop: 'auto',
  },
});

const Controls = ({
  isPlay: isPlayProps,
  isMute: isMuteProps,
  currentTime,
  totalTime,
  onPressPlay = () => {},
  onPressMute = () => {},
  onProgress = (value: number) => {},
}) => {
  const refPlayPath = useRef<any>();

  const [isPlay, setPlay] = useState(isPlayProps ? 1 : 0);
  const [isMute, setMute] = useState(isMuteProps ? 1 : 0);

  const animatedPlayValue = useValue(isPlay);

  useEffect(() => {
    setPlay(isPlayProps ? 1 : 0);
  }, [isPlayProps]);

  useEffect(() => {
    setMute(isMuteProps ? 1 : 0);
  }, [isMuteProps]);

  const togglePlay = useCallback(() => {
    onPressPlay();
  }, [isPlay]);

  const toggleMute = useCallback(() => {
    onPressMute();
  }, [isMute]);

  const animatePlay = ([value]) => {
    if (refPlayPath.current) {
      const path = pathInterpolate(value);
      refPlayPath.current.setNativeProps({
        d: path,
      });
    }
  };

  useCode(() => {
    return block([
      set(
        animatedPlayValue,
        timing({
          from: animatedPlayValue,
          to: isPlay,
          duration: 300,
          easing: Easing.quad,
        }),
      ),
    ]);
  }, [isPlay]);

  useCode(() => {
    return block([call([animatedPlayValue], animatePlay)]);
  }, []);

  const renderPlay = () => {
    return (
      <PlayPauseButton
        refPath={refPlayPath}
        path={PLAY_SVG_PATH}
        onPress={togglePlay}
      />
    );
  };

  const renderTracker = () => {
    return (
      <Tracker
        currentTime={currentTime}
        totalTime={totalTime}
        isMute={!!isMute}
        onPressMute={toggleMute}
        onProgress={onProgress}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>{renderPlay()}</View>
      <View style={styles.footer}>{renderTracker()}</View>
    </View>
  );
};

export default React.memo(Controls);
