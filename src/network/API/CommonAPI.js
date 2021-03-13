/**
 * Common/old API
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module CommonAPI
 */

import BaseAPI from './BaseAPI';

class CommonAPI {
  // Sites
  get USER_LOGIN() {
    return BaseAPI.apiDomain + 'apiUser/login';
  }
  get SITE_LIKE() {
    return BaseAPI.apiDomain + 'apiSite/like';
  }

  // Home
  get USER_HOME() {
    return BaseAPI.apiDomain + 'apiUser/home';
  }
  get USER_SITE_HOME_NEW() {
    return BaseAPI.apiDomain + 'apiUser/site_home_new';
  }
  get USER_SITE_HOME() {
    return BaseAPI.apiDomain + 'apiUser/site_home';
  }

  // Store
  get USER_SEARCH_SITES() {
    return BaseAPI.apiDomain + 'apiUser/search_sites';
  }
  get USER_SEARCH_SITE() {
    return BaseAPI.apiDomain + 'apiUser/search_site';
  }
  get USER_ADD_SITE() {
    return BaseAPI.apiDomain + 'apiUser/add_site';
  }
  get USER_LIST_SITE() {
    return BaseAPI.apiDomain + 'apiUser/list_site';
  }
  get USER_LIST_SUGGEST_SITE() {
    return BaseAPI.apiDomain + 'apiUser/list_suggest_site';
  }
  get SITE_INFO() {
    return BaseAPI.apiDomain + 'apiSite/info';
  }
  get SITE_DETAIL() {
    return BaseAPI.apiDomain + 'apiSite/detail';
  }
  get SITE_CATEGORY_PRODUCT() {
    return BaseAPI.apiDomain + 'apiSite/category_product';
  }
  get SEARCH_PRODUCT() {
    return BaseAPI.apiDomain + 'apiSite/search_product';
  }
  get SITE_PRODUCT_CONFIG() {
    return BaseAPI.apiDomain + 'apiSite/product_config';
  }
  get USER_SITES() {
    return BaseAPI.apiDomain + 'apiUser/sites';
  }
  get USER_BARCODE() {
    return BaseAPI.apiDomain + 'apiUser/user_barcode';
  }
  get USER_FROM_BARCODE() {
    return BaseAPI.apiDomain + 'apiUser/user_from_barcode';
  }
  get USER_REMOVE_SITE() {
    return BaseAPI.apiDomain + 'apiUser/remove_site';
  }
  get USER_ADD_REF() {
    return BaseAPI.apiDomain + 'apiUser/add_ctv';
  }
  get USER_GET_WALLET() {
    return BaseAPI.apiDomain + 'apiUser/user_get_wallet';
  }
  get USER_INVITE_HISTORY() {
    return BaseAPI.apiDomain + 'apiUser/invite_history';
  }
  get USER_CHECK_ADDRESS() {
    return BaseAPI.apiDomain + 'apiUser/check_address';
  }
  get USER_UPDATE_PROFILE() {
    return BaseAPI.apiDomain + 'apiUser/update';
  }
  get USER_LIST_STORE_LOCATION() {
    return BaseAPI.apiDomain + 'apiUser/list_store_location';
  }
  get USER_LIST_GPS_STORE_LOCATION() {
    return BaseAPI.apiDomain + 'apiUser/list_gps_store_location';
  }
  get USER_CHOOSE_STORE_LOCATION() {
    return BaseAPI.apiDomain + 'apiUser/choose_store_location';
  }
  get SITE_GET_TREE_CATEGORIES() {
    return BaseAPI.apiDomain + 'apiSite/get_tree_categories';
  }

  // Item
  get SITE_PRODUCT() {
    return BaseAPI.apiDomain + 'apiSite/product';
  }
  get SITE_PRODUCT_ATTRIBUTES() {
    return BaseAPI.apiDomain + 'apiSite/product_attr';
  }

  // Cart
  get CART_CONFIRMED() {
    return BaseAPI.apiDomain + 'apiCart/confirmed';
  }
  get SITE_CART_PLUS() {
    return BaseAPI.apiDomain + 'apiCart/plus';
  }
  get SITE_CART_MINUS() {
    return BaseAPI.apiDomain + 'apiCart/minus';
  }
  get SITE_CART_UPDATE_ORDERING() {
    return BaseAPI.apiDomain + 'apiCart/update_cart_ordering';
  }
  get SITE_CART_SELECTED() {
    return BaseAPI.apiDomain + 'apiCart/selected';
  }
  get SITE_CART_UNSELECTED() {
    return BaseAPI.apiDomain + 'apiCart/unselected';
  }
  get SITE_CART_ORDER() {
    return BaseAPI.apiDomain + 'apiCart/order';
  }
  get SITE_CART_UPDATE() {
    return BaseAPI.apiDomain + 'apiCart/update';
  }
  get SITE_CART_NOTE() {
    return BaseAPI.apiDomain + 'apiCart/note';
  }
  get SITE_CART_RATING() {
    return BaseAPI.apiDomain + 'apiCart/rating';
  }
  get SITE_CART_SHOW() {
    return BaseAPI.apiDomain + 'apiCart/show';
  }
  get SITE_CART_CANCELING() {
    return BaseAPI.apiDomain + 'apiCart/cancel';
  }
  get SITE_CART_ADDING() {
    return BaseAPI.apiDomain + 'apiSite/cartadding';
  }
  get SITE_CART() {
    return BaseAPI.apiDomain + 'apiSite/cart';
  }
  get SITE_CART_DOWN() {
    return BaseAPI.apiDomain + 'apiSite/cartdown';
  }
  get SITE_CART_UP() {
    return BaseAPI.apiDomain + 'apiSite/cartup';
  }
  get SITE_CART_REMOVE() {
    return BaseAPI.apiDomain + 'apiSite/cartremove';
  }
  get SITE_CART_SELECT() {
    return BaseAPI.apiDomain + 'apiSite/cartselect';
  }
  get SITE_CART_UNSELECT() {
    return BaseAPI.apiDomain + 'apiSite/cartunselect';
  }
  get SITE_CART_NODE() {
    return BaseAPI.apiDomain + 'apiSite/cartnote';
  }
  get SITE_CART_ORDERS() {
    return BaseAPI.apiDomain + 'apiSite/cartorder';
  }
  get SITE_CART_CANCEL() {
    return BaseAPI.apiDomain + 'apiSite/cartcancel';
  }
  get SITE_CART_REORDER() {
    return BaseAPI.apiDomain + 'apiSite/cart_reorder';
  }
  get SITE_CART_EDIT() {
    return BaseAPI.apiDomain + 'apiSite/cart_edit';
  }
  get CART_SITE_UPDATE() {
    return BaseAPI.apiDomain + 'apiSite/site_cart_update';
  }

  // Address
  get SITE_CART_ADD_ADDRESS() {
    return BaseAPI.apiDomain + 'apiCart/add_address';
  }
  get SITE_CART_CHANGE_ADDRESS() {
    return BaseAPI.apiDomain + 'apiCart/change_address';
  }
  get USER_ADDRESS() {
    return BaseAPI.apiDomain + 'apiUser/address';
  }
  get USER_ADD_ADDRESS() {
    return BaseAPI.apiDomain + 'apiUser/add_address';
  }
  get SITE_ADD_ADDRESS() {
    return BaseAPI.apiDomain + 'apiSite/add_address';
  }
  get SITE_CART_ADDRESS() {
    return BaseAPI.apiDomain + 'apiSite/cartaddress';
  }
  get USER_DELETE_ADDRESS() {
    return BaseAPI.apiDomain + 'apiUser/delete_address';
  }

  // Orders
  get SITE_CART_INDEX() {
    return BaseAPI.apiDomain + 'apiCart/index';
  }
  get SITE_CART_LIST() {
    return BaseAPI.apiDomain + 'apiSite/cart_list';
  }
  get USER_CART_LIST() {
    return BaseAPI.apiDomain + 'apiUser/cart_list';
  }
  //get_cart_code
  get USER_CART_CODE() {
    return BaseAPI.apiDomain + 'apiUser/get_cart_code';
  }

  // Chat
  get SITE_SEND_CHAT() {
    return BaseAPI.apiDomain + 'apiSite/send_chat';
  }
  get SITE_LOAD_CHAT() {
    return BaseAPI.apiDomain + 'apiSite/load_chat';
  }
  get SITE_NOTIFY_CHAT() {
    return BaseAPI.apiDomain + 'apiSite/notify_chat';
  }
  get USER_NOTIFY_CHAT() {
    return BaseAPI.apiDomain + 'apiUser/notify_chat';
  }
  get SITE_CONVERSATIONS() {
    return BaseAPI.apiDomain + 'apiChat/conversations';
  }
  get SITE_CONVERSATION() {
    return BaseAPI.apiDomain + 'apiChat/conversation';
  }
  get SITE_SEND_MESSAGE() {
    return BaseAPI.apiDomain + 'apiChat/send';
  }
  get SITE_SEARCH_CONVERSATIONS() {
    return BaseAPI.apiDomain + 'apiChat/search';
  }
  get SITE_PIN_LIST() {
    return BaseAPI.apiDomain + 'apiSite/pin_list';
  }

  // News
  get USER_NEWS_LIST() {
    return BaseAPI.apiDomain + 'apiUser/news_list';
  }
  get USER_NEWS() {
    return BaseAPI.apiDomain + 'apiUser/news';
  }

  // Notices
  get USER_NOTICE() {
    return BaseAPI.apiDomain + 'apiUser/notice';
  }

  // Notify
  get USER_NOTIFY() {
    return BaseAPI.apiDomain + 'apiUser/notify';
  }

  // Push Notification
  get ADD_PUSH_TOKEN() {
    return BaseAPI.apiDomain + 'api/add_push_token';
  }

  // Users
  get USER_DEVICE() {
    return BaseAPI.apiDomain + 'apiUser/device';
  }
  get USER_REGISTER() {
    return BaseAPI.apiDomain + 'apiUser/register';
  }
  get USER_OP_REGISTER() {
    return BaseAPI.apiDomain + 'apiUser/op_register';
  }
  get USER_VERIFY_OTP() {
    return BaseAPI.apiDomain + 'apiUser/verify_otp';
  }
  get USER_LOGIN_PASSWORD() {
    return BaseAPI.apiDomain + 'apiUser/login_password';
  }
  get USER_LOGIN_SMS() {
    return BaseAPI.apiDomain + 'apiUser/login_sms';
  }
  get LOGIN_SMS_VERIFY() {
    return BaseAPI.apiDomain + 'apiUser/login_sms_verify';
  }
  get LOGIN_FBAK_VERIFY() {
    return BaseAPI.apiDomain + 'apiUser/login_fbak_verify';
  }
  get USER_LOGOUT() {
    return BaseAPI.apiDomain + 'apiUser/logout';
  }
  get USER_ADD_AVATAR() {
    return BaseAPI.imageDomain + 'apiUser/add_avatar';
  }
  get UPLOAD_IMAGE() {
    return BaseAPI.imageDomain + 'photos/upload_image';
  }
  get USER_FORGET_PASSWORD() {
    return BaseAPI.apiDomain + 'apiUser/forget_password';
  }
  get USER_FORGET_PASSWORD_VERIFY() {
    return BaseAPI.apiDomain + 'apiUser/forget_password_verify';
  }
  get USER_FORGET_NEW_PASSWORD() {
    return BaseAPI.apiDomain + 'apiUser/forget_new_password';
  }
  get USER_CHOOSE_LOCATION() {
    return BaseAPI.apiDomain + 'apiUser/choose_site';
  }
  get USER_COINS_WALLET() {
    return BaseAPI.apiDomain + 'apiUser/point_history';
  }
  get USER_TRANSFER_BALANCE() {
    return BaseAPI.apiDomain + 'apiUser/transfer_balance';
  }
  get USER_WALLET_HISTORY() {
    return BaseAPI.apiDomain + 'apiUser/wallet_history';
  }
  get USER_GET_INFO_BY_PHONE_NUMBER() {
    return BaseAPI.apiDomain + 'apiUser/get_info_user_by_phone';
  }
  get USER_GET_INFO_BY_WALLET_ADDRESS() {
    return BaseAPI.apiDomain + 'apiUser/get_info_user_by_wallet_address';
  }
  get USER_GET_FAVOR_SITES() {
    return BaseAPI.apiDomain + 'apiUser/favor_sites';
  }
  get USER_RESET_PASSWORD() {
    return BaseAPI.apiDomain + 'apiUser/reset_pass';
  }
  get USER_RATE_APP() {
    return BaseAPI.apiDomain + 'apiUser/rate_app';
  }
  get USER_GET_SERVICES() {
    return BaseAPI.apiDomain + 'apiUser/get_services';
  }
  get USER_PROCESS_QRCODE() {
    return BaseAPI.apiDomain + 'apiUser/process_qrcode';
  }
  get USER_CHECK_PRODUCT_CODE() {
    return BaseAPI.apiDomain + 'apiUser/check_product_code'
  }
  get USER_GET_PRODUCT_STAMPS() {
    return BaseAPI.apiDomain + 'apiUser/product_stamps';
  }
  get USER_LOCATION() {
    return BaseAPI.apiDomain + 'apiUser/location';
  }

  // Service
  get SERVICE_INFO() {
    return BaseAPI.apiDomain + 'apiService/info';
  }
  get SERVICE_DETAIL() {
    return BaseAPI.apiDomain + 'apiService/detail';
  }
  get SERVICE_ORDERS() {
    return BaseAPI.apiDomain + 'apiService/orders';
  }
  get SERVICE_RATING() {
    return BaseAPI.apiDomain + 'apiService/rating';
  }
  get SERVICE_BOOK() {
    return BaseAPI.apiDomain + 'apiService/book';
  }

  // Voucher
  get GET_MY_VOUCHER_BY_SITE() {
    return BaseAPI.apiDomain + 'apiVoucher/my_voucher';
  }

  // Login Firebase
  get LOGIN_FIREBASE_VERIFY() {
    return BaseAPI.apiDomain + 'apiUser/login_firebase_verify';
  }

  // Payment
  get PAYMENT_METHOD() {
    return BaseAPI.apiDomain + 'apiSite/payment';
  }
  get ADD_PAYMENT_METHOD() {
    return BaseAPI.apiDomain + 'apiSite/add_payment_method_cart';
  }

  // SLACK - Error Firebase
  get SLACK_ERROR_FIREBASE() {
    return 'https://hooks.slack.com/services/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';
  }

  // Premium
  get GET_PREMIUMS() {
    return BaseAPI.apiDomain + 'apiPremiums/index';
  }

  get USER_SITE_CITY() {
    return BaseAPI.apiDomain + 'apiUser/site_city';
  }

  get CART_SERVICE_BOOK() {
    return BaseAPI.apiDomain + 'apiCart/book';
  }

  get SITE_GROUP_PRODUCT() {
    return BaseAPI.apiDomain + 'apiSite/group_product';
  }

  get USER_SITE_STORE() {
    return BaseAPI.apiDomain + 'apiUser/site_store';
  }

  get USER_CHOOSE_STORE() {
    return BaseAPI.apiDomain + 'apiUser/choose_store';
  }

  get USER_REGISTER_GOLD_MEMBER() {
    return BaseAPI.apiDomain + 'apiUser/register_gold_member';
  }

  get USER_SITE_CART_COMMISSION() {
    return BaseAPI.apiDomain + 'apiUser/site_cart_commission';
  }

  get LOTTERY_INDEX() {
    return BaseAPI.apiDomain + 'apiLottery/index';
  }
  
  get LOTTERY_TURN() {
    return BaseAPI.apiDomain + 'apiLottery/turn';
  }
}

export default new CommonAPI();

export {CommonAPI};
