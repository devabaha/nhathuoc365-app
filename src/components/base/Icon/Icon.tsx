import React, {forwardRef, memo, useMemo} from 'react';
import {StyleSheet, Animated} from 'react-native';
import Reanimated from 'react-native-reanimated';

import {Theme} from 'src/Themes/interface';
import {Ref} from '..';
import {IconProps} from '.';

import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

import {BundleIconSetName, BUNDLE_ICON_SETS} from './constants';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    primary: {
      color: theme.color.persistPrimary,
    },
    secondary: {
      color: theme.color.persistSecondary,
    },
    disabled: {
      color: theme.color.disabled,
    },

    icon: {
      color: theme.color.textPrimary,
      // fontSize: 16,
    },
  });
  return styles;
};

const Icon = forwardRef(
  (
    {
      bundle = BundleIconSetName.IONICONS,
      style,
      reanimated,
      animated,
      primary,
      secondary,
      disabled,
      ...props
    }: IconProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const IconComponent = useMemo(() => {
      let IconComp = BUNDLE_ICON_SETS[bundle];

      if (animated) {
        // @ts-ignore
        IconComp = Animated.createAnimatedComponent(IconComp);
      }
      if (reanimated) {
        IconComp = Reanimated.createAnimatedComponent(IconComp);
      }

      return IconComp;
    }, [bundle, reanimated, animated]);

    const styles = useMemo(() => {
      const baseStyles: any = createStyles(theme);

      return baseStyles;
    }, [theme]);

    const iconStyles = useMemo(() => {
      return mergeStyles(
        [
          styles.icon,
          primary && styles.primary,
          secondary && styles.secondary,
          disabled && styles.disabled,
        ],
        style,
      );
    }, [styles, style]);

    return <IconComponent {...props} ref={ref} style={iconStyles} />;
  },
);

export default memo(Icon);
