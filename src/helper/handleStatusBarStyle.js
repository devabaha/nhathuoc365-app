import appConfig from '../config';
import { StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { config as bgrStatusBarConfig } from 'app-packages/tickid-bgr-status-bar';

export default function handleStatusBarStyle(prevState, newState, action) {
  if (appConfig.device.isAndroid) return;

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
        StatusBar.setBarStyle('dark-content', true);
      } else {
        StatusBar.setBarStyle('light-content', true);
      }
      break;
  }
}
