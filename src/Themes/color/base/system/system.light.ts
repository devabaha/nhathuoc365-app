import {hexToRgba, rgbaToRgb} from 'app-helper';
import {ColorValue, Platform, PlatformColor} from 'react-native';
import {CORE} from '../core';

const SYSTEM_COMMON = {
  // ACCENT (Nature)
  primary: CORE.primary,
  // —— Primary variants ——
  primary5: rgbaToRgb(hexToRgba(CORE.primary, 0.05)),
  primary20: rgbaToRgb(hexToRgba(CORE.primary, 0.2)),
  primaryLight: CORE.primaryLight,
  primaryDark: CORE.primaryDark,
  onPrimary: CORE.onPrimary,

  secondary: CORE.secondary,
  // —— Secondary variants ——
  secondary5: rgbaToRgb(hexToRgba(CORE.secondary, 0.05)),
  secondary20: rgbaToRgb(hexToRgba(CORE.secondary, 0.2)),
  secondaryLight: CORE.secondaryLight,
  secondaryDark: CORE.secondaryDark,
  onSecondary: CORE.onSecondary,

  // NEUTRAL (Nature)
  neutral: CORE.neutral,
  // —— Neutral variants ——
  background: CORE.background,
  onBackground: CORE.onBackground,
  surface: CORE.surface,
  onSurface: CORE.onSurface,
  persistOnSurface: CORE.onSurface,
};

export const SYSTEM_LIGHT = {
  ...SYSTEM_COMMON,
  // MAPPING
  // —— GREY variants ——
  border: CORE.grey300,
  placeholder: CORE.grey400,
  disabled: CORE.grey300,
  onDisabled: CORE.grey500,

  overlay60: hexToRgba(CORE.black, 0.6),
  overlay30: hexToRgba(CORE.black, 0.3),
  onOverlay: CORE.white,
  underlay: CORE.grey200, // use for touchableHighlight
  shadow: CORE.black,

  // statusBarBackground: android ? primaryDark : transparent,
  // statusBarStyle: contrast with statusBarBackground,
  navBarBackground: SYSTEM_COMMON.primary,
  onNavBarBackground: SYSTEM_COMMON.onPrimary,

  contentBackgroundWeak: CORE.grey200,
  contentBackground: CORE.grey300,
  contentBackgroundStrong: CORE.grey400,
  onContentBackground: SYSTEM_COMMON.onSurface,

  persistPrimary: CORE.primary,
  onPersistPrimary: CORE.onPrimary,
  persistSecondary: CORE.secondary,
  onPersistSecondary: CORE.onSecondary,

  primaryHighlight: SYSTEM_COMMON.primary,
  secondaryHighlight: SYSTEM_COMMON.secondary,
  surfaceHighlight: SYSTEM_COMMON.surface,

  // TEXT/ ICON COLOR
  // for text in general, still can use others color like onPrimary and onSecondary for specific purpose.
  persistTextPrimary: SYSTEM_COMMON.persistOnSurface,
  textPrimary: SYSTEM_COMMON.onSurface,
  textSecondary: SYSTEM_COMMON.neutral,
  textTertiary: CORE.grey700,
  textInactive: CORE.grey600,

  iconInactive: CORE.grey600,

  indicator: (Platform.OS === 'android'
    ? PlatformColor('?attr/colorAccent')
    : '#999999') as ColorValue,
};
