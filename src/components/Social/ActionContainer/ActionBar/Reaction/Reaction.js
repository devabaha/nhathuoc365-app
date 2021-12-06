import React, {useCallback, useState, useEffect, useRef, useMemo} from 'react';
// 3-party libs
import {Easing, useValue, timing} from 'react-native-reanimated';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import Button from '../Button';

const Reaction = ({
  title,
  onPress,
  containerStyle,
  style,
  iconStyle,
  titleStyle,
  isLiked: isLikedProp,
}) => {
  const {theme} = useTheme();
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

  const highlightStyle = useMemo(() => {
    return {
      color: theme.color.persistPrimary,
    };
  }, [theme]);

  const animatedIconStyle = [
    isLiked && highlightStyle,
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

  const titleExtraStyle = isLiked && highlightStyle;

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
