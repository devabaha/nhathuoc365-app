import {StyleProp, TextStyle, ViewStyle} from 'react-native';

import {TypographyType} from 'src/components/base';
import {CartPaymentStatus, CartStatus} from 'src/constants/cart';
import {CartType, DeliveryStatusCode} from 'src/constants/cart';

export type Style =
  | StyleProp<ViewStyle | TextStyle>
  | StyleProp<ViewStyle | TextStyle>[];

export type Typography = {
  [TypographyType.TITLE_LARGE]?: Style;
  [TypographyType.TITLE_MEDIUM]?: Style;

  [TypographyType.LABEL_LARGE_PRIMARY]: Style;
  [TypographyType.LABEL_MEDIUM_PRIMARY]: Style;

  [TypographyType.LABEL_LARGE]?: Style;
  [TypographyType.LABEL_MEDIUM]?: Style;
  [TypographyType.LABEL_SMALL]?: Style;
  [TypographyType.LABEL_EXTRA_SMALL]?: Style;

  [TypographyType.DESCRIPTION_SMALL_PRIMARY]?: Style;

  [TypographyType.DESCRIPTION_MEDIUM]?: Style;
  [TypographyType.DESCRIPTION_SMALL]?: Style;

  [TypographyType.BUTTON_TEXT]?: Style;
};

export type Color = {
  // Core
  grey50: string;
  grey100: string;
  grey200: string;
  grey300: string;
  grey400: string;
  grey500: string;
  grey600: string;
  grey700: string;
  grey800: string;
  grey900: string;
  green50: string;
  green100: string;
  green200: string;
  green300: string;
  green400: string;
  green500: string;
  green600: string;
  green700: string;
  green800: string;
  green900: string;
  blue50: string;
  blue100: string;
  blue200: string;
  blue300: string;
  blue400: string;
  blue500: string;
  blue600: string;
  blue700: string;
  blue800: string;
  blue900: string;
  black: string;
  white: string;
  blueGray: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  onPrimary: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  onSecondary: string;
  neutral: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  skeletonContainer: string;
  skeletonContent: string;

  // System
  primary20: string;
  secondary20: string;
  persistOnSurface: string;
  border: string;
  placeholder: string;
  disabled: string;
  onDisabled: string;
  overlay60: string;
  overlay30: string;
  onOverlay: string;
  underlay: string;
  shadow: string;
  navBarBackground: string;
  onNavBarBackground: string;
  contentBackground: string;
  onContentBackground: string;
  persistPrimary: string;
  onPersistPrimary: string;
  persistSecondary: string;
  onPersistSecondary: string;
  primaryHighlight: string;
  secondaryHighlight: string;
  surfaceHighlight: string;
  persistTextPrimary: string;
  textPrimary: string;
  textSecondary: string;
  textInactive: string;
  iconInactive: string;

  // Addition
  cartTypes: {
    [type in CartType]: string;
  };

  // DELIVERY STATUS COLOR
  deliveryStatus: {
    [status in DeliveryStatusCode]: string;
  };

  // ORDER STATUS COLOR
  cartStatus: {
    [status in CartStatus]: string;
  };

  // PAYMENT STATUS COLOR
  cartPaymentStatus: {
    [status in CartPaymentStatus]: string;
  };

  danger: string;
  warning: string;
  success: string;
  info: string;
  other: string;
  facebook: string;
  youtube: string;
  standard: string[];
  gold: string[];
  platinum: string[];
  diamond: string[];
  accent1: string;
  accent2: string;
  sale: string;
  marigold: string;
  cherry: string;
};

export type Layout = {
  borderWidth: number;
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
