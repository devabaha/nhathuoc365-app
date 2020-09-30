import { IViewAPI as API } from '../API';
import BaseHandler from './BaseHandler';

/**
 * A handler for all common/old API handler existed in app.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @class
 * @mixin
 */
class IViewAPIHandler extends BaseHandler {
  /**
   * @param {string|number} siteId
   * @param {Object} data
   */
  site_upload_image_faceID(siteId, data) {
    const api = url_for(API.SITE_UPLOAD_IMAGE_FACEID + '/' + siteId);
    console.log(api, data);
    return this.postCancelableAPI(api, data);
  }
}

export default IViewAPIHandler;
