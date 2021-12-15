import React from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import {Rating, AirbnbRating} from 'react-native-ratings';
// types
import {RatingsProps} from '.';
// context
import {useTheme} from 'src/Themes/Theme.context';

const styles = StyleSheet.create({});

const Ratings = ({
  type = 'rating',
  count = 5,
  ratingCount = 5,
  ...props
}: RatingsProps) => {
  const {theme} = useTheme();

  return type === 'rating' ? (
    <Rating
      startingValue={ratingCount}
      imageSize={20}
      minValue={1}
      showRating={false}
      ratingBackgroundColor="transparent"
      // @ts-ignore
      ratingColor={theme.color.warning}
      // @ts-ignore
      tintColor={theme.color.background}
      {...props}
    />
  ) : (
    <AirbnbRating
      showRating={false}
      defaultRating={count}
      // @ts-ignore
      selectedColor={theme.color.warning}
      // @ts-ignore
      reviewColor={theme.color.background}
      {...props}
    />
  );
};

export default React.memo(Ratings);
