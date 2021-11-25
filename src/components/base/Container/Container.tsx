import React, {memo, forwardRef, useMemo} from 'react';
import {StyleSheet, Animated, View} from 'react-native';

import Reanimated from 'react-native-reanimated';

import {ContainerProps} from '.';
import {Ref} from '..';

import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

const createStyles = (theme) => {
  const styles = StyleSheet.create({
    surface: {
      backgroundColor: theme.color.surface,
    },
    flex: {
      flex: 1,
    },
    row: {
      flexDirection: 'row',
    },
    rowCenterVertical: {
      alignItems: 'center',
      justifyContent: undefined,
    },
    rowCenterHorizontal: {
      justifyContent: 'center',
      alignItems: undefined,
    },
    centerHorizontal: {
      alignItems: 'center',
      justifyContent: undefined,
    },
    centerVertical: {
      justifyContent: 'center',
      alignItems: undefined,
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return styles;
};

const Container = forwardRef(
  (
    {
      children,
      reanimated,
      animated,
      style,
      flex,
      row,
      center,
      centerHorizontal,
      centerVertical,
      ...props
    }: ContainerProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles: any = createStyles(theme);
      let additionalStyle: any = {};
      if (flex) {
        additionalStyle = {...additionalStyle, ...baseStyles.flex};
      }

      if (row) {
        additionalStyle = {...additionalStyle, ...baseStyles.row};
      }

      if (center) {
        additionalStyle = {...additionalStyle, ...baseStyles.center};
      }

      if (centerHorizontal) {
        additionalStyle = {
          ...additionalStyle,
          ...(row
            ? baseStyles.rowCenterHorizontal
            : baseStyles.centerHorizontal),
        };
      }

      if (centerVertical) {
        additionalStyle = {
          ...additionalStyle,
          ...(row ? baseStyles.rowCenterVertical : baseStyles.centerVertical),
        };
      }

      return mergeStyles(baseStyles.surface, additionalStyle);
    }, [theme, row, center, centerHorizontal, centerVertical]);

    const componentStyle = useMemo(() => {
      return mergeStyles(styles, style);
    }, [styles, style]);

    const Wrapper: any = useMemo(
      () => (reanimated ? Reanimated.View : animated ? Animated.View : View),
      [reanimated, animated],
    );

    return (
      <Wrapper {...props} ref={ref} style={componentStyle}>
        {children}
      </Wrapper>
    );
  },
);

export default memo(Container);
