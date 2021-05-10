import React, {useCallback, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, Easing} from 'react-native';
import Container from 'src/components/Layout/Container';
import Pressable from 'src/components/Pressable';
import {SOCIAL_BUTTON_TYPES} from 'src/constants/social';
import appConfig from 'app-config';
import FloatingIcons from '../../FloatingIcons ';

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 5,
    paddingHorizontal: 15,
  },
  container: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 13,
    color: '#777',
    marginRight: 15,
  },
  actionTitle: {
    fontWeight: '600',
    color: '#666',
  },

  actionBtnContainer: {
    marginRight: 15,
  },
  maskBtn: {
    backgroundColor: '#ccc',
    width: '150%',
    height: '150%',
    left: '-25%',
    top: '-25%',
    position: 'absolute',
    borderRadius: 4,
  },
});

const BubbleBottom = ({created, isLiked, onActionPress = () => {}}) => {
  const {t} = useTranslation('social');
  const [liked, setLiked] = useState(isLiked);

  const onPressReaction = useCallback(
    (type) => {
      switch (type) {
        case SOCIAL_BUTTON_TYPES.LIKE:
          if (!liked) {
            hapticFeedBack();
          }
          setLiked(!liked);
          break;
      }
      onActionPress(type);
    },
    [liked],
  );

  return (
    <Container row style={styles.wrapper}>
      <Container row style={styles.container}>
        <Text style={styles.time}>{created}</Text>

        <ActionBtn
          title={t('like')}
          highlight={liked}
          onPress={() => onPressReaction(SOCIAL_BUTTON_TYPES.LIKE)}
        />
        <ActionBtn
          title={t('reply')}
          onPress={() => onPressReaction(SOCIAL_BUTTON_TYPES.REPLY)}
        />
      </Container>

      {liked && (
        <FloatingIcons
          wrapperStyle={{position: 'absolute', right: 15}}
          icons="like1"
          prefixTitle={1}
        />
      )}
    </Container>
  );
};

export default React.memo(BubbleBottom);

const ActionBtn = React.memo(({title, highlight, onPress}) => {
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

  const titleExtraStyle = highlight && {color: appConfig.colors.primary};

  return (
    <Pressable
      hitSlop={HIT_SLOP}
      onPress={handlePress}
      refAnimationValue={setAnimationValue}
      style={styles.actionBtnContainer}>
      <Animated.View style={[styles.maskBtn, animatedPressingStyle]} />
      <Animated.View style={[styles.maskBtn, animatedMaskStyle]} />
      <Animated.Text
        style={[
          styles.actionTitle,
          titleExtraStyle,
          animatedTextPressingStyle,
        ]}>
        {title}
      </Animated.Text>
    </Pressable>
  );
});
