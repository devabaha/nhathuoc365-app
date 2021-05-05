/**
 * All API used through the whole app.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module API
 */
import store from 'app-store';

export const ORIGIN_API_DOMAIN = 'https://apiapp.abaha.vn/';
export const ORIGIN_DEV_API_DOMAIN = 'https://apiapp.tickid.top/';
export const ORIGIN_SPRINT_DEV_API_DOMAIN = 'https://apiapp.abaha.click/';
export const ORIGIN_PRE_RELEASE_API_DOMAIN = 'https://apiapp.abaha.link/';
export const ORIGIN_IMAGE_DOMAIN = 'https://img.abaha.vn/';

class BaseAPI {
  constructor(
    apiDomain = ORIGIN_DEV_API_DOMAIN,
    imageDomain = ORIGIN_IMAGE_DOMAIN
  ) {
    this._apiDomain = apiDomain;
    this._imageDomain = imageDomain;
    store.setBaseAPIDomain(apiDomain);
  }

  get apiDomain() {
    return this._apiDomain;
  }

  get imageDomain() {
    return this._imageDomain;
  }

  set updateAPIDomain(apiDomain) {
    this._apiDomain = apiDomain;
    store.setBaseAPIDomain(apiDomain);
  }

  set updateImageDomain(imageDomain) {
    this._imageDomain = imageDomain;
  }
}

export default new BaseAPI();
