import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Container from 'src/components/Layout/Container';
import Pressable from 'src/components/Pressable';
import {SOCIAL_BUTTON_TYPES} from 'src/constants/social';
import appConfig from 'app-config';
import FloatingIcons from '../../FloatingIcons ';

const styles = StyleSheet.create({
  wrapperContainer: {
    marginTop: 5,
    paddingLeft: 10,
  },
  wrapper: {
    justifyContent: 'space-between',
  },
  container: {
    // alignItems: 'flex-end',
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

  pendingContainer: {
    marginTop: appConfig.device.isIOS ? 5 : 3,
    marginBottom: 3,
  },
  pendingIcon: {
    fontSize: 7,
    color: appConfig.colors.status.warning,
    marginRight: 5,
  },
  pendingMessage: {
    fontSize: 12,
    color: appConfig.colors.status.warning,
  },
  icon: {
    position: 'absolute',
    right: 0,
    // bottom:0
  },
});

const BubbleBottom = ({
  isLoading,
  isPending,
  pendingMessage,
  bottomMainTitleStyle,
  message,
  isLiked,
  totalReaction,
  onActionPress = () => {},
}) => {
  const {t} = useTranslation('social');
  const [liked, setLiked] = useState(isLiked);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

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
    <Container centerVertical={false} style={styles.wrapperContainer}>
      {isPending && (
        <Container row style={styles.pendingContainer}>
          <FontAwesomeIcon name="circle" style={styles.pendingIcon} />
          <Text style={styles.pendingMessage}>{pendingMessage}</Text>
        </Container>
      )}
      <Container row style={styles.wrapper}>
        <Container row style={styles.container}>
          <Text style={[styles.time, bottomMainTitleStyle]}>{message}</Text>

          {!isLoading && (
            <>
              <ActionBtn
                title={t('like')}
                highlight={liked}
                onPress={() => onPressReaction(SOCIAL_BUTTON_TYPES.LIKE)}
              />
              <ActionBtn
                title={t('reply')}
                onPress={() => onPressReaction(SOCIAL_BUTTON_TYPES.REPLY)}
              />
            </>
          )}
        </Container>

        {(!!liked || !!totalReaction) && (
          <FloatingIcons
            wrapperStyle={styles.icon}
            icons="like1"
            prefixTitle={totalReaction}
          />
        )}
      </Container>
    </Container>
  );
};

export default React.memo(BubbleBottom);

export const ActionBtn = React.memo(
  ({title, highlight, style, contentStyle, titleStyle, maskStyle, onPress}) => {
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
        onPress={handlePress}
        refAnimationValue={setAnimationValue}
        style={[styles.actionBtnContainer, style]}
        contentStyle={contentStyle}>
        <Animated.View
          style={[styles.maskBtn, animatedPressingStyle, maskStyle]}
        />
        <Animated.View style={[styles.maskBtn, animatedMaskStyle, maskStyle]} />
        <Animated.Text
          style={[
            styles.actionTitle,
            titleExtraStyle,
            animatedTextPressingStyle,
            titleStyle,
          ]}>
          {title}
        </Animated.Text>
      </Pressable>
    );
  },
);
