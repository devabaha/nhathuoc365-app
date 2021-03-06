import {hexToRgba, rgbaToRgb} from 'app-helper';
import {CORE} from '../core';
import {SYSTEM_LIGHT} from './system.light';

const SYSTEM_COMMON = {
  // ACCENT (Nature)
  primary: '#212121',
  // —— Primary variants ——
  primaryLight: '#3d3d3d',
  primaryDark: '#181818',
  onPrimary: '#FFFFFF',

  secondary: '#212121',
  // —— Secondary variants ——
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

  // OTHERS
  coreOverlay: CORE.black,
};

export const SYSTEM_DARK = {
  ...SYSTEM_LIGHT,
  ...SYSTEM_COMMON,

  primary5: rgbaToRgb(hexToRgba(SYSTEM_COMMON.primary, 0.05)),
  primary20: rgbaToRgb(hexToRgba(SYSTEM_COMMON.primary, 0.2)),

  secondary5: rgbaToRgb(hexToRgba(SYSTEM_COMMON.secondary, 0.05)),
  secondary20: rgbaToRgb(hexToRgba(SYSTEM_COMMON.secondary, 0.2)),

  border: CORE.grey700,
  placeholder: CORE.grey500,
  disabled: '#444444',

  onOverlay: CORE.white,
  // underlay: hexToRgba(SYSTEM_COMMON.coreOverlay, 0.2),

  // for Android
  statusBarBackground: SYSTEM_COMMON.primary,
  statusBarBackgroundSurfaceMode: SYSTEM_COMMON.surface,

  navBarBackground: SYSTEM_COMMON.primary,
  onNavBarBackground: SYSTEM_COMMON.onPrimary,

  contentBackgroundPrimary: rgbaToRgb(hexToRgba(SYSTEM_COMMON.primary, 0.8)),
  contentBackgroundWeak: CORE.grey800,
  contentBackground: SYSTEM_COMMON.neutral,
  contentBackgroundStrong: CORE.grey600,
  onContentBackground: SYSTEM_COMMON.onSurface,

  persistPrimary: CORE.primary,
  persistSecondary: CORE.secondary,

  primaryHighlight: SYSTEM_COMMON.onSurface,
  onPrimaryHighlight: SYSTEM_COMMON.surface,
  secondaryHighlight: SYSTEM_COMMON.onSurface,
  surfaceHighlight: SYSTEM_COMMON.onSurface,

  // TEXT/ ICON COLOR
  // for text in general, still can use others color like onPrimary and onSecondary for specific purpose.
  persistTextPrimary: SYSTEM_COMMON.persistOnSurface,
  textPrimary: SYSTEM_COMMON.onSurface,
  textSecondary: SYSTEM_COMMON.neutral,
  textTertiary: CORE.grey600,
  textInactive: CORE.grey500,

  iconInactive: CORE.grey600,
  indicator: SYSTEM_COMMON.onSurface,
};
