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
   */
  user_list_room_beeland(data) {
    const api = url_for(API.USER_LIST_ROOM_BEELAND);
    return this.postCancelableAPI(api, data);
  }
}

export default BeeLandAPIHandler;
