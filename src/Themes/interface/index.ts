import {
  ColorValue,
  StatusBarStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {TypographyType} from 'src/components/base';
import {CartPaymentStatus, CartStatus} from 'src/constants/cart';
import {CartType, DeliveryStatusCode} from 'src/constants/cart';

export type ItemStyle = ViewStyle | TextStyle | Animated.AnimateStyle<any>;

export type Style = StyleProp<ItemStyle> | StyleProp<ItemStyle>[];

export type Typography = {
  [type in TypographyType]?: Style;
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
  coreOverlay?: ColorValue;

  // System
  primary5: ColorValue;
  primary20: ColorValue;
  secondary5: ColorValue;
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
  statusBarBackground: ColorValue;
  statusBarBackgroundSurfaceMode: ColorValue;
  navBarBackground: ColorValue;
  onNavBarBackground: ColorValue;
  contentBackgroundPrimary: ColorValue;
  contentBackgroundWeak: ColorValue;
  contentBackground: ColorValue;
  contentBackgroundStrong: ColorValue;
  onContentBackground: ColorValue;
  persistPrimary: ColorValue;
  persistPrimary5: ColorValue;
  persistPrimary20: ColorValue;
  onPersistPrimary: ColorValue;
  persistSecondary: ColorValue;
  persistSecondary20: ColorValue;
  onPersistSecondary: ColorValue;
  primaryHighlight: ColorValue;
  onPrimaryHighlight: ColorValue;
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
  cartType: {
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

  // ACCOUNT
  accountDomain: ColorValue;
  accountPremium: ColorValue;
  accountDefaultWallet: ColorValue;
  accountRevenueCommissions: ColorValue;
  accountAffiliate: ColorValue;
  accountStore: ColorValue;
  accountOrder: ColorValue;
  accountVoucher: ColorValue;
  accountAddress: ColorValue;
  accountGoldMember: ColorValue;
  accountWarehouse: ColorValue;
  accountCommissionIncome: ColorValue;
  accountSaleReport: ColorValue;
  accountResetPassword: ColorValue;
  accountFacebook: ColorValue;
  accountAboutUs: ColorValue;
  accountTermOfUse: ColorValue;
  accountLanguage: ColorValue;
  accountAppInfo: ColorValue;
  accountAppUpdate: ColorValue;
  accountPartnerRegistration: ColorValue;
  // PREMIUM
  premium: ColorValue;

  accent1: ColorValue;
  accent2: ColorValue;
  sale: ColorValue;
  marigold: ColorValue;
  cherry: ColorValue;
  neutral1: ColorValue;
  goldenYellow: ColorValue;
  backgroundBubbleLeft: ColorValue;
  backgroundBubbleRight: ColorValue;
  backgroundBubbleLeftHighlight: ColorValue;
};

export type Layout = {
  borderWidthPixel: number;
  borderWidthSmall: number;
  borderWidth: number;
  borderWidthLarge: number;
  borderRadiusExtraSmall: number;
  borderRadiusSmall: number;
  borderRadiusMedium: number;
  borderRadiusLarge: number;
  borderRadiusHuge: number;
  borderRadiusGigantic: number;

  shadow: {
    shadowOffset: {
      width: number;
      height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;

    elevation: number;
  };

  statusBarStyle: StatusBarStyle;
  statusBarSurfaceModeStyle: StatusBarStyle;
};

export interface Theme {
  id: string;
  name: string;
  color: Color;
  layout: Layout;
  typography: Typography;
}
