import React from 'react';
import {Typography, TypographyType} from 'src/components/base';

import {Style, Theme} from '../interface';

import appConfig from 'app-config';
import {
  themeChangingListener,
  THEME_CHANGING_EVENT_NAME,
} from '../Theme.context';
import {darkStatusBarScenes} from 'app-helper/handleStatusBarStyle';

export const addThemeChangingListener = (listener) => {
  themeChangingListener.addListener(THEME_CHANGING_EVENT_NAME, listener);
};

export const removeThemeChangingListener = (listener) => {
  themeChangingListener.removeListener(THEME_CHANGING_EVENT_NAME, listener);
};

export const checkIsNextSceneNavBarSurfaceMode = (nextSceneKey: string) => {
  const isNavBarSurfaceMode = darkStatusBarScenes.find((sceneName) => {
    return sceneName === nextSceneKey;
  });

  return !!isNavBarSurfaceMode;
};

export const getNavBarTheme = (theme?: Theme, isSurfaceMode?: boolean) => {
  if (!theme) return {};
  const tintColor = isSurfaceMode
    ? theme.color.onSurface
    : theme.color.onPrimary;

  const titleStyle: Style = {
    ...(theme.typography[TypographyType.TITLE_SEMI_LARGE] as {}),
    fontWeight: appConfig.device.isIOS ? '500' : 'bold',
    color: tintColor,
  };

  const iconStyle: Style = {
    color: tintColor,
  };

  return {
    renderTitle: (props) => {
      return (
        <Typography
          type={TypographyType.TITLE_SEMI_LARGE}
          numberOfLines={1}
          style={{
            color: tintColor,
            fontWeight: appConfig.device.isIOS ? '500' : 'bold',
          }}>
          {props.title}
        </Typography>
      );
    },
    titleStyle,
    iconStyle,
    headerStyle: {
      backgroundColor: isSurfaceMode
        ? theme.color.surface
        : theme.color.primary,
    },

    tintColor,
  };
};

export const updateNavbarTheme = (navigation: any, currentTheme: Theme) => {
  const listener = (theme: Theme) => {
    if (!navigation?.setParams) return;
    // const navigationBarStyle = navigation.getParam('navigationBarStyle', {});
    const navBarTheme = getNavBarTheme(
      theme,
      !!navigation.state?.params?.surfaceMode,
    );

    navigation.setParams(navBarTheme);
  };

  listener(currentTheme);

  addThemeChangingListener(listener);

  return () => removeThemeChangingListener(listener);
};
