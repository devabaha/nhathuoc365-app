import React, {forwardRef, memo, useMemo} from 'react';
import {StyleSheet, FlatList as RNFlatList, Animated} from 'react-native';
// 3-party libs
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Reanimated from 'react-native-reanimated';
// types
import {Theme} from 'src/Themes/interface';
import {FlatListProps} from '.';
import {Ref} from '..';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';

const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    contentContainer: {flexGrow: 1},
  });
};

const FlatList = forwardRef(
  (
    {
      safeLayout,
      reanimated,
      animated,
      contentContainerStyle,
      ...props
    }: FlatListProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const insets = useSafeAreaInsets();

    const safeLayoutStyle = useMemo(
      () => ({
        paddingBottom: insets.bottom,
      }),
      [insets],
    );

    const contentContainerStyles = useMemo(() => {
      const baseStyles = createStyles(theme);

      return mergeStyles(
        [baseStyles.contentContainer, safeLayout && safeLayoutStyle],
        contentContainerStyle,
      );
    }, [theme, safeLayout, safeLayoutStyle, contentContainerStyle]);

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
        contentContainerStyle={contentContainerStyles}
      />
    );
  },
);

export default memo(FlatList);
