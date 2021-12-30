import {StyleSheet} from 'react-native';

import {Style, Theme} from '../interface';
import {BASE_DARK_THEME_ID} from '../Theme.dark';

export const mergeStyles = (style1: Style, style2: Style) => {
  return StyleSheet.compose(style1, style2);
};

export const isDarkTheme = (currentTheme: Theme) => {
  return currentTheme.id === BASE_DARK_THEME_ID;
};
