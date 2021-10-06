import {
  default as RNVnpayMerchant,
  VnpayMerchantModule,
} from 'react-native-vnpay-merchant';
import {NativeEventEmitter} from 'react-native';

import appConfig from 'app-config';

const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);

const VNPAY_MERCHANT_PAYMENT_BACK_EVENT_NAME = 'PaymentBack';

class VNPayMerchant {
  subscription = null;
  // listener = (e) => {
  //   console.log('vnpay_merchant_payment_back', e);
  // };

  constructor(listener = this.listener) {
    this.removeListener();
    this.addListener(listener);
  }

  addListener(listener = this.listener) {
    this.listener = listener;
    console.log('vnpay_merchant_add_listener');
    this.subscription = eventEmitter.addListener(
      VNPAY_MERCHANT_PAYMENT_BACK_EVENT_NAME,
      (e) => {
        console.log('vnpay_merchant_payment_back', e);
      },
    );
  }

  removeListener() {
    // if (this.subscription) {
    console.log('vnpay_merchant_remove_listener');
    // eventEmitter.removeSubscription(this.subscription);
    eventEmitter.removeAllListeners(VNPAY_MERCHANT_PAYMENT_BACK_EVENT_NAME);
    // }
  }

  show(option = {}) {
    RNVnpayMerchant.show({
      isSandbox: true,
      //   paymentUrl
      scheme: 'vn.abahaglobal',
      // backAlert: 'Back test?',
      title: 'Thanh toán VNPAY',
      titleColor: appConfig.colors.text,
      beginColor: appConfig.colors.white,
      endColor: appConfig.colors.white,
      iconBackName: 'close',
      tmn_code: 'GOGREEN1',
      ...option,
    });
    console.log(JSON.stringify({
      isSandbox: true,
      //   paymentUrl
      scheme: 'vn.abahaglobal',
      // backAlert: 'Back test?',
      title: 'Thanh toán VNPAY',
      titleColor: appConfig.colors.text,
      beginColor: appConfig.colors.white,
      endColor: appConfig.colors.white,
      iconBackName: 'close',
      tmn_code: 'GOGREEN1',
      ...option,
    }))
  }
}

export default VNPayMerchant;
