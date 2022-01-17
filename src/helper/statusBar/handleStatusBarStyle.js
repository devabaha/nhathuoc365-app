import {StatusBar} from 'react-native';
// 3-party libs
import {Actions} from 'react-native-router-flux';
import {config as bgrStatusBarConfig} from 'app-packages/tickid-bgr-status-bar';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {isDarkTheme} from 'src/Themes/helper';
// constants
import {
  DARK_STATUS_BAR_SCENES,
  REMAIN_PREV_STATUS_BAR_STYLE_SCENES,
  TRANSLUCENT_STATUS_BAR_SCENES,
} from './constants';

export default function handleStatusBarStyle(prevState, newState, action) {
  switch (action.type) {
    case 'Navigation/JUMP_TO':
    case 'Navigation/PUSH':
    case 'Navigation/BACK':
    case 'Navigation/NAVIGATE':
    case 'REACT_NATIVE_ROUTER_FLUX_REPLACE':
      const currentScene = Actions.currentScene;

      const statusBarInState = bgrStatusBarConfig.statusBarState[currentScene];
      const isDark =
        DARK_STATUS_BAR_SCENES.some((sceneName) => {
          let stackName = sceneName;
          const suffix = currentScene.substring(currentScene.length - 2);
          if (suffix === '_1') {
            stackName = currentScene.substring(0, currentScene.length - 2);
          } else {
            stackName = currentScene;
          }

          return sceneName === stackName;
        }) || statusBarInState === bgrStatusBarConfig.mode.dark;

      const isDarkStatusBar = isDark && !isDarkTheme(store.theme || {});

      if (appConfig.device.isAndroid) {
        // if (currentScene === `${appConfig.routes.homeTab}_1`) {
        //   StatusBar.setBarStyle(store.homeStatusBar.barStyle, true);
        //   StatusBar.setBackgroundColor(store.homeStatusBar.backgroundColor);
        // }

        if (TRANSLUCENT_STATUS_BAR_SCENES.includes(currentScene)) {
          StatusBar.setTranslucent(true);
          StatusBar.setBackgroundColor('transparent');
          StatusBar.setBarStyle('dark-content', true);
        } else if (
          !REMAIN_PREV_STATUS_BAR_STYLE_SCENES.includes(currentScene)
        ) {
          StatusBar.setTranslucent(false);
          StatusBar.setBackgroundColor(
            isDark
              ? store.theme?.color?.statusBarBackgroundSurfaceMode
              : store.theme?.color?.statusBarBackground,
          );
          StatusBar.setBarStyle(
            isDark
              ? store.theme.layout.statusBarSurfaceModeStyle
              : store.theme.layout.statusBarStyle,
            true,
          );
        }
        return;
      } else {
        setTimeout(() => {
          StatusBar.setBarStyle(
            isDarkStatusBar
              ? store.theme.layout.statusBarSurfaceModeStyle
              : store.theme.layout.statusBarStyle,
            true,
          );
        });
      }

      break;
  }
}
