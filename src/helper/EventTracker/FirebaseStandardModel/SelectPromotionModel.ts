import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';

class SelectPromotionModel {
  promotionInfo: FirebaseAnalyticsTypes.SelectPromotionEventParameters = {
    creative_name: '',
    creative_slot: '',
    location_id: '',
    promotion_id: '',
    promotion_name: ''
  };

  constructor(promotionInfo: FirebaseAnalyticsTypes.SelectPromotionEventParameters) {
    this.promotionInfo = {
      ...this.promotionInfo,
      ...promotionInfo,
    };
  }

  get eventName() {
    return 'select_promotion';
  }

  logEvent() {
    return store.analyst.logSelectPromotion(this.promotionInfo);
  }
}

export default SelectPromotionModel;
