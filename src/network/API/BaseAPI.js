/**
 * All API used through the whole app.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module API
 */

export const ORIGIN_API_DOMAIN = 'https://apiapp.abaha.vn/';
export const ORIGIN_IMAGE_DOMAIN = 'https://img.abaha.vn/';

class BaseAPI {
  constructor(
    apiDomain = ORIGIN_API_DOMAIN,
    imageDomain = ORIGIN_IMAGE_DOMAIN
  ) {
    this._apiDomain = apiDomain;
    this._imageDomain = imageDomain;
  }

  get apiDomain() {
    return this._apiDomain;
  }

  get imageDomain() {
    return this._imageDomain;
  }

  set updateAPIDomain(apiDomain) {
    this._apiDomain = apiDomain;
  }

  set updateImageDomain(imageDomain) {
    this._imageDomain = imageDomain;
  }
}

export default new BaseAPI();
