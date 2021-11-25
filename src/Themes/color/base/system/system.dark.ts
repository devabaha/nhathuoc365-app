import { hexToRgba, rgbaToRgb } from 'app-helper';
import {CORE} from '../core';
import {SYSTEM_LIGHT} from './system.light';

const SYSTEM_COMMON = {
  // ACCENT (Nature)
  primary: '#212121',
  // —— Primary variants ——
  primary20: rgbaToRgb(hexToRgba(CORE.primary, .2)),
  primaryLight: '#3d3d3d',
  primaryDark: '#181818',
  onPrimary: '#FFFFFF',

  secondary: '#212121',
  // —— Secondary variants ——
  secondary20: rgbaToRgb(hexToRgba(CORE.secondary, .2)),
  secondaryLight: '#3d3d3d',
  secondaryDark: '#181818',
  onSecondary: '#FFFFFF',

  // NEUTRAL (Nature)
  neutral: CORE.grey700,
  // —— Neutral variants ——
  background: '#121212',
  onBackground: '#ffffff',
  surface: '#2a2a2a',
  onSurface: '#ffffff',
  persistOnSurface: CORE.onSurface,

};

export const SYSTEM_DARK = {
  ...SYSTEM_LIGHT,
  ...SYSTEM_COMMON,

  border: CORE.grey700,
  onOverlay: CORE.white,

  navBarBackground: SYSTEM_COMMON.primary,
  onNavBarBackground: SYSTEM_COMMON.onPrimary,

  contentBackground: SYSTEM_COMMON.neutral,
  onContentBackground: SYSTEM_COMMON.onSurface,

  persistPrimary: CORE.primary,
  persistSecondary: CORE.secondary,

  primaryHighlight: SYSTEM_COMMON.onSurface,
  secondaryHighlight: SYSTEM_COMMON.onSurface,
  surfaceHighlight: SYSTEM_COMMON.onSurface,

  // TEXT/ ICON COLOR
  // for text in general, still can use others color like onPrimary and onSecondary for specific purpose.
  persistTextPrimary: SYSTEM_COMMON.persistOnSurface,
  textPrimary: SYSTEM_COMMON.onSurface,
  textSecondary: SYSTEM_COMMON.neutral,
  textInactive: CORE.grey500,

  iconInactive: CORE.grey600,
};
