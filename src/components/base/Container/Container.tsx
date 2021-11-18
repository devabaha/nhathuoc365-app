import React, {memo, forwardRef, useMemo, MutableRefObject} from 'react';
import {StyleSheet, Animated, View} from 'react-native';

import Reanimated from 'react-native-reanimated';
import {mergeStyles} from 'src/Themes/helper';

import {useTheme} from 'src/Themes/Theme.context';
import {ContainerProps} from '.';

const AnimatedView = Animated.View;
const ReanimatedView = Reanimated.View;

const createStyles = (theme) => {
  const styles = StyleSheet.create({
    surface: {
      backgroundColor: theme.color.surface,
    },
  });

  return styles;
};

const Container = forwardRef(
  (
    {children, reanimated, animated, style, ...props}: ContainerProps,
    ref: MutableRefObject<any>,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles: any = createStyles(theme);

      return baseStyles.surface;
    }, [theme]);

    const componentStyle = useMemo(() => {
      return mergeStyles(styles, style);
    }, [styles, style]);

    const Wrapper: any = reanimated
      ? ReanimatedView
      : animated
      ? AnimatedView
      : View;

    return (
      <Wrapper ref={ref} {...props} style={componentStyle}>
        {children}
      </Wrapper>
    );
  },
);

export default memo(Container);
