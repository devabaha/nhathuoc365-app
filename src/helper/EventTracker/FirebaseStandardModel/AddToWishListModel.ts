import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';

class AddToWishListModel {
    wishListInfo: FirebaseAnalyticsTypes.AddToWishlistEventParameters = {
      currency: 'VND'
  };

  constructor(wishListInfo: FirebaseAnalyticsTypes.AddToWishlistEventParameters) {
    this.wishListInfo = {
        ...this.wishListInfo,
        ...wishListInfo
    };
  }

  logEvent() {
    store.analyst.logAddToWishlist(this.wishListInfo);
  }
}

export default AddToWishListModel;
