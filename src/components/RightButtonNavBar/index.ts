export {default} from './RightButtonNavBar';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';

import {BundleIconSetName} from '../base/Icon/constants';
import {ModalActionSheetProps} from '../ModalActionSheet';

export type RightButtonNavBar = 'shopping_cart' | 'chat' | 'share';

export interface RightButtonNavBarProps {
  type: RightButtonNavBar;
  icon?: JSX.Element;
  iconBundle?: BundleIconSetName;
  iconName?: string;
  touchableOpacity?: boolean;
  iconStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: Function;

  /** Chat props */
  siteId?: number | string;

  /** Share props */
  shareTitle?: string;
  shareURL?: string;

  /** Download props */
  imageUrl?: string;

  /** More props */
  moreOptions?: Array<String>;
  moreActionsProps?: ModalActionSheetProps;
  onPressMoreAction?: (buttonIndex: number) => void;
}
