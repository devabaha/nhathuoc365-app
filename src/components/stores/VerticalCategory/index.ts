export { default } from "./VerticalCategory";

export type Category = {
  name?: string;
  image?: string;
};

export interface VerticalCategoryProps {
  /**
   * show full data even sub category.
   * scroll all sub categories in a view
   */
  fullData?: boolean;
}
