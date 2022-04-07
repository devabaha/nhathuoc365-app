import {Theme} from './interface';
import {BASE_COLOR_LIGHT} from './color';
import {LAYOUT_LIGHT} from './layout';
import {TYPOGRAPHY_LIGHT} from './typography';
import {
  BASE_LIGHT_THEME_ID,
  BASE_LIGHT_THEME_NAME,
  CUSTOM_LIGHT_THEME_1_ID,
  CUSTOM_LIGHT_THEME_1_NAME,
} from './constants';
import {rgbaToRgb, hexToRgba} from 'app-helper';

export {BASE_LIGHT_THEME_ID, BASE_LIGHT_THEME_NAME};
export const BASE_LIGHT_THEME: Theme = {
  id: BASE_LIGHT_THEME_ID,
  name: BASE_LIGHT_THEME_NAME,
  color: BASE_COLOR_LIGHT,
  layout: LAYOUT_LIGHT,
  typography: TYPOGRAPHY_LIGHT,
};

export {CUSTOM_LIGHT_THEME_1_ID, CUSTOM_LIGHT_THEME_1_NAME};
const CUSTOM_LIGHT_THEME_1_SECONDARY_COLOR = '#268423';
const CUSTOM_LIGHT_THEME_1_SECONDARY_5_COLOR = rgbaToRgb(
  hexToRgba(CUSTOM_LIGHT_THEME_1_SECONDARY_COLOR, 0.05),
);
const CUSTOM_LIGHT_THEME_1_SECONDARY_20_COLOR = rgbaToRgb(
  hexToRgba(CUSTOM_LIGHT_THEME_1_SECONDARY_COLOR, 0.2),
);
export const CUSTOM_LIGHT_THEME_1: Theme = {
  ...BASE_LIGHT_THEME,
  id: CUSTOM_LIGHT_THEME_1_ID,
  name: CUSTOM_LIGHT_THEME_1_NAME,
  color: {
    ...BASE_COLOR_LIGHT,
    // SECONDARY
    secondary: CUSTOM_LIGHT_THEME_1_SECONDARY_COLOR,
    // —— Secondary variants ——
    secondaryLight: '#5cb551',
    secondaryDark: '#005600',
    secondary5: CUSTOM_LIGHT_THEME_1_SECONDARY_5_COLOR,
    secondary20: CUSTOM_LIGHT_THEME_1_SECONDARY_20_COLOR,
    persistSecondary: CUSTOM_LIGHT_THEME_1_SECONDARY_COLOR,
    persistSecondary20: CUSTOM_LIGHT_THEME_1_SECONDARY_20_COLOR,
    secondaryHighlight: CUSTOM_LIGHT_THEME_1_SECONDARY_COLOR,
  },
};
