import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, Animated} from 'react-native';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';
import Pressable from 'src/components/Pressable';

const styles = StyleSheet.create({
  actionTitle: {
    fontWeight: '600',
  },
  actionBtnContainer: {
    marginRight: 15,
  },
  maskBtn: {
    width: '150%',
    height: '150%',
    left: '-25%',
    top: '-25%',
    position: 'absolute',
  },
});

const ActionBtn = ({
  title,
  highlight,
  style,
  contentStyle,
  titleStyle,
  maskStyle,
  onPress = () => {},
}) => {
  const {theme} = useTheme();

  const [animationValue, setAnimation] = useState(new Animated.Value(0));
  const animatedPressing = useRef(new Animated.Value(0));

  const setAnimationValue = useCallback((animatedValue) => {
    setAnimation(animatedValue);
  }, []);

  const animatedMaskStyle = {
    opacity: animationValue,
  };

  const animatedPressingStyle = {
    opacity: animatedPressing.current.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0],
    }),
    transform: [
      {
        scale: animatedPressing.current.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.1, 1],
        }),
      },
    ],
  };

  const animatedTextPressingStyle = {
    transform: [
      {
        scale: animatedPressing.current.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.1, 1],
        }),
      },
    ],
  };

  const handlePress = useCallback(() => {
    Animated.spring(animatedPressing.current, {
      toValue: 1,
      speed: 1.5,
      useNativeDriver: true,
    }).start(() => {
      animatedPressing.current.setValue(0);
    });
    onPress();
  }, [highlight]);

  const titleExtraStyle = useMemo(
    () => highlight && {color: theme.color.persistPrimary},
    [theme, highlight],
  );

  const maskBtnStyle = useMemo(
    () => ({
      backgroundColor: theme.color.grey300,
      borderRadius: theme.layout.borderRadiusExtraSmall,
    }),
    [theme],
  );

  return (
    <Pressable
      onPress={handlePress}
      refAnimationValue={setAnimationValue}
      style={[styles.actionBtnContainer, style]}
      contentStyle={contentStyle}>
      <Animated.View
        style={[styles.maskBtn, maskBtnStyle, animatedPressingStyle, maskStyle]}
      />
      <Animated.View
        style={[styles.maskBtn, maskBtnStyle, animatedMaskStyle, maskStyle]}
      />
      <Typography
        animated
        type={TypographyType.LABEL_MEDIUM_TERTIARY}
        style={[
          styles.actionTitle,
          titleExtraStyle,
          animatedTextPressingStyle,
          titleStyle,
        ]}>
        {title}
      </Typography>
    </Pressable>
  );
};

export default memo(ActionBtn);
