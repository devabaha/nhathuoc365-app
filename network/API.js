'use strict';

/**
* Name: API v0
* Docs: https://docs.google.com/spreadsheets/d/1TmJAnrADprIjgkn1MWv5PFiUpTSmaKAVkfMCPKZ9L7A/edit#gid=0
* E.g: in components dir import {USER_INFO, USER_LOGIN} from '../../network/api';
*/
const MY_FOOD_API = 'http://test68.myfood.com.vn/';

// Sites
exports.USER_LOGIN = MY_FOOD_API + 'apiUser/login';

// Home
exports.USER_HOME = MY_FOOD_API + 'apiUser/home';

// Store
exports.USER_SEARCH_SITE = MY_FOOD_API + 'apiUser/search_site';
exports.USER_ADD_SITE = MY_FOOD_API + 'apiUser/add_site';
exports.USER_LIST_SITE = MY_FOOD_API + 'apiUser/list_site';
exports.SITE_INFO = MY_FOOD_API + 'apiSite/info';
exports.SITE_CATEGORY_PRODUCT = MY_FOOD_API + 'apiSite/category_product';

// Item
exports.SITE_PRODUCT = MY_FOOD_API + 'apiSite/product';

// Cart
exports.SITE_CART_ADDING = MY_FOOD_API + 'apiSite/cartadding';
exports.SITE_CART = MY_FOOD_API + 'apiSite/cart';
exports.SITE_CART_DOWN = MY_FOOD_API + 'apiSite/cartdown';
exports.SITE_CART_UP = MY_FOOD_API + 'apiSite/cartup';
exports.SITE_CART_REMOVE = MY_FOOD_API + 'apiSite/cartremove';

// Address
exports.USER_ADDRESS = MY_FOOD_API + 'apiUser/address';
exports.USER_ADD_ADDRESS = MY_FOOD_API + 'apiUser/add_address';
exports.SITE_CART_ADDRESS = MY_FOOD_API + 'apiSite/cartaddress';
exports.USER_DELETE_ADDRESS = MY_FOOD_API + 'apiUser/delete_address';
