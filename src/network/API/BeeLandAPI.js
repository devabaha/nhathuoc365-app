/**
 * BeeLand API
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module BeeLandAPI
 */

import BaseAPI from './BaseAPI';

class BeeLandAPI {
  get USER_LIST_BEELAND() {
    return BaseAPI.apiDomain + 'apiUser/list_beeland';
  }
  get USER_LIST_ROOM_BEELAND() {
    return BaseAPI.apiDomain + 'apiUser/list_room_beeland';
  }
  get USER_LIST_IMAGE_ROOM_DETAIL_BEELAND() {
    return BaseAPI.apiDomain + 'apiUser/list_image_room_detail_beeland';
  }
  get USER_ADD_CUSTOMER_BEELAND() {
    return BaseAPI.apiDomain + 'apiUser/add_customer_beeland';
  }
  get USER_SEARCH_CUSTOMER_BEELAND() {
    return BaseAPI.apiDomain + 'apiUser/search_customer_beeland';
  }
  get USER_CREATE_RESERVATION_BILL_BEELAND() {
    return BaseAPI.apiDomain + 'apiUser/create_reservation_bill_beeland';
  }
  get USER_LIST_CUSTOMER_BEELAND() {
    return BaseAPI.apiDomain + 'apiUser/list_customer_beeland';
  }
  get USER_LIST_RESERVATION_BEELAND() {
    return BaseAPI.apiDomain + 'apiUser/list_reservation_beeland';
  }
  get USER_CREATE_UPDATE_CUSTOMER_BEELAND() {
    return BaseAPI.apiDomain + 'apiUser/create_update_customer_beeland';
  }
}

export default new BeeLandAPI();

export { BeeLandAPI };
