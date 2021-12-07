import {Theme} from 'src/Themes/interface';

import {
  push,
  pop,
  replace,
  refresh,
  reset,
  jump,
  formatSceneProps,
} from './routing';

export {push, pop, replace, refresh, reset, jump, formatSceneProps};

export type RoutingPopFunction = (params?: {animated?: boolean}) => void;

export type RoutingCommonFunction = (
  sceneKey: string,
  props?: any,
  theme?: Theme,
) => void;

export type RoutingRefreshFunction = (props?: any, theme?: Theme) => void;
