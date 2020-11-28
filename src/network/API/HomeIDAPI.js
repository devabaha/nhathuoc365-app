/**
 * HomeID API
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module HomeIDAPI
 */

const { default: BaseAPI } = require('./BaseAPI');

class HomeIDAPI {
  get USER_LIST_BUILDING() {
    return BaseAPI.apiDomain + 'apiUser/list_building';
  }
  get USER_LIST_ROOM() {
    return BaseAPI.apiDomain + 'apiUser/list_room';
  }
  get USER_UPDATE_ROOM_DEFAULT() {
    return BaseAPI.apiDomain + 'apiUser/update_room_default';
  }
  get SITE_HOME() {
    return BaseAPI.apiDomain + 'apiSite/site_home';
  }
  get SITE_ROOM() {
    return BaseAPI.apiDomain + 'apiSite/room';
  }

  get SITE_BILLS_ROOM() {
    return BaseAPI.apiDomain + 'apiSite/get_bills_room';
  }
  get SITE_REQUESTS_ROOM() {
    return BaseAPI.apiDomain + 'apiSite/get_requests_room';
  }
  get SITE_DETAIL_REQUEST_ROOM() {
    return BaseAPI.apiDomain + 'apiSite/get_detail_request_room';
  }
  get SITE_RECEIPTS_ROOM() {
    return BaseAPI.apiDomain + 'apiSite/get_receipts_room';
  }

  get SITE_REQUEST_TYPES_ROOM() {
    return BaseAPI.apiDomain + 'apiSite/get_request_types_room';
  }
  get SITE_REQUEST_ROOM() {
    return BaseAPI.apiDomain + 'apiSite/create_request_room';
  }
  get SITE_COMMENT_REQUEST_ROOM() {
    return BaseAPI.apiDomain + 'apiSite/create_comment_request_room';
  }
  get SITE_LIST_USER_ROOM() {
    return BaseAPI.apiDomain + 'apiSite/list_user_room';
  }
  get SITE_SEARCH_USER_ROOM_BY_PHONE() {
    return BaseAPI.apiDomain + 'apiSite/search_user_by_phone';
  }
  get SITE_ADD_USER_ROOM() {
    return BaseAPI.apiDomain + 'apiSite/add_user_room';
  }
  get SITE_DELETE_USER_ROOM() {
    return BaseAPI.apiDomain + 'apiSite/delete_user_room';
  }

  get ROOM_UPDATE() {
    return BaseAPI.apiDomain + 'apiRoom/update_room';
  }

  /** STORE */
  get USER_CREATE_STORE() {
    return BaseAPI.apiDomain + 'apiUser/create_store';
  }
  get USER_LIST_BUSINESS_AREA() {
    return BaseAPI.apiDomain + 'apiUser/list_business_area';
  }

  /** E-PAY TRANSFER */
  get SITE_TRANSFER_PAY_VA() {
    return BaseAPI.apiDomain + 'apiSite/transfer_pay_va';
  }
  get SITE_CHECK_STATUS_VA() {
    return BaseAPI.apiDomain + 'apiSite/check_status_va';
  }
}

export default new HomeIDAPI();

export { HomeIDAPI };
