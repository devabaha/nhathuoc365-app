import React, {forwardRef, memo, useMemo} from 'react';
import {
  StyleSheet,
  TouchableHighlight as RNTouchableHighlight,
  TouchableOpacity as RNTouchableOpacity,
} from 'react-native';

import {
  TouchableHighlight as GestureTouchableHighlight,
  TouchableOpacity as GestureTouchableOpacity,
} from 'react-native-gesture-handler';

import {Theme} from 'src/Themes/interface';
import {BaseButtonProps} from '.';
import {Ref} from '..';

import {mergeStyles} from 'src/Themes/helper';
import {useTheme} from 'src/Themes/Theme.context';

import {TypographyType} from '../Typography/constants';

import Typography from '../Typography';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    text: {
      color: theme.color.textPrimary,
      // textTransform: 'uppercase',
      // fontWeight: '600',
      // fontSize: 16,
    },
  });
  return styles;
};

const Button = forwardRef(
  (
    {
      useGestureHandler,
      useTouchableHighlight,

      typoProps,

      title,

      titleStyle,

      renderIconLeft,
      renderTitleComponent,
      renderIconRight,

      iconLeft,
      iconRight,
      children,

      ...props
    }: BaseButtonProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles: any = createStyles(theme);

      return baseStyles;
    }, [theme]);

    const titleStyles = useMemo(() => {
      return mergeStyles(
        typoProps?.type ? theme.typography[typoProps.type] : styles.text,
        [titleStyle, typoProps?.style],
      );
    }, [styles, titleStyle, typoProps?.type, typoProps?.style]);

    const Wrapper = useMemo(() => {
      return useTouchableHighlight
        ? useGestureHandler
          ? GestureTouchableHighlight
          : RNTouchableHighlight
        : useGestureHandler
        ? GestureTouchableOpacity
        : RNTouchableOpacity;
    }, [useTouchableHighlight, useGestureHandler]);

    return (
      <Wrapper
        underlayColor={theme.color.underlay}
        activeOpacity={0.8}
        {...props}
        ref={ref}>
        <>
          {iconLeft}
          {!!renderIconLeft && renderIconLeft(titleStyles)}

          {renderTitleComponent ? (
            renderTitleComponent(titleStyles)
          ) : typeof children === 'string' || !!title ? (
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              {...typoProps}
              style={titleStyles}>
              {children || title}
            </Typography>
          ) : (
            children
          )}
          {!!renderIconRight && renderIconRight(titleStyles)}
          {iconRight}
        </>
      </Wrapper>
    );
  },
);

export default memo(Button);
