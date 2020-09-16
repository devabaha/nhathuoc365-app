import { BeeLandAPI as API } from '../API';
import BaseHandler from './BaseHandler';

/**
 * A handler for all of BeeLand's API.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @class
 * @mixin
 */
class BeeLandAPIHandler extends BaseHandler {
  /**
   * @todo lấy danh sách chung cư
   */
  async user_list_beeland() {
    const api = url_for(API.USER_LIST_BEELAND);
    return await this.getAPI(api);
  }

  /**
   * @todo lấy danh sách phòng, dự án
   *
   * @param {Object} data
   * @param {string|number} data.project_code Mã dự án
   * @param {?(string|number)} data.building_code Mã tòa nhà - null|undefined sẽ lấy dữ liệu mặc định là tòa index 0 trong mảng trả về
   * @param {string|number} data.id_code Mã nhân viên
   * @param {string|number} data.company_name Mã công ty
   */
  user_list_room_beeland(data) {
    const api = url_for(API.USER_LIST_ROOM_BEELAND);
    return this.postCancelableAPI(api, data);
  }

  /**
   * @todo lấy danh sách ảnh trang chi tiết căn hộ
   *
   * @param {Object} data
   * @param {string|number} data.product_code Mã sản phẩm
   * @param {string|number} data.id_code Mã nhân viên
   * @param {string|number} data.company_name Mã công ty
   */
  user_list_image_room_detail_beeland(data) {
    const api = url_for(API.USER_LIST_IMAGE_ROOM_DETAIL_BEELAND);
    return this.postCancelableAPI(api, data);
  }

  /**
   * @todo Thêm thông tin khách hàng
   *
   * @param {Object} data
   * @param {string|number} data.name
   * @param {string|number} data.tel
   * @param {string|number} data.email
   * @param {string|number} data.address
   * @param {string|number} data.id_code Mã nhân viên
   * @param {string|number} data.company_name Mã công ty
   */
  user_add_customer_beeland(data) {
    const api = url_for(API.USER_ADD_CUSTOMER_BEELAND);
    return this.postCancelableAPI(api, data);
  }

  /**
   * @todo Tìm kiếm khách hàng
   *
   * @param {Object} data
   * @param {string} data.keyword
   * @param {string|number} data.id_code Mã nhân viên
   * @param {string|number} data.company_name Mã công ty
   */
  user_search_customer_beeland(data) {
    const api = url_for(API.USER_SEARCH_CUSTOMER_BEELAND);
    return this.postCancelableAPI(api, data);
  }

  /**
   * @todo Tạo phiếu giữ chỗ
   *
   * @param {Object} data
   * @param {string|number} data.site_id
   * @param {string|number} data.id_code Mã nhân viên
   * @param {string|number} data.company_name Mã công ty
   * @param {string|number} data.product_code
   * @param {string|number} data.customer_code
   * @param {string|number} data.price_contract
   * @param {string|number} data.price_without_vat
   * @param {string|number} data.total_contract_value
   * @param {string|number} data.maintenance_fee
   * @param {string|number} data.total_price
   * @param {string|number} data.group_cart_code
   */
  user_create_reservation_bill_beeland_beeland(data) {
    const api = url_for(API.USER_CREATE_RESERVATION_BILL_BEELAND);
    return this.postCancelableAPI(api, data);
  }
}

export default BeeLandAPIHandler;
