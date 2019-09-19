import { Platform, Dimensions, PixelRatio } from 'react-native';
import {
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from 'react-native-iphone-x-helper';

const config = Object.freeze({
  namespace: 'app',
  device: Object.freeze({
    isIphoneX: isIphoneX(),
    isAndroid: Platform.OS.toLowerCase() === 'android',
    isIOS: Platform.OS.toLowerCase() === 'ios',
    ratio: PixelRatio.get(),
    pixel: 1 / PixelRatio.get(),
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    statusBarHeight: getStatusBarHeight(),
    bottomSpace: getBottomSpace()
  }),
  colors: {
    primary: '#812384',
    white: '#fff'
  },
  routes: {
    primaryTabbar: 'primaryTabbar',

    homeTab: 'homeTab',
    scanQrCodeTab: 'scanQrCodeTab',

    scanQrCode: 'scanQrCode',
    qrBarCode: 'qrBarCode',

    mainVoucher: 'mainVoucher',

    upToPhone: 'upToPhone'
  }
});

export default config;
