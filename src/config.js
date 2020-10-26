import { Platform, Dimensions, PixelRatio } from 'react-native';
import {
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from 'react-native-iphone-x-helper';

const config = Object.freeze({
  appName: 'HuongCang',
  namespace: 'app',
  defaultSiteId: 1803, // @NOTE: id cửa hàng ở menu
  reduxLoggerEnable: false,
  voucherModule: {
    appKey: 'thuchuylekey',
    secretKey: '6QAfthuchuylekeyVus5po'
  },
  radaModule: {
    partnerAuthorization: 'l4yn7tixrkaio4gq5rdc:XRNaQj8hwk3ZbIm'
  },
  oneSignal: {
    appKey: '490c05c5-ddb5-4bfd-adf9-a58e78f7982a'
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
      main: '#f41820',
      sub: '#FFF',
      addition: '#000'
    },
    primary: '#f41820',
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
    qrPaymentInfo: 'qrPaymentInfo',
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
    serviceFeedback: 'serviceFeedback',

    // Schedule
    schedule: 'schedule',
    scheduleConfirm: 'scheduleConfirm',

    // Store Location
    storeLocation: 'storeLocation',
    gpsStoreLocation: 'gpsStoreLocation',

    // Modal
    modalPicker: 'modalPicker',
    modalList: 'modalList',
    modalSearchPlaces: 'modalSearchPlaces',
    modalRateApp: 'modalRateApp',
    modalCameraView: 'modalCameraView',
    modalPopup: 'modalPopup',

    //  Reset password
    resetPassword: 'resetPassword',

    // All serives
    allServices: 'allServices',

    // iView
    captureFaceID: 'captureFaceID',

    // multi-level category
    multiLevelCategory: 'multiLevelCategory'
  }
});

export default config;
