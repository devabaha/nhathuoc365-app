import {Appearance} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isDarkTheme} from 'src/Themes/helper';
import {THEME_STORAGE_KEY} from 'src/constants';

export const saveTheme = (theme) => {
  AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
};

export const isDarkMode = (theme) => {
  return isDarkTheme(theme) || Appearance.getColorScheme() === 'dark';
};
