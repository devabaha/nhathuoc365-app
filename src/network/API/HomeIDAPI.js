/**
 * HomeID API
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module HomeIDAPI
 */
exports.USER_LIST_BUILDING = MY_FOOD_API + 'apiUser/list_building';
exports.USER_LIST_ROOM = MY_FOOD_API + 'apiUser/list_room';
exports.USER_UPDATE_ROOM_DEFAULT = MY_FOOD_API + 'apiUser/update_room_default';
exports.SITE_HOME = MY_FOOD_API + 'apiSite/site_home';
exports.SITE_ROOM = MY_FOOD_API + 'apiSite/room';

exports.SITE_BILLS_ROOM = MY_FOOD_API + 'apiSite/get_bills_room';
exports.SITE_REQUESTS_ROOM = MY_FOOD_API + 'apiSite/get_requests_room';
exports.SITE_DETAIL_REQUEST_ROOM =
  MY_FOOD_API + 'apiSite/get_detail_request_room';
exports.SITE_RECEIPTS_ROOM = MY_FOOD_API + 'apiSite/get_receipts_room';

exports.SITE_REQUEST_TYPES_ROOM =
  MY_FOOD_API + 'apiSite/get_request_types_room';
exports.SITE_REQUEST_ROOM = MY_FOOD_API + 'apiSite/create_request_room';
exports.SITE_COMMENT_REQUEST_ROOM =
  MY_FOOD_API + 'apiSite/create_comment_request_room';
exports.SITE_LIST_USER_ROOM = MY_FOOD_API + 'apiSite/list_user_room';
exports.SITE_SEARCH_USER_ROOM_BY_PHONE =
  MY_FOOD_API + 'apiSite/search_user_by_phone';
exports.SITE_ADD_USER_ROOM = MY_FOOD_API + 'apiSite/add_user_room';
exports.SITE_DELETE_USER_ROOM = MY_FOOD_API + 'apiSite/delete_user_room';

exports.ROOM_UPDATE = MY_FOOD_API + 'apiRoom/update_room';

/** STORE */
exports.USER_CREATE_STORE = MY_FOOD_API + 'apiUser/create_store';
exports.USER_LIST_BUSINESS_AREA = MY_FOOD_API + 'apiUser/list_business_area';

/** E-PAY TRANSFER */
exports.SITE_TRANSFER_PAY_VA = MY_FOOD_API + 'apiSite/transfer_pay_va';
exports.SITE_CHECK_STATUS_VA = MY_FOOD_API + 'apiSite/check_status_va';
