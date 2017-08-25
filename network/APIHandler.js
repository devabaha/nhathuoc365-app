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
  * Tìm cửa hàng theo mã CH
  */
  async user_search_store(store_code) {
    var api = url_for(API.USER_SEARCH_SITE + '/' + store_code);
    return await this.getAPI(api)
  }

  /**
  * Lấy d/s cửa hàng
  */
  async user_list_site() {
    var api = url_for(API.USER_LIST_SITE);
    return await this.getAPI(api)
  }

  /**
  * Thêm cửa hàng bằng mã cửa hàng
  */
  async user_add_store(store_code) {
    var api = url_for(API.USER_ADD_SITE + '/' + store_code);
    return await this.getAPI(api);
  }

  /**
  * Lấy thông tin cửa hàng
  */
  async site_info(site_id) {
    var api = url_for(API.SITE_INFO + '/' + site_id);
    return await this.getAPI(api);
  }

  /**
  * Lấy d/s sản phẩm theo categofy id
  */
  async site_category_product(store_id, category_id) {
    var api = url_for(API.SITE_CATEGORY_PRODUCT + '/' + store_id + '/' + category_id);
    return await this.getAPI(api);
  }

  /**
  * Lấy chi tiết sản phẩm theo product id
  */
  async site_product(store_id, product_id) {
    var api = url_for(API.SITE_PRODUCT + '/' + store_id + '/' + product_id);
    return await this.getAPI(api);
  }

  /**
  * Lấy chi tiết sản phẩm theo product id
  */
  async site_cart_adding(store_id, product_id) {
    var api = url_for(API.SITE_CART_ADDING + '/' + store_id + '/' + product_id);
    return await this.getAPI(api);
  }

  /**
  * Lấy thông tin giỏ hàng theo site id
  */
  async site_cart(store_id) {
    var api = url_for(API.SITE_CART + '/' + store_id);
    return await this.getAPI(api);
  }

  /**
  * Giảm số lượng sản phẩm trong giỏ hàng
  */
  async site_cart_down(store_id, product_id) {
    var api = url_for(API.SITE_CART_DOWN + '/' + store_id + '/' + product_id);
    return await this.getAPI(api);
  }

  /**
  * Tăng số lượng sản phẩm trong giỏ hàng
  */
  async site_cart_up(store_id, product_id) {
    var api = url_for(API.SITE_CART_UP + '/' + store_id + '/' + product_id);
    return await this.getAPI(api);
  }

  /**
  * Xoá sản phẩm trong giỏ hàng
  */
  async site_cart_remove(store_id, product_id) {
    var api = url_for(API.SITE_CART_REMOVE + '/' + store_id + '/' + product_id);
    return await this.getAPI(api);
  }

  /**
  * Danh sách địa chỉ
  */
  async user_address() {
    var api = url_for(API.USER_ADDRESS);
    return await this.getAPI(api);
  }

  /**
  * Thêm/sửa địa chỉ
  */
  async user_add_address(address_id, data) {
    var api = url_for(API.USER_ADD_ADDRESS + '/' + address_id);
    return await this.postAPI(api, data);
  }

  /**
  * Chọn địa chỉ cho đơn hàng
  */
  async site_cart_address(store_id, address_id) {
    var api = url_for(API.SITE_CART_ADDRESS + '/' + store_id + '/' + address_id);
    return await this.getAPI(api);
  }

  /**
  * Xoá địa chỉ
  */
  async user_delete_address(address_id) {
    var api = url_for(API.USER_DELETE_ADDRESS + '/' + address_id);
    return await this.getAPI(api);
  }

  /**
  * Chọn mặt hàng trong giỏ hàng
  */
  async site_cart_select(store_id, product_id) {
    var api = url_for(API.SITE_CART_SELECT + '/' + store_id + '/' + product_id);
    return await this.getAPI(api);
  }

  /**
  * Bỏ chọn mặt hàng trong giỏ hàng
  */
  async site_cart_unselect(store_id, product_id) {
    var api = url_for(API.SITE_CART_UNSELECT + '/' + store_id + '/' + product_id);
    return await this.getAPI(api);
  }

  /**
  * Note giỏ hàng
  */
  async site_cart_node(store_id, data) {
    var api = url_for(API.SITE_CART_NODE + '/' + store_id);
    return await this.postAPI(api, data);
  }

  /**
  * Xác nhận đặt hàng
  */
  async site_cart_orders(store_id) {
    var api = url_for(API.SITE_CART_ORDERS + '/' + store_id);
    return await this.getAPI(api);
  }

  /**
  * Danh sách đơn hàng (theo shop) của user
  */
  async site_cart_list(store_id) {
    var api = url_for(API.SITE_CART_LIST + '/' + store_id);
    return await this.getAPI(api);
  }

  /**
  * Danh sách tất cả đơn hàng của user
  */
  async user_cart_list() {
    var api = url_for(API.USER_CART_LIST);
    return await this.getAPI(api);
  }

  /**
  * Gửi chat
  */
  async site_send_chat(store_id, data) {
    var api = url_for(API.SITE_SEND_CHAT + '/' + store_id);
    return await this.postAPI(api, data);
  }

  /**
  * Load chat
  */
  async site_load_chat(store_id, chat_id) {
    var api = url_for(API.SITE_LOAD_CHAT + '/' + store_id + '/' + chat_id);
    return await this.getAPI(api);
  }

  /**
  * Tìm sản phẩm theo store_id
  */
  async search_product(store_id, data) {
    var api = url_for(API.SEARCH_PRODUCT + '/' + store_id);
    return await this.postAPI(api, data);
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
      console.log('--- response: ', JSON.stringify(response.data));
      return response.data;
  }
};

export default new APIHandler();
