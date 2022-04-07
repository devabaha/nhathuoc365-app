import {IconProps as RNIconProps} from 'react-native-vector-icons/Icon';
import {Style} from 'src/Themes/interface';
import {BundleIconSetName, BUNDLE_ICON_SETS} from './constants';

export {default} from './Icon';
export {BundleIconSetName, BUNDLE_ICON_SETS};

export type BUNDLE_ICON_TYPE =
  | BundleIconSetName.ANT_DESIGN
  | BundleIconSetName.ENTYPO
  | BundleIconSetName.EVIL_ICONS
  | BundleIconSetName.FEATHER
  | BundleIconSetName.FONTISO
  | BundleIconSetName.FONT_AWESOME
  | BundleIconSetName.FONT_AWESOME_5
  | BundleIconSetName.FOUNDATION
  | BundleIconSetName.IONICONS
  | BundleIconSetName.MATERIAL_COMMUNITY_ICONS
  | BundleIconSetName.MATERIAL_ICONS
  | BundleIconSetName.OCTICONS
  | BundleIconSetName.SIMPLE_LINE_ICONS
  | BundleIconSetName.ZOCIAL;

export interface IconProps extends RNIconProps {
  style?: Style;

  reanimated?: boolean;
  animated?: boolean;
  primary?: boolean;
  persistPrimary?: boolean;
  secondary?: boolean;
  persistSecondary?: boolean;
  primaryHighlight?: boolean;
  secondaryHighlight?: boolean;
  neutral?: boolean;
  disabled?: boolean;

  bundle?: BUNDLE_ICON_TYPE;
}
