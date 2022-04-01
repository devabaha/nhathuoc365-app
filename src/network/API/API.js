/**
 * All API used through the whole app.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module API
 */

import { CommonAPI } from './CommonAPI';
import { IViewAPI } from './IViewAPI';
import { aggregation } from '../helper';

const API = new (aggregation(CommonAPI, IViewAPI))();

export default API;
