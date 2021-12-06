import React, {forwardRef, memo, useCallback, useMemo} from 'react';
import {StyleSheet} from 'react-native';

import {TextButtonProps} from '.';
import {Ref} from '..';
import {Theme} from 'src/Themes/interface';

import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

import Button from './Button';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    primary: {
      color: theme.color.primary,
    },
    secondary: {
      color: theme.color.secondary,
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
      return mergeStyles([styles.container], style);
    }, [styles, style]);

    const titleStyles = useMemo(() => {
      return mergeStyles(
        [
          props.shadow && styles.shadow,
          props.primary && styles.primary,
          props.secondary && styles.secondary,
          // disabled should be the last overridden style
          props.disabled && styles.disabled,
        ],
        titleStyle,
      );
    }, [
      props.shadow,
      props.primary,
      props.secondary,
      props.disabled,
      titleStyle,
    ]);

    const renderTitleComponent = useCallback(() => {
      return props.renderTitleComponent(titleStyles, buttonStyles);
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
