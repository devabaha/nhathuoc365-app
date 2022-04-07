import {StyleProp, ViewProps} from 'react-native';
import {
  FastImageProps,
  ImageStyle as FIImageStyle,
  Source,
} from 'react-native-fast-image';
import {Children} from '../base';

export {default} from './Image';

export type ImageStyle = FIImageStyle;
export type ImageSource = Source | number;

export interface LightboxProps {
  activeProps?: {};
  renderHeader?: () => Children;
  renderContent?: () => Children;
  underlayColor?: string;
  backgroundColor?: string;
  didOpen?: () => void;
  onOpen?: () => void;
  willClose?: () => void;
  onClose?: () => void;
  springConfig?: {
    tension?: number;
    friction?: number;
  };
  swipeToDismiss?: boolean;
  style?: StyleProp<ViewProps>;
}

export interface ImageProps extends FastImageProps {
  renderError?: Function;
  errorColor?: string;
  loadingColor?: string;
  canTouch?: boolean;
  useNative?: boolean;
  lightBoxProps?: LightboxProps;
  containerStyle?: StyleProp<ViewProps>;
  onLoadError?: () => void;
  onLoadEnd?: () => void;
}
