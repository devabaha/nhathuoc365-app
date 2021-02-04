import {CommonAPI as API} from '../API';
import BaseHandler from './BaseHandler';

/**
 * A handler for all common/old API handler existed in app.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @class
 * @mixin
 */
class CommonAPIHandler extends BaseHandler {
  /**
   * Login khi mở app
   */
  async user_login(data) {
    var api = url_for(API.USER_LOGIN);
    return await this.postAPI(api, data);
  }

  async user_forget_password(data) {
    var api = url_for(API.USER_FORGET_PASSWORD);
    return await this.postAPI(api, data);
  }

  async user_forget_password_verify(data) {
    var api = url_for(API.USER_FORGET_PASSWORD_VERIFY);
    return await this.postAPI(api, data);
  }

  async user_forget_new_password(data) {
    var api = url_for(API.USER_FORGET_NEW_PASSWORD);
    return await this.postAPI(api, data);
  }

  async user_reset_password(data) {
    var api = url_for(API.USER_RESET_PASSWORD);
    return await this.postAPI(api, data);
  }

  /**
   * Lấy dữ liệu trang home
   */
  async user_home() {
    var api = url_for(API.USER_HOME);
    return await this.getAPI(api);
  }

  async user_site_home() {
    var api = url_for(API.USER_SITE_HOME);
    return await this.getAPI(api);
  }

  async user_sites() {
    var api = url_for(API.USER_SITES);
    return await this.getAPI(api);
  }

  async user_barcode(site_id) {
    var api = url_for(API.USER_BARCODE + '/' + site_id);
    return await this.getAPI(api);
  }

  //user_from_barcode
  async user_from_barcode(barcode) {
    var api = url_for(API.USER_FROM_BARCODE + '/' + barcode);
    return await this.getAPI(api);
  }

  /** get wallet from zone_code */
  async user_get_wallet(zone_code) {
    var api = url_for(API.USER_GET_WALLET + '/' + zone_code);
    return await this.getAPI(api);
  }

  /**
   * process QR code
   *
   * @param object data
   * @param string data.qrcode
   */
  async user_process_qrcode(data) {
    var api = url_for(API.USER_PROCESS_QRCODE);
    return await this.postAPI(api, data);
  }

  //check_address
  async user_check_address(address) {
    var api = url_for(API.USER_CHECK_ADDRESS + '/' + address);
    return await this.getAPI(api);
  }

  async user_invite_history() {
    var api = url_for(API.USER_INVITE_HISTORY);
    return await this.getAPI(api);
  }

  /**
   * Tìm cửa hàng theo mã CH
   */
  async user_search_store(store_code) {
    var api = url_for(API.USER_SEARCH_SITE + '/' + store_code);
    return await this.getAPI(api);
  }

  async user_search_stores(store_code) {
    var api = url_for(API.USER_SEARCH_SITES + '/' + store_code);
    return await this.getAPI(api);
  }

  /**
   * Lấy d/s cửa hàng
   */
  async user_list_site() {
    var api = url_for(API.USER_LIST_SITE);
    return await this.getAPI(api);
  }

  async user_list_suggest_site() {
    var api = url_for(API.USER_LIST_SUGGEST_SITE);
    return await this.getAPI(api);
  }

  /**
   * Thêm cửa hàng bằng mã cửa hàng
   */
  async user_add_store(store_code) {
    var api = url_for(API.USER_ADD_SITE + '/' + store_code);
    return await this.getAPI(api);
  }

  async user_add_ref(ref_code) {
    var api = url_for(API.USER_ADD_REF + '/' + ref_code);
    return await this.getAPI(api);
  }

  /**
   * Update Profile
   */
  async user_update_profile(data) {
    var api = url_for(API.USER_UPDATE_PROFILE);
    return await this.postAPI(api, data);
  }

  async get_my_voucher_by_site(siteId) {
    const api = url_for(API.GET_MY_VOUCHER_BY_SITE + '/' + siteId);
    return await this.getAPI(api);
  }

  /**
   * Lấy thông tin cửa hàng
   */
  async site_info(site_id, category_id = 0) {
    var api = url_for(API.SITE_INFO + '/' + site_id + '/' + category_id);
    return await this.getAPI(api);
  }

  async site_detail(site_id) {
    var api = url_for(API.SITE_DETAIL + '/' + site_id);
    return await this.getAPI(api);
  }

  async cart_site_update(site_id, cart_id, data) {
    var api = url_for(API.CART_SITE_UPDATE + '/' + site_id + '/' + cart_id);
    return await this.postAPI(api, data);
  }

  /**
   * Lấy d/s sản phẩm theo categofy id
   */
  async site_category_product(store_id, category_id, page_num) {
    var api = url_for(
      API.SITE_CATEGORY_PRODUCT +
        '/' +
        store_id +
        '/' +
        category_id +
        '/' +
        page_num,
    );
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
   * thêm product vào giỏ hàng
   */
  async site_cart_adding(store_id, product_id) {
    var api = url_for(API.SITE_CART_ADDING + '/' + store_id + '/' + product_id);
    return await this.getAPI(api);
  }

  /**
   * Tăng số lượng sản phẩm trong giỏ hàng
   */
  async site_cart_plus(store_id, product_id, data) {
    var api = url_for(API.SITE_CART_PLUS + '/' + store_id + '/' + product_id);
    return await this.postAPI(api, data);
  }

  /**
   * Giảm số lượng sản phẩm trong giỏ hàng
   */
  async site_cart_minus(store_id, product_id, data) {
    var api = url_for(API.SITE_CART_MINUS + '/' + store_id + '/' + product_id);
    return await this.postAPI(api, data);
  }

  async site_cart_update_ordering(store_id, cart_id) {
    var api = url_for(
      API.SITE_CART_UPDATE_ORDERING + '/' + store_id + '/' + cart_id,
    );
    return await this.getAPI(api);
  }

  /**
   * Sao chép đơn hàng
   */
  async site_cart_reorder(store_id, cart_id) {
    var api = url_for(API.SITE_CART_REORDER + '/' + store_id + '/' + cart_id);
    return await this.getAPI(api);
  }

  async site_cart_edit(store_id, cart_id) {
    var api = url_for(API.SITE_CART_EDIT + '/' + store_id + '/' + cart_id);
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
   * Lấy thông tin giỏ hàng theo site id
   */
  async site_cart_show(store_id, cart_id = '') {
    var api = url_for(API.SITE_CART_SHOW + '/' + store_id + '/' + cart_id);
    return await this.getAPI(api);
  }

  async site_cart_by_id(store_id, cart_id) {
    var api = url_for(API.SITE_CART + '/' + store_id + '/' + cart_id);
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
   * Cập nhật giỏ hàng
   */
  async site_cart_update(store_id, product_id, data) {
    var api = url_for(API.SITE_CART_UPDATE + '/' + store_id + '/' + product_id);
    return await this.postAPI(api, data);
  }

  /**
   * Đánh giá đơn hàng
   */
  async site_cart_rating(store_id, product_id, data) {
    var api = url_for(API.SITE_CART_RATING + '/' + store_id + '/' + product_id);
    return await this.postAPI(api, data);
  }

  /**
   * Đánh giá ứng dụng
   */
  async user_rate_app() {
    var api = url_for(API.USER_RATE_APP);
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
  async site_add_address(site_id, address_id, data) {
    var api = url_for(API.SITE_ADD_ADDRESS + '/' + site_id + '/' + address_id);
    return await this.postAPI(api, data);
  }

  /**
   * Thêm/sửa địa chỉ
   */
  async site_cart_add_address(site_id, address_id, data) {
    var api = url_for(
      API.SITE_CART_ADD_ADDRESS + '/' + site_id + '/' + address_id,
    );
    return await this.postAPI(api, data);
  }

  async user_add_address(address_id, data) {
    var api = url_for(API.USER_ADD_ADDRESS + '/' + address_id);
    return await this.postAPI(api, data);
  }

  /**
   * Chọn địa chỉ cho đơn hàng
   */
  async site_cart_address(store_id, address_id) {
    var api = url_for(
      API.SITE_CART_ADDRESS + '/' + store_id + '/' + address_id,
    );
    return await this.getAPI(api);
  }

  /**
   * Chọn địa chỉ cho đơn hàng
   */
  async site_cart_change_address(store_id, address_id) {
    var api = url_for(
      API.SITE_CART_CHANGE_ADDRESS + '/' + store_id + '/' + address_id,
    );
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
    var api = url_for(
      API.SITE_CART_UNSELECT + '/' + store_id + '/' + product_id,
    );
    return await this.getAPI(api);
  }

  /**
   * Chọn mặt hàng trong giỏ hàng
   */
  async site_cart_selected(store_id, product_id, data) {
    var api = url_for(
      API.SITE_CART_SELECTED + '/' + store_id + '/' + product_id,
    );
    return await this.postAPI(api, data);
  }

  /**
   * Bỏ chọn mặt hàng trong giỏ hàng
   */
  async site_cart_unselected(store_id, product_id, data) {
    var api = url_for(
      API.SITE_CART_UNSELECTED + '/' + store_id + '/' + product_id,
    );
    return await this.postAPI(api, data);
  }

  /**
   * Note giỏ hàng
   */
  async site_cart_node(store_id, data) {
    var api = url_for(API.SITE_CART_NODE + '/' + store_id);
    return await this.postAPI(api, data);
  }

  /**
   * Note giỏ hàng
   */
  async site_cart_note(store_id, data) {
    var api = url_for(API.SITE_CART_NOTE + '/' + store_id);
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
   * Xác nhận đặt hàng
   */
  async site_cart_order(store_id, data) {
    var api = url_for(API.SITE_CART_ORDER + '/' + store_id);
    return await this.postAPI(api, data);
  }

  /**
   * Danh sách đơn hàng (theo shop) của user
   */
  async site_cart_list(store_id) {
    var api = url_for(API.SITE_CART_LIST + '/' + store_id);
    return await this.getAPI(api);
  }

  /**
   * Danh sách đơn hàng (theo shop) của user
   */
  async site_cart_index(store_id) {
    var api = url_for(API.SITE_CART_INDEX + '/' + store_id);
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
   * USER_CART_CODE
   * @param {*} store_id
   * @param {*} data
   */
  async user_cart_code(cart_code) {
    var api = url_for(API.USER_CART_CODE + '/' + cart_code);
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
   * Gửi chat - new
   */
  async site_send_message(store_id, user_id, data) {
    var api = url_for(API.SITE_SEND_MESSAGE + '/' + store_id + '/' + user_id);
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
   * Load conversations
   */
  site_load_conversations(store_id, data = {}) {
    const api = url_for(API.SITE_CONVERSATIONS + '/' + store_id);

    return this.postCancelableAPI(api, data);
  }

  /**
   * Load chat - new
   */
  site_load_conversation(store_id, user_id, last_mesage_id) {
    const api = url_for(
      API.SITE_CONVERSATION +
        '/' +
        store_id +
        '/' +
        user_id +
        '/' +
        last_mesage_id,
    );

    return this.getCancelableAPI(api);
  }

  /**
   * Search chat
   */
  async site_search_conversations(store_id, data = {}) {
    var api = url_for(API.SITE_SEARCH_CONVERSATIONS + '/' + store_id);
    return await this.postAPI(api, data);
  }

  /**
   * Get pin list
   */
  async site_pin_list(store_id) {
    var api = url_for(API.SITE_PIN_LIST + '/' + store_id);
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
   * Lấy thông tin user theo số điện thoại
   */
  async user_get_info_by_phone_number(data) {
    var api = url_for(API.USER_GET_INFO_BY_PHONE_NUMBER);
    return await this.postAPI(api, data);
  }

  /**
   * Lấy thông tin user theo số địa chỉ ví
   */
  async user_get_info_by_wallet_address(data) {
    var api = url_for(API.USER_GET_INFO_BY_WALLET_ADDRESS);
    return await this.postAPI(api, data);
  }

  /**
   * Load news list
   */
  async user_news_list(type = '') {
    var api = url_for(API.USER_NEWS_LIST + type);
    return await this.getAPI(api);
  }

  /**
   * Load a news by id
   */
  async user_news(news_id) {
    var api = url_for(API.USER_NEWS + '/' + news_id);
    return await this.getAPI(api);
  }

  /**
   * Tìm sản phẩm theo store_id
   */
  async add_push_token(data) {
    var api = url_for(API.ADD_PUSH_TOKEN);
    return await this.postAPI(api, data);
  }

  /**
   * Lấy danh sách thông báo
   */
  async user_notice() {
    var api = url_for(API.USER_NOTICE);
    return await this.getAPI(api);
  }

  /**
   * Đăng ký
   */
  async user_register(data) {
    var api = url_for(API.USER_REGISTER);
    return await this.postAPI(api, data);
  }

  /**
   * Đăng ký ten va so dien thoai gioi thieu
   */
  async user_op_register(data) {
    var api = url_for(API.USER_OP_REGISTER);
    return await this.postAPI(api, data);
  }
  async user_transfer_balance(data) {
    var api = url_for(API.USER_TRANSFER_BALANCE);
    return await this.postAPI(api, data);
  }
  /**
   * Xác thực otp đăng ký
   */
  async user_verify_otp(data) {
    var api = url_for(API.USER_VERIFY_OTP);
    return await this.postAPI(api, data);
  }

  /**
   * Đăng nhập
   */
  async user_login_password(data) {
    var api = url_for(API.USER_LOGIN_PASSWORD);
    return await this.postAPI(api, data);
  }

  async user_login_sms(data) {
    var api = url_for(API.USER_LOGIN_SMS);
    return await this.postAPI(api, data);
  }

  async login_sms_verify(data) {
    var api = url_for(API.LOGIN_SMS_VERIFY);
    return await this.postAPI(api, data);
  }

  async login_fbak_verify(data) {
    var api = url_for(API.LOGIN_FBAK_VERIFY);
    return await this.postAPI(api, data);
  }

  async login_firebase_verify(data) {
    var api = url_for(API.LOGIN_FIREBASE_VERIFY);
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
   * URL upload avatar
   */
  url_user_add_avatar() {
    return url_for(API.USER_ADD_AVATAR);
  }

  /**
   * URL upload avatar
   */
  url_user_upload_image() {
    return url_for(API.UPLOAD_IMAGE);
  }

  /**
   * Lấy thông báo trong ứng dụng
   */
  async user_notify() {
    var api = url_for(API.USER_NOTIFY);
    return await this.getAPI(api);
  }

  /**
   * Lấy số lượng chat chưa đọc
   */
  async site_notify_chat(store_id) {
    var api = url_for(API.SITE_NOTIFY_CHAT + '/' + store_id);
    return await this.getAPI(api);
  }

  /**
   * Lấy dữ liệu thông tin cửa hàng
   */
  async site_notify(store_id) {
    var api = url_for(API.SITE_NOTIFY + '/' + store_id);
    return await this.getAPI(api);
  }

  async user_notify_chat() {
    var api = url_for(API.USER_NOTIFY_CHAT);
    return await this.getAPI(api);
  }

  /**
   * like & unlike for products
   */
  async site_like(store_id, product_id, flag) {
    var api = url_for(
      API.SITE_LIKE + '/' + store_id + '/' + product_id + '/' + flag,
    );
    return await this.getAPI(api);
  }

  /**
   * get attrs for product
   */
  async site_product_attrs(store_id, product_id, data) {
    var api = url_for(
      API.SITE_PRODUCT_ATTRIBUTES + '/' + store_id + '/' + product_id,
    );
    return await this.postAPI(api, data);
  }

  /**
   * Xoá site
   */
  async user_remove_site(store_id) {
    var api = url_for(API.USER_REMOVE_SITE + '/' + store_id);
    return await this.getAPI(api);
  }

  async site_cart_cancel(store_id, cart_id) {
    var api = url_for(API.SITE_CART_CANCEL + '/' + store_id + '/' + cart_id);
    return await this.getAPI(api);
  }

  async site_cart_canceling(store_id, cart_id) {
    var api = url_for(
      API.SITE_CART_CANCELING + '/' + store_id + (cart_id ? '/' + cart_id : ''),
    );
    return await this.getAPI(api);
  }

  /**
   * User chọn khu vực đặt hàng
   */
  async user_choose_location(site_id) {
    var api = url_for(API.USER_CHOOSE_LOCATION + '/' + site_id);
    return await this.getAPI(api);
  }

  /**
   * Ví xu
   */
  async user_coins_wallet() {
    var api = url_for(API.USER_COINS_WALLET);
    return await this.getAPI(api);
  }

  async user_wallet_history(zone_code) {
    var api = url_for(API.USER_WALLET_HISTORY + '/' + zone_code);
    return await this.getAPI(api);
  }

  /**
   * Service
   */
  async service_detail(service_id) {
    var api = url_for(API.SERVICE_DETAIL + '/' + service_id);
    return await this.getAPI(api);
  }
  /**
   *
   */
  async service_info(service_id) {
    var api = url_for(API.SERVICE_INFO + '/' + service_id);
    return await this.getAPI(api);
  }
  /**
   *
   */
  async service_orders() {
    var api = url_for(API.SERVICE_ORDERS);
    return await this.getAPI(api);
  }

  /**
   * Lấy danh sách hình thức thanh toán
   */
  async payment_method(store_id) {
    var api = url_for(API.PAYMENT_METHOD + '/' + store_id);
    return await this.postAPI(api);
  }

  /**
   * Cập nhật hình thức thanh toán cho đơn hàng
   */
  async add_payment_method(store_id, cart_id, data) {
    var api = url_for(API.ADD_PAYMENT_METHOD + '/' + store_id + '/' + cart_id);
    return await this.postAPI(api, data);
  }

  /**
   *
   */
  async service_rating(order_id, data) {
    var api = url_for(API.SERVICE_RATING + '/' + order_id);
    return await this.postAPI(api, data);
  }

  user_get_services() {
    const api = url_for(API.USER_GET_SERVICES);
    return this.getCancelableAPI(api);
  }

  /**
   * @todo get multi-level category
   *
   * @param site_id
   * @returns {categories: {name: string, id: number, image:string, list: []}[], type: string}
   */
  site_get_tree_categories(site_id) {
    const api = url_for(API.SITE_GET_TREE_CATEGORIES + '/' + site_id);
    return this.getCancelableAPI(api);
  }

  get_service_info(service_id) {
    const api = url_for(API.SERVICE_INFO + '/' + service_id);
    return this.getCancelableAPI(api);
  }

  /**
   * @todo book service
   *
   * @param {string|number} service_id
   */
  service_book(service_id, data) {
    const api = url_for(API.SERVICE_BOOK + '/' + service_id);
    return this.postCancelableAPI(api, data);
  }

  /**
   * @todo book service
   *
   * @param {string|number} service_id
   */
  cart_service_book(siteId, product_id, data) {
    const api = url_for(API.CART_SERVICE_BOOK, siteId, product_id);
    return this.postCancelableAPI(api, data);
  }

  /**
   * @todo send error firebase to slack
   *
   * @param {object} payload JSON object
   */
  slack_error_firebase(data) {
    const api = API.SLACK_ERROR_FIREBASE;
    return this.postCancelableAPI(api, data, false);
  }

  /**
   * @todo get list premium by siteID
   *
   */
  get_premiums(siteId) {
    const api = url_for(API.GET_PREMIUMS + '/' + siteId);
    return this.getCancelableAPI(api);
  }

  /**
   * @todo get list city
   *
   */
  user_site_city() {
    const api = url_for(API.USER_SITE_CITY);
    return this.getCancelableAPI(api);
  }

  /**
   * @todo get product config
   *
   */
  site_product_config(siteId, productId) {
    const api = url_for(API.SITE_PRODUCT_CONFIG, siteId, productId);
    return this.postCancelableAPI(api);
  }

  /**
   * @todo get products by group
   *
   */
  site_group_product(siteId, groupId) {
    const api = url_for(API.SITE_GROUP_PRODUCT, siteId, groupId);
    return this.getCancelableAPI(api, true);
  }

  /**
   * @todo get list warehouse
   *
   */
  user_site_store() {
    const api = url_for(API.USER_SITE_STORE);
    return this.getCancelableAPI(api, true);
  }

  /**
   * @todo update current warehouse
   *
   */
  user_choose_store(data) {
    const api = url_for(API.USER_CHOOSE_STORE);
    return this.postCancelableAPI(api, data, true);
  }

  /**
   * @todo register gold member/ store
   *
   */
  user_gold_member_register(data) {
    const api = url_for(API.USER_REGISTER_GOLD_MEMBER);
    return this.postAPI(api, data);
  }

  /**
   * @todo get commission income
   *
   */
  user_site_cart_commission(data) {
    const api = url_for(API.USER_SITE_CART_COMMISSION);
    return this.postCancelableAPI(api, data, true);
  }

  /**
   * @todo Lấy thông tin game đoán số
   *
   * @typedef {Object | null} LotteryInfo
   * @property {number} id ID của game
   * @property {string} title Tiêu đề game
   * @property {string} (size: 600x) ảnh banner game
   * @property {string} rules Thể lệ 
   * @property {string} prize Cơ cấu giải thưởng
   * @property {number} point_count Số điểm cho 1 lượt chơi
   * @property {string} start_date Ngày bắt đầu
   * @property {string} end_date Ngày kết thúc
   * @property {number} max_turn Số lượt chơi tối đa trong 1 ngày
   * @property {number[]} my_turn Danh sách các lần đã dự đoán dạng list array
   * @property {string} my_turn_selected  Danh sách số đã dự đoán dạng string (vd: 001, 002, 003)
   * @property {boolean} is_active Check game có đang trong thời gian diễn ra hay không
   * @property {string} message Nếu game ngoài thời gian diễn ra. message này để thông báo về trạng thái của game
   * @property {{balance: number, balance_view: string}} my_wallet Thông tin địa chỉ ví tích điểm của user nếu có
   *
   * @returns {LotteryInfo}
   */
  lottery_index(site_id) {
    const api = url_for(API.LOTTERY_INDEX + '/' + site_id);
    return this.getCancelableAPI(api);
  }

  /**
   * @todo Gửi số tham gia dự đoán game đoán số
   *
   * @param {number} lottery_id returned from @see lottery_index
   * @param {{prediction_number: number|string}} data
   */
  lottery_turn(site_id, lottery_id, data) {
    const api = url_for(API.LOTTERY_TURN + '/' + site_id + '/' + lottery_id);
    return this.postCancelableAPI(api, data);
  }
}

export default CommonAPIHandler;
