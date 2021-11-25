import {ViewProps} from 'react-native';

import { Children } from '..';

export {default} from './Skeleton';

export interface SkeletonProps extends ViewProps {
  container?: boolean;
  content?: boolean;

  children?: Children;
}
