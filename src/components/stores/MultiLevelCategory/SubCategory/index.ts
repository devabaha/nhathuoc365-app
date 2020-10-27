import { GestureResponderEvent, StyleProp, ViewProps } from "react-native";
import { Category, CategoryType } from "./..";

export { default } from "./SubCategory";

export interface SubCategoryProps {
  type: CategoryType;
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
