import React, {forwardRef, memo, useMemo} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import {Ref} from '..';
import {ScreenWrapperProps} from '.';
import {Theme} from 'src/Themes/interface';

import appConfig from 'app-config';
import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

import Container from '../Container';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    safeLayout: {
      paddingBottom: appConfig.device.bottomSpace,
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
      headerComponent = null,
      ...props
    }: ScreenWrapperProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();
    const styles = useMemo(() => {
      const baseStyles = createStyles(theme);

      return mergeStyles(
        [baseStyles.container, safeLayout && baseStyles.safeLayout],
        style,
      );
    }, [theme, style, safeLayout]);

    return (
      <Container {...props} ref={ref} style={styles}>
        {!!headerComponent ? (
          <SafeAreaView style={[{zIndex: 999}, headerComponent && {flex: 1}]}>
            {headerComponent}
          </SafeAreaView>
        ) : (
          <SafeAreaView />
        )}
        {children}
      </Container>
    );
  },
);

export default memo(ScreenWrapper);
