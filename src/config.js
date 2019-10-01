import { Platform, Dimensions, PixelRatio } from 'react-native';
import {
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from 'react-native-iphone-x-helper';

const config = Object.freeze({
  appName: 'TICKID',
  namespace: 'app',
  reduxLoggerEnable: false,
  voucherModule: {
    appKey: 'tickidkey',
    secretKey: '0011tickidkey001122private'
  },
  radaModule: {
    partnerAuthorization:
      'l4yn7tixrkaio4gq5rdc:XRNaQj8hwk3ZbIml4yn7tixrkaio4gq5rdc:XRNaQj8hwk3ZbIm'
  },
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
    white: '#fff',
    black: '#000',
    text: '#333'
  },
  routes: {
    primaryTabbar: 'primaryTabbar',

    homeTab: 'homeTab',
    scanQrCodeTab: 'scanQrCodeTab',
    ordersTab: 'ordersTab',

    scanQrCode: 'scanQrCode',
    qrBarCode: 'qrBarCode',

    store: 'store',

    // ** Begin routes of Voucher module
    mainVoucher: 'mainVoucher',
    myVoucher: 'myVoucher',
    voucherDetail: 'voucherDetail',
    voucherSelectProvince: 'voucherSelectProvince',
    voucherScanner: 'voucherScanner',
    alreadyVoucher: 'alreadyVoucher',
    voucherEnterCodeManual: 'voucherEnterCodeManual',
    voucherShowBarcode: 'voucherShowBarcode',
    // end routes of Voucher module **

    // Routes of Order
    orders: 'Orders',
    //
    upToPhone: 'upToPhone'
  }
});

export default config;
