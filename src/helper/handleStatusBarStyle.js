import { StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { config as bgrStatusBarConfig } from 'app-packages/tickid-bgr-status-bar';
import appConfig from 'app-config';
import store from 'app-store';

export default function handleStatusBarStyle(prevState, newState, action) {
  const darkStatusBarScenes = [
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

    appConfig.routes.resetPassword
  ];

  switch (action.type) {
    case 'Navigation/PUSH':
    case 'Navigation/BACK':
    case 'Navigation/NAVIGATE':
    case 'REACT_NATIVE_ROUTER_FLUX_REPLACE':
      const statusBarInState =
        bgrStatusBarConfig.statusBarState[Actions.currentScene];
      const isDark =
        !!darkStatusBarScenes.some(
          sceneName => `${Actions.currentScene}`.indexOf(sceneName) !== -1
        ) || statusBarInState === bgrStatusBarConfig.mode.dark;

      if (isDark) {
        if (appConfig.device.isAndroid) {
          StatusBar.setBackgroundColor('#000');
        } else {
          StatusBar.setBarStyle('dark-content', true);
        }
      } else {
        if (appConfig.device.isAndroid) {
          if (Actions.currentScene === `${appConfig.routes.homeTab}_1`) {
            StatusBar.setBackgroundColor(store.homeStatusBar.backgroundColor);
            return;
          }
          StatusBar.setBackgroundColor(appConfig.colors.primary);
        } else {
          StatusBar.setBarStyle('light-content', true);
        }
      }
      break;
  }
}
