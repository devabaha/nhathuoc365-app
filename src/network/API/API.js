/**
 * All API used through the whole app.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module API
 */

import { CommonAPI } from './CommonAPI';
import { HomeIDAPI } from './HomeIDAPI';
import { BeeLandAPI } from './BeeLandAPI';
import { aggregation } from '../helper';

const API = new (aggregation(CommonAPI, HomeIDAPI, BeeLandAPI))();

export default API;
