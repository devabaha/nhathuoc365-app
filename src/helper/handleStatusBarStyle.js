import appConfig from '../config';
import { StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default function handleStatusBarStyle(prevState, newState, action) {
  if (appConfig.device.isAndroid) return;

  const darkStatusBarScenes = [
    appConfig.routes.qrBarCode,
    appConfig.routes.myVoucher,
    appConfig.routes.voucherDetail,
    appConfig.routes.voucherScanner,
    appConfig.routes.alreadyVoucher,
    appConfig.routes.voucherShowBarcode,
    appConfig.routes.voucherEnterCodeManual
  ];
  switch (action.type) {
    case 'Navigation/PUSH':
    case 'Navigation/BACK':
      const isDark = !!darkStatusBarScenes.some(
        sceneName => `${Actions.currentScene}`.indexOf(sceneName) !== -1
      );
      if (isDark) {
        StatusBar.setBarStyle('dark-content', true);
      } else {
        StatusBar.setBarStyle('light-content', true);
      }
      break;
  }
}
