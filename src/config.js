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
    appKey: 'thuchuylekey',
    secretKey: '6QAfthuchuylekeyVus5po'
  },
  radaModule: {
    partnerAuthorization: 'l4yn7tixrkaio4gq5rdc:XRNaQj8hwk3ZbIm'
  },
  oneSignal: {
    appKey: '81c68653-e1e3-4ec7-baa4-5a8e89541e29'
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
    // ?deprecated
    forgetActive: 'forget_active',
    forgetVerify: 'forget_verify',
    newPass: 'new_pass',
    // ----

    sceneWrapper: 'sceneWrapper',
    launch: 'launch',

    primaryTabbar: 'primaryTabbar',

    homeTab: 'homeTab',
    newsTab: 'newsTab',
    accountTab: 'accountTab',
    deepLinkNewsTab: 'deepLinkNewsTab',
    scanQrCodeTab: 'scanQrCodeTab',
    ordersTab: 'ordersTab',
    deepLinkOrdersTab: 'deepLinkOrdersTab',

    news: 'news',
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

    detailHistoryPayment: 'detail_history_payment',

    profileDetail: 'profile_detail',
    editProfile: 'edit_profile',

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

    // Modal
    modalPicker: 'modalPicker',
    modalList: 'modalList',
    modalSearchPlaces: 'modalSearchPlaces',
    modalRateApp: 'modalRateApp',
    modalPopup: 'modalPopup',

    //  Reset password
    resetPassword: 'resetPassword',

    // All serives
    allServices: 'allServices',

    // multi-level category
    multiLevelCategory: 'multiLevelCategory'
  }
});

export default config;
