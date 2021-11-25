import React, {memo, forwardRef, useMemo} from 'react';
import {StyleSheet, Text} from 'react-native';

import {Ref} from '..';
import {TypographyProps} from '.';
import {Theme} from 'src/Themes/interface';

import {mergeStyles} from 'src/Themes/helper';
import {useTheme} from 'src/Themes/Theme.context';

import {TypographyFontSize, TypographyType} from './constants';

const createStyles = (theme: Theme) => {
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
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles = createStyles(theme);
      const finalStyle = mergeStyles(
        theme.typography[type],
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
      <Text {...props} ref={ref} style={componentStyle}>
        {children}
      </Text>
    );
  },
);

export default memo(Typography);
