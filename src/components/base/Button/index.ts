import {ReactElement} from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableHighlightProps,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import {ContainedTouchableProperties} from 'react-native-gesture-handler';
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
    TouchableHighlightProps,
    ContainedTouchableProperties {
  useGestureHandler?: boolean;
  useTouchableHighlight?: boolean;
  /**
   * this is props to add View instead of Fragment quickly as a container for children
   * mostly use for TouchableHighlight with Image as children
   * because TouchableHighlight won't underlay if the Image is inside a Fragment.
   * If you need pass more style to this container, use renderContentContainerComponent instead.
   */
  useContentContainer?: boolean;

  typoProps?: TypographyProps;

  title?: string;

  titleStyle?: StyleProp<TextStyle>;

  renderIconLeft?: (
    titleStyle: StyleProp<TextStyle>,
    buttonStyle?: StyleProp<ViewStyle>,
    fontStyle?: StyleProp<TextStyle>,
  ) => Children;
  renderTitleComponent?: (
    titleStyle: StyleProp<TextStyle>,
    buttonStyle?: StyleProp<ViewStyle>,
    fontStyle?: StyleProp<TextStyle>,
  ) => Children;
  renderIconRight?: (
    titleStyle: StyleProp<TextStyle>,
    buttonStyle?: StyleProp<ViewStyle>,
    fontStyle?: StyleProp<TextStyle>,
  ) => Children;
  /**
   * return children for contentContainer customization  as you want.
   */
  renderContentContainerComponent?: (children: any) => ReactElement;

  iconLeft?: Children;
  iconRight?: Children;
  children?: Children;
}

export interface CommonButtonProps extends BaseButtonProps {
  primary?: boolean;
  primaryHighlight?: boolean;
  secondary?: boolean;
  secondaryHighlight?: boolean;
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
