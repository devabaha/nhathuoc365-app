'use strict';

import { Platform, Dimensions, PixelRatio } from 'react-native';

// API URL
// global.MY_FOOD_API = 'https://apiapp.tickid.top/';
// global.MY_FOOD_API = 'http://localhost:8000/';
global.MY_FOOD_API = 'https://api.foodhub.vn/';
// global.PHOTO_MY_FOOD_API = 'http://mshop.com/';
global.PHOTO_MY_FOOD_API = 'https://img.abaha.vn/';
global.HOTLINE = '+84888301518';

// codepush deployment keys (production)
global.CPDK = {
  ios: 'IjE1p0Oymztmj5fKvyOQehDxxsHWf87a6e14-8df5-40b0-b8e4-7ff15b6db3a7',
  android: 'ovDsGSUDYu_nfXdgWYsw_oQnO79cf87a6e14-8df5-40b0-b8e4-7ff15b6db3a7'
};

// width, height of screen
Dimensions.get('window');
const { width, height } = Dimensions.get('window');

/**
 * Util
 */
const Util = {
  ratio: PixelRatio.get(),
  pixel: 1 / PixelRatio.get(),
  size: { width, height }
};
global.Util = Util;

/**
 * Detect OS
 * Use: isAndroid or isIOS returns true if the OS that
 */
global.isAndroid = Platform.OS == 'android';
global.isIOS = Platform.OS == 'ios';

// Listenner
global.NEXT_PREV_CART = 'NextPrevCart';
global.RELOAD_STORE_ORDERS = 'RefreshStoreOrders';
global.KEY_BOARD_SHOW = 'keyboardWillShow';
global.KEY_BOARD_HIDE = 'keyboardWillHide';

// Apps
global.APP_NAME = 'FoodHub'; //Ma cua ung dung, khong thay doi, vi dung ten nay gan vao device id
global.APP_NAME_SHOW = 'FoodHub';
//appConfig.appName
global.TIME_THE_LAUNCH = 1000;
global.DELAY_UPDATE_NOTICE = 3000;

global.GA_ID = 'UA-106153171-1';

// color
global.DEFAULT_COLOR = '#14964d'; //2c6ca3
global.DEFAULT_COLOR_RED = '#e31b23';
global.DEFAULT_ADMIN_COLOR = '#3c8dbc';
global.HEADER_BGR = DEFAULT_COLOR;
global.HEADER_ADMIN_BGR = DEFAULT_ADMIN_COLOR;
global.TITLE_HEADER_COLOR = '#ffffff';
global.BGR_SCREEN_COLOR = '#f1f1f1';

// Css
global.NAV_HEIGHT = isAndroid ? 54 : 64;
global.BAR_HEIGHT = 50;
global.CONTAINER_HEIGHT = Util.size.height - NAV_HEIGHT - BAR_HEIGHT;
global.MARGIN_SCREEN = {
  marginTop: NAV_HEIGHT,
  marginBottom: BAR_HEIGHT,
  backgroundColor: BGR_SCREEN_COLOR
};
global.TEXT_FONT_SIZE = 12;
global.MARGIN_HORIZONTAL = 15;

// API
global.STATUS_SUCCESS = 200;
global.STATUS_UNDEFINE_USER = 201;
global.STATUS_FILL_INFO_USER = 202;
global.STATUS_SYNC_FLAG = 203;
global.STATUS_PARAM_MISSING = 402;
global.STATUS_RTOKEN_INVALID = 400;
global.STATUS_AKEY_INVALID = 401;
global.STATUS_BLOCK_ACC = 404;
global.STATUS_LOGIN_FAIL = 405;
global.STATUS_SYSTEM_ERROR = 500;

// payment
global.CART_STATUS_ORDERING = 1;
global.CART_STATUS_READY = 5;
global.CART_STATUS_ACCEPTED = 10;
global.CART_STATUS_PROCESSING = 15;
global.CART_STATUS_DELIVERY = 20;
global.CART_STATUS_COMPLETED = 25;
global.CART_STATUS_CANCEL = 0;

/**Object table type */
global.OBJECT_TYPE_KEY_SITE = 'site';
global.OBJECT_TYPE_KEY_USER = 'user';
global.OBJECT_TYPE_KEY_ADDRESS = 'address';
global.OBJECT_TYPE_KEY_PRODUCT_CATEGORY = 'site_product_category';
global.OBJECT_TYPE_KEY_PRODUCT = 'site_product';
global.OBJECT_TYPE_KEY_NEWS = 'site_news';
global.OBJECT_TYPE_KEY_CART = 'site_cart';
global.OBJECT_TYPE_KEY_VOUCHER = 'site_voucher';
global.OBJECT_TYPE_KEY_CAMPAIGN = 'voucher_campaign';

// user
global.STATUS_VERIFYED = 1;
global.CALLBACK_APP_UPDATING = 'CallBackUpdating';

// cache
global.STORE_CATEGORY_CACHE = 1000 * 60 * 5;
global.STORE_CACHE = 1000 * 60 * 30;
global.ITEM_CACHE = 1000 * 60 * 30;
global.CHAT_CACHE = null;
global.STORAGE_INTRO_KEY = 'KeyStoreIntro';
global.STORAGE_REF_KEY = 'KeyRefIntro';

// stores
global.STORES_LOAD_MORE = 30;
global.STORE_DEMO_CODE = 'FH';
global.KEY_EVENTS_STORE = 'KeyEventStore';
global.PASSWORD_STORAGE_KEY = 'PASSWORD_STORAGE_KEY';

// news_list
global.NEWS_LIMIT_IN_PAGE = 10;

// contacts
global.CONTACTS_LIMIT_IN_PAGE = 10;

// facebook sdk
global.FACEBOOK_PERMISSIONS = ['email', 'public_profile'];

global.MESSAGE_OTHER_ERROR = 'Lỗi không xác định, xin thử lại';

global.EMAIL_SUPPORT = 'info@foodhub.vn';
global.APP_FANPAGE = 'https://www.facebook.com/foodhubshop';
global.APP_INFO = 'http://foodhub.vn';

const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;
const PAD_WIDTH = 768;
const PAD_HEIGHT = 1024;
const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');
global.HIT_SLOP = { tight: 10, left: 10, top: 10, bottom: 10 };

global.isIPhoneX = (() => {
  if (Platform.OS === 'web') return false;

  return (
    (Platform.OS === 'ios' &&
      ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
        (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))) ||
    ((D_HEIGHT === XSMAX_HEIGHT && D_WIDTH === XSMAX_WIDTH) ||
      (D_HEIGHT === XSMAX_WIDTH && D_WIDTH === XSMAX_HEIGHT))
  );
})();

global.heightTabbar = global.isIPhoneX ? 83 : 49;
