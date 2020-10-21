import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";

export { default } from "./Row";

export interface RowProps {
  image?: string;
  title?: string;
  defaultOpenChild?: boolean;
  /**
   * show all content, also hide direction icon
   */
  fullMode?: boolean;
  totalHeight: number;
  subCategory?: JSX.Element;
  containerStyle?: StyleProp<ViewStyle>;
  headerContainerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onPressTitle: (e: GestureResponderEvent) => void;
}
