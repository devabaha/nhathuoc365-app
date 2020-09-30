import BaseHandler from './BaseHandler';
import CommonAPIHandler from './CommonAPIHandler';
import IViewAPIHandler from './IViewAPIHandler';
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
 * @mixes IViewAPIHandler
 */

const APIHandler = new (aggregation(
  BaseHandler,
  CommonAPIHandler,
  IViewAPIHandler
))();

export default APIHandler;
