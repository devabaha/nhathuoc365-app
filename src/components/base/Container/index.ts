import {ViewProps} from 'react-native';

export {default} from './Container';

export interface ContainerProps extends ViewProps {
  reanimated?: boolean;
  animated?: boolean;

  children?: React.ReactNode | React.ReactNode[];
}
