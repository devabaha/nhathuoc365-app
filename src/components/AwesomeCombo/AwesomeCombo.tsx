import React, {MutableRefObject, useState, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
// 3-party libs
import useIsMounted from 'react-is-mounted-hook';
import {useValues, useClocks} from 'react-native-redash';
import Animated, {
  Easing,
  useCode,
  block,
  cond,
  set,
  call,
  startClock,
  stopClock,
  timing,
  eq,
  concat,
  clockRunning,
} from 'react-native-reanimated';
// configs
import appConfig from 'app-config';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import {Container} from 'src/components/base';
import AwesomeComboItem from './AwesomeComboItem';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 9999,
    maxWidth: appConfig.device.width * 0.6,
  },
  container: {},
  mainContent: {
    padding: 7,
    overflow: 'hidden',
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9990,
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
  useParentWidth: boolean;
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
    cond(clockRunning(clock), [], startClock(clock)),
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

const AwesomeCombo = ({
  data,
  show = false,
  parentRef,
  position = {x: 0, y: 0, width: undefined},
  useParentWidth = false,
  renderCustomItem,
  onSelect,
  onClose = () => {},
}: AwesomeComboProps) => {
  const {theme} = useTheme();

  const isMounted = useIsMounted();
  const [containerPosition, setContainerPosition] = useState(position);
  const [visible, setVisible] = useState(show);
  const [animatedOpacity, animatedHeight, animatedTranslateX] = useValues(
    0,
    0,
    0,
  );
  const [opacityClock, heightClock] = useClocks(2);

  useEffect(() => {
    if (show) {
      setVisible(true);
    }
  }, [show]);

  useCode(
    () => [
      set(
        animatedOpacity,
        runTiming(
          opacityClock,
          200,
          animatedOpacity,
          show ? 1 : 0,
          onFinishHeightAnimation,
        ),
      ),
    ],
    [show],
  );

  const onFinishHeightAnimation = (position) => {
    if (!isMounted()) return;

    if (!position && visible) {
      setVisible(false);
    }
  };

  function onContainerLayout(e: LayoutChangeEvent) {
    const {
      x,
      y,
      width: containerWidth,
      height: containerHeight,
    } = e.nativeEvent.layout;
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
              width,
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

  const containerStyle = useMemo(() => {
    return {borderRadius: theme.layout.borderRadiusMedium};
  }, [theme]);

  return (
    visible && (
      <>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.mask} />
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
          <Container
            reanimated
            shadow
            pointerEvents="box-none"
            style={[
              styles.container,
              {
                width: useParentWidth ? containerPosition.width : undefined,
                opacity:
                  containerPosition.width !== undefined ? animatedOpacity : 0,
                transform: [{translateX: animatedTranslateX}],
              },
              containerStyle,
            ]}>
            <Animated.View
              style={[
                styles.mainContent,
                {
                  height: concat(
                    animatedOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 100],
                    }),
                    '%',
                  ),
                },
                containerStyle,
              ]}>
              {data.map((item: AwesomeComboItem, index: number) =>
                renderItem(item, index),
              )}
            </Animated.View>
          </Container>
        </View>
      </>
    )
  );
};

const areEquals = (prevProps, nextProps) => {
  return (
    prevProps.show === nextProps.show &&
    prevProps.data === nextProps.data &&
    prevProps.show === nextProps.show &&
    prevProps.parentRef === nextProps.parentRef &&
    prevProps.position === nextProps.position &&
    prevProps.useParentWidth === nextProps.useParentWidth
  );
};

export default React.memo(AwesomeCombo, areEquals);
