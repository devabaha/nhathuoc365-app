import React from 'react';
import {StyleProp, TextStyle, TouchableOpacityProps} from 'react-native';

import {default as BaseButton} from './Button';
import FilledButton from './FilledButton';
import AppFilledButton from './AppFilledButton';
import IconButton from './IconButton';
import TextButton from './TextButton';
import OutlinedButton from './OutlinedButton';
import AppOutlinedButton from './AppOutlinedButton';
import FilledTonalButton from './FilledTonalButton';
import AppFilledTonalButton from './AppFilledTonalButton';
import AppPrimaryButton from './AppPrimaryButton';
import {ButtonRoundedType} from './constants';

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
  TextButton,
};

export interface BaseButtonProps extends TouchableOpacityProps {
  title?: string;

  titleStyle?: StyleProp<TextStyle>;

  renderTitleComponent?: (
    titleStyle: StyleProp<TextStyle>,
  ) => React.ReactNode | React.ReactNode[];

  iconLeft?: () => React.ReactNode | React.ReactNode[];
  iconRight?: () => React.ReactNode | React.ReactNode[];
  children?: () => React.ReactNode | React.ReactNode[];
}

export interface CommonButtonProps extends BaseButtonProps {
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  shadow?: boolean;
}

export interface SolidButtonProps extends CommonButtonProps {
  rounded?:
    | ButtonRoundedType.SMALL
    | ButtonRoundedType.MEDIUM
    | ButtonRoundedType.LARGE;
}

export interface OutlinedButtonProps extends SolidButtonProps {}
export interface FilledTonalButtonProps extends SolidButtonProps {}
export interface FilledButtonProps extends SolidButtonProps {}

export interface IconButtonProps extends CommonButtonProps {}
export interface TextButtonProps extends CommonButtonProps {}
