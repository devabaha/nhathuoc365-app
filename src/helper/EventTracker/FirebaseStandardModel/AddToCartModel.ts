import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';
import { defaultCurrency } from '../helper/currency';

class AddToCartModel {
    cartInfo: FirebaseAnalyticsTypes.AddToCartEventParameters = {
      currency: defaultCurrency()
  };

  constructor(cartInfo: FirebaseAnalyticsTypes.AddToCartEventParameters) {
    this.cartInfo = {
        ...this.cartInfo,
        ...cartInfo
    };
  }

  get eventName() {
    return 'add_to_cart'
  }

  logEvent() {
    return store.analyst.logAddToCart(this.cartInfo);
  }
}

export default AddToCartModel;
