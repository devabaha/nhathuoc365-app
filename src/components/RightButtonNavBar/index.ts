export {default} from './RightButtonNavBar';
import {TFunction} from 'i18next';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';

import {BundleIconSetName} from '../base/Icon/constants';
import {ModalActionSheetProps} from '../ModalActionSheet';
import {RightButtonNavbarType} from './constants';

export interface RightButtonNavBarProps {
  t?: TFunction;

  type: RightButtonNavbarType;
  icon?: JSX.Element;
  iconBundle?: BundleIconSetName;
  iconName?: string;
  touchableHighlight?: boolean;
  disabled?: boolean;
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
