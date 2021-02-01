import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';
import {defaultCurrency} from '../helper/currency';

class PurchaseModel {
  purchaseInfo: FirebaseAnalyticsTypes.PurchaseEventParameters = {
    currency: defaultCurrency(),
  };

  constructor(purchaseInfo: FirebaseAnalyticsTypes.PurchaseEventParameters) {
    this.purchaseInfo = {
      ...this.purchaseInfo,
      ...purchaseInfo,
    };
  }

  get eventName() {
    return 'purchase';
  }

  logEvent() {
    return store.analyst.logPurchase(this.purchaseInfo);
  }
}

export default PurchaseModel;
