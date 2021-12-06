import {StyleProp, TextProps, ViewProps} from 'react-native';
import { BundleIconSetName } from 'src/components/base/Icon/constants';

export {default} from './FloatingIcons';

export type Icon = {
  name: string;
  containerStyle?: StyleProp<ViewProps>;
  style?: StyleProp<TextProps>;
  bundle?: BundleIconSetName;
};

export interface FloatingIconsProps {
  icons: Array<Icon> | Icon | string;
  prefixTitle: string,
  
  wrapperStyle?: StyleProp<ViewProps>;
  containerStyle?: StyleProp<ViewProps>;
  style?: StyleProp<ViewProps>;
  iconContainerStyle?: StyleProp<ViewProps>;
  iconStyle?: StyleProp<TextProps>;
}
