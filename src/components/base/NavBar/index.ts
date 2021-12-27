import {StyleProp, ViewStyle} from 'react-native';
import {Style} from 'src/Themes/interface';
import {Children} from '..';
import {ContainerProps} from '../Container';
import NavBarWrapper from './NavBarWrapper';

export {default} from './NavBar';
export {NavBarWrapper};

export interface NavBarWrapperProps extends ContainerProps {
  appNavBar?: boolean;
  containerStyle?: StyleProp<ViewStyle>;

  renderBackground?: () => Children;

  children?: Children;
}

export interface NavBarProps extends NavBarWrapperProps {
  navigation: any;
  noBackground?: boolean;
  back?: boolean;

  renderLeft?: () => Children;
  renderRight?: () => Children;
  renderTitle?: () => Children;

  renderHeader?: () => Children;
  renderBack?: (iconStyle: Style) => Children;
}
