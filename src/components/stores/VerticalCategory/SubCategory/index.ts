import { StyleProp, ViewProps } from "react-native";
import { Category } from "./..";

export { default } from "./SubCategory";

export interface SubCategoryProps {
  categories: Array<Category>;
  image?: string;
  title?: string;
  loading?: string;
  onPress?: Function;
  /**
   * mode scroll all category for subCategory
   */
  fullData?: boolean;
}
