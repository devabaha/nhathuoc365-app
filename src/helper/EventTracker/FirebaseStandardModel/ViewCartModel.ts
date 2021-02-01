import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';
import {defaultCurrency} from '../helper/currency';

class ViewCartModel {
  cartInfo: FirebaseAnalyticsTypes.ViewCartEventParameters = {
    currency: defaultCurrency(),
  };

  constructor(cartInfo: FirebaseAnalyticsTypes.ViewCartEventParameters) {
    this.cartInfo = {
      ...this.cartInfo,
      ...cartInfo,
    };
  }

  get eventName() {
    return 'view_cart';
  }

  logEvent() {
    return store.analyst.logViewCart(this.cartInfo);
  }
}

export default ViewCartModel;
