import React, {Component} from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  block,
  cond,
  add,
  eq,
  set,
  call,
  lessThan,
  greaterThan,
  Clock,
  Value,
  clockRunning,
  startClock,
  stopClock,
  debug,
} from 'react-native-reanimated';
import {
  TapGestureHandler,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';

import DrawerManager from './DrawerManager';

import appConfig from 'app-config';
import ScreenWrapper from '../ScreenWrapper';
import {diffClamp} from 'react-native-reanimated';
import {timing} from 'react-native-reanimated';
import {and} from 'react-native-reanimated';
import {not} from 'react-native-reanimated';

export const showDrawer = (props) => {
  const ref = DrawerManager.getDrawer();
  if (!!ref) {
    ref.showDrawer(props);
  }
};

export const hideDrawer = (props) => {
  const ref = DrawerManager.getDrawer();
  if (!!ref) {
    ref.hideDrawer(props);
  }
};

function runTiming(clock, duration = 0, value, dest, callbackStopNode = []) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };
  const config = {
    duration: duration,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
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
    cond(state.finished, block([stopClock(clock), callbackStopNode])),
    // we made the block return the updated position
    state.position,
  ]);
}

export class Drawer extends Component {
  state = {};
  animatedShow = new Animated.Value(300);
  showDrawer = this.showDrawer.bind(this);
  hideDrawer = this.hideDrawer.bind(this);
  panX = new Animated.Value(0);
  gestureState = new Animated.Value(State.UNDETERMINED);
  offsetX = new Animated.Value(300);
  velocity = new Animated.Value(0);
  x = new Animated.Value(0);
  panMoving = false;
  clock = new Clock();

  handleTapStateChange = this.handleTapStateChange.bind(this);

  state = {
    visible: false,
  };

  componentDidMount() {
    DrawerManager.register(this);
  }

  componentWillUnmount() {
    DrawerManager.unregister(this);
  }

  showDrawer(props) {
    this.panX.setValue(0);
    this.setState({
      visible: true,
    });
    Animated.timing(this.offsetX, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
    }).start();
    // Animated.timing(this.animatedShow, {
    //   toValue: 0,
    //   duration: 300,
    //   easing: Easing.linear,
    // }).start(({finished}) => {
    //   if (finished) {
    //     // this.setState({
    //     //   visible: true,
    //     // });
    //   }
    // });
  }

  hideDrawer(props) {
    this.panX.setValue(0);
    Animated.timing(this.offsetX, {
      toValue: 300,
      duration: 300,
      easing: Easing.linear,
    }).start(({finished}) => {
      if (finished) {
        this.setState({
          visible: false,
        });
      }
    });
    // Animated.timing(this.transX, {
    //   toValue: 300,
    //   duration: 300,
    //   easing: Easing.linear,
    // }).start(({finished}) => {
    //   if (finished) {
    //     // this.animatedShow.setValue(300);

    //   }
    // });
  }

  handleTapStateChange({nativeEvent}) {
    if (nativeEvent.state === State.END) {
      this.hideDrawer();
    }
  }

  handlePanStateChange=Animated.event(
    [
      {
        nativeEvent: ({x, translationX, state, oldState, velocityX}) => {
          return block([
            set(this.panX, translationX),
            set(this.gestureState, state),
            set(this.velocity, velocityX),
            cond(eq(state, State.END), [
              // set(this.panX, 0),
              call([this.velocity, this.x], ([a, b]) =>
                console.log('%cvelocity', 'background-color:yellow', a),
              ),
              cond(
                greaterThan(velocityX, 0),
                cond(
                  this.x,
                  call([], ([]) => this.hideDrawer()),
                //   set(
                //     this.offsetX,
                //     runTiming(
                //       this.clock,
                //       300,
                //       this.offsetX,
                //       300,
                //       call([], ([]) => {
                //         alert('a');
                //         this.setState(
                //           {
                //             visible: false,
                //           },
                //           () => {
                //             this.panX.setValue(0);
                //             this.offsetX.setValue(300);
                //           },
                //         );
                //       }),
                //     ),
                //   ),
                ),
                cond(
                  this.x,
                  set(
                    this.offsetX,
                    runTiming(
                      this.clock,
                      300,
                      this.offsetX,
                      0,
                      //   call([], ([]) => {
                      //     this.panX.setValue(0);
                      //     alert('b');
                      //     this.setState({
                      //       visible: false,
                      //     });
                      //   }),
                    ),
                  ),
                ),
              ),
            ]),
          ]);
        },
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  handlePanEvent = Animated.event(
    [
      {
        nativeEvent: ({x, translationX, state, oldState, velocityX}) => {
          return block([
            set(this.panX, translationX),
            set(this.gestureState, state),
            set(this.velocity, velocityX),
            // cond(eq(state, State.END), [
            //   // set(this.panX, 0),
            //   call([this.velocity, this.x], ([a, b]) =>
            //     console.log('%cvelocity', 'background-color:yellow', a),
            //   ),
            //   cond(
            //     greaterThan(velocityX, 0),
            //     cond(
            //       this.x,
            //       call([], ([]) => this.hideDrawer()),
                //   set(
                //     this.offsetX,
                //     runTiming(
                //       this.clock,
                //       300,
                //       this.offsetX,
                //       300,
                //       call([], ([]) => {
                //         alert('a');
                //         this.setState(
                //           {
                //             visible: false,
                //           },
                //           () => {
                //             this.panX.setValue(0);
                //             this.offsetX.setValue(300);
                //           },
                //         );
                //       }),
                //     ),
                //   ),
            //     ),
            //     cond(
            //       this.x,
            //       set(
            //         this.offsetX,
            //         runTiming(
            //           this.clock,
            //           300,
            //           this.offsetX,
            //           0,
            //           //   call([], ([]) => {
            //           //     this.panX.setValue(0);
            //           //     alert('b');
            //           //     this.setState({
            //           //       visible: false,
            //           //     });
            //           //   }),
            //         ),
            //       ),
            //     ),
            //   ),
            // ]),
          ]);
        },
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  transX = diffClamp(
    cond(
      eq(this.gestureState, State.ACTIVE),
      add(this.offsetX, this.panX),
      set(this.offsetX, add(this.offsetX, this.panX)),
    ),
    0,
    300,
  );

  render() {
    return (
      <View
        pointerEvents={this.state.visible ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        <Animated.Code
          exec={() => {
            return block([
              set(this.x, this.state.visible ? 1 : 0),
              call([this.panX, this.offsetX, this.transX, this.gestureState], ([a, b, c, d]) => {
                console.log('pan', a);
                console.log('offset', b);
                console.log('%ctransX', 'background-color: red', b);
                console.log('%cstate', 'background-color: blue', d);
              }),
              //   cond(
              //     eq(this.state.visible ? 1 : 0, 1),
              //     set(this.offsetX, runTiming(this.clock, this.offsetX, 0)),
              //     set(this.offsetX, runTiming(this.clock, this.offsetX, 300)),
              //   ),
            ]);
          }}
          dependencies={[this.state.visible]}
        />
        <PanGestureHandler
          onHandlerStateChange={this.handlePanStateChange}
          onGestureEvent={this.handlePanEvent}>
          <Animated.View style={{width: '100%', alignItems: 'flex-end'}}>
            <View style={{position: 'absolute', width: '100%', height: '100%'}}>
              <TapGestureHandler
                onHandlerStateChange={this.handleTapStateChange}>
                <Animated.View
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,.6)',
                    opacity: interpolate(this.transX, {
                      inputRange: [0, 300],
                      outputRange: [1, 0],
                      extrapolate: 'clamp',
                    }),
                  }}
                  //   {...this.panResponder.panHandlers}
                />
              </TapGestureHandler>
            </View>

            <Animated.View
            //   style={{
            //     transform: [
            //       {
            //         translateX: this.animatedShow.interpolate({
            //           inputRange: [0, 1],
            //           outputRange: [300, 0],
            //         }),
            //       },
            //     ],
            //   }}
            >
              <Animated.View
                onMoveShouldSetPanResponder={() => true}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderTerminationRequest={() => false}
                style={{
                  width: 300,
                  height: appConfig.device.height,
                  backgroundColor: 'red',
                  transform: [
                    {
                      translateX: this.transX,
                    },
                  ],
                }}>
                <ScreenWrapper></ScreenWrapper>
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

export default Drawer;
