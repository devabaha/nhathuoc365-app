import { HomeIDAPI as API } from '../API';
import BaseHandler from './BaseHandler';

/**
 * A handler for all of HomeID's API.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @class
 * @mixin
 */
class HomeIDAPIHandler extends BaseHandler {
  /**
   * @todo lấy danh sách chung cư
   */
  async user_list_building() {
    const api = url_for(API.USER_LIST_BUILDING);
    return await this.getAPI(api);
  }

  /**
   * @todo lấy danh sách căn hộ của người dùng
   */
  async user_list_room() {
    const api = url_for(API.USER_LIST_ROOM);
    return await this.getAPI(api);
  }

  /**
   * @todo cập nhật căn hộ mặc định cho roomTab
   *
   * @param {Object} data
   * @param {(number|string)} data.room_id
   */
  async user_update_room_default(data) {
    const api = url_for(API.USER_UPDATE_ROOM_DEFAULT);
    return await this.postAPI(api, data);
  }

  /**
   * @todo lấy thông tin chi tiết chung cư
   */
  async site_building_detail(site_id) {
    const api = url_for(API.SITE_HOME + '/' + site_id);
    return await this.getAPI(api);
  }

  /**
   * @todo lấy thông tin chi tiết căn hộ
   */
  async site_room_detail(site_id, room_id) {
    const api = url_for(API.SITE_ROOM + '/' + site_id + '/' + room_id);
    return await this.getAPI(api);
  }

  /**
   * @todo lấy danh sách hóa đơn của căn hộ
   */
  async site_bills_room(site_id, room_id, data) {
    const api = url_for(API.SITE_BILLS_ROOM + '/' + site_id + '/' + room_id);
    return await this.postAPI(api, data);
  }

  /**
   * @todo lấy danh sách phản ánh của căn hộ
   */
  async site_requests_room(site_id, room_id) {
    const api = url_for(API.SITE_REQUESTS_ROOM + '/' + site_id + '/' + room_id);
    return await this.getAPI(api);
  }

  /**
   * @todo lấy thông tin chi tiết phản ánh của căn hộ
   */
  async site_detail_request_room(site_id, room_id, request_id) {
    const api = url_for(
      API.SITE_DETAIL_REQUEST_ROOM +
        '/' +
        site_id +
        '/' +
        room_id +
        '/' +
        request_id
    );
    return await this.getAPI(api);
  }

  /**
   * @todo lấy thông tin phiếu thu của căn hộ
   */
  async site_receipts_room(site_id, room_id) {
    const api = url_for(API.SITE_RECEIPTS_ROOM + '/' + site_id + '/' + room_id);
    return await this.getAPI(api);
  }

  /**
   * @todo lấy danh sách loại phản ánh của căn hộ
   */
  async site_request_types_room(site_id, room_id) {
    const api = url_for(
      API.SITE_REQUEST_TYPES_ROOM + '/' + site_id + '/' + room_id
    );
    return await this.getAPI(api);
  }

  /**
   * @todo Tạo phản ánh căn hộ
   */
  async site_request_room(site_id, room_id, data) {
    const api = url_for(API.SITE_REQUEST_ROOM + '/' + site_id + '/' + room_id);
    return await this.postAPI(api, data);
  }

  /**
   * @todo Gửi comment phản ánh căn hộ
   */
  async site_comment_request_room(site_id, room_id, request_id, data) {
    const api = url_for(
      API.SITE_COMMENT_REQUEST_ROOM +
        '/' +
        site_id +
        '/' +
        room_id +
        '/' +
        request_id
    );
    return await this.postAPI(api, data);
  }

  /**
   * @todo Lấy danh sách thành viên room
   */
  async site_list_user_room(site_id, room_id) {
    const api = url_for(
      API.SITE_LIST_USER_ROOM + '/' + site_id + '/' + room_id
    );
    return await this.getAPI(api);
  }

  /**
   * @todo Tìm kiếm thành viên room theo sđt
   */
  async site_search_user_room_by_phone(site_id, room_id, data) {
    const api = url_for(
      API.SITE_SEARCH_USER_ROOM_BY_PHONE + '/' + site_id + '/' + room_id
    );
    return await this.postAPI(api, data);
  }

  /**
   * @todo Thêm thành viên room
   */
  async site_add_user_room(site_id, room_id, data) {
    const api = url_for(API.SITE_ADD_USER_ROOM + '/' + site_id + '/' + room_id);
    return await this.postAPI(api, data);
  }

  /**
   * @todo Xóa thành viên room
   */
  async site_delete_user_room(site_id, room_id, data) {
    const api = url_for(
      API.SITE_DELETE_USER_ROOM + '/' + site_id + '/' + room_id
    );
    return await this.postAPI(api, data);
  }

  /**
   * @todo Cập nhật ảnh avatar/banner cho room
   *
   * @param {Object} data
   * @param {?string} banner - banner's name
   * @param {?string} avatar - avatar's name
   * @returns {Promise}
   */
  async room_update(room_id, data) {
    const api = url_for(API.ROOM_UPDATE + '/' + room_id);
    return await this.postAPI(api, data);
  }

  /** STORE */
  /**
   * @todo đăng ký gian hàng trên HomeID
   *
   * @param {Object} data
   * @param {number} source_id - id lĩnh vực kinh doanh
   * @param {string} store_name - tên của hàng
   * @param {string} email
   * @param {string} address - địa chỉ cửa hàng
   * @returns {Promise}
   */
  async user_create_store(data) {
    const api = url_for(API.USER_CREATE_STORE);
    return await this.postAPI(api, data);
  }

  /**
   * @todo lấy danh sách lĩnh vực kinh doanh ở trang tạo cửa hàng
   */
  async user_list_business_area() {
    const api = url_for(API.USER_LIST_BUSINESS_AREA);
    return await this.getAPI(api);
  }

  /** E-PAY TRANSFER */
  /**
   * @todo Thực hiện khởi tạo giao dịch thanh toán qua Virtual Account
   *
   * @param {Object} data
   * @param {Array} data.bill_ids - id của các hoá đơn
   * @param {number} data.amount - số tiền thanh toán
   * @returns {Promise}
   */
  async site_transfer_pay_va(site_id, room_id, data) {
    const api = url_for(
      API.SITE_TRANSFER_PAY_VA + '/' + site_id + '/' + room_id
    );
    return await this.postAPI(api, data);
  }

  /**
   * @todo  Thực hiện kiểm tra trạng thái khởi tạo giao dịch
   *
   * @param {Object} data
   * @param {number} data.request_id - trả về ở @see site_transfer_pay_va
   * @returns {Promise}
   */
  async site_check_status_va(site_id, room_id, data) {
    const api = url_for(
      API.SITE_CHECK_STATUS_VA + '/' + site_id + '/' + room_id
    );
    return await this.postAPI(api, data);
  }
}

export default HomeIDAPIHandler;
