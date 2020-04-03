import { Platform, Dimensions, PixelRatio } from 'react-native';
import {
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from 'react-native-iphone-x-helper';

const config = Object.freeze({
  appName: 'FoodHub',
  namespace: 'app',
  defaultSiteId: 28, // @NOTE: id cửa hàng ở menu
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
    primary: '#14964d',
    logo: {
      main: '#14964d',
      sub: '#ffffff',
      addition: '#14964d'
    },
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

    // Store Location
    storeLocation: 'storeLocation',

    // Modal
    modalPicker: 'modalPicker',
    modalList: 'modalList',
    modalSearchPlaces: 'modalSearchPlaces'
  }
});

export default config;
