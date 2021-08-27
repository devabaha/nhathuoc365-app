import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';

import appConfig from 'app-config';

import {RatingsProps} from '.';

const styles = StyleSheet.create({});

const Ratings = ({
  type = 'rating',
  count = 5,
  ratingCount = 5,
  ...props
}: RatingsProps) => {
  return type === 'rating' ? (
    <Rating
      startingValue={ratingCount}
      imageSize={20}
      minValue={1}
      showRating={false}
      ratingBackgroundColor="transparent"
      ratingColor={appConfig.colors.status.warning}
      tintColor={appConfig.colors.sceneBackground}
      {...props}
    />
  ) : (
    <AirbnbRating
      showRating={false}
      defaultRating={count}
      selectedColor={appConfig.colors.status.warning}
      reviewColor={appConfig.colors.sceneBackground}
      {...props}
    />
  );
};

export default React.memo(Ratings);
