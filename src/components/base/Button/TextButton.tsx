import React, {forwardRef, memo, useCallback, useMemo} from 'react';
import {StyleSheet} from 'react-native';

import {TextButtonProps} from '.';
import {Ref} from '..';
import {Theme} from 'src/Themes/interface';

import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

import Button from './Button';
import {getFontStyle} from '../helpers';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    column: {
      flexDirection: 'column',
    },
    primary: {
      color: theme.color.primary,
    },
    primaryHighlight: {
      color: theme.color.primaryHighlight,
    },
    secondary: {
      color: theme.color.secondary,
    },
    secondaryHighlight: {
      color: theme.color.secondaryHighlight,
    },
    neutral: {
      color: theme.color.textInactive,
    },
    disabled: {
      color: theme.color.onDisabled,
    },
    shadow: {
      shadowColor: theme.color.shadow,
      ...theme.layout.shadow,
    },
    text: {
      color: theme.color.textPrimary,
    },
  });

  return styles;
};

const TextButton = forwardRef(
  (
    {
      titleStyle,
      style,
      column,

      ...props
    }: TextButtonProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles: any = createStyles(theme);

      return baseStyles;
    }, [theme]);

    const buttonStyles = useMemo(() => {
      return mergeStyles([styles.container, column && styles.column], style);
    }, [styles, style, column]);

    const titleStyles = useMemo(() => {
      return mergeStyles(
        [
          props.shadow && styles.shadow,
          props.primary && styles.primary,
          props.primaryHighlight && styles.primaryHighlight,
          props.secondary && styles.secondary,
          props.secondaryHighlight && styles.secondaryHighlight,
          props.neutral && styles.neutral,
          // disabled should be the last overridden style
          props.disabled && styles.disabled,
        ],
        titleStyle,
      );
    }, [
      props.shadow,
      props.primary,
      props.primaryHighlight,
      props.secondary,
      props.secondaryHighlight,
      props.neutral,
      props.disabled,
      titleStyle,
    ]);

    const renderTitleComponent = useCallback(() => {
      const fontStyle = getFontStyle(titleStyles);

      return props.renderTitleComponent(titleStyles, buttonStyles, fontStyle);
    }, [titleStyles, buttonStyles]);

    return (
      <Button
        activeOpacity={0.3}
        {...props}
        ref={ref}
        style={buttonStyles}
        titleStyle={titleStyles}
        renderTitleComponent={
          props.renderTitleComponent && renderTitleComponent
        }
      />
    );
  },
);

export default memo(TextButton);
