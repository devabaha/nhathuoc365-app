import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';

class PurchaseModel {
    purchaseInfo: FirebaseAnalyticsTypes.PurchaseEventParameters = {
      currency: 'VND'
  };

  constructor(purchaseInfo: FirebaseAnalyticsTypes.PurchaseEventParameters) {
    this.purchaseInfo = {
        ...this.purchaseInfo,
        ...purchaseInfo
    };
  }

  logEvent() {
    store.analyst.logPurchase(this.purchaseInfo);
  }
}

export default PurchaseModel;
