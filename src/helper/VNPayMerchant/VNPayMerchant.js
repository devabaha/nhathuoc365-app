import {NativeEventEmitter} from 'react-native';
import {
  default as RNVnpayMerchant,
  VnpayMerchantModule,
} from 'react-native-vnpay-merchant';
import i18next from 'i18next';

import appConfig from 'app-config';

const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);

const VNPAY_MERCHANT_PAYMENT_BACK_EVENT_NAME = 'PaymentBack';

class VNPayMerchant {
  listener = (e) => {
    console.log('vnpay_merchant_payment_back', e);
  };

  constructor(listener = this.listener) {
    this.addListener(listener);
  }

  addListener(listener = this.listener) {
    this.listener = (e) => {
      listener(e);
      this.removeListener();
    };
    
    console.log('vnpay_merchant_add_listener');
    eventEmitter.addListener(
      VNPAY_MERCHANT_PAYMENT_BACK_EVENT_NAME,
      this.listener,
    );
  }

  removeListener() {
    console.log('vnpay_merchant_remove_listener');
    eventEmitter.removeAllListeners(VNPAY_MERCHANT_PAYMENT_BACK_EVENT_NAME);
  }

  show(option = {}) {
    const t = i18next.getFixedT(undefined, 'payment');
    const config = {
      isSandbox: true,
      scheme: 'vn.abahaglobal',
      backAlert: t('transaction.cancelPaymentFlowConfirmMessage'),
      title: t('transaction.vnpayTitle'),
      titleColor: appConfig.colors.text,
      beginColor: appConfig.colors.white,
      endColor: appConfig.colors.white,
      iconBackName: 'close',
      //   paymentUrl
      // tmn_code: 'GOGREEN1',
      ...option,
    };
    RNVnpayMerchant.show(config);
  }
}

export default VNPayMerchant;
