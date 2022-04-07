import React, {forwardRef, memo, useMemo} from 'react';
import {RefreshControl as RNRefreshControl} from 'react-native';

import {RefreshControlProps} from '.';
import {Ref} from '..';

import {useTheme} from 'src/Themes/Theme.context';

const RefreshControl = forwardRef(
  ({tintColor: tintColorProp, ...props}: RefreshControlProps, ref: Ref) => {
    const {theme} = useTheme();

    const tintColor = useMemo(() => {
      return tintColorProp || theme.color.onSurface;
    }, [theme, tintColorProp]);

    return <RNRefreshControl {...props} ref={ref} tintColor={tintColor} />;
  },
);

export default memo(RefreshControl);
