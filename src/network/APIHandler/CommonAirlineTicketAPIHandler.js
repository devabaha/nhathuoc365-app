import { CommonAirlineTicketAPI as API } from '../API';
import BaseHandler from './BaseHandler';
/**
 * @class
 * @mixin
 */
class CommonAirlineTicketAPIHandler extends BaseHandler {

    // tìm vé máy may
    async search_airport(data) {
        const api = url_for(API.SITE_SEARCH_AIRPORT);
        return await this.postAPI(api, data);
    }
}

export default CommonAirlineTicketAPIHandler;