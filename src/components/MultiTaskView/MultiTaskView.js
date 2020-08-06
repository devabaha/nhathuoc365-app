import React, { Component, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  Extrapolate,
  Clock,
  Value,
  Easing,
  block,
  cond,
  clockRunning,
  set,
  startClock,
  timing,
  stopClock,
  and,
  defined,
  neq,
  eq,
  not,
  useCode,
  debug,
  call
} from 'react-native-reanimated';
import appConfig from 'app-config';
import Button from '../Button';
import { useValue, useClock } from 'react-native-redash';

const runTiming = (clock, position, toValue) => {
  state = {
    finished: new Value(0),
    position,
    frameTime: new Value(0),
    time: new Value(0)
  };
  config = {
    toValue,
    duration: 3000,
    easing: Easing.bounce
  };

  return block([
    cond(
      not(clockRunning(clock)),
      [
        set(state.time, 0),
        set(state.position, position),
        set(config.toValue, toValue)
      ],
      timing(clock, state, config)
    ),

    cond(eq(state.finished, 1), [
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(config.toValue, not(state.position))
    ]),
    state.position
  ]);
};

class MultiTaskView extends Component {
  state = {
    isPlay: false
  };

  clock = new Clock();
  progress = new Value(0);
  isPlaying = new Value(0);
  dest = new Value(1);

  animating() {
    this.setState({
      isPlay: !this.state.isPlay
    });
  }

  render() {
    const title = this.state.isPlay ? 'Pause' : 'Play';

    return (
      <View style={styles.root}>
        <Animated.Code
          exec={() =>
            block([
              set(this.isPlaying, +this.state.isPlay),
              cond(
                and(this.isPlaying, not(clockRunning(this.clock))),
                startClock(this.clock)
              ),
              cond(
                and(not(this.isPlaying), clockRunning(this.clock)),
                stopClock(this.clock)
              ),
              set(
                this.progress,
                runTiming(this.clock, this.progress, this.dest)
              )
            ])
          }
        />
        <Bubbles progress={this.progress} />
        <Button title={title} onPress={this.animating.bind(this)} />
      </View>
    );
  }
}

// const runTiming2 = (clock) => {
//     state = {
//         finished: new Value(0),
//         position: new Value(0),
//         frameTime: new Value(0),
//         time: new Value(0),
//     };
//     config = {
//         toValue: new Value(1),
//         duration: 3000,
//         easing: Easing.inOut(Easing.ease),
//     };
//     console.log(state.position);
//     return block([
//         cond(
//             not(clockRunning(clock)),
//             set(state.time, 0),
//             timing(clock, state, config)
//         ),

//         cond(eq(state.finished, 1), [
//             set(state.finished, 0),
//             set(state.frameTime, 0),
//             set(state.time, 0),
//             set(config.toValue, not(state.position)),
//         ]),
//         state.position
//     ]);
// }
// const clock = new Clock();
//     const progress = new Value(0);
//     const isPlaying = new Value(0);
// const MultiTaskView = () => {
//     const [play, setPlay] = useState(false);

//     useCode(() => set(isPlaying, play ? 1 : 0), [play]);
//     useCode(
//         () => [
//             cond(and(isPlaying, not(clockRunning(clock))), startClock(clock)),
//             cond(and(not(isPlaying), clockRunning(clock)), stopClock(clock)),
//             set(progress, runTiming2(clock)),
//         ],
//         []
//     );
//     return (
//         <View style={styles.root}>
//             <Bubbles progress={progress} />
//             <Button
//                 title={play ? "Pause" : "Play"}
//                 onPress={() => setPlay((prev) => !prev)}
//             />
//         </View>
//     );
// };

export default MultiTaskView;

const width = appConfig.device.width * 0.8;
const size = 32;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    height: width,
    width,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
    borderTopLeftRadius: width / 2,
    borderTopRightRadius: width / 2,
    borderBottomLeftRadius: width / 2
  },
  bubble: {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: appConfig.colors.primary
  }
});

class Bubbles extends Component {
  render() {
    const progress = this.props.progress;
    const bubbles = [0, 1, 2];
    const delta = 1 / bubbles.length;
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          {bubbles.map(i => {
            const start = i * delta;
            const end = start + delta;
            const opacity = interpolate(progress, {
              inputRange: [start, end],
              outputRange: [0.5, 1],
              extrapolate: Extrapolate.CLAMP
            });
            const scale = interpolate(progress, {
              inputRange: [start, end],
              outputRange: [1, 1.5],
              extrapolate: Extrapolate.CLAMP
            });
            return (
              <Animated.View
                key={i}
                style={[styles.bubble, { opacity, transform: [{ scale }] }]}
              />
            );
          })}
        </View>
      </View>
    );
  }
}
