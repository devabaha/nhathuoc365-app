import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';

import {useValue} from 'react-native-redash';
import {
  State,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {Easing} from 'react-native-reanimated';

import {themes} from '../themes';

import Ripple from './Ripple';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // overflow: 'hidden',
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
  getRefSkipperSingleLeftTapGesture = (ref: any) => {},
  getRefSkipperSingleRightTapGesture = (ref: any) => {},
  getRefSkipperDoubleLeftTapGesture = (ref: any) => {},
  getRefSkipperDoubleRightTapGesture = (ref: any) => {},
  onSkipping = (seconds: number) => {},
  onSkipped = () => {},
  onSingleLeftTap = (state: TapGestureHandlerGestureEvent) => {},
  onSingleRightTap = (state: TapGestureHandlerGestureEvent) => {},
}) => {
  const refSkipperSingleLeftTap = useRef<any>();
  const refSkipperSingleRightTap = useRef<any>();
  const refSkipperDoubleLeftTap = useRef<any>();
  const refSkipperDoubleRightTap = useRef<any>();

  const totalFinishedLeftRipples = useRef<number>(0);
  const totalFinishedRightRipples = useRef<number>(0);

  const isDoubleLeftTapping = useRef<boolean>(false);
  const isDoubleRightTapping = useRef<boolean>(false);

  const timeoutDoubleLeftTapping = useRef<any>();
  const timeoutDoubleRightTapping = useRef<any>();

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

  const animatedDoubleLeftTapValue = useValue<number>(0);
  const animatedDoubleRightTapValue = useValue<number>(0);

  const stateDoubleLeftTap = useValue<number>(State.UNDETERMINED);
  const stateDoubleRightTap = useValue<number>(State.UNDETERMINED);

  useEffect(() => {
    getRefSkipperSingleLeftTapGesture(refSkipperSingleLeftTap);
    getRefSkipperSingleRightTapGesture(refSkipperSingleRightTap);
    getRefSkipperDoubleLeftTapGesture(refSkipperDoubleLeftTap);
    getRefSkipperDoubleRightTapGesture(refSkipperDoubleRightTap);
  }, []);

  useEffect(() => {
    setMainAxisSize(
      containerWidth > containerHeight ? containerWidth : containerHeight,
    );
  }, [containerWidth, containerHeight]);

  useEffect(() => {
    setGestureAreaSize(mainAxisSize * 0.8);
  }, [mainAxisSize]);

  const handleSingleLeftTap = useCallback(
    (event: TapGestureHandlerGestureEvent) => {
      onSingleLeftTap(event);
      if (event.nativeEvent.state === State.ACTIVE) {
      console.log('single tap left');
      }
    },
    [],
  );

  const handleSingleRightTap = useCallback(
    (event: TapGestureHandlerGestureEvent) => {
      onSingleRightTap(event);
      if (event.nativeEvent.state === State.ACTIVE) {
      console.log('single tap right');
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

  const handleDoubleLeftTap = useCallback(
    (event: TapGestureHandlerGestureEvent) => {
      stateDoubleLeftTap.setValue(event.nativeEvent.state);

      if (
        event.nativeEvent.state === State.ACTIVE &&
        !isDoubleRightTapping.current
      ) {
        setTotalNumberOfTimesLeftSkipped(totalNumberOfTimesLeftSkipped + 1);
        onSkipping(-amount);

        isDoubleLeftTapping.current = true;
        console.log('left double tap');
        const cloneRipples = [...leftRipples];
        cloneRipples.push(
          formatRippleData(event.nativeEvent.x, event.nativeEvent.y),
        );
        setLeftRipples(cloneRipples);

        Animated.timing(animatedDoubleLeftTapValue, {
          toValue: 1,
          duration: 200,
          easing: Easing.quad,
        }).start(({finished}) => {
          if (finished) {
            Animated.timing(animatedDoubleLeftTapValue, {
              toValue: 0,
              duration: 500,
              easing: Easing.quad,
            }).start();
          }
        });
      }

      if (event.nativeEvent.state === State.END) {
        clearTimeout(timeoutDoubleLeftTapping.current);
        timeoutDoubleLeftTapping.current = setTimeout(() => {
          if (isDoubleLeftTapping.current) {
            setTotalNumberOfTimesLeftSkipped(0);
            isDoubleLeftTapping.current = false;
            onSkipped();
          }
        }, 300);
      }
    },
    [leftRipples, gestureAreaSize, amount, totalNumberOfTimesLeftSkipped],
  );

  const handleDoubleRightTap = useCallback(
    (event: TapGestureHandlerGestureEvent) => {
      stateDoubleRightTap.setValue(event.nativeEvent.state);
      if (
        event.nativeEvent.state === State.ACTIVE &&
        !isDoubleLeftTapping.current
      ) {
        setTotalNumberOfTimesRightSkipped(totalNumberOfTimesRightSkipped + 1);
        onSkipping(amount);

        isDoubleRightTapping.current = true;
        console.log('right double tap');
        const cloneRipples = [...rightRipples];
        cloneRipples.push(
          formatRippleData(event.nativeEvent.x, event.nativeEvent.y),
        );
        setRightRipples(cloneRipples);

        Animated.timing(animatedDoubleRightTapValue, {
          toValue: 1,
          duration: 200,
          easing: Easing.quad,
        }).start(({finished}) => {
          if (finished) {
            Animated.timing(animatedDoubleRightTapValue, {
              toValue: 0,
              duration: 500,
              easing: Easing.quad,
            }).start();
          }
        });
      }

      if (event.nativeEvent.state === State.END) {
        clearTimeout(timeoutDoubleRightTapping.current);
        timeoutDoubleRightTapping.current = setTimeout(() => {
          if (isDoubleRightTapping.current) {
            setTotalNumberOfTimesRightSkipped(0);
            isDoubleRightTapping.current = false;
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

  const leftGestureContainerStyle = useMemo(() => {
    return {
      left: -gestureAreaSize / 2,
    };
  }, [gestureAreaSize]);

  const rightGestureContainerStyle = useMemo(() => {
    return {
      right: -gestureAreaSize / 2,
    };
  }, [gestureAreaSize]);

  const leftRipplesMaskStyle = useMemo(() => {
    return [
      styles.ripplesMask,
      {
        opacity: animatedDoubleLeftTapValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.1],
        }),
      },
    ];
  }, []);

  const rightRipplesMaskStyle = useMemo(() => {
    return [
      styles.ripplesMask,
      {
        opacity: animatedDoubleRightTapValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.05],
        }),
      },
    ];
  }, []);

  return (
    <Animated.View onLayout={handleContainerLayout} style={styles.container}>
      <Animated.View style={[gestureContainerStyle, leftGestureContainerStyle]}>
        {/* <TapGestureHandler
          ref={refSkipperSingleLeftTap}
          onHandlerStateChange={handleSingleLeftTap}
          waitFor={refSkipperDoubleLeftTap}>
          <Animated.View style={{flex: 1}}> */}
            <TapGestureHandler
              ref={refSkipperDoubleLeftTap}
              onHandlerStateChange={handleDoubleLeftTap}
              numberOfTaps={2}>
              <Animated.View style={styles.leftGestureContainer}>
                <Animated.View style={leftRipplesMaskStyle} />
                {leftRipples.map((ripple, index) => {
                  return renderRipple(ripple, index, 'ltr');
                })}
              </Animated.View>
            </TapGestureHandler>
          {/* </Animated.View>
        </TapGestureHandler> */}
      </Animated.View>

      <Animated.View
        style={[gestureContainerStyle, rightGestureContainerStyle]}>
        {/* <TapGestureHandler
          ref={refSkipperSingleRightTap}
          onHandlerStateChange={handleSingleRightTap}
          waitFor={refSkipperDoubleRightTap}>
          <Animated.View style={{flex: 1}}> */}
            <TapGestureHandler
              ref={refSkipperDoubleRightTap}
              onHandlerStateChange={handleDoubleRightTap}
              numberOfTaps={2}>
              <Animated.View style={styles.rightGestureContainer}>
                <Animated.View style={rightRipplesMaskStyle} />
                {rightRipples.map((ripple, index) => {
                  return renderRipple(ripple, index, 'rtl');
                })}
              </Animated.View>
            </TapGestureHandler>
          {/* </Animated.View>
        </TapGestureHandler> */}
      </Animated.View>
    </Animated.View>
  );
};

export default React.memo(TimeSkipper);
