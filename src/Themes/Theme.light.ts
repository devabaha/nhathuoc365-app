import {Theme} from './interface';
import {BASE_COLOR_LIGHT} from './color';
import {LAYOUT} from './layout';
import {TYPOGRAPHY_LIGHT} from './typography';

export const BASE_LIGHT_THEME_ID = 'light-theme';
export const BASE_LIGHT_THEME: Theme = {
  id: BASE_LIGHT_THEME_ID,
  color: BASE_COLOR_LIGHT,
  layout: LAYOUT,
  typography: TYPOGRAPHY_LIGHT,
};
