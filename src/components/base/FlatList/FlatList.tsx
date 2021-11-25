import React, {forwardRef, memo, useMemo} from 'react';
import {StyleSheet, FlatList as RNFlatList, Animated} from 'react-native';

import Reanimated from 'react-native-reanimated';

import {Theme} from 'src/Themes/interface';
import {FlatListProps} from '.';
import {Ref} from '..';

import appConfig from 'app-config';
import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    contentContainer: {flexGrow: 1},
    safeLayout: {
      paddingBottom: appConfig.device.bottomSpace,
    },
  });
};

const FlatList = forwardRef(
  (
    {
      safeLayout,
      reanimated,
      animated,
      contentContainerStyle,
      children,
      ...props
    }: FlatListProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const contentContainerStyles = useMemo(() => {
      const baseStyles = createStyles(theme);

      return mergeStyles(
        [baseStyles.contentContainer, safeLayout && baseStyles.safeLayout],
        contentContainerStyle,
      );
    }, [theme, safeLayout, contentContainerStyle]);

    const Wrapper: any = useMemo(
      () =>
        reanimated
          ? Reanimated.createAnimatedComponent(FlatList)
          : animated
          ? Animated.FlatList
          : RNFlatList,
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

export default memo(FlatList);
