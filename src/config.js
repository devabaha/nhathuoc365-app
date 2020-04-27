import { Platform, Dimensions, PixelRatio } from 'react-native';
import {
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from 'react-native-iphone-x-helper';

const config = Object.freeze({
  appName: 'SHOPID',
  namespace: 'app',
  reduxLoggerEnable: false,
  voucherModule: {
    appKey: 'shopidappkey',
    secretKey: '2897423jkshopidappkey3423h'
  },
  radaModule: {
    partnerAuthorization: 'l4yn7tixrkaio4gq5rdc:XRNaQj8hwk3ZbIm'
  },
  oneSignal: {
    appKey: 'a1d6057d-f162-43f8-82e0-c9445610d5d3'
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
    customerCardWallet: 'customer_card_wallet',
    ordersTab: 'ordersTab',
    deepLinkOrdersTab: 'deepLinkOrdersTab',

    vndWallet: 'vnd_wallet',
    payWallet: 'pay_wallet',
    transfer: 'transfer',
    transferPayment: 'transfer_payment',
    transferConfirm: 'transfer_confirm',
    transferResult: 'transfer_result',

    scanQrCode: 'scanQrCode',
    qrBarCode: 'qrBarCode',

    notifies: 'notifies',

    store: 'store',
    searchStore: 'searchStore',
    myAddress: 'myAddress',

    storeOrders: 'store_orders',
    ordersChat: 'ordersChat',

    op_register: 'op_register',

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
    serviceOrders: 'serviceOrders',

    // Schedule
    schedule: 'schedule',
    scheduleConfirm: 'scheduleConfirm',

    // Modal
    modalPicker: 'modalPicker',
    modalList: 'modalList',
    modalSearchPlaces: 'modalSearchPlaces',

    //  Reset password
    resetPassword: 'resetPassword'
  }
});

export default config;
