export {default} from './MultiLevelCategory';

export type Category = {
  name?: string;
  image?: string;
  list?: Array<any>;
};

export type CategoryType = 'fix' | 'scroll';

export interface MultiLevelCategoryProps {
  /**
   * show full data even sub category.
   * scroll all sub categories in a view
   */
  type?: CategoryType;
  siteId?: string | number;
  title?: string | number;
  categoryId?: string;
}
