import { GestureResponderEvent, StyleProp, ViewProps } from "react-native";
import { Category } from "./..";

export { default } from "./SubCategory";

export interface SubCategoryProps {
  categories: Array<Category>;
  image?: string;
  title?: string;
  loading?: string;
  onPressTitle?: (e: GestureResponderEvent) => void;
  /**
   * mode scroll all category for subCategory
   */
  fullData?: boolean;
}
