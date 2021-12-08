import {
  TypographyFontSize,
  TypographyType,
} from 'src/components/base/Typography/constants';
import {BASE_COLOR_DARK} from '../color';
import {Typography} from '../interface';

export const TYPOGRAPHY_DARK: Typography = {
  [TypographyType.LABEL_DISPLAY_SMALL]: {
    fontSize: TypographyFontSize.DISPLAY_SMALL,
    color: BASE_COLOR_DARK.textPrimary,
  },

  [TypographyType.TITLE_MEDIUM_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_LARGE,
    color: BASE_COLOR_DARK.primaryHighlight,
  },

  [TypographyType.TITLE_LARGE_TERTIARY]: {
    fontSize: TypographyFontSize.HEADLINE_MEDIUM,
    color: BASE_COLOR_DARK.textTertiary,
  },

  [TypographyType.TITLE_LARGE]: {
    fontSize: TypographyFontSize.HEADLINE_MEDIUM,
    color: BASE_COLOR_DARK.textPrimary,
  },
  [TypographyType.TITLE_SEMI_LARGE]: {
    fontSize: TypographyFontSize.HEADLINE_SMALL,
    color: BASE_COLOR_DARK.textPrimary,
  },
  [TypographyType.TITLE_MEDIUM]: {
    fontSize: TypographyFontSize.BODY_LARGE,
    color: BASE_COLOR_DARK.textPrimary,
  },

  [TypographyType.LABEL_LARGE_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_LARGE,
    color: BASE_COLOR_DARK.primaryHighlight,
  },
  [TypographyType.LABEL_MEDIUM_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_DARK.primaryHighlight,
  },
  [TypographyType.LABEL_SEMI_MEDIUM]: {
    fontSize: TypographyFontSize.BODY_SEMI_MEDIUM,
    color: BASE_COLOR_DARK.textPrimary,
  },
  [TypographyType.LABEL_SMALL_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_SMALL,
    color: BASE_COLOR_DARK.primaryHighlight,
  },
  [TypographyType.LABEL_EXTRA_SMALL_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_EXTRA_SMALL,
    color: BASE_COLOR_DARK.primaryHighlight,
  },

  [TypographyType.LABEL_MEDIUM_TERTIARY]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_DARK.textTertiary,
  },

  [TypographyType.LABEL_LARGE]: {
    fontSize: TypographyFontSize.BODY_LARGE,
    color: BASE_COLOR_DARK.textPrimary,
  },
  [TypographyType.LABEL_MEDIUM]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_DARK.textPrimary,
  },
  [TypographyType.LABEL_SMALL]: {
    fontSize: TypographyFontSize.BODY_SMALL,
    color: BASE_COLOR_DARK.textPrimary,
  },
  [TypographyType.LABEL_EXTRA_SMALL]: {
    fontSize: TypographyFontSize.BODY_EXTRA_SMALL,
    color: BASE_COLOR_DARK.textPrimary,
  },
  [TypographyType.LABEL_TINY]: {
    fontSize: TypographyFontSize.NOTE_LARGE,
    color: BASE_COLOR_DARK.textPrimary,
  },

  [TypographyType.DESCRIPTION_MEDIUM_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_DARK.primaryHighlight,
  },
  [TypographyType.DESCRIPTION_SMALL_PRIMARY]: {
    fontSize: TypographyFontSize.BODY_SMALL,
    color: BASE_COLOR_DARK.primaryHighlight,
  },

  [TypographyType.DESCRIPTION_MEDIUM_TERTIARY]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_DARK.textTertiary,
  },
  [TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY]: {
    fontSize: TypographyFontSize.BODY_SEMI_MEDIUM,
    color: BASE_COLOR_DARK.textTertiary,
  },
  [TypographyType.DESCRIPTION_SMALL_TERTIARY]: {
    fontSize: TypographyFontSize.BODY_SMALL,
    color: BASE_COLOR_DARK.textTertiary,
  },

  [TypographyType.DESCRIPTION_MEDIUM]: {
    fontSize: TypographyFontSize.BODY_MEDIUM,
    color: BASE_COLOR_DARK.textSecondary,
  },
  [TypographyType.DESCRIPTION_SEMI_MEDIUM]: {
    fontSize: TypographyFontSize.BODY_SEMI_MEDIUM,
    color: BASE_COLOR_DARK.textSecondary,
  },
  [TypographyType.DESCRIPTION_SMALL]: {
    fontSize: TypographyFontSize.BODY_SMALL,
    color: BASE_COLOR_DARK.textSecondary,
  },

  [TypographyType.BUTTON_TEXT]: {
    fontSize: 16,
    textTransform: 'uppercase',
    color: BASE_COLOR_DARK.onPrimary,
  },
};
