import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';

class ViewPromotionModel {
  promotionInfo: FirebaseAnalyticsTypes.ViewPromotionEventParameters = {
  };

  constructor(promotionInfo: FirebaseAnalyticsTypes.ViewPromotionEventParameters) {
    this.promotionInfo = {
      ...this.promotionInfo,
      ...promotionInfo,
    };
  }

  get eventName(){
      return 'view_promotion';
  }

  logEvent() {
    return store.analyst.logViewPromotion(this.promotionInfo);
  }
}

export default ViewPromotionModel;
