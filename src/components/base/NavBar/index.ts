import {StyleProp, ViewStyle} from 'react-native';
import {Children} from '..';
import {ContainerProps} from '../Container';
import NavBarWrapper from './NavBarWrapper';

export {default} from './NavBar';
export {NavBarWrapper};

export interface NavBarWrapperProps extends ContainerProps {
  appNavBar?: boolean;
  containerStyle?: StyleProp<ViewStyle>;

  children: Children;
}
