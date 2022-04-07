import {TextInputProps} from 'react-native';
import {Style} from 'src/Themes/interface';
import {BUNDLE_ICON_TYPE} from '../Icon';
import {TypographyType} from '../Typography';

import AppInput from './AppInput';

export {AppInput};

export {default} from './Input';

export interface InputProps extends TextInputProps {
  type?: TypographyType;
}

export interface AppInputProps extends InputProps {
  iconLeftBundle?: BUNDLE_ICON_TYPE;
  iconLeftName?: string;
  iconLeftStyle?: Style;
  containerStyle?: Style;
}
