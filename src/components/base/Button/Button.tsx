import React, {forwardRef, memo, MutableRefObject, useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {mergeStyles} from 'src/Themes/helper';
import {Theme} from 'src/Themes/interface';
import {useTheme} from 'src/Themes/Theme.context';
import {BaseButtonProps} from '.';
import {Typography} from '..';
import {TypographyType} from '../Typography/constants';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    text: {
      color: theme.color.textPrimary,
      textTransform: 'uppercase',
      fontWeight: '600',
      fontSize: 16,
    },
  });
  return styles;
};

const Button = forwardRef(
  (
    {
      title,

      titleStyle,

      renderTitleComponent,

      iconLeft,
      iconRight,
      children,

      ...props
    }: BaseButtonProps,
    ref: MutableRefObject<any>,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles: any = createStyles(theme);

      return baseStyles;
    }, [theme]);

    const titleStyles = useMemo(() => {
      return mergeStyles(styles.text, titleStyle);
    }, [styles, titleStyle]);

    return (
      <TouchableOpacity activeOpacity={0.8} {...props} ref={ref}>
        {iconLeft}
        {renderTitleComponent ? (
          renderTitleComponent(titleStyles)
        ) : typeof children === 'string' || !!title ? (
          <Typography type={TypographyType.LABEL_MEDIUM} style={titleStyles}>
            {children || title}
          </Typography>
        ) : (
          children
        )}
        {iconRight}
      </TouchableOpacity>
    );
  },
);

export default memo(Button);
