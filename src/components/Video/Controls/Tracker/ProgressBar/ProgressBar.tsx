import React, {useState, useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  PanGestureHandler,
  State,
  LongPressGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  abs,
  add,
  and,
  call,
  cond,
  divide,
  eq,
  Extrapolate,
  floor,
  greaterOrEq,
  greaterThan,
  lessOrEq,
  lessThan,
  multiply,
  neq,
  or,
  set,
  sub,
  useCode,
} from 'react-native-reanimated';
import {
  usePanGestureHandler,
  useTapGestureHandler,
  useValue,
} from 'react-native-redash';

import appConfig from 'app-config';
import {themes} from '../../themes';
import Timer from '../Timer';
import {timingFunction} from '../../helper';

const THUMB_SIZE = 15;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 50,
  },
  container: {
    width: '100%',
    height: 3,
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themes.colors.primary,
    opacity: 0.4,
  },
  tracker: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  foreground: {
    position: 'absolute',
    opacity: 0.4,
    height: '100%',
    backgroundColor: appConfig.colors.sceneBackground,
  },
  background: {
    height: '100%',
    backgroundColor: appConfig.colors.primary,
  },
  thumbContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    left: -THUMB_SIZE / 2,
    backgroundColor: appConfig.colors.primary,
  },
  timerContainer: {
    position: 'absolute',
    top: -40,
  },
});

const ProgressBar = ({
  progress = 0,
  bufferProgress = 0,
  popovers = [],
  onChangingProgress = (progress: number) => {},
  onProgress = (progress: number) => {},
}) => {
  const refPanGesture = useRef<any>();
  const refLongPressGesture = useRef<any>();

  const isStartChangeProgressManually = useValue(0);
  const isChangingProgressManually = useValue(0);

  const diffProgress = useValue(0);
  const currentProgress = useValue(0);

  const tempPositionX = useValue(0);
  const oldPositionX = useValue(0);
  const positionX = useValue(0);

  const animatedThumbValue = useValue(0);

  const {gestureHandler, state, translation} = usePanGestureHandler();
  const {
    gestureHandler: tapGestureHandler,
    state: tapState,
  } = useTapGestureHandler();

  const [currentPopover, setCurrentPopover] = useState(undefined);

  const handleChangeProgress = useCallback(
    (position) => {
      const popover = popovers.find(
        (popover) => position >= popover.start && position <= popover.end,
      );
      if (popover) {
        setCurrentPopover(popover);
      }
    },
    [popovers],
  );

  const handleEndChangeProgress = useCallback(() => {
    setCurrentPopover(undefined);
  }, []);

  useCode(() => {
    return [
      cond(eq(state, State.ACTIVE), [
        call([positionX], ([value]) => handleChangeProgress(value)),
      ]),
    ];
  }, [popovers]);

  useCode(() => {
    return [
      cond(eq(state, State.BEGAN), [
        // call([state, tapState], ([x, y]) => console.log('start', x, y)),

        set(isChangingProgressManually, 1),
        set(isStartChangeProgressManually, 1),
        set(oldPositionX, positionX),
        set(tempPositionX, 0),
      ]),
      cond(eq(state, State.ACTIVE), [
        // call([state, tapState], ([x, y]) => console.log('active', x, y)),

        set(isChangingProgressManually, 1),
        set(tempPositionX, add(oldPositionX, translation.x)),
        set(
          positionX,
          cond(
            greaterThan(tempPositionX, appConfig.device.width),
            appConfig.device.width,
            cond(lessThan(tempPositionX, 0), 0, tempPositionX),
          ),
        ),
        call([positionX], ([value]) =>
          onChangingProgress(value / appConfig.device.width),
        ),
      ]),
      cond(eq(state, State.END), [
        // call([state, tapState], ([x, y]) => console.log('end', x, y)),

        call([], handleEndChangeProgress),
        cond(eq(isStartChangeProgressManually, 1), [
          set(isStartChangeProgressManually, 0),
          set(currentProgress, progress || 0),
          call([positionX], ([value]) =>
            onProgress(value / appConfig.device.width),
          ),
        ]),
      ]),

      cond(
        or(eq(state, State.ACTIVE), eq(tapState, State.ACTIVE)),
        [
          cond(
            neq(animatedThumbValue, 1),
            set(animatedThumbValue, timingFunction(animatedThumbValue, 1)),
          ),
        ],
        cond(
          neq(animatedThumbValue, 0),
          set(animatedThumbValue, timingFunction(animatedThumbValue, 0)),
        ),
      ),
    ];
  }, []);

  useCode(
    () => [
      cond(
        eq(isChangingProgressManually, 0),
        [set(positionX, (progress || 0) * appConfig.device.width)],
        [
          set(
            diffProgress,
            multiply(
              abs(sub(positionX, (progress || 0) * appConfig.device.width)),
              1,
            ),
          ),

          cond(and(lessThan(diffProgress, 0.1), greaterThan(diffProgress, 0)), [
            set(isChangingProgressManually, 0),
          ]),
        ],
      ),
    ],
    [progress],
  );

  const animatedThumbStyle = useMemo(() => {
    return {
      transform: [{scale: animatedThumbValue}],
    };
  }, []);

  return (
    <View
      onStartShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onStartShouldSetResponderCapture={() => false}
      onMoveShouldSetResponderCapture={() => false}>
      <LongPressGestureHandler
        ref={refLongPressGesture}
        simultaneousHandlers={refPanGesture}
        {...tapGestureHandler}
        minDurationMs={200}>
        <Animated.View>
          <PanGestureHandler ref={refPanGesture} {...gestureHandler}>
            <Animated.View style={styles.wrapper}>
              <Animated.View style={styles.container}>
                <View style={styles.mask} />
                <Animated.View
                  style={[
                    styles.foreground,
                    {
                      width: bufferProgress * appConfig.device.width,
                    },
                  ]}
                />

                <View style={styles.tracker}>
                  <Animated.View
                    style={[
                      styles.background,
                      {
                        width: positionX,
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.thumbContainer,
                      {
                        transform: [{translateX: positionX}],
                      },
                    ]}>
                    {!!currentPopover && (
                      <Timer
                        current={currentPopover?.value}
                        containerStyle={styles.timerContainer}
                      />
                    )}
                    <Animated.View style={[styles.thumb, animatedThumbStyle]} />
                  </Animated.View>
                </View>
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </LongPressGestureHandler>
    </View>
  );
};

export default React.memo(ProgressBar);
