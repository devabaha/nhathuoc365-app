export { default } from "./RightButtonNavBar";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { BUNDLE_ICON_SETS_NAME } from "src/constants";

export type RightButtonNavBar = "shopping_cart" | "chat" | "share";

export interface RightButtonNavBarProps {
  type: RightButtonNavBar;
  icon?: JSX.Element;
  iconBundle?: BUNDLE_ICON_SETS_NAME;
  iconName?: string,
  touchableOpacity?: boolean;
  iconStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: Function;

  /** Chat props */
  siteId?: number | string;

  /** Share props */
  shareTitle?: string;
  shareURL?: string;

  /** Download props */
  imageUrl?: string;
}
