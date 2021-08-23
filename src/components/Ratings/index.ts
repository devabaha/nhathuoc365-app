export {default} from './Ratings';
import {SwipeRatingProps, TapRatingProps} from 'react-native-ratings';

type RatingType = 'rating' | 'airbnb';

export interface RatingsProps extends SwipeRatingProps, TapRatingProps {
  type?: RatingType;
  onFinishRating: (number) => void;
}
