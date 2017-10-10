'use strict';

import {
  Platform,
  Dimensions,
  PixelRatio,
} from 'react-native';

// API URL
// global.MY_FOOD_API = 'http://myfood.com/';
global.MY_FOOD_API = 'https://myfood.com.vn/';

// width, height of screen
Dimensions.get('window');
const {width, height} = Dimensions.get('window');

/**
* Util
*/
const Util = {
  ratio: PixelRatio.get(),
  pixel: 1 / PixelRatio.get(),
  size: {width, height},
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
global.APP_NAME = 'ABAHA';
global.APP_NAME_SHOW = 'ABAHA';
global.APP_VERSION = '1.0.1';
global.TIME_THE_LAUNCH = 1000;
global.DELAY_UPDATE_NOTICE = 5000;

global.GA_ID = 'UA-106153171-1';

// color
global.DEFAULT_COLOR = '#55b947';
global.HEADER_BGR = DEFAULT_COLOR;
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
}
global.TEXT_FONT_SIZE = 12;

// API
global.STATUS_SUCCESS = 200;
global.STATUS_UNDEFINE_USER = 201;
global.STATUS_FILL_INFO_USER = 202;
global.STATUS_PARAM_MISSING = 402;
global.STATUS_RTOKEN_INVALID = 400;
global.STATUS_AKEY_INVALID = 401;
global.STATUS_BLOCK_ACC = 404;
global.STATUS_LOGIN_FAIL = 405;
global.STATUS_SYSTEM_ERROR = 500;

// payment
global.CART_STATUS_ORDERING = 1;
global.CART_STATUS_READY = 5;

// user
global.STATUS_VERIFYED = 1;

// cache
global.STORE_CATEGORY_CACHE = 1000 * 60 * 5;
global.STORE_CACHE = 1000 * 60 * 30;
global.ITEM_CACHE = 1000 * 60 * 30;
global.CHAT_CACHE = null;
global.STORAGE_INTRO_KEY = 'KeyStoreIntro1188';

// stores
global.STORES_LOAD_MORE = 30;
global.STORE_DEMO_CODE = 'CHTNMF';
global.KEY_EVENTS_STORE = 'KeyEventStore';

// news_list
global.NEWS_LIMIT_IN_PAGE = 10;

// contacts
global.CONTACTS_LIMIT_IN_PAGE = 10;

// facebook sdk
global.FACEBOOK_PERMISSIONS = ['email', 'public_profile'];

global.MESSAGE_OTHER_ERROR = 'Lỗi không xác định, xin thử lại';

global.EMAIL_SUPPORT = 'support@abaha.com.vn';
global.ABAHA_FANPAGE = 'https://www.facebook.com/LoveU-1724265351163942/';
global.ABAHA_GROUP = 'https://www.facebook.com/groups/clbthuvuongmiennam/';
