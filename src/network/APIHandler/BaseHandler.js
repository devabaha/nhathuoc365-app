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
 *
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
   * @todo Gửi yêu cầu phương thức GET
   *
   * @param {string} api
   * @returns {import('network/Entity/APIRequest/APIRequest').Request}
   */
  getCancelableAPI(api, handleManually = false) {
    this._networkIndicator();
    const cancelInstance = this.getCancelInstance();

    return {
      cancel: () => cancelInstance.cancel(),
      promise: () =>
        axios(api)
          .then((response) => this.processError(response, handleManually))
          .catch((err) => console.log('getCancelableAPI', err)),
    };
  }

  /**
   * @todo Gửi yêu cầu phương thức POST
   *
   * @param {string} api
   * @param {Object} data
   * @returns {import('network/Entity/APIRequest/APIRequest').Request}
   */
  postCancelableAPI(api, data, isEncoding = true, handleManually = false) {
    this._networkIndicator();
    const cancelInstance = this.getCancelInstance();
    data = isEncoding ? encodeQueryData(data) : data;
    return {
      cancel: () => cancelInstance.cancel(),
      promise: () =>
        axios
          .post(api, data)
          .then((response) => this.processError(response, handleManually))
          .catch((err) => console.log('postCancelableAPI', err)),
    };
  }

  /**
   * @deprecated since 2020-08-10.
   *
   * This method doesn't initialize a cancel-er to cancel request.
   *
   * Every old request handler using kind of "isMounted" anti-pattern.
   *
   * @see getCancelableAPI
   * @todo Gửi yêu cầu phương thức GET
   */
  async getAPI(api) {
    this._networkIndicator();

    var response = await axios(api);
    return this.processError(response);
  }

  /**
   * @deprecated since 2020-08-10.
   *
   * This method doesn't initialize a cancel-er to cancel request.
   *
   * Every old request handler using kind of "isMounted" anti-pattern.
   *
   * @see postCancelableAPI
   * @todo Gửi yêu cầu phương thức POST
   */
  async postAPI(api, data) {
    this._networkIndicator();

    return axios
      .post(api, encodeQueryData(data))
      .then((response) => this.processError(response))
      .catch((err) => console.log('postAPI', err));
  }

  /**
   * @todo Xử lý ngoại lệ
   */
  processError(response, handleManually = false) {
    this._networkIndicator(false);

    if (response.status != HTTP_SUCCESS) {
      throw 'Error: ' + response.statusText;
    } else {
      action(() => {
        store.setConnect(true);
      })();
    }

    if (handleManually) {
      return this.handleResponse(response.data);
    } else {
      return response.data;
    }
  }

  /**
   * @todo handle response from api by the common way
   */
  handleResponse(response) {
    if (!response) throw Error("Response has no content!");
    if (response.status === HTTP_SUCCESS) {
      if (response.data) {
        return response.data;
      } else {
      console.log('%cRESPONSE_EMPTY_DATA', 'color:red', response);
      throw Error(response.message);
      }
    } else {
      console.log(`%cRESPONSE_FAILURE ${response.status}`, 'color:red', response);
      throw Error(response.message);
    }
  }
}

export default BaseHandler;
