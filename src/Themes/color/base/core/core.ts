import {lightenColor} from 'app-helper';

export const CORE_COMMON = {
  // GREY
  grey50: '#FCFCFC',
  grey100: '#F7F7F7',
  grey200: '#F2F2F2',
  grey300: '#EAEAEA',
  grey400: '#C8C8C8',
  grey500: '#AAAAAA',
  grey600: '#808080',
  grey700: '#6B6B6B',
  grey800: '#4C4C4C',
  grey900: '#2A2A2A',

  // GREEN
  green50: '#e9f6e9',
  green100: '#cae9c8',
  green200: '#a9dba5',
  green300: '#86cd80',
  green400: '#6bc264',
  green500: '#51b748', //
  green600: '#48a83f',
  green700: '#3b9534',
  green800: '#30842a',
  green900: '#196516',

  // BLUE
  blue50: '#e2f1ff',
  blue100: '#b9dcff',
  blue200: '#8ac6ff',
  blue300: '#55b0ff',
  blue400: '#259eff',
  blue500: '#008dff',
  blue600: '#007fff',
  blue700: '#126cea', //
  blue800: '#1a5ad7',
  blue900: '#2138b8',

  // BLACK
  black: '#000000',

  // WHITE
  white: '#FFFFFF',

  // BLUE GREY
  blueGray: '#D3DCE2',
};

export const CORE = {
  ...CORE_COMMON,

  // PRIMARY
  primary: '#f41820',
  // —— Primary variants ——
  primaryLight: '#ff5e4b',
  primaryDark: '#b80000',
  onPrimary: '#FFFFFF',

  // SECONDARY
  secondary: '#f41820',
  // secondary: '#268423',
  // —— Secondary variants ——
  secondaryLight: '#ff5e4b',
  // secondaryLight: '#5cb551',
  secondaryDark: '#b80000',
  // secondaryDark: '#005600',
  onSecondary: '#FFFFFF',

  // NEUTRAL (Nature)
  neutral: CORE_COMMON.grey500,
  // —— Neutral variants ——
  background: '#E9E9EE',
  onBackground: '#000000',
  surface: '#FFFFFF',
  onSurface: '#000000',

  skeletonContainer: CORE_COMMON.blueGray,
  skeletonContent: lightenColor(CORE_COMMON.blueGray, -12),
};
