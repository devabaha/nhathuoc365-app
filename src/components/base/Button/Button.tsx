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
import {Ref, Typography} from '..';

import {mergeStyles} from 'src/Themes/helper';
import {useTheme} from 'src/Themes/Theme.context';

import {TypographyType} from '../Typography/constants';

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

      renderTitleComponent,

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
      return mergeStyles(styles.text, [titleStyle, typoProps?.style]);
    }, [styles, titleStyle, typoProps?.style]);

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
        underlayColor={'rgba(0,0,0,.6)'}
        activeOpacity={0.8}
        {...props}
        ref={ref}>
        <>
          {iconLeft}
          {renderTitleComponent ? (
            renderTitleComponent(titleStyles)
          ) : typeof children === 'string' || !!title ? (
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              {...typoProps}
              style={titleStyles}
              >
              {children || title}
            </Typography>
          ) : (
            children
          )}
          {iconRight}
        </>
      </Wrapper>
    );
  },
);

export default memo(Button);
