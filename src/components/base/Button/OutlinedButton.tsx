import React, {forwardRef, memo, useCallback, useMemo} from 'react';
import {StyleSheet} from 'react-native';

import {OutlinedButtonProps} from '.';
import {Ref} from '..';
import {Theme} from 'src/Themes/interface';

import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

import {ButtonRoundedType} from './constants';

import Button from './Button';
import {getFontStyle} from '../helpers';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderWidth: theme.layout.borderWidth,
      borderColor: theme.color.persistTextPrimary,
    },
    primary: {
      borderColor: theme.color.persistPrimary,
    },
    secondary: {
      borderColor: theme.color.persistSecondary,
    },
    primaryHighlight: {
      borderColor: theme.color.primaryHighlight,
    },
    secondaryHighlight: {
      borderColor: theme.color.secondaryHighlight,
    },
    neutral: {
      backgroundColor: theme.color.contentBackgroundStrong,
    },
    disabled: {
      borderColor: theme.color.disabled,
    },
    shadow: {
      shadowColor: theme.color.shadow,
      ...theme.layout.shadow,
    },
    [ButtonRoundedType.EXTRA_SMALL]: {
      borderRadius: theme.layout.borderRadiusExtraSmall,
    },
    [ButtonRoundedType.SMALL]: {
      borderRadius: theme.layout.borderRadiusSmall,
    },
    [ButtonRoundedType.MEDIUM]: {
      borderRadius: theme.layout.borderRadiusMedium,
    },
    [ButtonRoundedType.LARGE]: {
      borderRadius: theme.layout.borderRadiusLarge,
    },
    text: {
      color: theme.color.textPrimary,
    },
    textPrimary: {
      color: theme.color.primaryHighlight,
    },
    textSecondary: {
      color: theme.color.persistSecondary,
    },
    textPrimaryHighlight: {
      color: theme.color.primaryHighlight,
    },
    textSecondaryHighlight: {
      color: theme.color.persistSecondary,
    },
    textDisabled: {
      color: theme.color.disabled,
    },
  });

  return styles;
};

const OutlinedButton = forwardRef(
  (
    {
      titleStyle,
      style,

      ...props
    }: OutlinedButtonProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles: any = createStyles(theme);

      return baseStyles;
    }, [theme]);

    const buttonStyles = useMemo(() => {
      return mergeStyles(
        [
          styles.container,
          props.shadow && styles.shadow,
          props.rounded && styles[props.rounded],
          props.primary
            ? styles.primary
            : props.primaryHighlight
            ? styles.primaryHighlight
            : props.secondary
            ? styles.secondary
            : props.secondaryHighlight
            ? styles.secondaryHighlight
            : {},
          props.neutral && styles.neutral,
          // disabled should be the last overridden style
          props.disabled && styles.disabled,
        ],
        style,
      );
    }, [
      styles,
      style,
      props.shadow,
      props.rounded,
      props.primary,
      props.secondary,
      props.primaryHighlight,
      props.secondaryHighlight,
      props.neutral,
      props.disabled,
    ]);

    const titleStyles = useMemo(() => {
      return mergeStyles(
        [
          styles.text,
          props.primary
            ? styles.textPrimary
            : props.primaryHighlight
            ? styles.textPrimaryHighlight
            : props.secondary
            ? styles.textSecondary
            : props.secondaryHighlight
            ? styles.textSecondaryHighlight
            : {},
          props.neutral && styles.neutral,
          // disabled should be the last overridden style
          props.disabled && styles.textDisabled,
        ],
        titleStyle,
      );
    }, [
      styles,
      titleStyle,
      props.primary,
      props.secondary,
      props.primaryHighlight,
      props.secondaryHighlight,
      props.neutral,
      props.disabled,
    ]);

    const renderTitleComponent = useCallback(() => {
      const fontStyle = getFontStyle(titleStyles);
      return props.renderTitleComponent(titleStyles, buttonStyles, fontStyle);
    }, [titleStyles, buttonStyles]);

    return (
      <Button
        activeOpacity={0.5}
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

export default memo(OutlinedButton);
