import {TextInputProps} from 'react-native';
import {TypoType} from '../Typography';

export {default} from './Input';

export interface InputProps extends TextInputProps {
  type?: TypoType;
}
