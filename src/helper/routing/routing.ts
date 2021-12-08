import {Actions} from 'react-native-router-flux';
import {Theme} from 'src/Themes/interface';
import {
  checkIsNextSceneNavBarSurfaceMode,
  getNavBarTheme,
} from 'src/Themes/helper/updateNavBarTheme';
import {
  RoutingCommonFunction,
  RoutingPopFunction,
  RoutingRefreshFunction,
} from '.';

export const formatSceneProps = (
  sceneKey: string,
  props: any = {},
  theme?: Theme,
) => {
  if (theme) {
    props = {
      ...props,
      ...getNavBarTheme(theme, checkIsNextSceneNavBarSurfaceMode(sceneKey)),
    };
  }

  return props;
};

export const push: RoutingCommonFunction = (sceneKey, props, theme) => {
  const formattedProps = formatSceneProps(sceneKey, props, theme);

  Actions.push(sceneKey, formattedProps);
};

export const refresh: RoutingRefreshFunction = (props, theme) => {
  Actions.refresh(props);
};

export const replace: RoutingCommonFunction = (sceneKey, props, theme) => {
  Actions.replace(sceneKey, props);
};

export const reset: RoutingCommonFunction = (sceneKey, props, theme) => {
  Actions.reset(sceneKey, props);
};

export const jump: RoutingCommonFunction = (sceneKey, props, theme) => {
  Actions.jump(sceneKey, props);
};

export const pop: RoutingPopFunction = (params) => {
  Actions.pop(params);
};
