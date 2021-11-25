import React, {
  forwardRef,
  memo,
  useCallback,
  useMemo,
} from 'react';
import {StyleSheet} from 'react-native';

import {FilledTonalButtonProps} from '.';
import {Ref} from '..';
import {Theme} from 'src/Themes/interface';

import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
import {hexToRgba, rgbaToRgb} from 'app-helper';

import {ButtonRoundedType} from './constants';

import Button from './Button';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: rgbaToRgb(
        hexToRgba(theme.color.persistTextPrimary, 0.2),
      ),
    },
    primary: {
      backgroundColor: rgbaToRgb(hexToRgba(theme.color.persistPrimary, 0.2)),
    },
    secondary: {
      backgroundColor: rgbaToRgb(hexToRgba(theme.color.persistSecondary, 0.2)),
    },
    disabled: {
      backgroundColor: theme.color.disabled,
    },
    shadow: {
      shadowColor: theme.color.shadow,
      ...theme.layout.shadow,
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
      color: theme.color.persistTextPrimary,
    },
    textPrimary: {
      color: theme.color.persistPrimary,
    },
    textSecondary: {
      color: theme.color.persistSecondary,
    },
    textDisabled: {
      color: theme.color.onDisabled,
    },
  });

  return styles;
};

const FilledTonalButton = forwardRef(
  (
    {
      titleStyle,
      style,

      ...props
    }: FilledTonalButtonProps,
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
          props.primary && styles.primary,
          props.secondary && styles.secondary,
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
      props.disabled,
    ]);

    const titleStyles = useMemo(() => {
      return mergeStyles(
        [
          styles.text,
          props.primary && styles.textPrimary,
          props.secondary && styles.textSecondary,
          // disabled should be the last overridden style
          props.disabled && styles.textDisabled,
        ],
        titleStyle,
      );
    }, [styles, titleStyle, props.primary, props.secondary, props.disabled]);

    const renderTitleComponent = useCallback(() => {
      return props.renderTitleComponent(titleStyles, buttonStyles);
    }, [titleStyles, buttonStyles]);

    return (
      <Button
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

export default memo(FilledTonalButton);
