export { default } from "./RightButtonNavBar";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

export type RightButtonNavBar = "shopping_cart" | "avx";

export interface RightButtonNavBarProps {
  type: RightButtonNavBar;
  icon: JSX.Element;
  iconStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: Function;
}
