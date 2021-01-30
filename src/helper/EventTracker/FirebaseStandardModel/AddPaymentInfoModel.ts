import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';

class AddPaymentInfoModel {
  paymentInfo: FirebaseAnalyticsTypes.AddPaymentInfoEventParameters = {
      currency: 'VND'
  };

  constructor(paymentInfo: FirebaseAnalyticsTypes.AddPaymentInfoEventParameters) {
    this.paymentInfo = {
        ...this.paymentInfo,
        ...paymentInfo
    };
  }

  logEvent() {
    store.analyst.logAddPaymentInfo(this.paymentInfo);
  }
}

export default AddPaymentInfoModel;
