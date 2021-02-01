import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';
import {defaultCurrency} from '../helper/currency';

class AddToWishListModel {
  wishListInfo: FirebaseAnalyticsTypes.AddToWishlistEventParameters = {
    currency: defaultCurrency(),
  };

  constructor(
    wishListInfo: FirebaseAnalyticsTypes.AddToWishlistEventParameters,
  ) {
    this.wishListInfo = {
      ...this.wishListInfo,
      ...wishListInfo,
    };
  }

  get eventName() {
    return 'add_to_wishlist';
  }

  logEvent() {
    return store.analyst.logAddToWishlist(this.wishListInfo);
  }
}

export default AddToWishListModel;
