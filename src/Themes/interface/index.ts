import {ColorValue, StyleProp, TextStyle, ViewStyle} from 'react-native';

import {TypographyType} from 'src/components/base';
import {CartPaymentStatus, CartStatus} from 'src/constants/cart';
import {CartType, DeliveryStatusCode} from 'src/constants/cart';

export type Style =
  | StyleProp<ViewStyle | TextStyle>
  | StyleProp<ViewStyle | TextStyle>[];

export type Typography = {
  [TypographyType.LABEL_DISPLAY_SMALL]?: Style;

  [TypographyType.TITLE_LARGE]?: Style;
  [TypographyType.TITLE_SEMI_LARGE]?: Style;
  [TypographyType.TITLE_MEDIUM]?: Style;

  [TypographyType.LABEL_LARGE_PRIMARY]: Style;
  [TypographyType.LABEL_MEDIUM_PRIMARY]: Style;

  [TypographyType.LABEL_LARGE]?: Style;
  [TypographyType.LABEL_MEDIUM]?: Style;
  [TypographyType.LABEL_SMALL]?: Style;
  [TypographyType.LABEL_EXTRA_SMALL]?: Style;

  [TypographyType.DESCRIPTION_MEDIUM_PRIMARY]?: Style;
  [TypographyType.DESCRIPTION_SMALL_PRIMARY]?: Style;

  [TypographyType.DESCRIPTION_MEDIUM_TERTIARY]?: Style;
  [TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY]?: Style;
  [TypographyType.DESCRIPTION_SMALL_TERTIARY]?: Style;

  [TypographyType.DESCRIPTION_MEDIUM]?: Style;
  [TypographyType.DESCRIPTION_SEMI_MEDIUM]?: Style;
  [TypographyType.DESCRIPTION_SMALL]?: Style;

  [TypographyType.CAPTION]?: Style;
  [TypographyType.BUTTON_TEXT]?: Style;
};

export type Color = {
  // Core
  grey50: ColorValue;
  grey100: ColorValue;
  grey200: ColorValue;
  grey300: ColorValue;
  grey400: ColorValue;
  grey500: ColorValue;
  grey600: ColorValue;
  grey700: ColorValue;
  grey800: ColorValue;
  grey900: ColorValue;
  green50: ColorValue;
  green100: ColorValue;
  green200: ColorValue;
  green300: ColorValue;
  green400: ColorValue;
  green500: ColorValue;
  green600: ColorValue;
  green700: ColorValue;
  green800: ColorValue;
  green900: ColorValue;
  blue50: ColorValue;
  blue100: ColorValue;
  blue200: ColorValue;
  blue300: ColorValue;
  blue400: ColorValue;
  blue500: ColorValue;
  blue600: ColorValue;
  blue700: ColorValue;
  blue800: ColorValue;
  blue900: ColorValue;
  black: ColorValue;
  white: ColorValue;
  blueGray: ColorValue;
  primary: ColorValue;
  primaryLight: ColorValue;
  primaryDark: ColorValue;
  onPrimary: ColorValue;
  secondary: ColorValue;
  secondaryLight: ColorValue;
  secondaryDark: ColorValue;
  onSecondary: ColorValue;
  neutral: ColorValue;
  background: ColorValue;
  onBackground: ColorValue;
  surface: ColorValue;
  onSurface: ColorValue;
  skeletonContainer: ColorValue;
  skeletonContent: ColorValue;

  // System
  primary20: ColorValue;
  secondary20: ColorValue;
  persistOnSurface: ColorValue;
  border: ColorValue;
  placeholder: ColorValue;
  disabled: ColorValue;
  onDisabled: ColorValue;
  overlay60: ColorValue;
  overlay30: ColorValue;
  onOverlay: ColorValue;
  underlay: ColorValue;
  shadow: ColorValue;
  navBarBackground: ColorValue;
  onNavBarBackground: ColorValue;
  contentBackground: ColorValue;
  contentBackground1: ColorValue;
  onContentBackground: ColorValue;
  persistPrimary: ColorValue;
  onPersistPrimary: ColorValue;
  persistSecondary: ColorValue;
  onPersistSecondary: ColorValue;
  primaryHighlight: ColorValue;
  secondaryHighlight: ColorValue;
  surfaceHighlight: ColorValue;
  persistTextPrimary: ColorValue;
  textPrimary: ColorValue;
  textSecondary: ColorValue;
  textTertiary: ColorValue;
  textInactive: ColorValue;
  iconInactive: ColorValue;
  indicator: ColorValue;

  // Addition
  cartTypes: {
    [type in CartType]: ColorValue;
  };

  // DELIVERY STATUS COLOR
  deliveryStatus: {
    [status in DeliveryStatusCode]: ColorValue;
  };

  // ORDER STATUS COLOR
  cartStatus: {
    [status in CartStatus]: ColorValue;
  };

  // PAYMENT STATUS COLOR
  cartPaymentStatus: {
    [status in CartPaymentStatus]: ColorValue;
  };

  danger: ColorValue;
  warning: ColorValue;
  success: ColorValue;
  info: ColorValue;
  other: ColorValue;
  facebook: ColorValue;
  youtube: ColorValue;
  standard: ColorValue[];
  gold: ColorValue[];
  platinum: ColorValue[];
  diamond: ColorValue[];
  accent1: ColorValue;
  accent2: ColorValue;
  sale: ColorValue;
  marigold: ColorValue;
  cherry: ColorValue;
};

export type Layout = {
  borderWidthPixel: number;
  borderWidthSmall: number;
  borderWidth: number;
  borderRadiusExtraSmall: number;
  borderRadiusSmall: number;
  borderRadiusMedium: number;
  borderRadiusLarge: number;

  shadow: {
    shadowOffset: {
      width: number;
      height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;

    elevation: number;
  };
};

export interface Theme {
  id: string;
  color: Color;
  layout: Layout;
  typography: Typography;
}
