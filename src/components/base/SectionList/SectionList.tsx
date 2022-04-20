import React, {memo, useMemo, forwardRef} from 'react';
import {Animated, SectionList as RNSectionList, StyleSheet} from 'react-native';
import Reanimated from 'react-native-reanimated';
import {Theme} from 'src/Themes/interface';
import appConfig from 'app-config';
import {Ref} from '..';
import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
import {SectionListProps} from '.';

const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    contentContainer: {flexGrow: 1},
    safeLayout: {
      paddingBottom: appConfig.device.bottomSpace,
    },
  });
};

const SectionList = forwardRef(
  (
    {
      safeLayout,
      reanimated,
      animated,
      contentContainerStyle,
      ...props
    }: SectionListProps,
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
          ? Reanimated.createAnimatedComponent(SectionList)
          : animated
          ? Animated.SectionList
          : RNSectionList,
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

export default memo(SectionList);
