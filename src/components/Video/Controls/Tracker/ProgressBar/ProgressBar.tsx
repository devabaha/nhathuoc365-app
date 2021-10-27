import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
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
  set,
  sub,
  useCode,
  Value,
} from 'react-native-reanimated';
import {usePanGestureHandler, useValue} from 'react-native-redash';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 50,
  },
  container: {
    width: '100%',
    height: 3,
    backgroundColor: appConfig.colors.overlay,
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: appConfig.colors.disabled,
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
  thumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 12 / 2,
    backgroundColor: appConfig.colors.primary,
    alignSelf: 'center',
    left: -12 / 2,
  },
});

const ProgressBar = ({
  progress = 0,
  bufferProgress = 0,
  onProgress = (value: number) => {},
}) => {
  const isStartChangeProgressManually = useValue(0);
  const isChangingProgressManually = useValue(0);

  const diffProgress = useValue(0);
  const currentProgress = useValue(0);

  const tempPositionX = useValue(0);
  const oldPositionX = useValue(0);
  const positionX = useValue(0);

  const {gestureHandler, state, translation} = usePanGestureHandler();

  useCode(() => {
    return [
      cond(eq(state, State.BEGAN), [
        set(isChangingProgressManually, 1),
        set(isStartChangeProgressManually, 1),
        set(oldPositionX, positionX),
        set(tempPositionX, 0),
      ]),
      cond(eq(state, State.ACTIVE), [
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
      ]),
      cond(eq(state, State.END), [
        cond(eq(isStartChangeProgressManually, 1), [
          set(isStartChangeProgressManually, 0),
          set(currentProgress, progress || 0),
          call([positionX], ([value]) =>
            onProgress(value / appConfig.device.width),
          ),
        ]),
      ]),
    ];
  }, []);

  useCode(
    () => [
      cond(
        eq(isChangingProgressManually, 0),
        [
          set(positionX, (progress || 0) * appConfig.device.width),
          call([diffProgress], ([value]) => console.log('abc', value)),
        ],
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
            call([diffProgress], ([value]) => console.log(value)),
          ]),
        ],
      ),
    ],
    [progress],
  );

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        onStartShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onStartShouldSetResponderCapture={() => false}
        onMoveShouldSetResponderCapture={() => false}
        style={styles.wrapper}>
        <Animated.View style={styles.container}>
          <View style={styles.mask} />
          <Animated.View
            style={[
              styles.foreground,
              {
                width: bufferProgress,
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
                styles.thumb,
                {
                  transform: [{translateX: positionX}],
                },
              ]}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default React.memo(ProgressBar);
