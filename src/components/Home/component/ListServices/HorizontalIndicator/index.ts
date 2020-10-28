export { default } from "./HorizontalIndicator";
import { StyleProp, ViewStyle } from "react-native";

export interface HorizontalIndicatorProps {
  containerStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  color?: string;
  foregroundColor?: string;
  indicatorColor?: string;
  indicatorWidth?: number;
}
