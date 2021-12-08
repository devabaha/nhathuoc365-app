import {TextProps} from 'react-native';

import {Children} from '..';

import {TypographyType, TypographyFontSize} from './constants';

export {default} from './Typography';
export {TypographyType, TypographyFontSize};

export interface TypographyProps extends TextProps {
  type?: TypographyType;

  reanimated?: boolean;
  animated?: boolean;
  onPrimary?: boolean;
  onSecondary?: boolean;
  onSurface?: boolean;
  onBackground?: boolean;
  onDisabled?: boolean;

  children?: Children;
}
