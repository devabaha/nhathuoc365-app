import {ScrollViewProps as RNScrollViewProps} from 'react-native';
import {Children} from '..';

export {default} from './ScrollView';

export interface ScrollViewProps extends RNScrollViewProps {
  safeLayout?: boolean;
  safeTopLayout?: boolean;
  reanimated?: boolean;
  animated?: boolean;

  children?: Children;
}
