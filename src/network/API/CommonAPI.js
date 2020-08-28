/**
 * Common/old API
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module CommonAPI
 */

// Sites
exports.USER_LOGIN = MY_FOOD_API + 'apiUser/login';
exports.SITE_LIKE = MY_FOOD_API + 'apiSite/like';

// Home
exports.USER_HOME = MY_FOOD_API + 'apiUser/home';
exports.USER_SITE_HOME = MY_FOOD_API + 'apiUser/site_home';

// Store
exports.USER_SEARCH_SITE = MY_FOOD_API + 'apiUser/search_site';
exports.USER_SEARCH_SITES = MY_FOOD_API + 'apiUser/search_sites';
exports.USER_ADD_SITE = MY_FOOD_API + 'apiUser/add_site';
exports.USER_LIST_SITE = MY_FOOD_API + 'apiUser/list_site';
exports.USER_LIST_SUGGEST_SITE = MY_FOOD_API + 'apiUser/list_suggest_site';
exports.SITE_INFO = MY_FOOD_API + 'apiSite/info';
exports.SITE_DETAIL = MY_FOOD_API + 'apiSite/detail';
exports.SITE_CATEGORY_PRODUCT = MY_FOOD_API + 'apiSite/category_product';
exports.SEARCH_PRODUCT = MY_FOOD_API + 'apiSite/search_product';
exports.USER_SITES = MY_FOOD_API + 'apiUser/sites';
exports.USER_BARCODE = MY_FOOD_API + 'apiUser/user_barcode';
exports.USER_FROM_BARCODE = MY_FOOD_API + 'apiUser/user_from_barcode';
exports.USER_REMOVE_SITE = MY_FOOD_API + 'apiUser/remove_site';
exports.USER_ADD_REF = MY_FOOD_API + 'apiUser/add_ctv';
exports.USER_GET_WALLET = MY_FOOD_API + 'apiUser/user_get_wallet';
exports.USER_INVITE_HISTORY = MY_FOOD_API + 'apiUser/invite_history';
exports.USER_CHECK_ADDRESS = MY_FOOD_API + 'apiUser/check_address';
exports.USER_UPDATE_PROFILE = MY_FOOD_API + 'apiUser/update';

// Item
exports.SITE_PRODUCT = MY_FOOD_API + 'apiSite/product';
exports.SITE_PRODUCT_ATTRIBUTES = MY_FOOD_API + 'apiSite/product_attr';

// Cart
exports.SITE_CART_PLUS = MY_FOOD_API + 'apiCart/plus';
exports.SITE_CART_MINUS = MY_FOOD_API + 'apiCart/minus';
exports.SITE_CART_UPDATE_ORDERING =
  MY_FOOD_API + 'apiCart/update_cart_ordering';
exports.SITE_CART_SELECTED = MY_FOOD_API + 'apiCart/selected';
exports.SITE_CART_UNSELECTED = MY_FOOD_API + 'apiCart/unselected';
exports.SITE_CART_ORDER = MY_FOOD_API + 'apiCart/order';
exports.SITE_CART_UPDATE = MY_FOOD_API + 'apiCart/update';
exports.SITE_CART_NOTE = MY_FOOD_API + 'apiCart/note';
exports.SITE_CART_RATING = MY_FOOD_API + 'apiCart/rating';
exports.SITE_CART_SHOW = MY_FOOD_API + 'apiCart/show';
exports.SITE_CART_CANCELING = MY_FOOD_API + 'apiCart/cancel';
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
exports.SITE_CART_REORDER = MY_FOOD_API + 'apiSite/cart_reorder';
exports.SITE_CART_EDIT = MY_FOOD_API + 'apiSite/cart_edit';
exports.CART_SITE_UPDATE = MY_FOOD_API + 'apiSite/site_cart_update';

// Address
exports.SITE_CART_ADD_ADDRESS = MY_FOOD_API + 'apiCart/add_address';
exports.SITE_CART_CHANGE_ADDRESS = MY_FOOD_API + 'apiCart/change_address';
exports.USER_ADDRESS = MY_FOOD_API + 'apiUser/address';
exports.USER_ADD_ADDRESS = MY_FOOD_API + 'apiUser/add_address';
exports.SITE_ADD_ADDRESS = MY_FOOD_API + 'apiSite/add_address';
exports.SITE_CART_ADDRESS = MY_FOOD_API + 'apiSite/cartaddress';
exports.USER_DELETE_ADDRESS = MY_FOOD_API + 'apiUser/delete_address';

// Orders
exports.SITE_CART_INDEX = MY_FOOD_API + 'apiCart/index';
exports.SITE_CART_LIST = MY_FOOD_API + 'apiSite/cart_list';
exports.USER_CART_LIST = MY_FOOD_API + 'apiUser/cart_list';
//get_cart_code
exports.USER_CART_CODE = MY_FOOD_API + 'apiUser/get_cart_code';

// Chat
exports.SITE_SEND_CHAT = MY_FOOD_API + 'apiSite/send_chat';
exports.SITE_LOAD_CHAT = MY_FOOD_API + 'apiSite/load_chat';
exports.SITE_NOTIFY_CHAT = MY_FOOD_API + 'apiSite/notify_chat';
exports.USER_NOTIFY_CHAT = MY_FOOD_API + 'apiUser/notify_chat';
exports.SITE_CONVERSATIONS = MY_FOOD_API + 'apiChat/conversations';
exports.SITE_CONVERSATION = MY_FOOD_API + 'apiChat/conversation';
exports.SITE_SEND_MESSAGE = MY_FOOD_API + 'apiChat/send';
exports.SITE_SEARCH_CONVERSATIONS = MY_FOOD_API + 'apiChat/search';
exports.SITE_PIN_LIST = MY_FOOD_API + 'apiSite/pin_list';

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
exports.USER_OP_REGISTER = MY_FOOD_API + 'apiUser/op_register';
exports.USER_VERIFY_OTP = MY_FOOD_API + 'apiUser/verify_otp';
exports.USER_LOGIN_PASSWORD = MY_FOOD_API + 'apiUser/login_password';
exports.USER_LOGIN_SMS = MY_FOOD_API + 'apiUser/login_sms';
exports.LOGIN_SMS_VERIFY = MY_FOOD_API + 'apiUser/login_sms_verify';
exports.LOGIN_FBAK_VERIFY = MY_FOOD_API + 'apiUser/login_fbak_verify';
exports.USER_LOGOUT = MY_FOOD_API + 'apiUser/logout';
exports.USER_ADD_AVATAR = PHOTO_MY_FOOD_API + 'apiUser/add_avatar';
exports.UPLOAD_IMAGE = PHOTO_MY_FOOD_API + 'photos/upload_image';
exports.USER_FORGET_PASSWORD = MY_FOOD_API + 'apiUser/forget_password';
exports.USER_FORGET_PASSWORD_VERIFY =
  MY_FOOD_API + 'apiUser/forget_password_verify';
exports.USER_FORGET_NEW_PASSWORD = MY_FOOD_API + 'apiUser/forget_new_password';
exports.USER_CHOOSE_LOCATION = MY_FOOD_API + 'apiUser/choose_site';
exports.USER_COINS_WALLET = MY_FOOD_API + 'apiUser/point_history';
exports.USER_TRANSFER_BALANCE = MY_FOOD_API + 'apiUser/transfer_balance';
exports.USER_WALLET_HISTORY = MY_FOOD_API + 'apiUser/wallet_history';
exports.USER_GET_INFO_BY_PHONE_NUMBER =
  MY_FOOD_API + 'apiUser/get_info_user_by_phone';
exports.USER_GET_INFO_BY_WALLET_ADDRESS =
  MY_FOOD_API + 'apiUser/get_info_user_by_wallet_address';
exports.USER_RESET_PASSWORD = MY_FOOD_API + 'apiUser/reset_pass';
exports.USER_RATE_APP = MY_FOOD_API + 'apiUser/rate_app';
exports.USER_GET_SERVICES = MY_FOOD_API + 'apiUser/get_services';

// Service
exports.SERVICE_INFO = MY_FOOD_API + 'apiService/info';
exports.SERVICE_DETAIL = MY_FOOD_API + 'apiService/detail';
exports.SERVICE_ORDERS = MY_FOOD_API + 'apiService/orders';
exports.SERVICE_RATING = MY_FOOD_API + 'apiService/rating';

// Voucher
exports.GET_MY_VOUCHER_BY_SITE = MY_FOOD_API + 'apiVoucher/my_voucher';

// Login Firebase
exports.LOGIN_FIREBASE_VERTIFY = MY_FOOD_API + 'apiUser/login_firebase_verify';

// Payment
exports.PAYMENT_METHOD = MY_FOOD_API + 'apiSite/payment';
exports.ADD_PAYMENT_METHOD = MY_FOOD_API + 'apiSite/add_payment_method_cart';
