import {Actions} from 'react-native-router-flux';
import {formatViewEvents} from '../../constants';
import {ANALYTICS_DELAY_LOG_EVENT} from '../../constants/analytics';
import store from 'app-store';
import {
  AddPaymentInfoModel,
  AddToCartModel,
  AddToWishListModel,
  RemoveFromCartModel,
  PurchaseModel,
  ShareModel,
  SearchModel,
  SelectItemModel,
  ViewItemModel,
  ViewItemListModel,
  SelectPromotionModel,
  SignUpModel,
  ViewCartModel,
  ViewPromotionModel,
  LoginModel,
} from './FirebaseStandardModel';
import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import { defaultMethod } from './helper/currency';

class EventTracker {
  timer = -1;
  defaultLogOptions = {
    callBack: undefined,
    delay: ANALYTICS_DELAY_LOG_EVENT,
    params: undefined,
  };
  currentEventName = '';

  setCurrentEventName(eventName) {
    this.currentEventName = eventName;
  }

  isEventNameHasNotChanged(eventName) {
    return eventName && this.currentEventName === eventName;
  }

  mergeLogOptionsWithDefault(options) {
    return {
      ...this.defaultLogOptions,
      ...options,
    };
  }

  logSuccess(eventName, params: any = '') {
    console.log(
      '%canalytics',
      'background-color:#FFA611;color:white;padding-left:5px;padding-right: 5px;padding-top: 2px;padding-bottom: 2px;border-radius:5px',
      eventName,
      params,
    );
  }

  logError(eventName, error, params: any = '') {
    console.log(
      '%canalytics',
      'background-color:red;color:white;padding-left:5px;padding-right: 5px;padding-top: 2px;padding-bottom: 2px;border-radius:5px',
      error,
      params,
    );
    console.warn(`analytics_${eventName}_fails`, error);
  }

  analystLogEvent(eventName, params) {
    if (this.isEventNameHasNotChanged(eventName)) {
      // if (!__DEV__) {
      try {
        if (
          params &&
          typeof params === 'object' &&
          Object.keys(params).length === 0
        ) {
          params = undefined;
        }
        store.analyst.logEvent(eventName, {...params});
        this.logSuccess(eventName, params);
      } catch (error) {
        this.logError(eventName, error, params);
      }
      // }
    }
  }

  timeoutLogEvent(eventName, options = this.defaultLogOptions) {
    const mergedOptions = this.mergeLogOptionsWithDefault(options);
    const {delay, callBack, params} = mergedOptions;
    this.setCurrentEventName(eventName);
    this.timer = setTimeout(() => {
      // if (!__DEV__) {
      try {
        if (typeof callBack === 'function') {
          callBack(eventName, mergedOptions);
        } else {
          this.analystLogEvent(eventName, params);
        }
      } catch (error) {
        this.logError(eventName, error);
      }
      // }
    }, delay);
  }

  logEvent(eventName, options = this.defaultLogOptions) {
    options.delay = 0;
    this.timeoutLogEvent(eventName, options);
  }

  logAddPaymentInfo(item) {
    const paymentInfo: FirebaseAnalyticsTypes.AddPaymentInfoEventParameters = {};
    const AddPaymentInfo = new AddPaymentInfoModel(paymentInfo);
    AddPaymentInfo.logEvent()
      .then((res) => {
        this.logSuccess(AddPaymentInfo.eventName, paymentInfo);
      })
      .catch((err) => {
        this.logError(AddPaymentInfo.eventName, err, paymentInfo);
      });
  }

  logAddToCart(item) {
    const cartInfo: FirebaseAnalyticsTypes.AddToCartEventParameters = {};
    const AddToCartInfo = new AddToCartModel(cartInfo);
    AddToCartInfo.logEvent()
      .then((res) => {
        this.logSuccess(AddToCartInfo.eventName, cartInfo);
      })
      .catch((err) => {
        this.logError(AddToCartInfo.eventName, err, cartInfo);
      });
  }

  logAddToWishList(item) {
    const wishListInfo: FirebaseAnalyticsTypes.AddToWishlistEventParameters = {};
    const AddToWishList = new AddToWishListModel(wishListInfo);
    AddToWishList.logEvent()
      .then((res) => {
        this.logSuccess(AddToWishList.eventName, wishListInfo);
      })
      .catch((err) => {
        this.logError(AddToWishList.eventName, err, wishListInfo);
      });
  }

  logRemoveFromCart() {
    const cartInfo: FirebaseAnalyticsTypes.RemoveFromCartEventParameters = {};
    const RemoveFromCart = new RemoveFromCartModel(cartInfo);
    RemoveFromCart.logEvent()
      .then((res) => {
        this.logSuccess(RemoveFromCart.eventName, cartInfo);
      })
      .catch((err) => {
        this.logError(RemoveFromCart.eventName, err, cartInfo);
      });
  }

  logPurchase() {
    const purchaseInfo: FirebaseAnalyticsTypes.PurchaseEventParameters = {};
    const Purchase = new PurchaseModel(purchaseInfo);
    Purchase.logEvent()
      .then((res) => {
        this.logSuccess(Purchase.eventName, purchaseInfo);
      })
      .catch((err) => {
        this.logError(Purchase.eventName, err, purchaseInfo);
      });
  }

  logViewItem() {
    const itemInfo: FirebaseAnalyticsTypes.ViewItemEventParameters = {};
    const ViewItem = new ViewItemModel(itemInfo);
    ViewItem.logEvent()
      .then((res) => {
        this.logSuccess(ViewItem.eventName, itemInfo);
      })
      .catch((err) => {
        this.logError(ViewItem.eventName, err, itemInfo);
      });
  }

  logViewItemList() {
    const itemListInfo: FirebaseAnalyticsTypes.ViewItemListEventParameters = {};
    const ViewItemList = new ViewItemListModel(itemListInfo);
    ViewItemList.logEvent()
      .then((res) => {
        this.logSuccess(ViewItemList.eventName, itemListInfo);
      })
      .catch((err) => {
        this.logError(ViewItemList.eventName, err, itemListInfo);
      });
  }

  logShare() {
    const shareInfo: FirebaseAnalyticsTypes.ShareEventParameters = {
      content_type: '',
      item_id: '',
      method: '',
    };
    const Share = new ShareModel(shareInfo);
    Share.logEvent()
      .then((res) => {
        this.logSuccess(Share.eventName, shareInfo);
      })
      .catch((err) => {
        this.logError(Share.eventName, err, shareInfo);
      });
  }

  logSearch() {
    const searchInfo: FirebaseAnalyticsTypes.SearchEventParameters = {
      search_term: '',
    };
    const Search = new SearchModel(searchInfo);
    Search.logEvent()
      .then((res) => {
        this.logSuccess(Search.eventName, searchInfo);
      })
      .catch((err) => {
        this.logError(Search.eventName, err, searchInfo);
      });
  }

  logSelectItem() {
    const itemInfo: FirebaseAnalyticsTypes.SelectItemEventParameters = {
      content_type: '',
      item_list_id: '',
      item_list_name: '',
    };
    const SelectItem = new SelectItemModel(itemInfo);
    SelectItem.logEvent()
      .then((res) => {
        this.logSuccess(SelectItem.eventName, itemInfo);
      })
      .catch((err) => {
        this.logError(SelectItem.eventName, err, itemInfo);
      });
  }

  logSelectPromotion() {
    const promotion: FirebaseAnalyticsTypes.SelectPromotionEventParameters = {
      creative_name: '',
      creative_slot: '',
      location_id: '',
      promotion_id: '',
      promotion_name: '',
    };
    const SelectPromotion = new SelectPromotionModel(promotion);
    SelectPromotion.logEvent()
      .then((res) => {
        this.logSuccess(SelectPromotion.eventName, promotion);
      })
      .catch((err) => {
        this.logError(SelectPromotion.eventName, err, promotion);
      });
  }

  logSignUp() {
    const signUpInfo: FirebaseAnalyticsTypes.SignUpEventParameters = {
      method: '',
    };
    const SignUp = new SignUpModel(signUpInfo);
    SignUp.logEvent()
      .then((res) => {
        this.logSuccess(SignUp.eventName, signUpInfo);
      })
      .catch((err) => {
        this.logError(SignUp.eventName, err, signUpInfo);
      });
  }

  logViewCart() {
    const cartInfo: FirebaseAnalyticsTypes.ViewCartEventParameters = {};
    const ViewCart = new ViewCartModel(cartInfo);
    ViewCart.logEvent()
      .then((res) => {
        this.logSuccess(ViewCart.eventName, cartInfo);
      })
      .catch((err) => {
        this.logError(ViewCart.eventName, err, cartInfo);
      });
  }

  logViewPromotion() {
    const promotionCart: FirebaseAnalyticsTypes.ViewPromotionEventParameters = {};
    const ViewPromotion = new ViewPromotionModel(promotionCart);
    ViewPromotion.logEvent()
      .then((res) => {
        this.logSuccess(ViewPromotion.eventName, promotionCart);
      })
      .catch((err) => {
        this.logError(ViewPromotion.eventName, err, promotionCart);
      });
  }

  logLogin() {
    const loginInfo: FirebaseAnalyticsTypes.LoginEventParameters = {
      method: defaultMethod(),
    };
    const Login = new LoginModel(loginInfo);
    Login.logEvent()
      .then((res) => {
        this.logSuccess(Login.eventName, loginInfo);
      })
      .catch((err) => {
        this.logError(Login.eventName, err, loginInfo);
      });
  }

  logCurrentView(options = this.defaultLogOptions) {
    const eventOptions = {
      ...options,
      callBack: (eName, {delay, callBack, params}) => {
        const currentViewName = Actions.currentScene.split('_1')[0];
        if (currentViewName) {
          const eventName = formatViewEvents(currentViewName);
          this.analystLogEvent(eventName, params);
        }
      },
    };

    setTimeout(() => {
      const beforeLoggingViewName = Actions.currentScene.split('_1')[0];
      if (beforeLoggingViewName) {
        const formattedBeforeLoggingViewName = formatViewEvents(
          beforeLoggingViewName,
        );
        this.timeoutLogEvent(formattedBeforeLoggingViewName, eventOptions);
      }
    });
  }

  clearTracking() {
    clearTimeout(this.timer);
  }
}

export default EventTracker;
