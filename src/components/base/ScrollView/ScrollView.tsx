import React, {forwardRef, memo, useMemo} from 'react';
import {StyleSheet, ScrollView as RNScrollView, Animated} from 'react-native';

import Reanimated from 'react-native-reanimated';

import {Ref} from '..';
import {Theme} from 'src/Themes/interface';
import {ScrollViewProps} from '.';

import appConfig from 'app-config';
import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    contentContainer: {flexGrow: 1},
    safeLayout: {
      paddingBottom: appConfig.device.bottomSpace,
    },
  });
};

const ScrollView = forwardRef(
  (
    {
      safeLayout,
      safeTopLayout,
      reanimated,
      animated,
      contentContainerStyle,
      children,
      ...props
    }: ScrollViewProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();
    const {top} = useSafeAreaInsets();

    const contentContainerStyles = useMemo(() => {
      const baseStyles = createStyles(theme);

      return mergeStyles(
        [
          baseStyles.contentContainer,
          safeLayout && baseStyles.safeLayout,
          safeTopLayout && {paddingTop: top},
        ],
        contentContainerStyle,
      );
    }, [theme, safeLayout, safeTopLayout, contentContainerStyle]);

    const Wrapper: any = useMemo(
      () =>
        reanimated
          ? Reanimated.createAnimatedComponent(ScrollView)
          : animated
          ? Animated.ScrollView
          : RNScrollView,
      [reanimated, animated],
    );

    return (
      <Wrapper
        {...props}
        ref={ref}
        contentContainerStyle={contentContainerStyles}>
        {children}
      </Wrapper>
    );
  },
);

export default memo(ScrollView);
