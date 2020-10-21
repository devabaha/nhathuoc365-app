export { default } from "./MultiLevelCategory";

export type Category = {
  name?: string;
  image?: string;
};

export type CategoryType = "fix" | "scroll";

export interface MultiLevelCategoryProps {
  /**
   * show full data even sub category.
   * scroll all sub categories in a view
   */
  type?: CategoryType;
  siteId?: string | number;
}
