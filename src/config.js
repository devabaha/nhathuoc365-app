import { Platform, Dimensions, PixelRatio } from 'react-native';
import {
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from 'react-native-iphone-x-helper';

const config = Object.freeze({
  appName: 'homeid',
  namespace: 'app',
  reduxLoggerEnable: false,
  voucherModule: {
    appKey: 'homeidkey',
    secretKey: 'homeidkey234jhjksefdsd'
  },
  radaModule: {
    partnerAuthorization: 'l4yn7tixrkaio4gq5rdc:XRNaQj8hwk3ZbIm'
  },
  oneSignal: {
    appKey: '2647d461-03d1-43f0-a17a-31375254aca1'
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
      main: '#59b2e4',
      sub: '#6559c5',
      addition: '#d37ee9'
    },
    primary: '#128C7E',
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
