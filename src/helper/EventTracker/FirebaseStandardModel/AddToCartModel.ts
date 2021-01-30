import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';

class AddToCartModel {
    cartInfo: FirebaseAnalyticsTypes.AddToCartEventParameters = {
      currency: 'VND'
  };

  constructor(cartInfo: FirebaseAnalyticsTypes.AddToCartEventParameters) {
    this.cartInfo = {
        ...this.cartInfo,
        ...cartInfo
    };
  }

  logEvent() {
    store.analyst.logAddToCart(this.cartInfo);
  }
}

export default AddToCartModel;
