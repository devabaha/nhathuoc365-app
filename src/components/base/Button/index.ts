import {
  StyleProp,
  TextStyle,
  TouchableHighlightProps,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import {ImageProps, ImageSource, ImageStyle} from 'src/components/Image';

import {ButtonRoundedType} from './constants';

import {default as BaseButton} from './Button';
import FilledButton from './FilledButton';
import AppFilledButton from './AppFilledButton';
import IconButton from './IconButton';
import ImageButton from './ImageButton';
import TextButton from './TextButton';
import OutlinedButton from './OutlinedButton';
import AppOutlinedButton from './AppOutlinedButton';
import FilledTonalButton from './FilledTonalButton';
import AppFilledTonalButton from './AppFilledTonalButton';
import AppPrimaryButton from './AppPrimaryButton';
import {IconProps} from '../Icon';
import {Children} from '..';
import {TypographyProps} from '../Typography';

export {
  BaseButton,
  OutlinedButton,
  AppOutlinedButton,
  FilledButton,
  AppFilledButton,
  FilledTonalButton,
  AppFilledTonalButton,
  AppPrimaryButton,
  IconButton,
  ImageButton,
  TextButton,
  ButtonRoundedType,
};

export interface BaseButtonProps
  extends TouchableOpacityProps,
    TouchableHighlightProps {
  useGestureHandler?: boolean;
  useTouchableHighlight?: boolean;

  typoProps?: TypographyProps;

  title?: string;

  titleStyle?: StyleProp<TextStyle>;

  renderIconLeft?: (
    titleStyle: StyleProp<TextStyle>,
    buttonStyle?: StyleProp<ViewStyle>,
  ) => Children;
  renderTitleComponent?: (
    titleStyle: StyleProp<TextStyle>,
    buttonStyle?: StyleProp<ViewStyle>,
  ) => Children;
  renderIconRight?: (
    titleStyle: StyleProp<TextStyle>,
    buttonStyle?: StyleProp<ViewStyle>,
  ) => Children;

  iconLeft?: () => Children;
  iconRight?: () => Children;
  children?: Children;
}

export interface CommonButtonProps extends BaseButtonProps {
  primary?: boolean;
  secondary?: boolean;
  neutral?: boolean;
  disabled?: boolean;
  shadow?: boolean;
}

export interface SolidButtonProps extends CommonButtonProps {
  rounded?: ButtonRoundedType;
}

export interface OutlinedButtonProps extends SolidButtonProps {}
export interface FilledTonalButtonProps extends SolidButtonProps {}
export interface FilledButtonProps extends SolidButtonProps {}

export interface IconButtonProps extends CommonButtonProps, IconProps {
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;

  iconProps?: Omit<IconProps, 'name'> & {name?: string};
}

export interface ImageButtonProps extends CommonButtonProps {
  source: ImageSource;

  style?: StyleProp<ViewStyle>;
  imageStyle?: ImageStyle;

  imageProps?: ImageProps;

  children?: Children;
}

export interface TextButtonProps extends CommonButtonProps {
  column?: boolean;
}
