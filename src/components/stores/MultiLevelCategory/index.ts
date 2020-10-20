export { default } from "./MultiLevelCategory";

export type Category = {
  name?: string;
  image?: string;
};

export type CategoryType = "multi-level1" | "multi-level2";

export interface MultiLevelCategoryProps {
  /**
   * show full data even sub category.
   * scroll all sub categories in a view
   */
  type?: CategoryType;
  siteId?: string | number;
}
