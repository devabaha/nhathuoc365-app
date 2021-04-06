import {Platform, Dimensions, PixelRatio} from 'react-native';
import {
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';

class Config {
  constructor() {
    this._primaryColor = '#128C7E';
  }

  get tagVersion() {
    return 'b11.4.7';
  }

  get appName() {
    return 'homeid';
  }

  get namespace() {
    return 'app';
  }

  get reduxLoggerEnable() {
    return false;
  }

  get voucherModule() {
    return {
      appKey: 'homeidkey',
      secretKey: 'homeidkey234jhjksefdsd'
    };
  }

  get radaModule() {
    return {
      partnerAuthorization: 'l4yn7tixrkaio4gq5rdc:XRNaQj8hwk3ZbIm',
    };
  }

  get oneSignal() {
    return {
      appKey: '2647d461-03d1-43f0-a17a-31375254aca1'
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
        // main: '#59b2e4',
        main: this.primaryColor,
        sub: '#6559c5',
        addition: '#d37ee9'
      },
      status: {
        danger: '#ef476f',
        warning: '#ffd166',
        success: '#06d6a0',
        info: '#118ab2',
        other: '#073b4c'
      },
      cartType: {
        cart: '#B0C0F0',
        dropship: '#FF9F1C'
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
        [CART_STATUS_CLOSED]: '#06d6a0',
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
      roomTab: 'roomTab',
      accountTab: 'accountTab',
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
      modalInput: 'modalInput',
      modalConfirm: 'modalConfirm',
      modalComboLocation: 'modalComboLocation',

      //  Reset password
      resetPassword: 'resetPassword',

      // Amazing_chat
      amazing_chat: 'amazing_chat',

      // HomeID
      listBuilding: 'listBuilding',
      listRoom: 'listRoom',
      building: 'building',
      room: 'room',
      supplierStore: 'supplierStore',
      bills: 'bills',
      billsPaymentMethod: 'billsPaymentMethod',
      billsPaymentList: 'billsPaymentList',
      transferInfo: 'transferInfo',
      requests: 'requests',
      requestDetail: 'requestDetail',
      requestCreation: 'requestCreation',
      members: 'members',
      memberModal: 'memberModal',
      registerStore: 'registerStore',

      // BeeLand
      listBeeLand: 'listBeeLand',
      projectBeeLand: 'projectBeeLand',
      projectProductBeeLand: 'projectProductBeeLand',
      customerInfoBookingBeeLand: 'customerInfoBookingBeeLand',
      confirmBookingBeeLand: 'confirmBookingBeeLand',
      customerSearchingBeeLand: 'customerSearchingBeeLand',
      orderManagementBeeLand: 'orderManagementBeeLand',
      customerProfileBeeLand: 'customerProfileBeeLand',

      // All serives
      allServices: 'allServices',

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
      lotteryGame: 'lotteryGame'
    };
  }
}

export default new Config();
