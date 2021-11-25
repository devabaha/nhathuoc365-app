import React, {memo, forwardRef, useMemo} from 'react';
import {StyleSheet} from 'react-native';

import {CardProps} from '.';
import {Ref} from '..';

import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

import Container from '../Container';

const createStyles = (theme) => {
  const styles = StyleSheet.create({
    surface: {
      backgroundColor: theme.color.surface,
      borderRadius: theme.layout.borderRadiusMedium,
    },
  });

  return styles;
};

const Card = forwardRef(
  ({children, reanimated, animated, style, ...props}: CardProps, ref: Ref) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles: any = createStyles(theme);

      return baseStyles.surface;
    }, [theme]);

    const componentStyle = useMemo(() => {
      return mergeStyles(styles, style);
    }, [styles, style]);

    return (
      <Container ref={ref} {...props} style={componentStyle}>
        {children}
      </Container>
    );
  },
);

export default memo(Card);
