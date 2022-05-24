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

export const LIVE_AIRLINE_TICKET_DOMAIN = 'https://webbanve.net/';

class BaseAPI {
  constructor(
    apiDomain = LIVE_API_DOMAIN,
    imageDomain = LIVE_API_DOMAIN,
    socialDomain = LIVE_SOCIAL_DOMAIN,
    airlineTicketDomain = LIVE_AIRLINE_TICKET_DOMAIN,
  ) {
    this._apiDomain = apiDomain;
    this._imageDomain = imageDomain;
    this._socialDomain = socialDomain;
    this._airlineTicketDomain = airlineTicketDomain;
    store.setBaseDomains([apiDomain, imageDomain, socialDomain]);
  }

  get apiDomain() {
    return this._apiDomain;
  }

  get imageDomain() {
    return this._imageDomain;
  }

  get socialDomain() {
    return this._socialDomain;
  }

  get airlineTicketDomain() {
    return this._airlineTicketDomain;
  }

  set updateAPIDomain(apiDomain) {
    this._apiDomain = apiDomain;
    this.updateImageDomain = apiDomain;
    this.updateSocialDomain =
      apiDomain === LIVE_API_DOMAIN || apiDomain === PRE_RELEASE_API_DOMAIN
        ? LIVE_SOCIAL_DOMAIN
        : DEV_SOCIAL_DOMAIN;
    store.updateBaseDomain(0, apiDomain);
  }

  set updateImageDomain(imageDomain) {
    this._imageDomain = imageDomain;
    store.updateBaseDomain(1, imageDomain);
  }

  set updateSocialDomain(socialDomain) {
    this._socialDomain = socialDomain;
    store.updateBaseDomain(2, socialDomain);
  }

  set updateAirlineTicketDomain(airlineTicketDomain) {
    this._airlineTicketDomain = airlineTicketDomain;
  }
}

export default new BaseAPI();
