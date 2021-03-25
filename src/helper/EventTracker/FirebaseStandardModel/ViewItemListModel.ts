import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';

class ViewItemListModel {
  itemListInfo: FirebaseAnalyticsTypes.ViewItemListEventParameters = {};

  constructor(
    itemListInfo: FirebaseAnalyticsTypes.ViewItemListEventParameters,
  ) {
    this.itemListInfo = {
      ...this.itemListInfo,
      ...itemListInfo,
    };
  }

  get eventName() {
    return 'view_item_list';
  }

  logEvent() {
    return store.analyst.logViewItemList(this.itemListInfo);
  }
}

export default ViewItemListModel;
