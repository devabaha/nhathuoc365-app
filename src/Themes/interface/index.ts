import {StyleProp, TextStyle, ViewStyle} from 'react-native';

export interface Theme {
  id: string;
  color: any;
  layout: any;
}

export type Style =
  | StyleProp<ViewStyle | TextStyle>
  | StyleProp<ViewStyle | TextStyle>[];
