import {
  TypographyFontSize,
  TypographyType,
} from 'src/components/base/Typography/constants';
import {BASE_COLOR_LIGHT} from '../color';
import {Typography} from '../interface';

export const TYPOGRAPHY_LIGHT: Typography = {
  // TITLE
  // PRIMARY
  [TypographyType.TITLE_MEDIUM_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_LARGE,
    color: BASE_COLOR_LIGHT.primaryHighlight,
  },
  // TERTIARY
  [TypographyType.TITLE_LARGE_TERTIARY]: {
    fontSize: TypographyFontSize.HEADLINE_MEDIUM,
    color: BASE_COLOR_LIGHT.textTertiary,
  },
  [TypographyType.TITLE_SEMI_LARGE_TERTIARY]: {
    fontSize: TypographyFontSize.HEADLINE_SMALL,
    color: BASE_COLOR_LIGHT.textTertiary,
  },
  // NORMAL
  [TypographyType.TITLE_LARGE]: {
    fontSize: TypographyFontSize.HEADLINE_MEDIUM,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  [TypographyType.TITLE_SEMI_LARGE]: {
    fontSize: TypographyFontSize.HEADLINE_SMALL,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  [TypographyType.TITLE_MEDIUM]: {
    fontSize: TypographyFontSize.BODY_LARGE,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  // LABEL
  // PRIMARY
  [TypographyType.LABEL_HUGE_PRIMARY]: {
    fontSize: TypographyFontSize.HEADLINE_MEDIUM,
    color: BASE_COLOR_LIGHT.primaryHighlight,
  },
  [TypographyType.LABEL_LARGE_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_LARGE,
    color: BASE_COLOR_LIGHT.primaryHighlight,
  },
  [TypographyType.LABEL_MEDIUM_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_LIGHT.primaryHighlight,
  },
  [TypographyType.LABEL_SMALL_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_SMALL,
    color: BASE_COLOR_LIGHT.primaryHighlight,
  },
  [TypographyType.LABEL_EXTRA_SMALL_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_EXTRA_SMALL,
    color: BASE_COLOR_LIGHT.primaryHighlight,
  },
  // TERTIARY
  [TypographyType.LABEL_MEDIUM_TERTIARY]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_LIGHT.textTertiary,
  },
  [TypographyType.LABEL_TINY_TERTIARY]: {
    fontSize: TypographyFontSize.NOTE_LARGE,
    color: BASE_COLOR_LIGHT.textTertiary,
  },

  // SECONDARY
  [TypographyType.LABEL_MEDIUM_SECONDARY]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_LIGHT.textSecondary,
  },
  // NORNAL
  [TypographyType.LABEL_DISPLAY_SMALL]: {
    fontSize: TypographyFontSize.DISPLAY_SMALL,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  [TypographyType.LABEL_HUGE]: {
    fontSize: TypographyFontSize.HEADLINE_MEDIUM,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  [TypographyType.LABEL_LARGE]: {
    fontSize: TypographyFontSize.BODY_LARGE,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  [TypographyType.LABEL_MEDIUM]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  [TypographyType.LABEL_SEMI_MEDIUM]: {
    fontSize: TypographyFontSize.BODY_SEMI_MEDIUM,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  [TypographyType.LABEL_SMALL]: {
    fontSize: TypographyFontSize.BODY_SMALL,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  [TypographyType.LABEL_EXTRA_SMALL]: {
    fontSize: TypographyFontSize.BODY_EXTRA_SMALL,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  [TypographyType.LABEL_TINY]: {
    fontSize: TypographyFontSize.NOTE_LARGE,
    color: BASE_COLOR_LIGHT.textPrimary,
  },
  // DESCRIPTION
  // PRIMARY
  [TypographyType.DESCRIPTION_MEDIUM_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_LIGHT.primaryHighlight,
  },
  [TypographyType.DESCRIPTION_SMALL_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_SMALL,
    color: BASE_COLOR_LIGHT.primaryHighlight,
  },
  // TERTIARY
  [TypographyType.DESCRIPTION_MEDIUM_TERTIARY]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_LIGHT.textTertiary,
  },
  [TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY]: {
    fontSize: TypographyFontSize.BODY_SEMI_MEDIUM,
    color: BASE_COLOR_LIGHT.textTertiary,
  },
  [TypographyType.DESCRIPTION_SMALL_TERTIARY]: {
    fontSize: TypographyFontSize.BODY_SMALL,
    color: BASE_COLOR_LIGHT.textTertiary,
  },
  // NORMAL
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
  // OTHERS
  [TypographyType.BUTTON_TEXT]: {
    fontSize: 16,
    textTransform: 'uppercase',
    color: BASE_COLOR_LIGHT.onPrimary,
  },
};
