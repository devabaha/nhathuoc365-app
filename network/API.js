'use strict';

/**
* Name: API v0
* Docs: https://docs.google.com/spreadsheets/d/1TmJAnrADprIjgkn1MWv5PFiUpTSmaKAVkfMCPKZ9L7A/edit#gid=0
* E.g: in components dir import {USER_INFO, USER_LOGIN} from '../../network/api';
*/

// Sites
exports.USER_LOGIN = MY_FOOD_API + 'apiUser/login';
exports.SITE_LIKE = MY_FOOD_API + 'apiSite/like';

// Home
exports.USER_HOME = MY_FOOD_API + 'apiUser/home';

// Store
exports.USER_SEARCH_SITE = MY_FOOD_API + 'apiUser/search_site';
exports.USER_ADD_SITE = MY_FOOD_API + 'apiUser/add_site';
exports.USER_LIST_SITE = MY_FOOD_API + 'apiUser/list_site';
exports.SITE_INFO = MY_FOOD_API + 'apiSite/info';
exports.SITE_CATEGORY_PRODUCT = MY_FOOD_API + 'apiSite/category_product';
exports.SEARCH_PRODUCT = MY_FOOD_API + 'apiSite/search_product';
exports.USER_SITES = MY_FOOD_API + 'apiUser/sites';
exports.USER_REMOVE_SITE = MY_FOOD_API + 'apiUser/remove_site';

// Item
exports.SITE_PRODUCT = MY_FOOD_API + 'apiSite/product';

// Cart
exports.SITE_CART_ADDING = MY_FOOD_API + 'apiSite/cartadding';
exports.SITE_CART = MY_FOOD_API + 'apiSite/cart';
exports.SITE_CART_DOWN = MY_FOOD_API + 'apiSite/cartdown';
exports.SITE_CART_UP = MY_FOOD_API + 'apiSite/cartup';
exports.SITE_CART_REMOVE = MY_FOOD_API + 'apiSite/cartremove';
exports.SITE_CART_SELECT = MY_FOOD_API + 'apiSite/cartselect';
exports.SITE_CART_UNSELECT = MY_FOOD_API + 'apiSite/cartunselect';
exports.SITE_CART_NODE = MY_FOOD_API + 'apiSite/cartnote';
exports.SITE_CART_ORDERS = MY_FOOD_API + 'apiSite/cartorder';
exports.SITE_CART_CANCEL = MY_FOOD_API + 'apiSite/cartcancel';

// Address
exports.USER_ADDRESS = MY_FOOD_API + 'apiUser/address';
exports.USER_ADD_ADDRESS = MY_FOOD_API + 'apiUser/add_address';
exports.SITE_ADD_ADDRESS = MY_FOOD_API + 'apiSite/add_address';
exports.SITE_CART_ADDRESS = MY_FOOD_API + 'apiSite/cartaddress';
exports.USER_DELETE_ADDRESS = MY_FOOD_API + 'apiUser/delete_address';

// Orders
exports.SITE_CART_LIST = MY_FOOD_API + 'apiSite/cart_list';
exports.USER_CART_LIST = MY_FOOD_API + 'apiUser/cart_list';

// Chat
exports.SITE_SEND_CHAT = MY_FOOD_API + 'apiSite/send_chat';
exports.SITE_LOAD_CHAT = MY_FOOD_API + 'apiSite/load_chat';
exports.SITE_NOTIFY_CHAT = MY_FOOD_API + 'apiSite/notify_chat';
exports.USER_NOTIFY_CHAT = MY_FOOD_API + 'apiUser/notify_chat';

// News
exports.USER_NEWS_LIST = MY_FOOD_API + 'apiUser/news_list';
exports.USER_NEWS = MY_FOOD_API + 'apiUser/news';

// Notices
exports.USER_NOTICE = MY_FOOD_API + 'apiUser/notice';

// Notify
exports.USER_NOTIFY = MY_FOOD_API + 'apiUser/notify';

// Push Notification
exports.ADD_PUSH_TOKEN = MY_FOOD_API + 'api/add_push_token';

// Users
exports.USER_REGISTER = MY_FOOD_API + 'apiUser/register';
exports.USER_VERIFY_OTP = MY_FOOD_API + 'apiUser/verify_otp';
exports.USER_LOGIN_PASSWORD = MY_FOOD_API + 'apiUser/login_password';
exports.USER_LOGOUT = MY_FOOD_API + 'apiUser/logout';
exports.USER_ADD_AVATAR = MY_FOOD_API + 'apiUser/add_avatar';
