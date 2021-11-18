import React, {forwardRef, memo, MutableRefObject, useMemo} from 'react';
import {StyleSheet} from 'react-native';

import {TextButtonProps} from '.';
import {Theme} from 'src/Themes/interface';

import {useTheme} from 'src/Themes/Theme.context';
import Button from './Button';
import {mergeStyles} from 'src/Themes/helper';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    primary: {
      backgroundColor: theme.color.persistPrimary,
    },
    secondary: {
      backgroundColor: theme.color.persistSecondary,
    },
    disabled: {
      backgroundColor: theme.color.disabled,
    },
    shadow: {
      shadowColor: theme.color.shadow,
      ...theme.layout.shadow,
    },
    roundedSmall: {
      borderRadius: theme.layout.borderRadiusSmall,
    },
    roundedMedium: {
      borderRadius: theme.layout.borderRadiusMedium,
    },
    roundedLarge: {
      borderRadius: theme.layout.borderRadiusLarge,
    },
    text: {
      color: theme.color.onPersistPrimary,
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
    ref: MutableRefObject<any>,
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
        //   props.roundedSmall && styles.roundedSmall,
        //   props.roundedMedium && styles.roundedMedium,
        //   props.roundedLarge && styles.roundedLarge,
          props.primary && styles.primary,
          props.secondary && styles.secondary,
          // disabled should be the last overridden style
          props.disabled && styles.disabled,
        ],
        style,
      );
    }, [styles, style]);

    const titleStyles = [styles.text, titleStyle];

    return (
      <Button
        ref={ref}
        {...props}
        style={buttonStyles}
        titleStyle={titleStyles}
      />
    );
  },
);

export default memo(TextButton);
