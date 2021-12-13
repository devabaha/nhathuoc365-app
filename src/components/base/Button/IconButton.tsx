import React, {forwardRef, memo, useCallback, useMemo} from 'react';
import {StyleSheet} from 'react-native';

import {IconButtonProps} from '.';
import {Ref} from '..';
import {Theme} from 'src/Themes/interface';

import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

import Icon from '../Icon';
import Button from './Button';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    primary: {
      color: theme.color.primary,
    },
    secondary: {
      color: theme.color.secondary,
    },
    neutral: {
      color: theme.color.neutral,
    },
    disabled: {
      color: theme.color.disabled,
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

const IconButton = forwardRef(
  (
    {
      titleStyle,
      style,

      name,
      bundle,
      iconStyle,
      iconProps,

      ...props
    }: IconButtonProps,
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
          styles.text,
          props.shadow && styles.shadow,
          props.primary && styles.primary,
          props.secondary && styles.secondary,
          props.neutral && styles.neutral,
          // disabled should be the last overridden style
          props.disabled && styles.disabled,
        ],
        titleStyle,
      );
    }, [
      props.shadow,
      props.primary,
      props.secondary,
      props.neutral,
      props.disabled,
      titleStyle,
    ]);

    const renderTitleComponent = useCallback(() => {
      return props.renderTitleComponent(titleStyles, buttonStyles);
    }, [titleStyles, buttonStyles]);

    const renderIconComponent = () => {
      const iconStyles = mergeStyles(titleStyles, iconStyle);
      return (
        <Icon name={name} bundle={bundle} style={iconStyles} {...iconProps} />
      );
    };

    return (
      <Button
        activeOpacity={0.3}
        {...props}
        ref={ref}
        style={buttonStyles}
        titleStyle={titleStyles}
        children={props.children || renderIconComponent()}
        renderTitleComponent={
          props.renderTitleComponent && renderTitleComponent
        }
      />
    );
  },
);

export default memo(IconButton);
