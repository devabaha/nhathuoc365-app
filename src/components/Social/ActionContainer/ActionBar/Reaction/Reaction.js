import React, {useCallback, useState, useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {Easing, useValue, timing} from 'react-native-reanimated';

import Button from '../Button';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  highlight: {
    color: appConfig.colors.primary,
  },
});

const Reaction = ({
  title,
  onPress,
  containerStyle,
  style,
  iconStyle,
  titleStyle,
  isLiked: isLikedProp,
}) => {
  //   console.log('render reaction');
  const isDidMount = useRef(false);

  const [isLiked, setLiked] = useState(isLikedProp ? 1 : 0);

  const animatedScaleReaction = useValue(0);
  const animatedJumpReaction = useValue(0);

  useEffect(() => {
    if (isDidMount.current) {
      setLiked(isLikedProp ? 1 : 0);
    }
  }, [isLikedProp]);

  useEffect(() => {
    if (isDidMount.current) {
      animatedJumpReaction.setValue(0);
      if (isLiked) {
        timing(animatedJumpReaction, {
          toValue: 1,
          duration: 200,
          easing: Easing.bezier(0.46, 0.81, 0.82, 0.28),
        }).start(() => {});
      }
    }
  }, [isLiked]);

  useEffect(() => {
    isDidMount.current = true;
    return () => {
      isDidMount.current = false;
    };
  }, []);

  const handlePress = useCallback(() => {
    setLiked(!isLiked);

    animatedScaleReaction.setValue(0);
    hapticFeedBack();
    timing(animatedScaleReaction, {
      toValue: 1,
      duration: 150,
      easing: Easing.inOut(Easing.ease),
    }).start();

    onPress();
  }, [isLiked]);

  const animatedScaleStyle = {
    transform: [
      {
        scale: animatedScaleReaction.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.1, 1],
        }),
      },
    ],
  };

  const animatedIconStyle = [
    isLiked && styles.highlight,
    {
      transform: [
        {
          scale: animatedJumpReaction.interpolate({
            inputRange: [0, 0.3, 1],
            outputRange: [1, 1.3, 1],
          }),
        },
        {
          rotate: animatedJumpReaction.interpolate({
            inputRange: [0, 0.3, 1],
            outputRange: ['0deg', '-15deg', '0deg'],
          }),
        },
      ],
    },
  ];

  const titleExtraStyle = isLiked && styles.highlight;

  return (
    <Button
      title={title}
      iconName={isLiked ? 'like1' : 'like2'}
      style={[animatedScaleStyle, style]}
      iconStyle={[animatedIconStyle, iconStyle]}
      onPress={handlePress}
      titleStyle={[titleExtraStyle, titleStyle]}
      containerStyle={containerStyle}
    />
  );
};

export default React.memo(Reaction);