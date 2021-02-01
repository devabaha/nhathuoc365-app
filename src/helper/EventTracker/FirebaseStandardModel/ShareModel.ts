import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';

class ShareModel {
  shareInfo: FirebaseAnalyticsTypes.ShareEventParameters = {
    content_type: '',
    item_id: '',
    method: ''
  };

  constructor(shareInfo: FirebaseAnalyticsTypes.ShareEventParameters) {
    this.shareInfo = {
      ...this.shareInfo,
      ...shareInfo,
    };
  }

  get eventName(){
      return 'share'
  }

  logEvent() {
    return store.analyst.logShare(this.shareInfo);
  }
}

export default ShareModel;
