import { endPoint, paths } from './constants';

class APIHandler {
  handleCallApi(url, headers, method, body) {
    return fetch(url, {
      method: method,
      headers: headers,
      body: body
    }).then(res => res.json());
  }

  async getCategories() {
    const url = endPoint + paths.categories;
    const headers = {
      language: 'vi'
    };
    return await this.handleCallApi(url, headers, 'GET', null);
  }

  async getListServices(categoryId, keyword, page, limit) {
    const url =
      endPoint +
      paths.listService +
      `?cat=${categoryId},keyword=${keyword},page=${page},limit=${10}`;
    const headers = {
      language: 'vi'
    };
    return await this.handleCallApi(url, headers, 'GET', null);
  }

  async getServiceDetail(serviceId) {
    const url = endPoint + paths.serviceDetail + `?service=${serviceId}`;
    const headers = {
      language: 'vi'
    };
    return await this.handleCallApi(url, headers, 'GET', null);
  }

  async createRequest(
    partnerAuthor,
    service,
    phone,
    location,
    name,
    message,
    appoint,
    latlng
  ) {
    const url = endPoint + paths.createRequest;
    const headers = {
      'Content-Type': 'text/plain',
      Authorization: partnerAuthor,
      language: 'vi'
    };

    var params = {
      service: service,
      phone: phone,
      location: location,
      latlng: latlng,
      name: name,
      message: message,
      appoint: appoint
    };
    var formData = new FormData();
    for (var k in params) {
      formData.append(k, params[k]);
    }

    return await this.handleCallApi(url, headers, 'POST', formData);
  }

  async callWebHook(
    partnerAuthor,
    service,
    phone,
    location,
    name,
    message,
    appoint,
    latlng,
    request,
    url
  ) {
    const headers = {
      'Content-Type': 'text/plain',
      Authorization: partnerAuthor,
      language: 'vi'
    };
    const params = JSON.stringify({
      service: service,
      phone: phone,
      location: location,
      latlng: latlng,
      name: name,
      message: message,
      appoint: appoint,
      request: request
    });

    var formData = new FormData();
    for (var k in params) {
      formData.append(k, params[k]);
    }
    return await this.handleCallApi(url, headers, 'POST', formData);
  }
}

export default new APIHandler();
