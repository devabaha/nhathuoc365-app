import React, {memo, forwardRef, useMemo} from 'react';
import {StyleSheet, Text, Animated} from 'react-native';

import Reanimated from 'react-native-reanimated';

import {Ref} from '..';
import {TypographyProps} from '.';
import {Theme} from 'src/Themes/interface';

import {mergeStyles} from 'src/Themes/helper';
import {useTheme} from 'src/Themes/Theme.context';

import {TypographyType} from './constants';

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
    onContentBackground: {
      color: theme.color.onContentBackground,
    },
    onDisabled: {
      color: theme.color.onDisabled,
    },
  });

  return styles;
};

const Typography = forwardRef(
  (
    {
      reanimated,
      animated,
      onPrimary,
      onSecondary,
      onSurface,
      onBackground,
      onContentBackground,
      onDisabled,
      type = TypographyType.LABEL_MEDIUM,
      style,

      renderIconBefore,
      renderIconAfter,
      renderInlineIconBefore,
      renderInlineIconAfter,
      children,
      ...props
    }: TypographyProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles = createStyles(theme);
      const finalStyle = mergeStyles(
        [theme.typography[type], style],
        onDisabled
          ? baseStyles.onDisabled
          : onPrimary
          ? baseStyles.onPrimary
          : onSecondary
          ? baseStyles.onSecondary
          : onSurface
          ? baseStyles.onSurface
          : onBackground
          ? baseStyles.onBackground
          : onContentBackground
          ? baseStyles.onContentBackground
          : {},
      );

      return finalStyle;
    }, [
      theme,
      type,
      style,
      onPrimary,
      onSecondary,
      onSurface,
      onBackground,
      onContentBackground,
      onDisabled,
    ]);

    const componentStyle = useMemo(() => {
      return mergeStyles(styles, style);
    }, [styles, style]);

    const TextComponent: any = useMemo(() => {
      if (animated) {
        return Animated.Text;
      }
      if (reanimated) {
        return Reanimated.Text;
      }

      return Text;
    }, [animated, reanimated]);

    return (
      <>
        {renderIconBefore && renderIconBefore(styles)}
        <TextComponent {...props} ref={ref} style={styles}>
          {renderInlineIconBefore && renderInlineIconBefore(styles)}
          {children}
          {renderInlineIconAfter && renderInlineIconAfter(styles)}
        </TextComponent>
        {renderIconAfter && renderIconAfter(styles)}
      </>
    );
  },
);

export default memo(Typography);
