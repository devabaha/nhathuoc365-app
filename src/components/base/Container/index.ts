import {ViewProps} from 'react-native';

import {Children} from '..';

export {default} from './Container';

export interface ContainerProps extends ViewProps {
  reanimated?: boolean;
  animated?: boolean;

  flex?: boolean;
  row?: boolean;
  center?: boolean;
  centerVertical?: boolean;
  centerHorizontal?: boolean;

  children?: Children | Children[];
}
