import {StyleProp, ViewProps} from 'react-native';
import {FastImageProps} from 'react-native-fast-image';

export {default} from './Image';

export interface ImageProps extends FastImageProps {
  renderError?: Function;
  errorColor?: string;
  loadingColor?: string;
  canTouch?: boolean;
  containerStyle?: StyleProp<ViewProps>;
  onLoadError?: () => void;
  onLoadEnd?: () => void;
}
