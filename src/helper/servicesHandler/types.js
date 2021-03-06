import {GPS_LIST_TYPE} from 'src/constants';

/**
 * All types for all services used through the whole app.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module serviceType
 */
export const SERVICES_TYPE = {
  /** RADA */
  RADA_SERVICE_DETAIL: 'rada_service_detail',
  RADA_LIST_SERVICE: 'rada_list_service',
  RADA_SERVICE: 'rada_service',

  /** EXTERNAL LINK */
  EXTERNAL_LINK: 'external_link',
  WEBVIEW: 'webview',

  /** QRBARCODE */
  ACCUMULATE_POINTS: 'ACCUMULATE_POINTS_TYPE',
  QRCODE_SCAN_TYPE: 'QRCODE_SCAN_TYPE',
  QRCODE_SCAN: 'qrscan',
  QRCODE_SCAN_TYPE: 'QRCODE_SCAN_TYPE',

  /** VOUCHER */
  LIST_VOUCHER: 'list_voucher',
  MY_VOUCHER_TYPE: 'MY_VOUCHER_TYPE',
  MY_VOUCHER: 'my_voucher',
  MY_VOUCHER_TYPE: 'MY_VOUCHER_TYPE',
  MY_VOUCHER_DETAIL: 'my_voucher_detail',
  VOUCHER_DETAIL: 'voucher_detail',
  VOUCHER_CAMPAIGN_DETAIL: 'voucher_campaign_detail',

  /** TRANSACTION */
  TRANSACTION: 'TRANSACTION_TYPE',

  /** ORDER */
  STORE_ORDERS: 'STORE_ORDERS_TYPE',
  ORDERS: 'ORDERS_TYPE',
  ORDERS_TAB: 'orders',
  ORDER_DETAIL: 'order_detail',

  /** TICKID-PHONE-CARD */
  UP_TO_PHONE: 'up_to_phone',

  /** 30DAY */
  _30DAY_SERVICE: '30day_service',

  /** ACCOUNT */
  MY_ADDRESS: 'my_address',
  CREATE_ADDRESS: 'create_address',

  /** NEWS */
  NEWS: 'news',
  NEWS_DETAIL: 'news_detail',
  NEWS_CATEGORY: 'news_category',
  NEWS_CATEGORY_VERTICAL: 'news_category_vertical',

  /** CHAT */
  CHAT_NOTI: 'chat_noti',
  LIST_CHAT: 'list_chat',
  LIST_USER_CHAT: 'list_user_chat',
  CHAT: 'chat',
  USER_CHAT: 'user_chat',

  /** STORE */
  OPEN_SHOP: 'open_shop',
  GPS_LIST_STORE: GPS_LIST_TYPE.GPS_LIST_STORE,
  GPS_LIST_SITE: GPS_LIST_TYPE.GPS_LIST_SITE,
  SEARCH_STORE: 'search_store',

  /** COMMUNICATION */
  CALL: 'call',

  /** PRODUCT */
  PRODUCT_DETAIL: 'product_detail',
  GROUP_PRODUCT: 'group_product',
  PRODUCT_STAMPS: 'product_stamps',

  /** AFFILIATE */
  AFFILIATE: 'affiliate',

  /** SERVICE ORDERS */
  SERVICE_ORDERS: 'service_orders',

  /** LIST SERVICE */
  ALL_SERVICES: 'all_services',

  /** PAYMENT */
  PAYMENT_METHOD: 'payment_method',
  PAYMENT_TRANSACTION: 'payment_transaction',

  /** POPUP */
  POP_UP: 'popup',

  /** SCHEDULE BOOKING */
  SCHEDULE_BOOKING: 'schedule_booking',

  /** PREMIUMS */
  PREMIUM_INFO: 'PREMIUM_INFO',

  /** COMMISSION */
  COMMISSION_INCOME_STATEMENT: 'commission_income_statement',

  /** GAMIFICATION */
  LOTTERY_GAME: 'lottery_game',

  /** SOCIAL */
  SOCIAL: 'social',
  SOCIAL_GROUP: 'social_group',
  SOCIAL_CREATE_POST: 'social_create_post',

  /** PROGRESS TRACKING */
  LIST_PROGRESS_TRACKING: 'list_progress_tracking',
  PROGRESS_TRACKING_DETAIL: 'progress_tracking_detail',

  /** PROFILE */
  PERSONAL_PROFILE: 'personal_profile',

  /** AIRLINE TICKET */
  AIRLINE_TICKET: 'airline_ticket',

  /** AGENCY INFORMATION REGISTER */
  AGENCY_INFORMATION_REGISTER: 'agency_information_register',

  /** REQUESTS */
  REQUESTS: 'requests',
  CREATE_REQUEST: 'create_request',
  REQUEST_DETAIL: 'request_detail',

  /** WALLET */
  WALLET: 'wallet',

  /** RATING */
  RATING: 'rating',
  
  /** REPORT */
  SALES_REPORT: 'sales_report',
  
  /** LICENSE/ AGREEMENT */
  EULA_AGREEMENT: 'eula_agreement',
};
