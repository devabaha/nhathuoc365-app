import {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

export { default } from "./Category";

export interface CategoryProps {
  numberOfLines?: number;
  disabled?: boolean;
  isActive?: boolean;
  image?: string;
  title?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onPress?: (e: GestureResponderEvent) => void;
}
