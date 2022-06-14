import React, {memo, forwardRef, useMemo} from 'react';
import {StyleSheet} from 'react-native';
// types
import {CardProps} from '.';
import {Ref} from '..';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {CardBorderRadiusType} from './constants';
// custom components
import Container from '../Container';

const createStyles = (theme) => {
  const styles = StyleSheet.create({
    surface: {
      backgroundColor: theme.color.surface,
      borderRadius: theme.layout.borderRadiusMedium,
    },
    [CardBorderRadiusType.EXTRA_SMALL]: {
      borderRadius: theme.layout.borderRadiusExtraSmall,
    },
    [CardBorderRadiusType.SMALL]: {
      borderRadius: theme.layout.borderRadiusSmall,
    },
    [CardBorderRadiusType.MEDIUM]: {
      borderRadius: theme.layout.borderRadiusMedium,
    },
    [CardBorderRadiusType.LARGE]: {
      borderRadius: theme.layout.borderRadiusLarge,
    },
  });

  return styles;
};

const Card = forwardRef(
  (
    {
      children,
      animated,
      borderRadiusSize = CardBorderRadiusType.MEDIUM,
      style,
      ...props
    }: CardProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles: any = createStyles(theme);

      return [
        props.noBackground ? {} : baseStyles.surface,
        baseStyles[borderRadiusSize],
      ];
    }, [theme, props.noBackground]);

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
