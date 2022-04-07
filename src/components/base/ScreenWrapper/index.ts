import {ViewProps} from 'react-native';
import {Children} from '..';

export {default} from './ScreenWrapper';

export interface ScreenWrapperProps extends ViewProps {
  safeLayout?: boolean;
  safeTopLayout?: boolean;
  noBackground?: boolean;

  headerComponent?: Children;
  children?: Children;
}
