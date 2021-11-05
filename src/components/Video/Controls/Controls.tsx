import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {interpolateAll, combine, splitPathString, separate} from 'flubber';
import extractBrush from 'react-native-svg/src/lib/extract/extractBrush';
import extractStroke from 'react-native-svg/src/lib/extract/extractStroke';

import Animated, {
  Easing,
  block,
  call,
  cond,
  eq,
  set,
  useCode,
  useValue,
  lessOrEq,
} from 'react-native-reanimated';

import appConfig from 'app-config';

import PlayPauseButton from './PlayPauseButton';
import Tracker from './Tracker';
import {timingFunction} from './helper';
import {
  State,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import TimeSkipper from './TimeSkipper';
import {themes} from './themes';

const PLAY_SVG_PATH =
  'M 133 440 a 35.37 35.37 0 0 1 -17.5 -4.67 c -12 -6.8 -19.46 -20 -19.46 -34.33 V 111 c 0 -14.37 7.46 -27.53 19.46 -34.33 a 35.13 35.13 0 0 1 35.77 0.45 l 247.85 148.36 a 36 36 0 0 1 0 61 l -247.89 148.4 A 35.5 35.5 0 0 1 133 440 Z';
const PAUSE_SVG_PATH =
  'M 208 432 h -48 a 16 16 0 0 1 -16 -16 V 96 a 16 16 0 0 1 16 -16 h 48 a 16 16 0 0 1 16 16 v 320 a 16 16 0 0 1 -16 16 Z M 352 432 h -48 a 16 16 0 0 1 -16 -16 V 96 a 16 16 0 0 1 16 -16 h 48 a 16 16 0 0 1 16 16 v 320 a 16 16 0 0 1 -16 16 Z';
const REPLAY_SVG_PATH =
  'M 320 146 s 24.36 -12 -64 -12 a 160 160 0 1 0 160 160 M 256 58 l 80 80 l -80 80';

const pathInterpolatePlayToPause = separate(
  PLAY_SVG_PATH,
  splitPathString(PAUSE_SVG_PATH),
  {
    single: true,
  },
);

const pathInterpolateReplayToPlay = combine(
  splitPathString(REPLAY_SVG_PATH),
  PLAY_SVG_PATH,
  {
    single: true,
  },
);

const pathInterpolateReplayToPause = interpolateAll(
  splitPathString(PAUSE_SVG_PATH),
  splitPathString(REPLAY_SVG_PATH),
  {
    single: true,
  },
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: appConfig.colors.overlay,
  },
  contentContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  playContainer: {
    position: 'absolute',
  },
  icon: {
    color: themes.colors.primary,
    fontSize: 24,
  },
  playIcon: {
    fontSize: 48,
  },

  footer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});

const Controls = ({
  isPlay: isPlayProps,
  isMute: isMuteProps,
  isEnd: isEndProps,
  currentTime,
  totalTime,
  bufferTime,
  isFullscreen = false,
  containerStyle = {},
  onPressPlay = () => {},
  onPressMute = () => {},
  onPressFullScreen = () => {},
  onSkippingTime = (seconds: number) => {},
  onChangingProgress = (progress: number) => {},
  onChangedProgress = (progress: number) => {},
}) => {
  const refPlayPath = useRef<any>();
  const refLeftSkipperSingleTap = useRef<any>();
  const refRightSkipperSingleTap = useRef<any>();
  const refLeftSkipperDoubleTap = useRef<any>();
  const refRightSkipperDoubleTap = useRef<any>();

  const timeoutHideControls = useRef<any>(() => {});

  const [isControlsVisible, setControlsVisible] = useState(1);
  const [isPlay, setPlay] = useState(isPlayProps ? 1 : 0);
  const [isEnd, setEnd] = useState(isEndProps ? 1 : 0);
  const [isMute, setMute] = useState(isMuteProps ? 1 : 0);
  const [isChangingProgress, setChangingProgress] = useState(0);
  const [isSkippingTime, setSkippingTime] = useState(0);

  const animatedPlayValue = useValue(isPlay);
  const animatedVisibleControls = useValue(isChangingProgress);
  const animatedVisibleProgressBar = useValue(isChangingProgress);
  const animatedVisibleMask = useValue(isChangingProgress);

  const state = useValue<number>(State.UNDETERMINED);

  useEffect(() => {
    if (isPlayProps !== !!isPlay) {
      setPlay(isPlayProps ? 1 : 0);
    }
  }, [isPlayProps]);

  useEffect(() => {
    // if (!isEndProps && !!isEnd) {
    //   animatedPlayValue.setValue(-1);
    // }
    if (isEndProps !== !!isEnd) {
      Animated.timing(animatedPlayValue, {
        toValue: isEndProps ? 2 : 1,
        duration: 200,
        easing: Easing.quad,
      }).start();
      setEnd(isEndProps ? 1 : 0);
    }
  }, [isEndProps]);

  useEffect(() => {
    setMute(isMuteProps ? 1 : 0);
  }, [isMuteProps]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutHideControls.current);
    };
  }, []);

  useEffect(() => {
    if (isControlsVisible && !!isPlay) {
      hideControls();
    } else {
      clearTimeout(timeoutHideControls.current);
    }

    () => {
      clearTimeout(timeoutHideControls.current);
    };
  }, [isControlsVisible, isPlay]);

  const hideControls = useCallback(() => {
    clearTimeout(timeoutHideControls.current);
    timeoutHideControls.current = setTimeout(() => {
      setControlsVisible(0);
    }, 3000);
  }, [isFullscreen]);

  const togglePlay = useCallback(() => {
    if (!isPlay) {
      hideControls();
    }
    onPressPlay();
  }, [isPlay]);

  const toggleMute = useCallback(() => {
    if (!!isPlay) {
      hideControls();
    }
    onPressMute();
  }, [isMute, isPlay]);

  const handleRefLeftSkipperSingleTap = useCallback((ref) => {
    refLeftSkipperSingleTap.current = ref.current;
  }, []);

  const handleRefRightSkipperSingleTap = useCallback((ref) => {
    refRightSkipperSingleTap.current = ref.current;
  }, []);

  const handleRefLeftSkipperDoubleTap = useCallback((ref) => {
    refLeftSkipperDoubleTap.current = ref.current;
  }, []);

  const handleRefRightSkipperDoubleTap = useCallback((ref) => {
    refRightSkipperDoubleTap.current = ref.current;
  }, []);

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

  const handleChangedProgress = useCallback((progress) => {
    onChangedProgress(progress);
    setChangingProgress(0);
    hideControls();
  }, []);

  const handleTapStateChange = useCallback(
    (event: TapGestureHandlerGestureEvent) => {
      state.setValue(event.nativeEvent.state);
    },
    [],
  );

  const handleSkippingTime = useCallback(
    (skipTime) => {
      onSkippingTime(skipTime);
      !isSkippingTime && setSkippingTime(1);
    },
    [isSkippingTime],
  );

  const handleSkippedTime = useCallback(() => {
    isSkippingTime && setSkippingTime(0);
  }, [isSkippingTime]);

  const animatePlay = useCallback(([playValue]) => {
    if (refPlayPath.current) {
      const path =
        playValue > 1
          ? pathInterpolateReplayToPause(playValue - 1)
          : playValue < 0
          ? pathInterpolateReplayToPlay(playValue + 1)
          : pathInterpolatePlayToPause(playValue);

      const stroke = {};
      extractStroke(
        stroke,
        {
          strokeWidth: playValue > 1 || playValue < 0 ? 32 : 0,
        },
        [],
      );

      refPlayPath.current.setNativeProps({
        d: path,
        fill: extractBrush(
          playValue > 1
            ? //@ts-ignore
              hexToRgbA(themes.colors.primary, 0)
            : //@ts-ignore
              hexToRgbA(themes.colors.primary, 1),
        ),
        ...stroke,
      });
    }
  }, []);

  useCode(() => {
    return block([
      cond(
        lessOrEq(animatedPlayValue, 1),
        set(animatedPlayValue, timingFunction(animatedPlayValue, isPlay)),
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
        call([], ([]) => {
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
      set(
        animatedVisibleProgressBar,
        timingFunction(
          animatedVisibleProgressBar,
          cond(
            eq(isChangingProgress, 0),
            isControlsVisible,
            isFullscreen ? 1 : isChangingProgress ? 0 : 1,
          ),
        ),
      ),
      set(
        animatedVisibleMask,
        timingFunction(
          animatedVisibleMask,
          cond(eq(isChangingProgress, 0), isControlsVisible, 1),
        ),
      ),
    ]);
  }, [isChangingProgress, isControlsVisible, isFullscreen]);

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
        isFullscreen={isFullscreen}
        actionsContainerPointerEvents={isControlsVisible ? 'auto' : 'none'}
        actionsContainerStyle={animatedVisibleControlsStyle}
        progressBarStyle={
          isFullscreen && !isChangingProgress && animatedVisibleProgressBarStyle
        }
        animatedVisibleValue={animatedVisibleMask}
        onPressMute={toggleMute}
        onPressFullscreen={onPressFullScreen}
        onChangingProgress={handleChangingProgress}
        onChangedProgress={handleChangedProgress}
      />
    );
  };

  const animatedVisibleControlsStyle = useMemo(() => {
    return {
      opacity: animatedVisibleControls,
    };
  }, []);

  const animatedVisibleProgressBarStyle = useMemo(() => {
    return {
      opacity: animatedVisibleProgressBar,
    };
  }, []);

  const animatedVisibleMaskStyle = useMemo(() => {
    return {
      opacity: animatedVisibleMask,
    };
  }, []);

  const tapGestureWaitFor = useMemo(() => {
    const waitFor = [];
    if (!!currentTime) {
      waitFor.push(refLeftSkipperDoubleTap);
    }
    if (!isEnd) {
      waitFor.push(refRightSkipperDoubleTap);
    }

    return waitFor;
  }, [isEnd, currentTime]);

  return (
    <View style={[styles.container, containerStyle]}>
      <TapGestureHandler
        onHandlerStateChange={handleTapStateChange}
        simultaneousHandlers={[
          refLeftSkipperSingleTap,
          refRightSkipperSingleTap,
        ]}
        waitFor={tapGestureWaitFor}>
        <Animated.View style={styles.contentContainer}>
          <Animated.View style={[styles.mask, animatedVisibleMaskStyle]} />
          <Animated.View
            pointerEvents={isControlsVisible ? 'auto' : 'none'}
            style={[styles.body, animatedVisibleControlsStyle]}
          />

          <TimeSkipper
            getRefLeftSkipperSingleTapGesture={handleRefLeftSkipperSingleTap}
            getRefRightSkipperSingleTapGesture={handleRefRightSkipperSingleTap}
            getRefLeftSkipperDoubleTapGesture={handleRefLeftSkipperDoubleTap}
            getRefRightSkipperDoubleTapGesture={handleRefRightSkipperDoubleTap}
            onSkipping={handleSkippingTime}
            onSkipped={handleSkippedTime}
          />

          <Animated.View
            pointerEvents={isControlsVisible ? 'auto' : 'none'}
            style={[styles.playContainer, animatedVisibleControlsStyle]}>
            {renderPlay()}
          </Animated.View>

          <View
            pointerEvents={
              isFullscreen ? (isControlsVisible ? 'auto' : 'none') : 'auto'
            }
            style={[styles.footer]}>
            {renderTracker()}
          </View>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

export default React.memo(Controls);
