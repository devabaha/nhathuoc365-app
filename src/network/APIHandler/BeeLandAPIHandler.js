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
}

export default BeeLandAPIHandler;
