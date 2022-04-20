import React, {useMemo} from 'react';
import {ActivityIndicator as RnActivityIndicator} from 'react-native';

import {ActivityIndicatorProps} from '.';

import {useTheme} from 'src/Themes/Theme.context';

const ActivityIndicator = ({color, ...props}: ActivityIndicatorProps) => {
  const {theme} = useTheme();

  const colorValue = useMemo(() => {
    return color || theme.color.indicator;
  }, [theme, color]);

  return <RnActivityIndicator {...props} color={colorValue} />;
};

export default ActivityIndicator;
