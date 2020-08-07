import React, { Component, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
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
  onChange
} from 'react-native-reanimated';
import appConfig from 'app-config';
import { RectButton, PanGestureHandler, State } from 'react-native-gesture-handler';

import { useValue, useClock, usePanGestureHandler, translate, withOffset, withDecay, diffClamp, multiplyTo, between, clamp } from 'react-native-redash';
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
export const CARD_WIDTH = width * 0.8;
export const CARD_HEIGHT = CARD_WIDTH / 2;
const MARGIN = 16;
const HEIGHT = CARD_HEIGHT + MARGIN * 2;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
  },
  card: {
    marginVertical: MARGIN,
  },
});

const MultiTaskView = () => {
  const [containerHeight, setContainerHeight] = useState(height);
  const [cardsHeight, setCardsHeight] = useState(0);
  const { gestureHandler, translation, state, velocity, position } = usePanGestureHandler();
  // const translateX = diffClamp(
  //   withDecay({ value: translation.x, velocity: velocity.x, state }),
  //   -(cardsHeight - containerHeight),
  //   0
  // );
  const translateY = diffClamp(
    withDecay({ value: translation.y, velocity: velocity.y, state }),
    -(cardsHeight - containerHeight),
    0
  );
  const translateX = new Value(0);
  // const translateY = interpolate(y, {
  //   inputRange: [0, Math.abs(cardsHeight - containerHeight)],
  //   outputRange: [0, Math.abs(cardsHeight - containerHeight)],
  //   extrapolate: Extrapolate.CLAMP
  // })

  const root = 0, A = 50, clock = useClock();

  function translating(index: number) {
    let A = new Value(getRandomArbitrary(25, 200)), breakpoint1 = new Value(0), breakpoint2 = new Value(0), isResetA = new Value(0);

    return translate({
      x: block([
        cond(eq(state, State.BEGAN), [
          set(A, multiply(modulo(abs(translateY), A), 2)),
          call([A], ([a]) => index === 3 && console.log(a)),
          set(breakpoint1, multiply(A, .25)),
          set(breakpoint2, multiply(A, .75)),
        ]),
        cond(between(translateY, -Math.abs(cardsHeight - containerHeight), root, false),
          cond(between(modulo(abs(translateY), A), breakpoint1, breakpoint2),
            [
              // call([A], ([a]) => console.log(a)),
              interpolate(modulo(abs(translateY), A), {
                inputRange: [breakpoint1, breakpoint2],
                outputRange: [breakpoint1, multiply(breakpoint1, -1)],
                extrapolate: Extrapolate.CLAMP
              })
            ],
            interpolate(modulo(abs(translateY), A), {
              inputRange: [root, breakpoint1, breakpoint2, A],
              outputRange: [root, breakpoint1, multiply(breakpoint1, -1), root],
              extrapolate: Extrapolate.CLAMP
            }),
          ),
          root
        )
      ]),
      y: 0
    })
  }

  function getRandomArbitrary(min: number, max: number) {
    const random = Math.random() * (max - min) + min;
    console.log(random)
    return random;
  }

  return (
    <View
      style={styles.container}
      onLayout={({
        nativeEvent: {
          layout: { height: h },
        },
      }) => setContainerHeight(h)}
    >
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          onLayout={({
            nativeEvent: {
              layout: { height: h },
            },
          }) => setCardsHeight(h)}
          style={{
            transform: [{ translateY }]
          }}
        >
          {cards.map((card, index) => {
            return (
              <Animated.View
                key={index}
                style={[styles.card, {
                  transform: translating(index)
                }]}
              >
                <Card {...{ card }} />
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
}

const Card = ({ card }: CardProps) => {
  return <View style={[cardstyles.card, { backgroundColor: card }]} />;
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