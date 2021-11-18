import React from 'react';
import {TextProps} from 'react-native';
import {TypographyType} from './constants';

export {default} from './Typography';

export type TypoType =
  | TypographyType.TITLE_LARGE
  | TypographyType.TITLE_MEDIUM
  | TypographyType.LABEL_LARGE_PRIMARY
  | TypographyType.LABEL_MEDIUM_PRIMARY
  | TypographyType.LABEL_LARGE
  | TypographyType.LABEL_MEDIUM
  | TypographyType.LABEL_SMALL
  | TypographyType.BUTTON_TEXT;

export interface TypographyProps extends TextProps {
  type?: TypoType;

  onPrimary?: boolean;
  onSecondary?: boolean;
  onSurface?: boolean;
  onBackground?: boolean;

  children?: React.ReactNode | React.ReactNode[];
}
