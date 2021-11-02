import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  State,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  call,
  cond,
  eq,
  set,
  useCode,
  sub,
} from 'react-native-reanimated';

import appConfig from 'app-config';
import {timing, useValue} from 'react-native-redash';
import {timingFunction} from '../helper';
import Ripple from './Ripple';
import {themes} from '../themes';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  gestureContainer: {
    position: 'absolute',
    transform: [{scaleY: 1.4}],
    overflow: 'hidden',
  },
  leftGestureContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightGestureContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  ripplesMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themes.colors.background,
  },
});

const TimeSkipper = ({
  amount = 10,
  getRefLeftSkipperSingleTapGesture = (ref: any) => {},
  getRefRightSkipperSingleTapGesture = (ref: any) => {},
  getRefLeftSkipperDoubleTapGesture = (ref: any) => {},
  getRefRightSkipperDoubleTapGesture = (ref: any) => {},
  onSkipping = (seconds: number) => {},
  onSkipped = () => {},
}) => {
  const refLeftSkipperSingleTap = useRef<any>();
  const refRightSkipperSingleTap = useRef<any>();
  const refLeftSkipperDoubleTap = useRef<any>();
  const refRightSkipperDoubleTap = useRef<any>();

  const totalFinishedLeftRipples = useRef<number>(0);
  const totalFinishedRightRipples = useRef<number>(0);

  const isLeftDoubleTapping = useRef<boolean>(false);
  const isRightDoubleTapping = useRef<boolean>(false);

  const timeoutLeftDoubleTapping = useRef<any>();
  const timeoutRightDoubleTapping = useRef<any>();

  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [mainAxisSize, setMainAxisSize] = useState(0);
  const [gestureAreaSize, setGestureAreaSize] = useState(0);

  const [leftRipples, setLeftRipples] = useState([]);
  const [rightRipples, setRightRipples] = useState([]);

  const [
    totalNumberOfTimesLeftSkipped,
    setTotalNumberOfTimesLeftSkipped,
  ] = useState(0);
  const [
    totalNumberOfTimesRightSkipped,
    setTotalNumberOfTimesRightSkipped,
  ] = useState(0);

  const animatedLeftDoubleTapValue = useValue<number>(0);
  const animatedRightDoubleTapValue = useValue<number>(0);

  const stateLeftDoubleTap = useValue<number>(State.UNDETERMINED);
  const stateRightDoubleTap = useValue<number>(State.UNDETERMINED);

  useEffect(() => {
    getRefLeftSkipperSingleTapGesture(refLeftSkipperSingleTap);
    getRefRightSkipperSingleTapGesture(refRightSkipperSingleTap);
    getRefLeftSkipperDoubleTapGesture(refLeftSkipperDoubleTap);
    getRefRightSkipperDoubleTapGesture(refRightSkipperDoubleTap);
  }, []);

  useEffect(() => {
    setMainAxisSize(
      containerWidth > containerHeight ? containerWidth : containerHeight,
    );
  }, [containerWidth, containerHeight]);

  useEffect(() => {
    setGestureAreaSize(mainAxisSize * 0.8);
  }, [mainAxisSize]);

  const handleLeftSingleTap = useCallback(
    (event: TapGestureHandlerGestureEvent) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        // console.log('single tap left');
      }
    },
    [],
  );

  const handleRightSingleTap = useCallback(
    (event: TapGestureHandlerGestureEvent) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        // console.log('single tap right');
      }
    },
    [],
  );

  const formatRippleData = useCallback(
    (x, y) => {
      return {
        id: new Date().getTime(),
        x,
        y,
        size: gestureAreaSize / 3,
        scale: 7,
      };
    },
    [gestureAreaSize],
  );

  const handleLeftDoubleTap = useCallback(
    (event: TapGestureHandlerGestureEvent) => {
      stateLeftDoubleTap.setValue(event.nativeEvent.state);

      if (
        event.nativeEvent.state === State.ACTIVE &&
        !isRightDoubleTapping.current
      ) {
        setTotalNumberOfTimesLeftSkipped(totalNumberOfTimesLeftSkipped + 1);
        onSkipping(-amount);

        isLeftDoubleTapping.current = true;
        // console.log('left double tap');
        const cloneRipples = [...leftRipples];
        cloneRipples.push(
          formatRippleData(event.nativeEvent.x, event.nativeEvent.y),
        );
        setLeftRipples(cloneRipples);

        Animated.timing(animatedLeftDoubleTapValue, {
          toValue: 1,
          duration: 200,
          easing: Easing.quad,
        }).start(({finished}) => {
          if (finished) {
            Animated.timing(animatedLeftDoubleTapValue, {
              toValue: 0,
              duration: 500,
              easing: Easing.quad,
            }).start();
          }
        });
      }

      if (event.nativeEvent.state === State.END) {
        clearTimeout(timeoutLeftDoubleTapping.current);
        timeoutLeftDoubleTapping.current = setTimeout(() => {
          if (isLeftDoubleTapping.current) {
            setTotalNumberOfTimesLeftSkipped(0);
            isLeftDoubleTapping.current = false;
            onSkipped();
          }
        }, 300);
      }
    },
    [leftRipples, gestureAreaSize, amount, totalNumberOfTimesLeftSkipped],
  );

  const handleRightDoubleTap = useCallback(
    (event: TapGestureHandlerGestureEvent) => {
      stateRightDoubleTap.setValue(event.nativeEvent.state);
      if (
        event.nativeEvent.state === State.ACTIVE &&
        !isLeftDoubleTapping.current
      ) {
        setTotalNumberOfTimesRightSkipped(totalNumberOfTimesRightSkipped + 1);
        onSkipping(amount);

        isRightDoubleTapping.current = true;
        // console.log('right double tap');
        const cloneRipples = [...rightRipples];
        cloneRipples.push(
          formatRippleData(event.nativeEvent.x, event.nativeEvent.y),
        );
        setRightRipples(cloneRipples);

        Animated.timing(animatedRightDoubleTapValue, {
          toValue: 1,
          duration: 200,
          easing: Easing.quad,
        }).start(({finished}) => {
          if (finished) {
            Animated.timing(animatedRightDoubleTapValue, {
              toValue: 0,
              duration: 500,
              easing: Easing.quad,
            }).start();
          }
        });
      }

      if (event.nativeEvent.state === State.END) {
        clearTimeout(timeoutRightDoubleTapping.current);
        timeoutRightDoubleTapping.current = setTimeout(() => {
          if (isRightDoubleTapping.current) {
            setTotalNumberOfTimesRightSkipped(0);
            isRightDoubleTapping.current = false;
            onSkipped();
          }
        }, 300);
      }
    },
    [rightRipples, gestureAreaSize, amount, totalNumberOfTimesRightSkipped],
  );

  const handleContainerLayout = useCallback((e) => {
    setContainerWidth(e.nativeEvent.layout.width);
    setContainerHeight(e.nativeEvent.layout.height);
  }, []);

  const onLeftRippleFinishAnimation = useCallback(
    (rippleId) => {
      totalFinishedLeftRipples.current++;
      if (totalFinishedLeftRipples.current === leftRipples.length) {
        setLeftRipples([]);
      }
    },
    [leftRipples],
  );

  const onRightRippleFinishAnimation = useCallback(
    (rippleId) => {
      totalFinishedRightRipples.current++;
      if (totalFinishedRightRipples.current === rightRipples.length) {
        setRightRipples([]);
      }
    },
    [rightRipples],
  );

  const renderRipple = (ripple, index, direction) => {
    let iconName = 'caretright';
    let onFinishAnimationFunction = onRightRippleFinishAnimation;
    let timeSkipped = amount;
    switch (direction) {
      case 'ltr':
        iconName = 'caretleft';
        onFinishAnimationFunction = onLeftRippleFinishAnimation;
        timeSkipped *= totalNumberOfTimesLeftSkipped;
        break;
      case 'rtl':
        iconName = 'caretright';
        onFinishAnimationFunction = onRightRippleFinishAnimation;
        timeSkipped *= totalNumberOfTimesRightSkipped;
        break;
    }
    return (
      <Ripple
        key={index}
        id={ripple.id}
        x={ripple.x}
        y={ripple.y}
        size={ripple.size}
        scale={ripple.scale}
        iconName={iconName}
        direction={direction}
        onFinishAnimation={onFinishAnimationFunction}
        renderDescription={(animatedShowRippleValue) => (
          <Animated.Text
            style={{
              color: themes.colors.primary,
              fontWeight: '500',
              marginTop: 5,
              fontSize: Math.max(Math.min(gestureAreaSize / 30, 13), 10),

              opacity: animatedShowRippleValue.interpolate({
                inputRange: [0, 0.2, 0.8, 1],
                outputRange: [0, 1, 1, 0],
              }),
            }}>
            {timeSkipped} giây
          </Animated.Text>
        )}
      />
    );
  };

  const gestureContainerStyle = useMemo(() => {
    return [
      styles.gestureContainer,
      {
        width: gestureAreaSize,
        height: gestureAreaSize,
        borderRadius: gestureAreaSize / 2,
      },
    ];
  }, [gestureAreaSize]);

  const gestureLeftContainerStyle = useMemo(() => {
    return {
      left: -gestureAreaSize / 2,
    };
  }, [gestureAreaSize]);

  const gestureRightContainerStyle = useMemo(() => {
    return {
      right: -gestureAreaSize / 2,
    };
  }, [gestureAreaSize]);

  const ripplesLeftMaskStyle = useMemo(() => {
    return [
      styles.ripplesMask,
      {
        opacity: animatedLeftDoubleTapValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.1],
        }),
      },
    ];
  }, []);

  const ripplesRightMaskStyle = useMemo(() => {
    return [
      styles.ripplesMask,
      {
        opacity: animatedRightDoubleTapValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.05],
        }),
      },
    ];
  }, []);

  return (
    <Animated.View onLayout={handleContainerLayout} style={styles.container}>
      <Animated.View style={[gestureContainerStyle, gestureLeftContainerStyle]}>
        <TapGestureHandler
          ref={refLeftSkipperSingleTap}
          onHandlerStateChange={handleLeftSingleTap}
          waitFor={refLeftSkipperDoubleTap}>
          <TapGestureHandler
            ref={refLeftSkipperDoubleTap}
            onHandlerStateChange={handleLeftDoubleTap}
            numberOfTaps={2}>
            <Animated.View style={styles.leftGestureContainer}>
              <Animated.View style={ripplesLeftMaskStyle} />
              {leftRipples.map((ripple, index) => {
                return renderRipple(ripple, index, 'ltr');
              })}
            </Animated.View>
          </TapGestureHandler>
        </TapGestureHandler>
      </Animated.View>

      <View style={[gestureContainerStyle, gestureRightContainerStyle]}>
        <TapGestureHandler
          ref={refRightSkipperSingleTap}
          onHandlerStateChange={handleRightSingleTap}
          waitFor={refRightSkipperDoubleTap}>
          <TapGestureHandler
            ref={refRightSkipperDoubleTap}
            onHandlerStateChange={handleRightDoubleTap}
            numberOfTaps={2}>
            <Animated.View style={styles.rightGestureContainer}>
              <Animated.View style={ripplesRightMaskStyle} />
              {rightRipples.map((ripple, index) => {
                return renderRipple(ripple, index, 'rtl');
              })}
            </Animated.View>
          </TapGestureHandler>
        </TapGestureHandler>
      </View>
    </Animated.View>
  );
};

export default React.memo(TimeSkipper);
