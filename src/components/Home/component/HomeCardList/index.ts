import {StyleProp, ViewStyle} from 'react-native';

export {default} from './HomeCardList';
export {default as HomeCardItem} from './HomeCardItem';

export interface HomeCardListSkeletonProps {
  itemContainerStyle?: StyleProp<ViewStyle>;
  mainStyle?: StyleProp<ViewStyle>;
}
