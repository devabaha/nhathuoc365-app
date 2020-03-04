import React, { Component } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Octicons';
import Icon3 from 'react-native-vector-icons/Ionicons';
import appConfig from 'app-config';
import Svg, { Rect } from 'react-native-svg';
import interpolate from 'color-interpolate';
import extractColor from 'react-native-svg/lib/module/lib/extract/extractColor';

const AnimatedIcon1 = Animated.createAnimatedComponent(Icon1);
const AnimatedIcon2 = Animated.createAnimatedComponent(Icon2);
const AnimatedIcon3 = Animated.createAnimatedComponent(Icon3);
const MAIN_COLOR = appConfig.colors.primary;
const SUB_COLOR = '#fff';
const SHAPE_DIMENSSION = appConfig.device.isAndroid ? 48 : 50;
const colormap = interpolate([MAIN_COLOR, SUB_COLOR]);

class CreditCardTabButton extends Component {
  state = {
    animated: new Animated.Value(0),
    animated1: new Animated.Value(0),
    animated2: new Animated.Value(0),
    animatedRotate: new Animated.Value(0),
    animatedRotate1: new Animated.Value(0),
    animatedScan: new Animated.Value(0),
    animatedColor: new Animated.Value(0),
    animatedFocused: new Animated.Value(0)
  };
  refRect = React.createRef();

  componentDidMount() {
    this.startAnimation();
    this.state.animatedColor.addListener(this.animatedColorListener);
  }

  componentWillUnmount() {
    this.state.animatedColor.removeListener(this.animatedColorListener);
  }

  animatedColorListener = ({ value }) => {
    const color = colormap(value);
    if (this.refRect.current) {
      this.refRect.current.setNativeProps({
        fill: extractColor(color)
      });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (nextProps.focused !== this.props.focused) {
      Animated.timing(this.state.animatedFocused, {
        toValue: nextProps.focused ? 1 : 0,
        easing: Easing.elastic(2),
        useNativeDriver: true
      }).start();
    }

    if (
      nextProps.focused !== this.props.focused ||
      nextProps.label !== this.props.label
    ) {
      return true;
    }

    return false;
  }

  startAnimation() {
    Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(this.state.animated, {
          toValue: 1,
          useNativeDriver: true,
          easing: Easing.bounce
        }),
        Animated.delay(1000),
        Animated.parallel([
          Animated.timing(this.state.animatedColor, {
            toValue: 1,
            useNativeDriver: true
          }),
          Animated.timing(this.state.animatedScan, {
            toValue: 1,
            easing: Easing.elastic(1000),
            useNativeDriver: true,
            duration: 1000
          }),
          Animated.timing(this.state.animated, {
            toValue: 0,
            useNativeDriver: true,
            easing: Easing.elastic()
          }),
          Animated.stagger(200, [
            Animated.timing(this.state.animated1, {
              toValue: 1,
              useNativeDriver: true,
              easing: Easing.elastic()
            }),
            Animated.timing(this.state.animated2, {
              toValue: 1,
              useNativeDriver: true,
              easing: Easing.elastic()
            })
          ]),
          Animated.timing(this.state.animatedRotate, {
            toValue: 1,
            useNativeDriver: true,
            easing: Easing.elastic()
          })
        ]),
        Animated.delay(1500),
        Animated.parallel([
          Animated.timing(this.state.animatedScan, {
            toValue: 0,
            easing: Easing.elastic(1000),
            useNativeDriver: true,
            duration: 1000
          }),
          Animated.timing(this.state.animatedRotate, {
            toValue: 0,
            useNativeDriver: true,
            easing: Easing.elastic()
          }),
          Animated.timing(this.state.animated, {
            toValue: 2,
            useNativeDriver: true,
            easing: Easing.bounce
          }),
          Animated.stagger(200, [
            Animated.parallel([
              Animated.timing(this.state.animated2, {
                toValue: 2,
                useNativeDriver: true,
                easing: Easing.elastic()
              }),
              Animated.timing(this.state.animatedRotate1, {
                toValue: 1,
                useNativeDriver: true,
                easing: Easing.elastic()
              })
            ]),
            Animated.parallel([
              Animated.timing(this.state.animated1, {
                toValue: 2,
                useNativeDriver: true,
                easing: Easing.elastic()
              }),
              Animated.timing(this.state.animatedRotate1, {
                toValue: 1,
                useNativeDriver: true,
                easing: Easing.elastic()
              })
            ])
          ])
        ]),
        Animated.parallel([
          Animated.timing(this.state.animatedRotate, {
            toValue: 0,
            useNativeDriver: true,
            duration: 0
          }),
          Animated.timing(this.state.animatedRotate1, {
            toValue: 0,
            useNativeDriver: true,
            duration: 0
          }),
          Animated.timing(this.state.animated2, {
            toValue: 0,
            useNativeDriver: true,
            duration: 0
          }),
          Animated.timing(this.state.animated1, {
            toValue: 0,
            useNativeDriver: true,
            duration: 0
          })
        ]),
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(this.state.animatedColor, {
            toValue: 0,
            useNativeDriver: true
          }),
          Animated.timing(this.state.animated, {
            toValue: 3,
            useNativeDriver: true,
            easing: Easing.bezier(0, -0.46, 0.39, 1.54)
          })
        ]),
        Animated.timing(this.state.animated, {
          toValue: 0,
          useNativeDriver: true,
          duration: 0
        }),
        Animated.delay(1000)
      ])
    ).start();
  }

  renderAnimated(data) {
    const animatedStyle = {
      transform: [
        {
          scale: this.state.animated.interpolate({
            inputRange: [0, 1, 2, 3],
            outputRange: [1, 1.2, 1.2, 1]
          })
        },
        {
          translateY: this.state.animatedRotate.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 5]
          })
        },
        {
          rotate: this.state.animatedRotate.interpolate({
            inputRange: [0, 0.3, 1],
            outputRange: ['0deg', '0deg', '-20deg']
          })
        },
        {
          translateY: this.state.animatedRotate.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -10]
          })
        },
        {
          rotate: this.state.animated.interpolate({
            inputRange: [0, 1, 1.5, 2, 3],
            outputRange: ['0deg', '0deg', '0deg', '20deg', '360deg']
          })
        },
        {
          scale: this.state.animated.interpolate({
            inputRange: [0, 1, 2, 3],
            outputRange: [1, 1, 1, 1]
          })
        }
      ]
    };

    const animatedColorStyle = {
      backgroundColor: MAIN_COLOR,
      opacity: this.state.animatedColor.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0]
      })
    };

    return data.map((animated, index) => (
      <Animated.View
        key={index}
        style={[styles.iconContainer, animatedStyle, animated.style]}
      >
        <Animated.View
          style={[{ position: 'absolute', backgroundColor: SUB_COLOR }]}
        >
          {animated.subComponent}
        </Animated.View>
        <Animated.View style={[animatedColorStyle]}>
          {animated.mainComponent}
        </Animated.View>
      </Animated.View>
    ));
  }

  render() {
    const animatedFocused = {
      transform: [
        {
          translateY: this.state.animatedFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [
              appConfig.device.isAndroid ? -3 : -4,
              appConfig.device.isAndroid ? -22 : -24
            ]
          })
        }
      ]
    };

    const animated1Style = {
      transform: [
        {
          translateY: this.state.animated1.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [-50, 0, 50]
          })
        },
        {
          rotate: this.state.animatedRotate.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: ['20deg', '20deg', '0deg']
          })
        },
        {
          translateX: this.state.animatedRotate1.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 50]
          })
        },
        {
          translateY: this.state.animatedRotate1.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -50]
          })
        }
      ]
    };

    const animated2Style = {
      transform: [
        {
          translateY: this.state.animated2.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [-50, 0, 50]
          })
        },
        {
          translateY: this.state.animatedRotate.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: [0, 0, 4]
          })
        },
        {
          rotate: this.state.animatedRotate.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: ['0deg', '0deg', '30deg']
          })
        },
        {
          translateX: this.state.animatedRotate1.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -50]
          })
        },
        {
          translateY: this.state.animatedRotate1.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 50]
          })
        }
      ]
    };

    const animatedScanStyle = {
      transform: [
        {
          translateX: this.state.animatedScan.interpolate({
            inputRange: [0, 1],
            outputRange: [-5, 60]
          })
        }
      ]
    };

    const animatedScanBackgroundColorStyle = {
      opacity: this.state.animatedColor
    };

    const data = [
      {
        subComponent: (
          <AnimatedIcon3 style={[styles.icon]} name="ios-card" size={22} />
        ),
        mainComponent: (
          <AnimatedIcon3
            style={[styles.icon, styles.mainIcon]}
            name="ios-card"
            size={22}
          />
        ),
        style: animated2Style
      },
      {
        subComponent: (
          <AnimatedIcon2 style={[styles.icon]} name="credit-card" size={22} />
        ),
        mainComponent: (
          <AnimatedIcon2
            style={[styles.icon, styles.mainIcon]}
            name="credit-card"
            size={22}
          />
        ),
        style: animated1Style
      },
      {
        subComponent: (
          <AnimatedIcon1
            style={[styles.icon, styles.bigIcon]}
            name="credit-card"
            size={20}
          />
        ),
        mainComponent: (
          <AnimatedIcon1
            style={[styles.icon, styles.bigIcon, styles.mainIcon]}
            name="credit-card"
            size={20}
          />
        )
      }
    ];

    return (
      <Animated.View style={[styles.container, animatedFocused]}>
        <Animated.View style={[styles.animatedContainer]}>
          <Animated.View style={[styles.animatedIconContainer]}>
            <Svg width="100%" height="100%">
              <Rect
                ref={this.refRect}
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill={MAIN_COLOR}
                rx={18}
              />
            </Svg>
            {this.renderAnimated(data)}
          </Animated.View>
          <Animated.View style={styles.scanContainer}>
            <Animated.View style={[styles.scanWrapper, animatedScanStyle]}>
              <Animated.View style={[styles.scanLTR]} />
              <Animated.View
                style={[styles.scanRTL, animatedScanBackgroundColorStyle]}
              />
            </Animated.View>
          </Animated.View>
        </Animated.View>
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    ...elevationShadowStyle(5, 0, 2),
    borderRadius: 18,
    zIndex: 1,
    alignItems: 'center'
  },
  animatedContainer: {
    zIndex: 1,
    width: SHAPE_DIMENSSION,
    height: SHAPE_DIMENSSION,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  animatedIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  animatedIconBackground: {
    position: 'absolute',
    flex: 1,
    backgroundColor: SUB_COLOR,
    width: '100%',
    height: '100%'
  },
  iconContainer: {
    position: 'absolute',
    backgroundColor: MAIN_COLOR,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    textAlign: 'center',
    color: MAIN_COLOR,
    height: 18
  },
  mainIcon: {
    color: SUB_COLOR
  },
  bigIcon: {
    height: 19
  },
  scanContainer: {
    position: 'absolute',
    borderRadius: 18,
    height: SHAPE_DIMENSSION,
    width: SHAPE_DIMENSSION,
    overflow: 'hidden'
  },
  scanWrapper: {
    left: 0,
    height: '100%',
    width: 0.5,
    position: 'absolute'
  },
  scanLTR: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: SUB_COLOR
  },
  scanRTL: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: MAIN_COLOR,
    position: 'absolute'
  },
  labelContainer: {
    zIndex: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default CreditCardTabButton;
