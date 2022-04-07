import React, {forwardRef, memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
// types
import {Ref} from '..';
import {ScreenWrapperProps} from '.';
import {Theme} from 'src/Themes/interface';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import Container from '../Container';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    noBackground: {
      backgroundColor: undefined,
    },
  });

  return styles;
};

const ScreenWrapper = forwardRef(
  (
    {
      children,
      style,
      safeLayout,

      safeTopLayout,
      noBackground,
      headerComponent = null,
      ...props
    }: ScreenWrapperProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles = createStyles(theme);

      return mergeStyles(
        [baseStyles.container, noBackground && baseStyles.noBackground],
        style,
      );
    }, [theme, style, noBackground]);

    const edges: Array<Edge> = useMemo(() => {
      const directions: Array<Edge> = ['left', 'right'];
      if (safeLayout) {
        directions.push('bottom');
      }
      if (safeTopLayout) {
        directions.push('top');
      }
      return directions;
    }, [safeLayout, safeTopLayout]);

    return (
      <Container {...props} ref={ref} style={styles}>
        {!!headerComponent && headerComponent}
        <SafeAreaView style={{flex:1}} edges={edges}>
          {children}
        </SafeAreaView>
      </Container>
    );
  },
);

export default memo(ScreenWrapper);
