import {Theme} from './interface';
import {BASE_COLOR_DARK} from './color';
import {LAYOUT_DARK} from './layout';
import {TYPOGRAPHY_DARK} from './typography';

export const BASE_DARK_THEME_ID = 'dark-theme';
export const BASE_DARK_THEME: Theme = {
  id: BASE_DARK_THEME_ID,
  color: BASE_COLOR_DARK,
  layout: LAYOUT_DARK,
  typography: TYPOGRAPHY_DARK,
};
