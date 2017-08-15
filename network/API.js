'use strict';

/**
* Name: API v0
* Docs: https://docs.google.com/spreadsheets/d/1TmJAnrADprIjgkn1MWv5PFiUpTSmaKAVkfMCPKZ9L7A/edit#gid=0
* E.g: in components dir import {USER_INFO, USER_LOGIN} from '../../network/api';
*/
const MY_FOOD_API = 'http://test68.myfood.com.vn/';

exports.USER_LOGIN = MY_FOOD_API + 'apiUser/login';
exports.USER_HOME = MY_FOOD_API + 'apiUser/home';
exports.USER_ADD_SITE = MY_FOOD_API + 'apiUser/add_site';
