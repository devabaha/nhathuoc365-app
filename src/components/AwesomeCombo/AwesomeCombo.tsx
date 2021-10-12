import React, {
  MutableRefObject,
  useState,
  useRef,
  useEffect,
  isValidElement,
} from 'react';
import {
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  useValues,
  timing as timingRedash,
  delay,
  transformOrigin,
  useClocks,
  TimingParams,
} from 'react-native-redash';
import Animated, {
  Easing,
  useCode,
  block,
  cond,
  set,
  not,
  call,
  startClock,
  stopClock,
  clockRunning,
  timing,
  eq,
  concat,
  Extrapolate,
} from 'react-native-reanimated';
import AwesomeComboItem from './AwesomeComboItem';
import appConfig from 'app-config';
import useIsMounted from 'react-is-mounted-hook';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 999,
    maxWidth: appConfig.device.width * 0.6,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    // @ts-ignore
    ...elevationShadowStyle(10),
  },
  mainContent: {
    borderRadius: 8,
    padding: 7,
    overflow: 'hidden',
  },
});
const PADDING_STANDARD = 15;
const {Value} = Animated;

type AwesomeComboItem = {
  title: string;
};
type AwesomeComboPosition = {
  x: number;
  y: number;
  width: number | undefined;
};
type AwesomeComboProps = {
  data: Array<AwesomeComboItem>;
  show: boolean;
  /**
   * [Android] Require props collapsable={false} or implement onLayout
   * in the View or parent component to make `measure()` return values
   * otherwise `measure()` will return undefined.
   *
   * @see collapsable {@link https://reactnative.dev/docs/view#collapsable}
   */
  parentRef: MutableRefObject<any>;
  position: AwesomeComboPosition;
  renderCustomItem: (
    item: AwesomeComboItem,
    onPress: Function,
    index: number,
    data: Array<AwesomeComboItem>,
  ) => React.ReactNode;
  onSelect: (item: AwesomeComboItem) => void;
  onClose: () => void;
};

function runTiming(
  clock: Animated.Clock,
  duration: number,
  from: Animated.Value<any>,
  toValue: number,
  callback = (position) => {},
) {
  const state = {
    finished: new Value(0),
    position: from,
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    toValue: new Value(toValue),
    duration,
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    timing(clock, state, config),
    cond(
      eq(state.finished, 1),
      block([
        stopClock(clock),
        call([state.position], ([position]) => {
          callback(position);
        }),
      ]),
    ),
    state.position,
  ]);
}

function AwesomeCombo({
  data,
  show = false,
  parentRef,
  position = {x: 0, y: 0, width: undefined},
  renderCustomItem,
  onSelect,
  onClose = () => {},
}: AwesomeComboProps) {
  const isMounted = useIsMounted();
  const refAwesomeCombo = useRef<any>();
  const [containerPosition, setContainerPosition] = useState(position);
  const [visible, setVisible] = useState(show);
  const [
    animatedOpacity,
    animatedHeight,
    animatedTranslateX,
    isShow,
  ] = useValues(0, 0, -5, 0);
  const [opacityClock, heightClock] = useClocks(2);

  useEffect(() => {
    if (show) {
      setVisible(true);
    }
  }, [show]);

  const onFinishHeightAnimation = (position) => {
    if (!isMounted()) return;

    if (!position) {
      setVisible(false);
    }
  };

  useCode(() => set(isShow, show ? 1 : 0), [show]);

  useCode(
    () =>
      block([
        startClock(opacityClock),
        set(
          animatedOpacity,
          runTiming(opacityClock, 200, animatedOpacity, show ? 1 : 0),
        ),
      ]),
    [show],
  );

  useCode(
    () =>
      block([
        startClock(heightClock),
        set(
          animatedHeight,
          runTiming(
            heightClock,
            300,
            animatedHeight,
            show ? 100 : 0,
            onFinishHeightAnimation,
          ),
        ),
      ]),
    [show],
  );

  function renderItem(item: AwesomeComboItem, index: number) {
    return renderCustomItem ? (
      renderCustomItem(item, () => onSelect(item), index, data)
    ) : (
      <AwesomeComboItem
        key={index}
        title={item.title}
        last={index === data.length - 1}
        onPress={() => onSelect(item)}
      />
    );
  }

  function onContainerLayout(e: LayoutChangeEvent) {
    const {
      x,
      y,
      width: containerWidth,
      height: containerHeight,
    } = e.nativeEvent.layout;
    // const { x: parentX, y: parentY } = this.props.position;
    const {width: appWidth, height: appHeight} = Dimensions.get('window');

    if (parentRef.current) {
      parentRef.current.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number,
        ) => {
          if (pageX + containerWidth > appWidth - PADDING_STANDARD) {
            setContainerPosition({
              x:
                pageX -
                (containerWidth - (appWidth - pageX)) -
                PADDING_STANDARD,
              y: pageY + height + PADDING_STANDARD,
              width: undefined,
            });
          } else {
            setContainerPosition({
              x: pageX,
              y: pageY + height,
              width,
            });
          }
        },
      );
    }
  }

  return (
    visible && (
      <>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{...StyleSheet.absoluteFillObject}} />
        </TouchableWithoutFeedback>
        <View
          pointerEvents="box-none"
          onLayout={onContainerLayout}
          style={[
            styles.wrapper,
            {
              left: containerPosition.x,
              top: containerPosition.y,
            },
          ]}>
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.container,
              {
                width: containerPosition.width,
                opacity:
                  containerPosition.width !== undefined ? animatedOpacity : 0,
                // transform: [{translateX: animatedTranslateX}],
              },
            ]}>
            <Animated.View
              style={[
                styles.mainContent,
                {
                  height: concat(animatedHeight, '%'),
                },
              ]}>
              {data.map((item: AwesomeComboItem, index: number) =>
                renderItem(item, index),
              )}
            </Animated.View>
          </Animated.View>
        </View>
      </>
    )
  );
}

export default React.memo(AwesomeCombo);
