'use strict';

import {
  Platform,
  Dimensions,
  PixelRatio,
} from 'react-native';


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

// Apps
global.APP_NAME = 'ABAHA';
global.APP_NAME_SHOW = 'ABAHA';
global.APP_VERSION = '1.0.1';
global.TIME_THE_LAUNCH = 1000;

// Css
global.NAV_HEIGHT = isAndroid ? 54 : 64;
global.BAR_HEIGHT = 50;
global.CONTAINER_HEIGHT = Util.size.height - NAV_HEIGHT - BAR_HEIGHT;
global.MARGIN_SCREEN = {
  marginTop: NAV_HEIGHT,
  marginBottom: BAR_HEIGHT,
  backgroundColor: '#ebebeb'
}
global.TEXT_FONT_SIZE = 12;

// color
global.DEFAULT_COLOR = '#81be32';
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
