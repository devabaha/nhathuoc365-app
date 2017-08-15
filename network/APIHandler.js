'use strict';

import API from './API';
import axios from 'axios';

var HTTP_SUCCESS = 200;

class APIHandler {

  /**
  * Login khi mở app
  */
  async user_login(data) {
    var api = url_for(API.USER_LOGIN);
    return await this.postAPI(api, data);
  }

  /**
  * Lấy dữ liệu trang home
  */
  async user_home() {
    var api = url_for(API.USER_HOME);
    return await this.getAPI(api);
  }

  /**
  * Thêm cửa hàng bằng mã cửa hàng
  */
  async user_add_site(site_code) {
    var api = url_for(API.USER_ADD_SITE + '/' + site_code);
    return await this.getAPI(api);
  }








  /**
  * Gửi yêu cầu phương thức GET
  */
  async getAPI(api) {
    console.log(api);
    var response = await axios(api);
    return await this.processError(response);
  }

  /**
  * Gửi yêu cầu phương thức POST
  */
  async postAPI(api, data){
    console.log(api);
    var response = await axios.post(api, encodeQueryData(data));
    return await this.processError(response);
  }

  /**
  * Xử lý ngoại lệ
  */
  async processError(response) {
      if (response.status != HTTP_SUCCESS) {
          throw 'Error: ' + response.statusText;
      }
      console.log('--- response: ', response.data);
      return response.data;
  }
};

export default new APIHandler();
