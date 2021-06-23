/**
 * IView API
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module IViewAPI
 */

import BaseAPI from './BaseAPI';

class IViewAPI {
  // Sites
  get SITE_UPLOAD_IMAGE_FACEID() {
    return BaseAPI.apiDomain + 'apiSite/upload_image_faceid';
  }
}

export default new IViewAPI();

export { IViewAPI };
