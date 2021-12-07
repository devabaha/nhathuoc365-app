import {TextProps} from 'react-native';

import {Children} from '..';

import {TypographyType, TypographyFontSize} from './constants';

export {default} from './Typography';
export {TypographyType, TypographyFontSize};

export type TypoType =
  | TypographyType.DISPLAY_SMALL
  | TypographyType.TITLE_LARGE
  | TypographyType.TITLE_MEDIUM
  | TypographyType.LABEL_LARGE_PRIMARY
  | TypographyType.LABEL_MEDIUM_PRIMARY
  | TypographyType.LABEL_LARGE
  | TypographyType.LABEL_MEDIUM
  | TypographyType.LABEL_SMALL
  | TypographyType.LABEL_EXTRA_SMALL
  | TypographyType.DESCRIPTION_SMALL_PRIMARY
  | TypographyType.DESCRIPTION_MEDIUM
  | TypographyType.DESCRIPTION_SEMI_MEDIUM
  | TypographyType.DESCRIPTION_SMALL
  | TypographyType.BUTTON_TEXT;

export interface TypographyProps extends TextProps {
  type?: TypoType;

  reanimated?: boolean;
  animated?: boolean;
  onPrimary?: boolean;
  onSecondary?: boolean;
  onSurface?: boolean;
  onBackground?: boolean;

  children?: Children;
}
