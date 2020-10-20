import {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

export { default } from "./Category";

export interface CategoryProps {
  isActive?: boolean;
  image?: string;
  title?: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onPress?: (e: GestureResponderEvent) => void;
}
