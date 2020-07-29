import axios from 'axios';
import store from '../../store/Store';
// import API from '../API';

const HTTP_SUCCESS = 200;
const CancelToken = axios.CancelToken;

/**
 * This is base handler for API execution (send, get, error processing)
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @class
 * @mixin
 */
class BaseHandler {
  // API = API;

  getCancelInstance() {
    return CancelToken.source();
  }

  _networkIndicator(flag = true) {
    if (isIOS) {
      // StatusBar.setNetworkActivityIndicatorVisible(flag);
    }
  }

  /**
   * Gửi yêu cầu phương thức GET
   */
  async getAPI(api) {
    this._networkIndicator();

    var response = await axios(api);
    return await this.processError(response);
  }

  /**
   * Gửi yêu cầu phương thức POST
   */
  async postAPI(api, data) {
    this._networkIndicator();

    return axios
      .post(api, encodeQueryData(data))
      .then(response => this.processError(response))
      .catch(err => err);
  }

  /**
   * Xử lý ngoại lệ
   */
  async processError(response) {
    this._networkIndicator(false);

    if (response.status != HTTP_SUCCESS) {
      throw 'Error: ' + response.statusText;
    } else {
      action(() => {
        store.setConnect(true);
      })();
    }
    return response.data;
  }
}

export default BaseHandler;
