import { Platform, Dimensions, PixelRatio } from 'react-native';
import {
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from 'react-native-iphone-x-helper';

const config = Object.freeze({
  appName: 'FoodHub',
  namespace: 'app',
  reduxLoggerEnable: false,
  voucherModule: {
    appKey: 'mydinhhubkey',
    secretKey: '0406mydinhhubjfsdfd1414h52'
  },
  radaModule: {
    partnerAuthorization: 'l4yn7tixrkaio4gq5rdc:XRNaQj8hwk3ZbIm'
  },
  oneSignal: {
    appKey: 'c437636c-1e52-489c-b3bd-e64616fe2735'
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
    primary: '#55b947',
    white: '#fff',
    black: '#000',
    text: '#333'
  },
  routes: {
    sceneWrapper: 'sceneWrapper',
    launch: 'launch',

    primaryTabbar: 'primaryTabbar',

    homeTab: 'homeTab',
    newsTab: 'newsTab',
    scanQrCodeTab: 'scanQrCodeTab',
    ordersTab: 'ordersTab',

    scanQrCode: 'scanQrCode',
    qrBarCode: 'qrBarCode',

    store: 'store',
    searchStore: 'searchStore',
    myAddress: 'myAddress',

    // ** Begin routes of Rada module
    tickidRada: 'tickidRada',
    tickidRadaListService: 'tickidRadaListService',
    tickidRadaServiceDetail: 'tickidRadaServiceDetail',
    tickidRadaBooking: 'tickidRadaBooking',
    // end routes of Rada module **

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
