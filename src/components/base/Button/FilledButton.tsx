import React, {forwardRef, memo, useCallback, useMemo} from 'react';
import {StyleSheet} from 'react-native';

import {FilledButtonProps} from '.';
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
      backgroundColor: theme.color.persistTextPrimary,
    },
    primary: {
      backgroundColor: theme.color.persistPrimary,
    },
    secondary: {
      backgroundColor: theme.color.persistSecondary,
    },
    primaryHighlight: {
      backgroundColor: theme.color.primaryHighlight,
    },
    secondaryHighlight: {
      backgroundColor: theme.color.secondaryHighlight,
    },
    neutral: {
      backgroundColor: theme.color.contentBackgroundStrong,
    },
    disabled: {
      backgroundColor: theme.color.disabled,
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
      color: theme.color.onPersistPrimary,
    },
    textDisabled: {
      color: theme.color.onDisabled,
    },
  });

  return styles;
};

const FilledButton = forwardRef(
  (
    {
      titleStyle,
      style,

      ...props
    }: FilledButtonProps,
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

    const titleStyles = useMemo(
      () =>
        mergeStyles(
          [styles.text, props.disabled && styles.textDisabled],
          titleStyle,
        ),
      [styles, titleStyle, props.disabled],
    );

    const renderTitleComponent = useCallback(() => {
      const fontStyle = getFontStyle(titleStyles);

      return props.renderTitleComponent(titleStyles, buttonStyles, fontStyle);
    }, [titleStyles, buttonStyles]);

    return (
      <Button
        ref={ref}
        {...props}
        style={buttonStyles}
        titleStyle={titleStyles}
        renderTitleComponent={
          props.renderTitleComponent && renderTitleComponent
        }
      />
    );
  },
);

export default memo(FilledButton);
