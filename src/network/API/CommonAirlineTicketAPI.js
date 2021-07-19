import BaseAPI from './BaseAPI';

class CommonAirlineTicketAPI {

    get SITE_SEARCH_AIRPORT() {
        return BaseAPI.airlineTicketDomain + '/apiSite/search_airport';
    }
}
export default new CommonAirlineTicketAPI();

export { CommonAirlineTicketAPI };