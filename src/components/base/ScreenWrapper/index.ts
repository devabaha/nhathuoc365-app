import {ViewProps} from 'react-native';
import {Children} from '..';

export {default} from './ScreenWrapper';

export interface ScreenWrapperProps extends ViewProps {
  safeLayout?: boolean;

  headerComponent?: Children;
  children?: Children;
}
