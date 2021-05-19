/**
 * All API used through the whole app.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module API
 */
import store from 'app-store';

export const LIVE_API_DOMAIN = 'https://apiapp.abaha.vn/';
export const DEV_API_DOMAIN = 'https://apiapp.tickid.top/';
export const SPRINT_DEV_API_DOMAIN = 'https://apiapp.abaha.click/';
export const PRE_RELEASE_API_DOMAIN = 'https://apiapp.abaha.link/';

export const LIVE_IMAGE_DOMAIN = 'https://img.abaha.vn/';
export const DEV_IMAGE_DOMAIN = 'https://img.tickid.top/';

export const LIVE_SOCIAL_DOMAIN = 'https://social.abaha.vn/';
export const DEV_SOCIAL_DOMAIN = 'https://social.tickid.top/';

class BaseAPI {
  constructor(
    apiDomain = DEV_API_DOMAIN,
    socialDomain = DEV_SOCIAL_DOMAIN,
    imageDomain = DEV_IMAGE_DOMAIN,
  ) {
    this._apiDomain = apiDomain;
    this._socialDomain = socialDomain;
    this._imageDomain = imageDomain;
    store.setBaseAPIDomain(apiDomain);
  }

  get apiDomain() {
    return this._apiDomain;
  }

  get socialDomain() {
    return this._socialDomain;
  }

  get imageDomain() {
    return this._imageDomain;
  }

  set updateAPIDomain(apiDomain) {
    this._apiDomain = apiDomain;
    this.updateImageDomain =
      apiDomain === LIVE_API_DOMAIN || apiDomain === PRE_RELEASE_API_DOMAIN
        ? LIVE_IMAGE_DOMAIN
        : DEV_IMAGE_DOMAIN;
    this.updateSocialDomain =
      apiDomain === LIVE_API_DOMAIN || apiDomain === PRE_RELEASE_API_DOMAIN
        ? LIVE_SOCIAL_DOMAIN
        : DEV_SOCIAL_DOMAIN;
    store.setBaseAPIDomain(apiDomain);
  }

  set updateSocialDomain(socialDomain) {
    this._socialDomain = socialDomain;
  }

  set updateImageDomain(imageDomain) {
    this._imageDomain = imageDomain;
  }
}

export default new BaseAPI();
