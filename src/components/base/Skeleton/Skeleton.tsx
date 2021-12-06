import React, {forwardRef, memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';

import {Ref} from '..';
import {SkeletonProps} from '.';

import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

import Container from '../Container';

const createStyles = (theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.color.skeletonContainer,
    },
    content: {
      backgroundColor: theme.color.skeletonContent,
    },
  });
};

const Skeleton = forwardRef(
  (
    {children, style, container, content, ...props}: SkeletonProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles = createStyles(theme);
      if (content) {
        return baseStyles.content;
      }
      if (container) {
        return baseStyles.container;
      }

      return {};
    }, [theme, container, content]);

    return (
      <Container {...props} ref={ref} style={mergeStyles(styles, style)}>
        {children}
      </Container>
    );
  },
);

export default memo(Skeleton);
