import {StyleSheet} from 'react-native';

import {Style} from '../interface';

export const mergeStyles = (style1: Style, style2: Style) => {
  return StyleSheet.compose(style1, style2);
};
