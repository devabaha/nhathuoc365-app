'use strict';

import {
  Platform
} from 'react-native';

/**
* Detect OS
* Use: isAndroid or isIOS returns true if the OS that
*/
global.isAndroid = Platform.OS == 'android';
global.isIOS = Platform.OS == 'ios';

// Apps
global.APP_NAME = 'ABAHA';
global.APP_NAME_SHOW = 'ABAHA';
global.APP_VERSION = '1.0.1';
global.TIME_THE_LAUNCH = 1000;

// Css
global.NAV_HEIGHT = isAndroid ? 54 : 64;
global.BAR_HEIGHT = 46;
global.TEXT_FONT_SIZE = '1.2rem';

// color
global.DEFAULT_COLOR = '#FF5159';
global.HEADER_BGR = DEFAULT_COLOR;
global.TITLE_HEADER_COLOR = '#ffffff';
global.BGR_SCREEN_COLOR = '#f0f0f0';

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
