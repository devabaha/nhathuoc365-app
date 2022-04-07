import {TFunction} from 'i18next';
import {GestureResponderEvent} from 'react-native';
import {Category, CategoryType} from '../';

export {default} from './SubCategory';

export interface SubCategoryProps {
  t?: TFunction;

  type: CategoryType;
  categories: Array<Category>;
  image?: string;
  title?: string;
  loading?: boolean;
  onPressTitle?: (e: GestureResponderEvent) => void;
  onPressBanner?: () => void;
  /**
   * mode scroll all category for subCategory
   */
  fullData?: boolean;
}
