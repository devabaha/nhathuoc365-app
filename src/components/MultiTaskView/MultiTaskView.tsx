import React, { Component, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, StyleProp, ViewStyle } from 'react-native';
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
  call,
  divide,
  modulo,
  multiply,
  floor,
  add,
  sub,
  lessOrEq,
  lessThan,
  abs,
  round,
  onChange,
  max,
  log,
  greaterOrEq
} from 'react-native-reanimated';
import appConfig from 'app-config';
import { RectButton, PanGestureHandler, State } from 'react-native-gesture-handler';

import { useValue, useClock, usePanGestureHandler, translate, withOffset, withDecay, diffClamp, multiplyTo, between, clamp, delay, withSpring, withSpringTransition, transformOrigin } from 'react-native-redash';
const StyleGuide = {
  spacing: 8,
  palette: {
    primary: "#3884ff",
    secondary: "#FF6584",
    tertiary: "#38ffb3",
    backgroundPrimary: "#d5e5ff", // === rgba(primary, 0.1)
    background: "#f2f2f2",
    border: "#f2f2f2",
  },
  typography: {
    body: {
      fontSize: 17,
      lineHeight: 20,
      fontFamily: "SFProText-Regular",
    },
    callout: {
      fontSize: 16,
      lineHeight: 20,
      fontFamily: "SFProText-Regular",
    },
    caption: {
      fontSize: 11,
      lineHeight: 13,
      fontFamily: "SFProText-Regular",
    },
    footnote: {
      fontSize: 13,
      lineHeight: 18,
      fontFamily: "SFProText-Regular",
      color: "#999999",
    },
    headline: {
      fontSize: 17,
      lineHeight: 22,
      fontFamily: "SFProText-Semibold",
    },
    subhead: {
      fontSize: 15,
      lineHeight: 20,
      fontFamily: "SFProText-Bold",
    },
    title1: {
      fontSize: 34,
      lineHeight: 41,
      fontFamily: "SFProText-Bold",
    },
    title2: {
      fontSize: 28,
      lineHeight: 34,
      fontFamily: "SFProText-Bold",
    },
    title3: {
      fontSize: 22,
      lineHeight: 26,
      fontFamily: "SFProText-Bold",
    },
  },
};
const { width, height } = appConfig.device;
const CARD_WIDTH = width * .8;
const CARD_HEIGHT = height * .7 * .9;
const CARD_MARGIN_SPACE = (width - CARD_WIDTH) / 2;
const MARGIN = 0;
const HEIGHT = CARD_HEIGHT + MARGIN * 2;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
  },
  card: {
    marginVertical: MARGIN,
    borderRadius: 20,
  },
});

const springConfig = {
  damping: 1200,
  mass: 1,
  stiffness: 1200,
  overshootClamping: true,
  restSpeedThreshold: 0.01,
  restDisplacementThreshold: 0.001,
}

const MultiTaskView = () => {
  const [containerHeight, setContainerHeight] = useState(height);
  const [containerWidth, setContainerWidth] = useState(width);
  const [cardsHeight, setCardsHeight] = useState(0);
  const { gestureHandler, translation, state, velocity, position } = usePanGestureHandler();
  const cardsWidth = CARD_WIDTH * cards.length + CARD_MARGIN_SPACE * 2;
  const translateX =
    withSpring(
      {
        value:
          withDecay({
            value:
              interpolate(translation.x, {
                inputRange: [-getSwipableWidth(), 0],
                outputRange: [
                  translation.x,
                  cond(greaterOrEq(translation.x, 1), divide(translation.x, 7))
                ],
                extrapolateRight: Extrapolate.CLAMP
              })
            , velocity: velocity.x, state, deceleration:.997
          })
        ,
        velocity: velocity.x,
        state,
        snapPoints: getSnapPoints(),
        config: springConfig
      }
    );

  function getSnapPoints() {
    const snapPoints = [0];
    cards.forEach((card: string, index: number) => {
      if (index < cards.length - 1) {
        snapPoints.push(-CARD_WIDTH * index - CARD_WIDTH);
      }
    })

    return snapPoints;
  }

  function getSwipableWidth() {
    return CARD_MARGIN_SPACE + (cards.length - 1) * CARD_WIDTH
  }

  console.log(CARD_WIDTH)
  return (
    <View
      style={styles.container}
      onLayout={({
        nativeEvent: {
          layout: { height, width },
        },
      }) => {
        setContainerHeight(height);
        setContainerWidth(width);
      }}
    >
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          onLayout={({
            nativeEvent: {
              layout: { height, width },
            },
          }) => {
            setCardsHeight(height);
          }}
          style={{
            width: cardsWidth,
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            justifyContent: 'flex-start',
            flex: 1,
            paddingHorizontal: CARD_MARGIN_SPACE
          }}
        >
          {cards.map((card, index) => {
            const SCALE_ARG = .9;
            const onRightEnd = -CARD_WIDTH * (index) + CARD_MARGIN_SPACE + CARD_WIDTH / 3;
            const onLeftEnd = -((CARD_WIDTH) * index) - CARD_MARGIN_SPACE;

            let extrapolate = {};
            if (index === 0) {
              extrapolate = { extrapolateLeft: Extrapolate.CLAMP };
            } else if (index < cards.length - 1) {
              extrapolate = { extrapolate: Extrapolate.CLAMP };
            } else {
              extrapolate = { extrapolate: Extrapolate.CLAMP };
            }
            return (
              <Animated.View
                key={index}
                style={[styles.card, {
                  // backgroundColor: '#999',
                  transform: [{
                    translateX: block([
                      withSpringTransition(
                        interpolate(translateX, {
                          inputRange: [-((CARD_WIDTH) * index) - CARD_MARGIN_SPACE, CARD_WIDTH * index],
                          outputRange: [-((CARD_WIDTH) * index) - CARD_MARGIN_SPACE - CARD_WIDTH * (1 - SCALE_ARG) / 2, (CARD_WIDTH + CARD_MARGIN_SPACE) * index * 2 / 3],
                          ...extrapolate
                        }),
                        springConfig,
                        velocity.x,
                        state
                      )
                    ])
                  }],
                }]}
              >
                <Animated.View
                  key={index}
                  style={[styles.card, {
                    opacity: index !== cards.length - 1
                      ? interpolate(
                        translateX,
                        {
                          inputRange: [onLeftEnd - CARD_WIDTH, onLeftEnd - CARD_WIDTH + CARD_MARGIN_SPACE / 2],
                          outputRange: [0.6, 1],
                          extrapolate: Extrapolate.CLAMP
                        })
                      : 1,
                    transform: [{
                      scale: interpolate(
                        translateX,
                        {
                          inputRange: [onLeftEnd, onLeftEnd + 10, onRightEnd],
                          outputRange: [SCALE_ARG, .94, 1],
                          extrapolate: Extrapolate.CLAMP
                        })

                    }]
                  }]}
                >
                  <Card
                    index={index}
                    {...{ card }
                    } />
                </Animated.View>
              </Animated.View>
            );
          })}
        </Animated.View>
      </PanGestureHandler>

    </View >
  );
};

export { MultiTaskView };












const cardstyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15
  },
});

export enum Cards {
  Card1 = 'red',
  Card2 = 'blue',
  Card3 = 'purple',
  Card4 = 'orange',
  Card5 = 'pink',
  Card6 = 'green',
}

export const cards = [
  Cards.Card1,
  Cards.Card2,
  Cards.Card3,
  Cards.Card4,
  Cards.Card5,
  Cards.Card6,
];

interface CardProps {
  card: Cards;
  index?: number;
  style?: StyleProp<ViewStyle>
}

const Card = ({ card, index, style }: CardProps) => {

  return <Animated.View style={[cardstyles.card,
  {
    backgroundColor: card,
    zIndex: index,
    // @ts-ignore
    ...elevationShadowStyle(15)
  },
    style
  ]} />;
};



interface ButtonProps {
  label: string;
  primary?: boolean;
  onPress: () => void;
}

const btnstyles = StyleSheet.create({
  container: {
    padding: StyleGuide.spacing * 2,
  },
  label: {
    textAlign: "center",
  },
});

const Button = ({ label, primary, onPress }: ButtonProps) => {
  const color = primary ? "white" : undefined;
  const backgroundColor = primary ? StyleGuide.palette.primary : undefined;
  return (
    <RectButton {...{ onPress }}>
      <SafeAreaView style={{ backgroundColor }} accessible>
        <View style={btnstyles.container}>
          <Text style={[btnstyles.label, { color }]}>
            {label}
          </Text>
        </View>
      </SafeAreaView>
    </RectButton>
  );
};