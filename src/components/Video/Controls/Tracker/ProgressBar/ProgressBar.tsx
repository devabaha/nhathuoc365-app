import React, {useState, useCallback, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';

import {debounce} from 'lodash';
import {
  PanGestureHandler,
  State,
  LongPressGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  abs,
  add,
  and,
  call,
  cond,
  eq,
  greaterThan,
  lessThan,
  max,
  min,
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
import {TRACKER_HEIGHT, THUMB_SIZE, TIMER_PADDING} from '../../constants';
import {themes} from '../../themes';
import {timingFunction} from '../../helper';
import {formatTime} from 'app-helper';

import Timer from '../Timer';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 15,
  },
  wrapperFullscreen: {
    paddingBottom: 30,
  },
  container: {
    width: '100%',
    height: TRACKER_HEIGHT,
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
  trackerFullscreen: {
    borderRadius: TRACKER_HEIGHT / 2,
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
    top: -60,
  },
});

const ProgressBar = ({
  progress = 0,
  total = 1,
  bufferProgress = 0,
  isFullscreen = false,
  thumbStyle = {},
  animatedVisibleValue = new Animated.Value(0),
  onChangingProgress = (progress: number) => {},
  onChangedProgress = (progress: number) => {},
}) => {
  const refPanGesture = useRef<any>();
  const refLongPressGesture = useRef<any>();

  const [containerWidth, setContainerWidth] = useState(1);
  const [containerOffsetX, setContainerOffsetX] = useState(0);
  const [timerWidth, setTimerWidth] = useState(0);

  const isStartChangeProgressManually = useValue<number>(0);
  const isChangingProgressManually = useValue<number>(0);

  const diffProgress = useValue<number>(0);

  const tempPositionX = useValue<number>(0);
  const oldPositionX = useValue<number>(0);
  const positionX = useValue<number>(0);
  const panPositionX = useValue<number>(0);
  const tapState = useValue<number>(State.UNDETERMINED);
  const tapPositionX = useValue<number>(0);

  const animatedThumbValue = useValue<number>(0);

  const {
    gestureHandler,
    state: panState,
    translation,
    position,
  } = usePanGestureHandler();
  const {
    gestureHandler: longPressGestureHandler,
    state: longPressState,
  } = useTapGestureHandler();

  const [currentPopover, setCurrentPopover] = useState(undefined);

  const popovers = useMemo(() => {
    const popoverLength = containerWidth / total;

    const popovers = Array.from({length: total}, (_, index) => ({
      start: index * popoverLength,
      end: popoverLength * (index + 1),
      value: formatTime(index),
    }));

    return popovers || [];
  }, [total, containerWidth]);

  const updateContainerDimensions = useCallback(
    debounce((layout) => {
      panPositionX.setValue(progress * layout.width);
      positionX.setValue(progress * layout.width);
      setContainerWidth(layout.width || 1);
      setContainerOffsetX(layout.x);
    }, 0),
    [],
  );

  const handleContainerLayout = useCallback((e) => {
    updateContainerDimensions(e.nativeEvent.layout);
  }, []);

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

  const handleTimerLayout = useCallback((e) => {
    setTimerWidth(e.nativeEvent.layout.width);
  }, []);

  const handleTapStateChange = useCallback((e) => {
    tapState.setValue(e.nativeEvent.state);
    tapPositionX.setValue(e.nativeEvent.x);
  }, []);

  useCode(() => {
    return [
      cond(
        eq(tapState, State.ACTIVE),
        [
          set(isStartChangeProgressManually, 1),
          set(
            panPositionX,
            cond(
              lessThan(tapPositionX, 0),
              0,
              cond(
                greaterThan(tapPositionX, containerWidth),
                containerWidth,
                tapPositionX,
              ),
            ),
          ),
        ],
      ),

      cond(eq(panState, State.BEGAN), [
        // call([panState, longPressState], ([x, y]) =>
        //   console.log('start', x, y),
        // ),

        set(isChangingProgressManually, 1),
        set(isStartChangeProgressManually, 1),
        set(oldPositionX, positionX),
        set(tempPositionX, 0),
      ]),
      cond(eq(panState, State.ACTIVE), [
        // call([panState, longPressState], ([x, y]) => console.log('active', x, y)),

        set(isChangingProgressManually, 1),
        // set(tempPositionX, add(oldPositionX, translation.x)),
        // set(
        //   positionX,
        //   cond(
        //     greaterThan(tempPositionX, containerWidth),
        //     containerWidth,
        //     cond(lessThan(tempPositionX, 0), 0, tempPositionX),
        //   ),
        // ),
        call([panPositionX], ([value]) =>
          onChangingProgress(value / containerWidth),
        ),
      ]),
      cond(or(eq(panState, State.END), eq(tapState, State.ACTIVE)), [
        // call([panState, longPressState], ([x, y]) => console.log('end', x, y)),

        call([], handleEndChangeProgress),
        cond(eq(isStartChangeProgressManually, 1), [
          set(isStartChangeProgressManually, 0),
          set(positionX, panPositionX),
          call([positionX, tapPositionX], ([value, b]) => {
            onChangedProgress(value / containerWidth);
          }),
        ]),
      ]),

      cond(
        or(eq(panState, State.ACTIVE), eq(longPressState, State.ACTIVE)),
        [
          cond(
            neq(animatedThumbValue, 1),
            set(animatedThumbValue, timingFunction(animatedThumbValue, 1)),
          ),
        ],
        cond(
          neq(animatedThumbValue, cond(eq(isFullscreen ? 1 : 0, 0), 0, 0.6)),
          [
            set(
              animatedThumbValue,
              timingFunction(
                animatedThumbValue,
                cond(eq(isFullscreen ? 1 : 0, 0), 0, 0.6),
              ),
            ),
          ],
        ),
      ),
    ];
  }, [containerWidth, isFullscreen]);

  useCode(() => {
    return [
      set(
        panPositionX,
        cond(
          lessThan(position.x, 0),
          [0],
          cond(
            greaterThan(position.x, containerWidth),
            [containerWidth],
            cond(
              or(eq(tapState, State.ACTIVE), eq(panState, State.ACTIVE)),
              position.x,
              positionX,
            ),
          ),
        ),
      ),
    ];
  }, [containerOffsetX, containerWidth]);

  useCode(() => {
    return [
      cond(eq(panState, State.ACTIVE), [
        call([panPositionX], ([value]) => handleChangeProgress(value)),
      ]),
    ];
  }, [popovers]);

  useCode(
    () => [
      cond(
        neq(panState, State.END),
        [set(positionX, (progress || 0) * containerWidth)],
        [
          set(
            diffProgress,
            multiply(abs(sub(positionX, (progress || 0) * containerWidth)), 1),
          ),
          // call([diffProgress], ([value]) => console.log(value)),
          cond(and(lessThan(diffProgress, 0.8), greaterThan(diffProgress, 0)), [
            set(isChangingProgressManually, 0),
            set(panState, State.UNDETERMINED),
          ]),
        ],
      ),
    ],
    [progress, containerWidth],
  );

  const animatedThumbStyle = useMemo(() => {
    return {
      transform: [
        {
          scale: max(
            animatedThumbValue,
            cond(
              neq(animatedVisibleValue, 0),
              min(animatedVisibleValue, 0.6),
              animatedVisibleValue,
            ),
          ),
        },
      ],
    };
  }, []);

  const wrapperFullscreenStyle = useMemo(() => {
    return isFullscreen && [styles.wrapperFullscreen];
  }, [isFullscreen]);

  const animatedProgressBarFullscreen = useMemo(() => {
    return isFullscreen && styles.trackerFullscreen;
  }, [isFullscreen]);

  return (
    <View
      onLayout={handleContainerLayout}
      onStartShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onStartShouldSetResponderCapture={() => false}
      onMoveShouldSetResponderCapture={() => false}>
      <TapGestureHandler
        simultaneousHandlers={[refPanGesture]}
        waitFor={refLongPressGesture}
        onHandlerStateChange={handleTapStateChange}>
        <Animated.View>
          <LongPressGestureHandler
            ref={refLongPressGesture}
            simultaneousHandlers={refPanGesture}
            {...longPressGestureHandler}
            minDurationMs={200}>
            <Animated.View>
              <PanGestureHandler ref={refPanGesture} {...gestureHandler}>
                <Animated.View style={[styles.wrapper, wrapperFullscreenStyle]}>
                  <Animated.View
                    style={[styles.container, animatedProgressBarFullscreen]}>
                    <View
                      style={[styles.mask, animatedProgressBarFullscreen]}
                    />
                    <Animated.View
                      style={[
                        styles.foreground,
                        {
                          width: bufferProgress * containerWidth,
                        },
                        animatedProgressBarFullscreen,
                      ]}
                    />

                    <View style={styles.tracker}>
                      <Animated.View
                        style={[
                          styles.background,
                          {
                            width: positionX,
                          },
                          animatedProgressBarFullscreen,
                        ]}
                      />
                      <Animated.View
                        style={[
                          styles.thumbContainer,
                          {
                            transform: [
                              {
                                translateX: cond(
                                  eq(isChangingProgressManually, 1),
                                  panPositionX,
                                  positionX,
                                ),
                              },
                            ],
                          },
                        ]}>
                        {!!currentPopover && (
                          <Timer
                            //@ts-ignore
                            onLayout={handleTimerLayout}
                            current={currentPopover?.value}
                            containerStyle={[
                              styles.timerContainer,
                              {
                                transform: [
                                  {
                                    translateX: cond(
                                      lessThan(
                                        panPositionX,
                                        timerWidth / 2 + TIMER_PADDING,
                                      ),
                                      sub(
                                        timerWidth / 2 + TIMER_PADDING,
                                        panPositionX,
                                      ),
                                      cond(
                                        greaterThan(
                                          panPositionX,
                                          containerWidth -
                                            timerWidth / 2 -
                                            TIMER_PADDING,
                                        ),
                                        sub(
                                          containerWidth -
                                            timerWidth / 2 -
                                            TIMER_PADDING,
                                          panPositionX,
                                        ),
                                        0,
                                      ),
                                    ),
                                  },
                                ],
                              },
                            ]}
                          />
                        )}
                        <Animated.View
                          style={[styles.thumb, animatedThumbStyle, thumbStyle]}
                        />
                      </Animated.View>
                    </View>
                  </Animated.View>
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </LongPressGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

export default React.memo(ProgressBar);
