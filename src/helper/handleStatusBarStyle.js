import appConfig from '../config';
import {StatusBar} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {config as bgrStatusBarConfig} from 'app-packages/tickid-bgr-status-bar';

export default function handleStatusBarStyle(prevState, newState, action) {
  if (appConfig.device.isAndroid) return;

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
