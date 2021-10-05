import {
  default as RNVnpayMerchant,
  VnpayMerchantModule,
} from 'react-native-vnpay-merchant';
import {NativeEventEmitter} from 'react-native';

import appConfig from 'app-config';

const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);

const VNPAY_MERCHANT_PAYMENT_BACK_EVENT_NAME = 'PaymentBack';

class VNPayMerchant {
  listener = (e) => {
    console.log(e);
  };

  constructor(listener = this.listener) {
    this.addListener(listener);
  }

  addListener(listener = this.listener) {
    this.listener = listener;
    eventEmitter.addListener(VNPAY_MERCHANT_PAYMENT_BACK_EVENT_NAME, listener);
  }

  removeListener() {
    eventEmitter.removeListener(
      VNPAY_MERCHANT_PAYMENT_BACK_EVENT_NAME,
      this.listener,
    );
  }

  show(option = {}) {
    RNVnpayMerchant.show({
      isSandbox: true,
      //   paymentUrl
      scheme: 'vn.abahaglobal',
      backAlert: 'Back test?',
      title: 'Test thanh toán VNPAY',
      titleColor: appConfig.colors.white,
      beginColor: appConfig.colors.primary,
      endColor: appConfig.colors.primary,
      iconBackName: 'ion_back',
      tmn_code: 'GOGREEN1',
      ...option,
    });
  }
}

export default VNPayMerchant;
