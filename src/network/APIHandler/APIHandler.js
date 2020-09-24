import BaseHandler from './BaseHandler';
import CommonAPIHandler from './CommonAPIHandler';
import { aggregation } from '../helper';

/**
 * A mighty handler to execute API calling through the whole app.
 * This is an `combined class` that combined from all class
 * that passed in aggregation().
 *
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @class
 * @mixes BaseHandler
 * @mixes CommonAPIHandler
 * @mixes HomeIDAPIHandler
 */

const APIHandler = new (aggregation(BaseHandler, CommonAPIHandler))();

export default APIHandler;
