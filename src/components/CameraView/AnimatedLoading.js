import * as React from 'react';
import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import Animated, {Easing, timing} from 'react-native-reanimated';
import {useValue, useClock} from 'react-native-redash';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import Loading from 'src/components/Loading';
import {Container} from 'src/components/base';

const {
  useCode,
  set,
  block,
  cond,
  call,
  startClock,
  stopClock,
  clockRunning,
  Value,
} = Animated;

const animatedLoadingStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 9999,
    // backgroundColor: 'rgba(0,0,0,.6)',
  },
});

const AnimatedLoading = ({isLoading = false}) => {
  const {theme} = useTheme();

  const animatedOpacity = useValue(0);
  const Clock = useClock();
  const [isFadeOut, setFadeOut] = React.useState(false);

  function runTiming(clock, value, dest) {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0),
    };

    const config = {
      duration: 300,
      toValue: new Value(0),
      easing: Easing.quad,
    };

    return block([
      cond(
        clockRunning(clock),
        [
          // if the clock is already running we update the toValue, in case a new dest has been passed in
          set(config.toValue, dest),
        ],
        [
          // if the clock isn't running we reset all the animation params and start the clock
          set(state.finished, 0),
          set(state.time, 0),
          set(state.position, value),
          set(state.frameTime, 0),
          set(config.toValue, dest),
          startClock(clock),
        ],
      ),
      // we run the step here that is going to update position
      timing(clock, state, config),
      // if the animation is over we stop the clock
      cond(
        state.finished,
        block([
          stopClock(clock),
          call([animatedOpacity], ([value]) => {
            if (dest === 0) {
              setFadeOut(true);
            } else {
              setFadeOut(false);
            }
          }),
        ]),
      ),
      // we made the block return the updated position
      state.position,
    ]);
  }

  useCode(() => {
    return set(
      animatedOpacity,
      runTiming(Clock, animatedOpacity, isLoading ? 1 : 0),
    );
  }, [isLoading]);

  const loadingContainerStyle = useMemo(() => {
    return mergeStyles(
      animatedLoadingStyles.loadingContainer,
      {
        backgroundColor: theme.color.overlay60,
      },
      [theme],
    );
  });

  return (
    (isLoading || !isFadeOut) && (
      <Container
        reanimated
        style={[
          loadingContainerStyle,
          {
            opacity: animatedOpacity,
          },
        ]}>
        <Loading center />
      </Container>
    )
  );
};
export default AnimatedLoading;
