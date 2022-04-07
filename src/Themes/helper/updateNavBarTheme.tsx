import React from 'react';
import Typography, {TypographyType} from 'src/components/base/Typography';

import {Style, Theme} from '../interface';

import appConfig from 'app-config';
import {
  themeChangingListener,
  THEME_CHANGING_EVENT_NAME,
} from '../Theme.context';
import {DARK_STATUS_BAR_SCENES} from 'app-helper/statusBar/constants';
import {StatusBar} from 'react-native';

export const addThemeChangingListener = (listener) => {
  themeChangingListener.addListener(THEME_CHANGING_EVENT_NAME, listener);
};

export const removeThemeChangingListener = (listener) => {
  themeChangingListener.removeListener(THEME_CHANGING_EVENT_NAME, listener);
};

export const checkIsNextSceneNavBarSurfaceMode = (nextSceneKey: string) => {
  const isNavBarSurfaceMode = DARK_STATUS_BAR_SCENES.find((sceneName) => {
    const suffix = nextSceneKey.slice(nextSceneKey.length - 2);
    if (suffix === '_1') {
      nextSceneKey = nextSceneKey.slice(0, nextSceneKey.length - 2);
    }
    return sceneName === nextSceneKey;
  });

  return !!isNavBarSurfaceMode;
};

export const getNavBarTheme = (
  theme?: Theme,
  isSurfaceMode?: boolean,
  params: any = {},
) => {
  if (!theme) return {};
  const tintColor = isSurfaceMode
    ? theme.color.onSurface
    : theme.color.onPrimary;

  const titleStyle: Style = {
    ...(theme.typography[TypographyType.TITLE_SEMI_LARGE] as {}),
    ...params.titleStyle,
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
          style={[
            titleStyle,
            {
              color: tintColor,
              fontWeight: appConfig.device.isIOS ? '500' : 'bold',
            },
          ]}>
          {props.title}
        </Typography>
      );
    },
    titleStyle,
    iconStyle,
    headerStyle: {
      borderBottomWidth: 0,
      borderBottomColor: theme.color.border,
      ...params.navigationBarStyle,
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
      navigation?.state?.params || {},
    );

    navigation.setParams(navBarTheme);

    if (!!theme) {
      StatusBar.setBarStyle(
        !!navigation.state?.params?.surfaceMode
          ? theme.layout.statusBarSurfaceModeStyle
          : theme.layout.statusBarStyle,
      );

      if (
        appConfig.device.isAndroid &&
        navigation.state?.params?.surfaceMode !== undefined
      ) {
        if (!!navigation.state?.params?.surfaceMode) {
          StatusBar.setBackgroundColor(theme.color.statusBarBackgroundSurfaceMode);
        } else {
          StatusBar.setBackgroundColor(theme.color.statusBarBackground);
        }
      }
    }
  };

  listener(currentTheme);

  addThemeChangingListener(listener);

  return () => removeThemeChangingListener(listener);
};
