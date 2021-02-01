import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';
import { defaultCurrency } from '../helper/currency';

class ViewItemModel {
  itemInfo: FirebaseAnalyticsTypes.ViewItemEventParameters = {
    currency: defaultCurrency()
  };

  constructor(itemInfo: FirebaseAnalyticsTypes.ViewItemEventParameters) {
    this.itemInfo = {
      ...this.itemInfo,
      ...itemInfo,
    };
  }

  get eventName() {
      return 'view_item';
  }

  logEvent() {
    return store.analyst.logViewItem(this.itemInfo);
  }
}

export default ViewItemModel;
