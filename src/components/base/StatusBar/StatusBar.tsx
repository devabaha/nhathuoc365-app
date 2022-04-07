import React, {memo, useMemo} from 'react';
import {StatusBar as RNStatusBar} from 'react-native';
// types
import {StatusBarProps} from '.';
// helpers
import {isDarkTheme} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';

const StatusBar = ({}: StatusBarProps) => {
  const {theme} = useTheme();

  const barStyle = useMemo(() => {
    return isDarkTheme(theme) ? 'light-content' : 'dark-content';
  }, [theme]);

  return <RNStatusBar barStyle={barStyle} />;
};

export default memo(StatusBar);
