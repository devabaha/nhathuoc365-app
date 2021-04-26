import {Platform, Dimensions, PixelRatio} from 'react-native';
import {
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';
import {CART_PAYMENT_STATUS, DELIVERY_STATUS_CODE} from './constants/cart';

class Config {
  constructor() {
    this._primaryColor = '#f41820';
  }

  get tagVersion() {
    return 'r11.5.3';
  }

  get appName() {
    return 'ABAHAGLOBAL';
  }

  get namespace() {
    return 'app';
  }

  get defaultSiteId() {
    return 1803;
  }

  get reduxLoggerEnable() {
    return false;
  }

  get voucherModule() {
    return {
      appKey: 'abahaglobalkeywoxBg',
      secretKey: 'dyTUabahaglobalkeywoxBg4OA1mh',
    };
  }

  get radaModule() {
    return {
      partnerAuthorization: 'l4yn7tixrkaio4gq5rdc:XRNaQj8hwk3ZbIm',
    };
  }

  get oneSignal() {
    return {
      appKey: '437375e6-9a46-42fd-836e-30d3b1c28cd1',
    };
  }

  get device() {
    return {
      isIphoneX: isIphoneX(),
      isAndroid: Platform.OS.toLowerCase() === 'android',
      isIOS: Platform.OS.toLowerCase() === 'ios',
      ratio: PixelRatio.get(),
      pixel: 1 / PixelRatio.get(),
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      statusBarHeight: getStatusBarHeight(),
      bottomSpace: getBottomSpace(),
    };
  }

  get primaryColor() {
    return this._primaryColor;
  }

  set updatePrimaryColor(primaryColor) {
    this._primaryColor = primaryColor;
  }

  get colors() {
    return {
      logo: {
        main: this.primaryColor,
        sub: '#FFF',
        addition: '#000'
      },
      status: {
        danger: '#ef476f',
        warning: '#ffd166',
        success: '#06d6a0',
        info: '#118ab2',
        other: '#073b4c',
      },
      cartType: {
        cart: '#B0C0F0',
        dropship: '#FF9F1C',
      },
      delivery: {
        [DELIVERY_STATUS_CODE.CANCEL]: '#DED9E2',
        [DELIVERY_STATUS_CODE.SYSTEM_RECEIVED_ORDER]: '#9FA4C4',
        [DELIVERY_STATUS_CODE.SHIPPER_RECEIVED_ORDER]: '#95AFBA',
        [DELIVERY_STATUS_CODE.SHIPPER_GETTING_PACKAGES]: '#0F7173',
        [DELIVERY_STATUS_CODE.FAIL_TO_GETTING_PACKAGES]: '#EF798A',
        [DELIVERY_STATUS_CODE.DELIVERING]: '#ffd166',
        [DELIVERY_STATUS_CODE.DELIVERY_SUCCESS]: '#06d6a0',
        [DELIVERY_STATUS_CODE.DELIVERY_FAIL]: '#ef476f',
        [DELIVERY_STATUS_CODE.ORDER_RETURNING]: '#92817A',
        [DELIVERY_STATUS_CODE.ORDER_RETURNED]: '#6C7D47',
        [DELIVERY_STATUS_CODE.FOR_CONTROL]: '#17A398',
      },
      orderStatus: {
        [CART_STATUS_CANCEL_1]: '#ef476f',
        [CART_STATUS_CANCEL]: '#ef476f',
        [CART_STATUS_ORDERING]: '#6F7C12',
        [CART_STATUS_READY]: '#812384',
        [CART_STATUS_ACCEPTED]: '#F46036',
        [CART_STATUS_PROCESSING]: '#986d60',
        [CART_STATUS_DELIVERY]: '#EEAA21',
        [CART_STATUS_COMPLETED]: '#06d6a0',
        [CART_STATUS_CLOSED]: '#aaa',
      },
      paymentStatus: {
        [CART_PAYMENT_STATUS.UNPAID]: '#EEAA21',
        [CART_PAYMENT_STATUS.PAID]: '#06d6a0',
        [CART_PAYMENT_STATUS.CANCEL]: '#ef476f',
      },
      sceneBackground: '#e9e9ee',
      marigold: '#EEAA21',
      primary: this.primaryColor,
      white: '#fff',
      black: '#000',
      text: '#333',
      placeholder: '#c7c7cd',
    };
  }

  get routes() {
    return {
      // ?deprecated
      forgetActive: 'forget_active',
      forgetVerify: 'forget_verify',
      newPass: 'new_pass',
      // ----

      sceneWrapper: 'sceneWrapper',
      launch: 'launch',

      phoneAuth: 'phone_auth',
      countryPicker: 'countryPicker',

      primaryTabbar: 'primaryTabbar',

      homeTab: 'homeTab',
      newsTab: 'newsTab',
      accountTab: 'accountTab',
      deepLinkNewsTab: 'deepLinkNewsTab',
      scanQrCodeTab: 'scanQrCodeTab',
      customerCardWallet: 'customer_card_wallet',
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
      notifyDetail: 'notify_item',

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
      transaction: 'transaction',
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
      modalInput: 'modalInput',
      modalConfirm: 'modalConfirm',
      modalComboLocation: 'modalComboLocation',
      modalWebview: 'modalWebview',

      //  Reset password
      resetPassword: 'resetPassword',

      // All serives
      allServices: 'allServices',

      // iView
      captureFaceID: 'captureFaceID',

      // multi-level category
      multiLevelCategory: 'multiLevelCategory',

      //dynamic domain
      domainSelector: 'domainSelector',

      // Premium
      premiumInfo: 'premiumInfo',

      // Item detail
      item: 'item',

      // Product schedule
      productSchedule: 'productSchedule',

      //Group product
      groupProduct: 'groupProduct',
      productStamps: 'productStamps',

      // List GPS store
      gpsListStore: 'gpsListStore',

      // Agency
      agencyInformationRegister: 'agencyInformationRegister',

      // Commission
      commissionIncomeStatement: 'commissionIncomeStatement',

      // Gamification
      lotteryGame: 'lotteryGame',
    };
  }
}

export default new Config();
