import {ViewProps} from 'react-native';

import {Children} from '..';

export {default} from './Container';

export interface ContainerProps extends ViewProps {
  safeLayout?: boolean,
  
  reanimated?: boolean;
  animated?: boolean;

  content?: boolean;
  noBackground?: boolean;
  shadow?: boolean;
  flex?: boolean;
  row?: boolean;
  center?: boolean;
  centerVertical?: boolean;
  centerHorizontal?: boolean;

  children?: Children | Children[];
}