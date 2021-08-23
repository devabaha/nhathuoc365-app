import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  concat,
  Easing,
  color,
  Extrapolate,
} from 'react-native-reanimated';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import appConfig from 'app-config';

import Ratings from 'src/components/Ratings';
import {Container} from 'src/components/Layout';

const AnimatedIcon = Animated.createAnimatedComponent(AntDesignIcon);

const styles = StyleSheet.create({
  ratingWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  ratingContainer: {
    justifyContent: 'center',
    borderRadius: 4,
  },

  ratingTitleContainer: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  ratingTitle: {
    color: appConfig.colors.typography.text,
    fontWeight: '500',
    fontSize: 12,
  },

  ratingStarContainer: {
    position: 'absolute',
  },
  closeRatingContainer: {
    paddingLeft: 5,
    marginLeft: 7,
  },
  closeRatingIconContainer: {
    backgroundColor: appConfig.colors.status.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    borderRadius: 20,
    padding: 3,
  },
  closeRatingIcon: {
    color: appConfig.colors.white,
  },
});

const RatingAccessory = ({title = 'Đánh giá'}) => {
  const [isVisibleRating, setVisibleRating] = useState(false);
  const [ratingContainerWidth, setRatingContainerWidth] = useState(0);
  const [ratingWidth, setRatingWidth] = useState(0);
  const [animatedVisibleRating] = useState(new Animated.Value(0));

  const toggleRating = useCallback(() => {
    Animated.spring(animatedVisibleRating, {
      toValue: isVisibleRating ? 0 : 1,
      damping: isVisibleRating ? 30: 15,
      mass: .8,
      stiffness: 200,
    }).start();
    setVisibleRating(!isVisibleRating);
  }, [isVisibleRating]);

  const handleRatingContainerLayout = (e) => {
    if (!ratingContainerWidth) {
      setRatingContainerWidth(e.nativeEvent.layout.width);
    }
  };

  const handleRatingLayout = (e) => {
    setRatingWidth(e.nativeEvent.layout.width);
  };

  const animatedRatingContainerStyle = useMemo(
    () =>
      !!ratingContainerWidth && {
        width: animatedVisibleRating.interpolate({
          inputRange: [0, 1],
          outputRange: [ratingContainerWidth, ratingWidth],
          extrapolateLeft: Extrapolate.CLAMP,
        }),
        backgroundColor:
         color(
          ...hexToRgbCode(appConfig.colors.status.warning),
          animatedVisibleRating.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP,
          }),
        ),
      },
    [ratingContainerWidth, ratingWidth],
  );

  const animatedRatingTitleStyle = {
    opacity: animatedVisibleRating.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    }),
  };
  const animatedRatingStyle = {
    opacity: animatedVisibleRating.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
      extrapolate: Extrapolate.CLAMP,
    }),
    transform: [
      {
        translateX: animatedVisibleRating.interpolate({
          inputRange: [0, 1],
          outputRange: [-50, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.ratingWrapper}>
      <Animated.View
        onLayout={handleRatingContainerLayout}
        style={[styles.ratingContainer, animatedRatingContainerStyle]}>
        <TouchableHighlight
          disabled={isVisibleRating}
          hitSlop={HIT_SLOP}
          underlayColor="rgba(0,0,0,.1)"
          style={styles.ratingTitleContainer}
          onPress={toggleRating}>
          <Animated.Text style={[styles.ratingTitle, animatedRatingTitleStyle]}>
            {title}
          </Animated.Text>
          {/* <AnimatedIcon name="star" style={[ {color: appConfig.colors.white, alignSelf: 'center'}, animatedRatingTitleStyle]}/> */}
        </TouchableHighlight>

        <Container
          reanimated
          row
          pointerEvents={isVisibleRating ? 'auto' : 'none'}
          style={[styles.ratingStarContainer, animatedRatingStyle]}
          onLayout={handleRatingLayout}>
          <Ratings type="airbnb" size={20} />
          <TouchableOpacity
            hitSlop={HIT_SLOP}
            style={styles.closeRatingContainer}
            onPress={toggleRating}>
            <View style={styles.closeRatingIconContainer}>
              <AntDesignIcon name="close" style={styles.closeRatingIcon} />
            </View>
          </TouchableOpacity>
        </Container>
      </Animated.View>
    </View>
  );
};

export default React.memo(RatingAccessory);
