import React, {memo, forwardRef, useMemo, MutableRefObject} from 'react';
import {StyleSheet, Text, StyleProp, TextStyle} from 'react-native';
import { mergeStyles } from 'src/Themes/helper';
import {useTheme} from 'src/Themes/Theme.context';

import {TypographyProps} from '.';
import {TypographyFontSize, TypographyType} from './constants';

const createStyles = (theme) => {
  const styles = StyleSheet.create({
    primary: {
      color: theme.color.textPrimary,
    },
    secondary: {
      color: theme.color.textSecondary,
    },
    onPrimary: {
      color: theme.color.onPrimary,
    },
    onSecondary: {
      color: theme.color.onSecondary,
    },
    onSurface: {
      color: theme.color.onSurface,
    },
    onBackground: {
      color: theme.color.onBackground,
    },
    [TypographyType.TITLE_LARGE]: {
      fontSize: TypographyFontSize.HEADLINE_MEDIUM,
      color: theme.color.textPrimary,
    },
    [TypographyType.TITLE_MEDIUM]: {
      fontSize: TypographyFontSize.BODY_LARGE,
      color: theme.color.textPrimary,
    },

    [TypographyType.LABEL_LARGE_PRIMARY]: {
      fontSize: TypographyFontSize.BODY_LARGE,
      color: theme.color.primaryHighlight,
    },
    [TypographyType.LABEL_MEDIUM_PRIMARY]: {
      fontSize: TypographyFontSize.BODY_MEDIUM,
      color: theme.color.primaryHighlight,
    },
    [TypographyType.LABEL_MEDIUM]: {
      fontSize: TypographyFontSize.BODY_MEDIUM,
      color: theme.color.textPrimary,
    },
    [TypographyType.LABEL_SMALL]: {
      fontSize: TypographyFontSize.BODY_SMALL,
      color: theme.color.textPrimary,
    },
    [TypographyType.LABEL_EXTRA_SMALL]: {
      fontSize: TypographyFontSize.NOTE_LARGE,
      color: theme.color.textPrimary,
    },

    [TypographyType.DESCRIPTION_SMALL_PRIMARY]: {
      fontSize: TypographyFontSize.BODY_SMALL,
      color: theme.color.primaryHighlight,
    },
    [TypographyType.DESCRIPTION_MEDIUM]: {
      fontSize: TypographyFontSize.BODY_MEDIUM,
      color: theme.color.textSecondary,
    },
    [TypographyType.DESCRIPTION_SMALL]: {
      fontSize: TypographyFontSize.BODY_SMALL,
      color: theme.color.textSecondary,
    },

    [TypographyType.BUTTON_TEXT]: {
      fontSize: 16,
      textTransform: 'uppercase',
      color: theme.color.onPrimary,
    },
  });

  return styles;
};

const Typography = forwardRef(
  (
    {
      onPrimary,
      onSecondary,
      onSurface,
      onBackground,
      type = TypographyType.LABEL_MEDIUM,
      style,
      children,
      ...props
    }: TypographyProps,
    ref: MutableRefObject<any>,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles = createStyles(theme);
      const finalStyle = mergeStyles(
        baseStyles[type],
        onPrimary
          ? baseStyles.onPrimary
          : onSecondary
          ? baseStyles.onSecondary
          : onSurface
          ? baseStyles.onSurface
          : onBackground
          ? baseStyles.onBackground
          : {},
      );

      return finalStyle;
    }, [theme, type, onPrimary, onSecondary, onSurface, onBackground]);

    const componentStyle = useMemo(() => {
      return mergeStyles(styles, style);
    }, [styles, style]);

    return (
      <Text ref={ref} {...props} style={componentStyle}>
        {children}
      </Text>
    );
  },
);

export default memo(Typography);
