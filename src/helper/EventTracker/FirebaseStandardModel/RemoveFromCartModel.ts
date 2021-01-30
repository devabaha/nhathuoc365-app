import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';

class RemoveFromCartModel {
    cartInfo: FirebaseAnalyticsTypes.RemoveFromCartEventParameters = {
      currency: 'VND'
  };

  constructor(cartInfo: FirebaseAnalyticsTypes.RemoveFromCartEventParameters) {
    this.cartInfo = {
        ...this.cartInfo,
        ...cartInfo
    };
  }

  logEvent() {
    store.analyst.logRemoveFromCart(this.cartInfo);
  }
}

export default RemoveFromCartModel;
