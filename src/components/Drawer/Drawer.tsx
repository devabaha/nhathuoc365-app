import React, {Component} from 'react';
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
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
  spring,
  Extrapolate,
  greaterOrEq,
  or,
  and,
  not,
  abs,
} from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import DrawerManager from './DrawerManager';

import appConfig from 'app-config';
import ScreenWrapper from '../ScreenWrapper';
import {DRAWER_WIDTH} from 'src/constants';
import {DrawerProps} from '.';

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

export const clearDrawerContent = (props) => {
  const ref = DrawerManager.getDrawer();
  if (!!ref) {
    ref.setState({content: null});
  }
};

function runSpring(state, clock, value, velocity, dest, callback = []) {
  const config = {
    damping: 1,
    mass: 1,
    stiffness: 15,
    overshootClamping: true,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0),
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, [stopClock(clock), callback]),
    state.position,
  ];
}

const VELOCITY_THRESHOLD = 100;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    backgroundColor: '#fff',
  },
  mask: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.6)',
  },
  icon: {
    fontSize: 28,
    color: '#fff',
  },
  closeIconContainer: {
    position: 'absolute',
    left: 20,
    top: 30,
  },
});

export class Drawer extends Component<DrawerProps> {
  static defaultProps = {
    width: DRAWER_WIDTH,
    position: 'right',
  };

  state = {
    visible: false,
    content: null,
  };

  refScrollView = React.createRef<any>();

  panX = new Animated.Value(0);
  panY = new Animated.Value(0);
  gestureState = new Animated.Value(State.UNDETERMINED);
  oldState = new Animated.Value<number>(State.UNDETERMINED);
  offsetX = new Animated.Value(this.props.width);
  velocityX = new Animated.Value<number>(0);
  velocityY = new Animated.Value<number>(0);
  visible = new Animated.Value(0);

  clock = new Clock();

  animatedSpringState = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    velocity: new Value(0),
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      if (nextState.visible !== this.state.visible) {
        if (nextState.visible) {
          this.velocityX.setValue(-this.props.width);
        } else {
          this.velocityX.setValue(this.props.width);
        }

        this.gestureState.setValue(State.UNDETERMINED);
        this.panX.setValue(0);
      }
      return true;
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    DrawerManager.register(this);
  }

  componentWillUnmount() {
    DrawerManager.unregister(this);
  }

  showDrawer = (props) => {
    this.setState({visible: true, content: props.content || null});
  };

  hideDrawer = () => {
    Keyboard.dismiss();
    this.setState({visible: false});
  };

  handleTapStateChange = ({nativeEvent}) => {
    if (nativeEvent.state === State.ACTIVE) {
      // this.oldState.setValue(State.ACTIVE);
      this.hideDrawer();
    }
  };

  handlePanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: this.panX,
          state: this.gestureState,
          oldState: this.oldState,
          velocityX: this.velocityX,
        },
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  animate = (to) => {
    return [
      runSpring(
        this.animatedSpringState,
        this.clock,
        this.offsetX,
        this.velocityX,
        to,
      ),
    ];
  };

  transX = [
    cond(
      eq(this.gestureState, State.ACTIVE),
      [stopClock(this.clock), add(this.offsetX, this.panX)],
      [
        [
          set(this.offsetX, add(this.offsetX, this.panX)),
          cond(
            or(
              greaterThan(this.velocityX, VELOCITY_THRESHOLD),
              greaterThan(this.panX, this.props.width / 2),
            ),
            [
              // call([this.velocityX, this.panX], ([a, b]) =>
              //   console.log('1', a, b),
              // ),
              set(this.offsetX, this.animate(this.props.width)),
            ],
            cond(
              or(
                lessThan(this.velocityX, -VELOCITY_THRESHOLD),
                lessThan(this.panX, -this.props.width / 2),
              ),
              [
                // call([this.velocityX, this.panX, this.offsetX], ([a, b, c]) =>
                //   console.log('2', a, b, c),
                // ),
                set(this.offsetX, this.animate(0)),
              ],

              [
                // call([this.velocityX, this.panX], ([a, b]) =>
                //   console.log('3', a, b),
                // ),
                set(
                  this.offsetX,
                  cond(
                    greaterThan(this.panX, 0),
                    this.animate(0),
                    this.animate(this.props.width),
                  ),
                ),
              ],
            ),
          ),
        ],
        this.offsetX,
      ],
    ),
  ];

  opacityStyle = interpolate(this.transX, {
    inputRange: [0, this.props.width],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  render() {
    return (
      <View
        pointerEvents={this.state.visible ? 'auto' : 'none'}
        style={styles.container}>
        <Animated.Code>
          {() => {
            return block([
              set(this.visible, this.state.visible ? 1 : 0),
              cond(
                and(
                  this.visible,
                  greaterOrEq(this.offsetX, this.props.width),
                  eq(this.oldState, State.ACTIVE),
                ),
                [
                  call([this.velocityX, this.offsetX], ([a, b]) => {
                    // console.log('a', a, b, c);
                    this.state.visible && this.setState({visible: false});
                  }),
                  stopClock(this.clock),

                  cond(
                    lessThan(this.offsetX, this.props.width),
                    set(this.offsetX, this.props.width),
                  ),
                ],
              ),
              call(
                [this.velocityX, this.offsetX, this.visible],
                ([a, b, c, d]) => {
                  // console.log('b', a, b, c, d);
                },
              ),
            ]);
          }}
        </Animated.Code>
        {/* <PanGestureHandler
          maxPointers={1}
          onHandlerStateChange={this.handlePanEvent}
          onGestureEvent={this.handlePanEvent}> */}
        <Animated.View style={{flex: 1}}>
          <View style={styles.container}>
            <TouchableWithoutFeedback onPress={this.hideDrawer}>
              <Animated.View
                style={[
                  styles.mask,
                  {
                    opacity: this.opacityStyle,
                  },
                ]}
              />
            </TouchableWithoutFeedback>
          </View>

          <Animated.View
            style={{
              width: this.props.width,
              height: '100%',
              marginLeft: 'auto',
              transform: [
                {
                  translateX: interpolate(this.transX, {
                    inputRange: [0, this.props.width],
                    outputRange: [0, this.props.width],
                    extrapolate: Extrapolate.CLAMP,
                  }),
                },
              ],
            }}>
            {this.state.content}
          </Animated.View>
        </Animated.View>
        {/* </PanGestureHandler> */}

        {/* <SafeAreaView style={{flex: 1, position: 'absolute'}}>
          <Animated.View
            style={[
              styles.closeIconContainer,
              {
                opacity: this.opacityStyle
              },
            ]}>
            <TouchableOpacity
              onPress={this.hideDrawer}
              //@ts-ignore
              hitSlop={HIT_SLOP}>
              <AntDesignIcon name="close" style={styles.icon} />
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView> */}
      </View>
    );
  }
}

export default Drawer;
