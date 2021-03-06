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

  // OTHERS
  coreOverlay: CORE.black,
};

export const SYSTEM_LIGHT = {
  ...SYSTEM_COMMON,
  // MAPPING
  // —— GREY variants ——
  border: CORE.grey300,
  placeholder: CORE.grey500,
  disabled: '#eeeeee',
  onDisabled: CORE.grey500,

  overlay60: hexToRgba(SYSTEM_COMMON.coreOverlay, 0.6),
  overlay30: hexToRgba(SYSTEM_COMMON.coreOverlay, 0.3),
  onOverlay: CORE.white,
  underlay: hexToRgba(SYSTEM_COMMON.coreOverlay, 0.1), // use for touchableHighlight
  shadow: CORE.black,

  // for Android
  statusBarBackground: SYSTEM_COMMON.primary,
  statusBarBackgroundSurfaceMode: SYSTEM_COMMON.surface,

  navBarBackground: SYSTEM_COMMON.primary,
  onNavBarBackground: SYSTEM_COMMON.onPrimary,

  contentBackgroundPrimary: SYSTEM_COMMON.primary20,
  contentBackgroundWeak: CORE.grey200,
  contentBackground: CORE.grey300,
  contentBackgroundStrong: CORE.grey400,
  onContentBackground: SYSTEM_COMMON.onSurface,

  persistPrimary: CORE.primary,
  persistPrimary5: SYSTEM_COMMON.primary5,
  persistPrimary20: SYSTEM_COMMON.primary20,
  onPersistPrimary: CORE.onPrimary,
  persistSecondary: CORE.secondary,
  persistSecondary20: SYSTEM_COMMON.secondary20,
  onPersistSecondary: CORE.onSecondary,

  primaryHighlight: SYSTEM_COMMON.primary,
  onPrimaryHighlight: CORE.onPrimary,
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
