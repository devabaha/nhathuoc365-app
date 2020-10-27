export { default } from "./RowIndicator";
import { StyleProp, ViewStyle } from "react-native";

export interface RowIndicatorProps {
  containerStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  color?: string;
  foregroundColor?: string;
  indicatorColor?: string;
  indicatorWidth?: number;
}
