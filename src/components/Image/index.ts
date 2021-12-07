import {StyleProp, ViewProps} from 'react-native';
import {
  FastImageProps,
  ImageStyle as FIImageStyle,
  Source,
} from 'react-native-fast-image';

export {default} from './Image';

export type ImageStyle = FIImageStyle;
export type ImageSource = Source | number;

export interface ImageProps extends FastImageProps {
  renderError?: Function;
  errorColor?: string;
  loadingColor?: string;
  canTouch?: boolean;
  containerStyle?: StyleProp<ViewProps>;
  onLoadError?: () => void;
  onLoadEnd?: () => void;
}
