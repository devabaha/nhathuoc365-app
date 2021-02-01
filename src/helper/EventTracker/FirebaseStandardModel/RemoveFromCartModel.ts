import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';
import {defaultCurrency} from '../helper/currency';

class RemoveFromCartModel {
  cartInfo: FirebaseAnalyticsTypes.RemoveFromCartEventParameters = {
    currency: defaultCurrency(),
  };

  constructor(cartInfo: FirebaseAnalyticsTypes.RemoveFromCartEventParameters) {
    this.cartInfo = {
      ...this.cartInfo,
      ...cartInfo,
    };
  }

  get eventName() {
    return 'remove_from_cart';
  }

  logEvent() {
    return store.analyst.logRemoveFromCart(this.cartInfo);
  }
}

export default RemoveFromCartModel;
