import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';

class SelectItemModel {
  itemInfo: FirebaseAnalyticsTypes.SelectItemEventParameters = {
    content_type: '',
    item_list_id: '',
    item_list_name: '',
  };

  constructor(itemInfo: FirebaseAnalyticsTypes.SelectItemEventParameters) {
    this.itemInfo = {
      ...this.itemInfo,
      ...itemInfo,
    };
  }

  get eventName() {
    return 'select_item';
  }

  logEvent() {
    return store.analyst.logSelectItem(this.itemInfo);
  }
}

export default SelectItemModel;
