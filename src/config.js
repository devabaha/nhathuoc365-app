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
    partnerAuthorization: 'l4yn7tixrkaio4gq5rdc:XRNaQj8hwk3ZbIm'
  },
  oneSignal: {
    appKey: 'e2e80243-08c0-405a-9a36-5d060ba0af12'
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
    logo: {
      main: '#8d2d8c',
      sub: '#f5bb4b',
      addition: '#f18c21'
    },
    primary: '#812384',
    white: '#fff',
    black: '#000',
    text: '#333',
    placeholder: '#c7c7cd'
  },
  routes: {
    sceneWrapper: 'sceneWrapper',
    launch: 'launch',

    primaryTabbar: 'primaryTabbar',

    homeTab: 'homeTab',
    newsTab: 'newsTab',
    deepLinkNewsTab: 'deepLinkNewsTab',
    scanQrCodeTab: 'scanQrCodeTab',
    ordersTab: 'ordersTab',
    deepLinkOrdersTab: 'deepLinkOrdersTab',

    vndWallet: 'vnd_wallet',
    payWallet: 'pay_wallet',
    transfer: 'transfer',
    transferPayment: 'transfer_payment',
    transferConfirm: 'transfer_confirm',

    scanQrCode: 'scanQrCode',
    qrBarCode: 'qrBarCode',

    notifies: 'notifies',

    store: 'store',
    searchStore: 'searchStore',
    myAddress: 'myAddress',

    storeOrders: 'store_orders',
    ordersChat: 'ordersChat',

    // ** Begin routes of Rada module
    tickidRada: 'tickidRada',
    tickidRadaListService: 'tickidRadaListService',
    tickidRadaServiceDetail: 'tickidRadaServiceDetail',
    tickidRadaBooking: 'tickidRadaBooking',
    tickidRadaOrderHistory: 'tickidRadaOrderHistory',
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
    paymentConfirm: 'paymentConfirm',
    paymentMethod: 'paymentMethod',
    internetBanking: 'internetBanking',
    //
    upToPhone: 'upToPhone',

    itemAttribute: 'itemAttribute',
    serviceOrders: 'serviceOrders'
  }
});

export default config;
