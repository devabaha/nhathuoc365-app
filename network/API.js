'use strict';

/**
* Name: API v0
* Docs: https://docs.google.com/spreadsheets/d/1TmJAnrADprIjgkn1MWv5PFiUpTSmaKAVkfMCPKZ9L7A/edit#gid=0
* E.g: in components dir import {USER_INFO, USER_LOGIN} from '../../network/api';
*/
const GAPP_API_V0 = 'https://api.abaha.net/';
// const GAPP_API_V0 = 'http://localhost/abaha_server/';

exports.USER_INFO = GAPP_API_V0 + 'user/info';
exports.USER_LOGIN = GAPP_API_V0 + 'user/login';
exports.USER_LOGOUT = GAPP_API_V0 + 'user/logout';
exports.USER_UPDATE = GAPP_API_V0 + 'user/update';
exports.USER_FEEDBACK = GAPP_API_V0 + 'user/feedback';
exports.USER_NOTIFY = GAPP_API_V0 + 'user/notify';
exports.USER_NOTICE = GAPP_API_V0 + 'user/notice';
exports.USER_DEVICE = GAPP_API_V0 + 'user/device';

exports.HOME = GAPP_API_V0 + 'user/home';
exports.SITE_CREATE = GAPP_API_V0 + 'user/create_site';
exports.SITE_INFO = GAPP_API_V0 + 'site/info';
exports.SITE_PRODUCT = GAPP_API_V0 + 'site/product';
exports.CREATE_PRODUCT = GAPP_API_V0 + 'site/create_product';
exports.PRODUCT_INFO = GAPP_API_V0 + 'product/info';
exports.PRODUCT_DELETE = GAPP_API_V0 + 'product/delete';
exports.CHOOSE_CATEGORY = GAPP_API_V0 + 'product/choose_category';
// category
exports.CATEGORIES = GAPP_API_V0 + 'site/category';
exports.CREATE_CATEGORY = GAPP_API_V0 + 'site/create_category';
exports.EDIT_CATEGORY = GAPP_API_V0 + 'category/update';
exports.DELETE_CATEGORY = GAPP_API_V0 + 'category/delete';
exports.INFO_CATEGORY = GAPP_API_V0 + 'category/info';
exports.UPDATE_IMAGE_CATEGORY = GAPP_API_V0 + 'category/update_image';

exports.LIST_DOMAIN = GAPP_API_V0 + 'domain/index';
exports.INFO_DOMAIN = GAPP_API_V0 + 'domain/info';
exports.DELETE_DOMAIN = GAPP_API_V0 + 'domain/delete';
exports.ADD_DOMAIN = GAPP_API_V0 + 'domain/add';
exports.CHECK_DOMAIN = GAPP_API_V0 + 'domain/check';
exports.CHECK_WHOIS_DOMAIN = GAPP_API_V0 + 'domain/check_whois';

exports.ANALYTIC = GAPP_API_V0 + 'site/stats/';
exports.FEEDBACKS = GAPP_API_V0 + 'feedback/index';
exports.FEEDBACK_DETAIL = GAPP_API_V0 + 'feedback/info';
exports.PRODUCT_UPDATE = GAPP_API_V0 + 'product/update';
exports.PRODUCT_UPLOAD_IMAGE = GAPP_API_V0 + 'product/upload_image';
exports.PRODUCT_DELETE_IMAGE = GAPP_API_V0 + 'product/delete_image';

exports.NEWS_LIST = GAPP_API_V0 + 'news_list';
exports.NEWS_DETAILTS = GAPP_API_V0 + 'news_details';
exports.CONTACTS = GAPP_API_V0 + 'contacts';
exports.SEND_PUSH_TOKEN = GAPP_API_V0 + 'send_push_token';
exports.OPEN_AFTER_PUSH = GAPP_API_V0 + 'open_after_push';

// site config
exports.SITE_CONFIG = GAPP_API_V0 + 'site/save_config';
exports.SITE_ADD_LOGO = GAPP_API_V0 + 'site/add_logo';
exports.SITE_UPDATE = GAPP_API_V0 + 'site/update';

// template
exports.LIST_TEMPLATE = GAPP_API_V0 + 'template/index';
exports.USE_TEMPLATE = GAPP_API_V0 + 'template/use_template';
