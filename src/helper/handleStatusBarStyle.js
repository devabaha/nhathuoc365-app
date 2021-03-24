import {StatusBar} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {config as bgrStatusBarConfig} from 'app-packages/tickid-bgr-status-bar';
import appConfig from 'app-config';
import store from 'app-store';

export default function handleStatusBarStyle(prevState, newState, action) {
  if (appConfig.device.isAndroid) {
    if (Actions.currentScene === `${appConfig.routes.homeTab}_1`) {
      StatusBar.setBarStyle(store.homeStatusBar.barStyle, true);
      StatusBar.setBackgroundColor(store.homeStatusBar.backgroundColor)
      return;
    }
    if (Actions.currentScene === `${appConfig.routes.item}_1`) {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
      StatusBar.setBarStyle('dark-content', true);
    } else {
      StatusBar.setBackgroundColor(appConfig.colors.primary);
      StatusBar.setTranslucent(false);
      StatusBar.setBarStyle('light-content', true);
    }
    return;
  }

  const darkStatusBarScenes = [
    appConfig.routes.domainSelector,

    appConfig.routes.phoneAuth,
    appConfig.routes.qrBarCode,

    appConfig.routes.myVoucher,
    appConfig.routes.voucherDetail,
    appConfig.routes.voucherScanner,
    appConfig.routes.alreadyVoucher,
    appConfig.routes.voucherShowBarcode,
    appConfig.routes.voucherEnterCodeManual,

    appConfig.routes.tickidRada,
    appConfig.routes.tickidRadaListService,
    appConfig.routes.tickidRadaServiceDetail,
    appConfig.routes.tickidRadaBooking,

    appConfig.routes.schedule,
    appConfig.routes.scheduleConfirm,

    appConfig.routes.resetPassword,

    appConfig.routes.premiumInfo,

    appConfig.routes.item,
    appConfig.routes.itemAttribute,
  ];

  switch (action.type) {
    case 'Navigation/JUMP_TO':
    case 'Navigation/PUSH':
    case 'Navigation/BACK':
    case 'Navigation/NAVIGATE':
    case 'REACT_NATIVE_ROUTER_FLUX_REPLACE':
      const statusBarInState =
        bgrStatusBarConfig.statusBarState[Actions.currentScene];
      const isDark =
        darkStatusBarScenes.some((sceneName) => {
          let stackName = sceneName;
          const suffix = Actions.currentScene.substring(
            Actions.currentScene.length - 2,
          );
          if (suffix === '_1') {
            stackName = Actions.currentScene.substring(
              0,
              Actions.currentScene.length - 2,
            );
          }
          return sceneName === stackName;
        }) || statusBarInState === bgrStatusBarConfig.mode.dark;

      setTimeout(() => {
        if (isDark) {
          StatusBar.setBarStyle('dark-content', true);
        } else {
          StatusBar.setBarStyle('light-content', true);
        }
      });
      break;
  }
}
