import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';
import {defaultCurrency} from '../helper/currency';

class AddPaymentInfoModel {
  paymentInfo: FirebaseAnalyticsTypes.AddPaymentInfoEventParameters = {
    currency: defaultCurrency(),
  };

  constructor(
    paymentInfo: FirebaseAnalyticsTypes.AddPaymentInfoEventParameters,
  ) {
    this.paymentInfo = {
      ...this.paymentInfo,
      ...paymentInfo,
    };
  }

  get eventName() {
    return 'add_payment_info';
  }

  logEvent() {
    return store.analyst.logAddPaymentInfo(this.paymentInfo);
  }
}

export default AddPaymentInfoModel;
