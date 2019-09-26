import appConfig from 'app-config';
import { StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default function handleStatusBarStyle(prevState, newState, action) {
  const darkStatusBarScenes = [
    appConfig.routes.qrBarCode,
    appConfig.routes.myVoucher,
    appConfig.routes.voucherDetail,
    appConfig.routes.voucherScanner
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
