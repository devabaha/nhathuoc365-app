import {TextInputProps} from 'react-native';
import {TypographyType} from '../Typography';

export {default} from './Input';

export interface InputProps extends TextInputProps {
  type?: TypographyType;
}
