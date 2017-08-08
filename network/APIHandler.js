'use strict';

import API from './API';
import axios from 'axios';

var HTTP_SUCCESS = 200;

class APIHandler {

  /**
  * Gửi thông báo mở app từ Push
  */
  async open_after_push(push_id) {
    var api = url_for(API.OPEN_AFTER_PUSH);
    return await this.postAPI(api, {push_id});
  }

  /**
  * Gửi Push token lên server
  */
  async send_push_token(push_token) {
    var api = url_for(API.SEND_PUSH_TOKEN);
    return await this.postAPI(api, {push_token});
  }

  /**
  * Lấy thông tin trang Home
  */
  async home() {
    var api = url_for(API.HOME);
    return await this.getAPI(api);
  }

  /**
  * Tạo trang web
  */
  async create_site(data) {
    var api = url_for(API.SITE_CREATE);
    return await this.postAPI(api, data);
  }

	/**
	* Update trang web
	*/
	async update_site(site_id, data) {
		var api = url_for(API.SITE_UPDATE + '/' + site_id);
		return await this.postAPI(api, data);
	}

  /**
  * Chọn category cho sản phẩm
  */
  async choose_category(site_id, item_id, data) {
    var api = url_for(API.CHOOSE_CATEGORY + '/' + site_id + '/' + item_id);
    return await this.postAPI(api, data);
  }

  /**
  * Upload ảnh cho sản phẩm
  */
  async product_upload_image(site_id, item_id, data) {
    var api = url_for(API.PRODUCT_UPLOAD_IMAGE + '/' + site_id + '/' + item_id);
    return await this.postAPI(api, data);
  }

  /**
  * Upload ảnh cho sản phẩm
  */
  async product_delete_image(site_id, item_id, image_id) {
    var api = url_for(API.PRODUCT_DELETE_IMAGE + '/' + site_id + '/' + item_id + '/' + image_id);
    setTimeout(() => {
      console.log(api);
    }, 5000);

    return await this.getAPI(api);
  }

  /**
  * Url tạo sản phẩm
  */
  create_product_url(site_id) {
    return url_for(API.CREATE_PRODUCT + '/' + site_id);
  }

  /**
  * Url upload images
  */
  upload_image_url(site_id, item_id) {
    return url_for(API.PRODUCT_UPLOAD_IMAGE + '/' + site_id + '/' + item_id);
  }

  /**
  *  Lấy thông tin site
  */
  async site_info(site_id) {
    var api = url_for(API.SITE_INFO + '/' + site_id);
    return await this.getAPI(api);
  }

  /**
  *  Lấy thông tin site
  */
  async product_delete(site_id, item_id) {
    var api = url_for(API.PRODUCT_DELETE + '/' + site_id + '/' + item_id);
    return await this.getAPI(api);
  }

  /**
  *  Lấy danh sách phản hồi
  */
  async categories(site_id) {
    var api = url_for(API.CATEGORIES + '/' + site_id);
    return await this.getAPI(api);
  }

  /**
  *  Lấy thông tin category
  */
  async category_info(site_id, item_id) {
    var api = url_for(API.INFO_CATEGORY + '/' + site_id + '/' + item_id);
    return await this.getAPI(api);
  }
  async category_delete(site_id, item_id) {
    var api = url_for(API.DELETE_CATEGORY + '/' + site_id + '/' + item_id);
    return await this.getAPI(api);
  }
  async category_update(site_id, item_id, data) {
    var api = url_for(API.EDIT_CATEGORY + '/' + site_id + '/' + item_id);
    return await this.postAPI(api, data);
  }
  upload_image_category_url(site_id, category_id) {
    return url_for(API.UPDATE_IMAGE_CATEGORY + '/' + site_id + '/' + category_id);
  }

  /**
  * Url tạo sản phẩm
  */
  create_category_url(site_id) {
    return url_for(API.CREATE_CATEGORY + '/' + site_id);
  }

  /**
  *  Lấy danh sách phản hồi
  */
  async feedbacks(site_id) {
    var api = url_for(API.FEEDBACKS + '/' + site_id);
    return await this.getAPI(api);
  }
  /**
  *  Lấy danh sách phản hồi
  */
  async feedback_detail(site_id, feedback_id) {
    var api = url_for(API.FEEDBACK_DETAIL + '/' + site_id + '/' + feedback_id);
    return await this.getAPI(api);
  }

  /**
  *  Lấy sản phẩm
  */
  async site_product(site_id) {
    var api = url_for(API.SITE_PRODUCT + '/' + site_id);
    return await this.getAPI(api);
  }

  /**
  *  Lấy sản phẩm
  */
  async product_info(site_id, item_id) {
    var api = url_for(API.PRODUCT_INFO + '/' + site_id + '/' + item_id);
    return await this.getAPI(api);
  }

  /**
  * Edit user
  */
  async user_update(data) {
    var api = url_for(API.USER_UPDATE);
    return await this.postAPI(api, data);
  }

  /**
  * Edit item
  */
  async product_update(site_id, item_id, data) {
    var api = url_for(API.PRODUCT_UPDATE + '/' + site_id + '/' + item_id);
    return await this.postAPI(api, data);
  }

  /**
  * Đăng xuất
  */
  async user_logout() {
    var api = url_for(API.USER_LOGOUT);
    return await this.getAPI(api);
  }

  /**
  * Đăng ký
  */
  async user_login(fb_access_token) {
    var api = url_for(API.USER_LOGIN);
    return await this.postAPI(api, {fb_access_token});
  }

    /**
     * Gửi register device
     */
    async user_device(push_token) {
        var api = url_for(API.USER_DEVICE);
        return await this.postAPI(api, {push_token});
    }

  /**
  * Lấy thông tin User
  */
  async user_info(app_user_id) {
    app_user_id = typeof app_user_id != 'undefined' ? `/${app_user_id}` : '';

    var api = url_for(API.USER_INFO + app_user_id);
    return await this.getAPI(api);
  }

  /**
  *  Lấy danh sách trao doi voi admin
  */
  async user_feedbacks() {
    var api = url_for(API.USER_FEEDBACK);
    return await this.getAPI(api);
  }

  /**
  *  Lấy danh sách trao doi voi admin
  */
  async create_user_feedbacks(data) {
    var api = url_for(API.USER_FEEDBACK);
    return await this.postAPI(api, data);
  }

  /**
  *  Lấy danh sách trao doi voi admin
  */
  async user_notices() {
    var api = url_for(API.USER_NOTICE);
    return await this.getAPI(api);
  }

  async user_notify() {
    var api = url_for(API.USER_NOTIFY);
    return await this.getAPI(api);
  }

  /**
  * Thêm domain cho site
  */
  async add_domain(site_id, data) {
    var api = url_for(API.ADD_DOMAIN + '/' + site_id);
    return await this.postAPI(api, data);
  }

  /**
  * Thêm logo
  */
  url_add_logo(site_id) {
    return url_for(API.SITE_ADD_LOGO + '/' + site_id);
  }

  /**
  * Xoá domain
  */
  async delete_domain(site_id, domain_id) {
    var api = url_for(API.DELETE_DOMAIN + '/' + site_id + '/' + domain_id);
    return await this.getAPI(api);
  }

  /**
  *  Lấy danh sách domain
  */
  async list_domain(site_id) {
    var api = url_for(API.LIST_DOMAIN + '/' + site_id);
    return await this.getAPI(api);
  }

  async check_domain(site_id, data) {
    var api = url_for(API.CHECK_DOMAIN + '/' + site_id);
    return await this.postAPI(api, data);
  }

  async check_whois_domain(site_id, data) {
    var api = url_for(API.CHECK_WHOIS_DOMAIN + '/' + site_id);
    return await this.postAPI(api, data);
  }

  /**
  * Config site
  */
  async site_config(site_id, data) {
    var api = url_for(API.SITE_CONFIG + '/' + site_id);
    return await this.postAPI(api, data);
  }

  /**
  * List template
  */
  async list_template(site_id) {
    var api = url_for(API.LIST_TEMPLATE + '/' + site_id);
    return await this.getAPI(api);
  }

  /**
  * Use template
  */
  async use_template(site_id, template_id) {
    var api = url_for(API.USE_TEMPLATE + '/' + site_id + '/' + template_id);
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
