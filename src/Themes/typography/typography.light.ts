import {TypographyFontSize, TypographyType} from 'src/components/base';
import {BASE_COLOR_LIGHT} from '../color';
import {Typography} from '../interface';

export const TYPOGRAPHY_LIGHT: Typography = {
  [TypographyType.DISPLAY_SMALL]: {
    fontSize: TypographyFontSize.DISPLAY_SMALL,
    color: BASE_COLOR_LIGHT.textPrimary,
  },

  [TypographyType.TITLE_LARGE]: {
    fontSize: TypographyFontSize.HEADLINE_MEDIUM,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  [TypographyType.TITLE_MEDIUM]: {
    fontSize: TypographyFontSize.BODY_LARGE,
    color: BASE_COLOR_LIGHT.textPrimary,
  },

  [TypographyType.LABEL_LARGE_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_LARGE,
    color: BASE_COLOR_LIGHT.primaryHighlight,
  },
  [TypographyType.LABEL_MEDIUM_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_LIGHT.primaryHighlight,
  },
  [TypographyType.LABEL_MEDIUM]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  [TypographyType.LABEL_SMALL]: {
    fontSize: TypographyFontSize.BODY_SMALL,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  [TypographyType.LABEL_EXTRA_SMALL]: {
    fontSize: TypographyFontSize.NOTE_LARGE,
    color: BASE_COLOR_LIGHT.textPrimary,
  },

  [TypographyType.DESCRIPTION_SMALL_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_SMALL,
    color: BASE_COLOR_LIGHT.primaryHighlight,
  },
  [TypographyType.DESCRIPTION_MEDIUM]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_LIGHT.textSecondary,
  },
  [TypographyType.DESCRIPTION_SEMI_MEDIUM]: {
    fontSize: TypographyFontSize.BODY_SEMI_MEDIUM,
    color: BASE_COLOR_LIGHT.textSecondary,
  },
  [TypographyType.DESCRIPTION_SMALL]: {
    fontSize: TypographyFontSize.BODY_SMALL,
    color: BASE_COLOR_LIGHT.textSecondary,
  },

  [TypographyType.BUTTON_TEXT]: {
    fontSize: 16,
    textTransform: 'uppercase',
    color: BASE_COLOR_LIGHT.onPrimary,
  },
};
