import {ListRenderItem, StyleProp, ViewStyle} from 'react-native';

export {default} from './HomeCardList';
export {default as HomeCardItem} from './HomeCardItem';

export interface HomeCardListSkeletonProps {
  containerStyle?: StyleProp<ViewStyle>;
  itemContainerStyle?: StyleProp<ViewStyle>;
  mainStyle?: StyleProp<ViewStyle>;

  renderItem?:  ListRenderItem<any> | null | undefined;
}
