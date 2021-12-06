import {IconProps as RNIconProps} from 'react-native-vector-icons/Icon';
import {BundleIconSetName} from './constants';

export {default} from './Icon';

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
  reanimated?: boolean;
  animated?: boolean;
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;

  bundle?: BUNDLE_ICON_TYPE;
}
