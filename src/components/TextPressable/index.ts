import {ColorValue, StyleProp, TextProps, TextStyle} from 'react-native';
import {Children} from '../base';

export {default} from './TextPressable';

export interface TextPressableProps extends TextProps {
  children: Children;
}
