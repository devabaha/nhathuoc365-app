import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
  cond,
  Easing,
  eq,
  set,
  useCode,
  useValue,
} from 'react-native-reanimated';

import appConfig from 'app-config';
import {timing, useTapGestureHandler} from 'react-native-redash';

import PlayPauseButton from './PlayPauseButton';
import Tracker from './Tracker';
import {timingFunction} from './helper';
import {State, TapGestureHandler} from 'react-native-gesture-handler';

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
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
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
  bufferTime,
  isFullscreen,
  containerStyle = {},
  onPressPlay = () => {},
  onPressMute = () => {},
  onPressFullScreen = () => {},
  onChangingProgress = (progress: number) => {},
  onProgress = (progress: number) => {},
}) => {
  const refPlayPath = useRef<any>();
  const timeoutHideControls = useRef<any>(() => {});

  const [isControlsVisible, setControlsVisible] = useState(1);
  const [isPlay, setPlay] = useState(isPlayProps ? 1 : 0);
  const [isMute, setMute] = useState(isMuteProps ? 1 : 0);
  const [isChangingProgress, setChangingProgress] = useState(0);

  const animatedPlayValue = useValue(isPlay);
  const animatedVisibleControls = useValue(isChangingProgress);

  const {gestureHandler, state} = useTapGestureHandler();

  useEffect(() => {
    setPlay(isPlayProps ? 1 : 0);
  }, [isPlayProps]);

  useEffect(() => {
    setMute(isMuteProps ? 1 : 0);
  }, [isMuteProps]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutHideControls.current);
    };
  }, []);

  useEffect(() => {
    if (isControlsVisible) {
      hideControls();
    }

    () => {
      clearTimeout(timeoutHideControls.current);
    };
  }, [isControlsVisible]);

  const hideControls = useCallback(() => {
    clearTimeout(timeoutHideControls.current);
    timeoutHideControls.current = setTimeout(() => {
      setControlsVisible(0);
    }, 3000);
  }, []);

  const togglePlay = useCallback(() => {
    hideControls();
    onPressPlay();
  }, [isPlay]);

  const toggleMute = useCallback(() => {
    hideControls();
    onPressMute();
  }, [isMute]);

  const handleChangingProgress = useCallback(
    (progress) => {
      clearTimeout(timeoutHideControls.current);
      onChangingProgress(progress);
      if (!isChangingProgress) {
        setChangingProgress(1);
      }
    },
    [isChangingProgress],
  );

  const handleProgressEnd = useCallback((progress) => {
    onProgress(progress);
    setChangingProgress(0);
    hideControls();
  }, []);

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

  useCode(() => {
    return [
      cond(eq(state, State.BEGAN), []),
      cond(eq(state, State.END), [
        set(state, State.UNDETERMINED),
        call([], () => {
          clearTimeout(timeoutHideControls.current);
          setControlsVisible(isControlsVisible ? 0 : 1);
        }),
      ]),
    ];
  }, [isControlsVisible]);

  useCode(() => {
    return block([
      set(
        animatedVisibleControls,
        timingFunction(
          animatedVisibleControls,
          cond(
            eq(isChangingProgress, 0),
            isControlsVisible,
            isChangingProgress ? 0 : 1,
          ),
        ),
      ),
    ]);
  }, [isChangingProgress, isControlsVisible]);

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
        bufferTime={bufferTime}
        isMute={!!isMute}
        actionsContainerPointerEvents={isControlsVisible ? 'auto' : 'none'}
        actionsContainerStyle={animatedVisibleControlsStyle}
        onPressMute={toggleMute}
        onPressFullscreen={onPressFullScreen}
        onChangingProgress={handleChangingProgress}
        onProgress={handleProgressEnd}
      />
    );
  };

  const animatedVisibleControlsStyle = useMemo(() => {
    return {
      opacity: animatedVisibleControls,
    };
  }, []);

  const extraFooterStyle = useMemo(() => {
    return {
      bottom: isFullscreen ? 30 : 0,
    };
  }, [isFullscreen]);

  return (
    <View style={[styles.container, containerStyle]}>
      <TapGestureHandler {...gestureHandler}>
        <Animated.View style={styles.container}>
          <Animated.View
            pointerEvents={isControlsVisible ? 'auto' : 'none'}
            style={[styles.body, animatedVisibleControlsStyle]}>
            <View style={styles.mask} />
            {renderPlay()}
          </Animated.View>
          <View style={[styles.footer, extraFooterStyle]}>{renderTracker()}</View>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

export default React.memo(Controls);
