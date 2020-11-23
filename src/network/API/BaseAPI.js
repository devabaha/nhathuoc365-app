/**
 * All API used through the whole app.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module API
 */

class BaseAPI {
  constructor(
    apiDomain = 'http://apiapp.tickid.vn/',
    imageDomain = 'https://img.tickid.vn/'
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
