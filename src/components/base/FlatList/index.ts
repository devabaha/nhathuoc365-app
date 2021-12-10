import {FlatListProps as RNFlatListProps} from 'react-native';

import {Children} from '..';

export {default} from './FlatList';

export interface FlatListProps extends RNFlatListProps<any> {
  safeLayout?: boolean;
  reanimated?: boolean;
  animated?: boolean;
}
