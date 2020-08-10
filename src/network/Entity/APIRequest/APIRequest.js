/**
 * @module APIRequest
 * @class APIRequest
 *
 * @callback cancelRequest
 * @returns {void}
 *
 * @callback promiseRequest
 * @returns {Promise}
 *
 * @typedef {Object} Request
 * @property {cancelRequest} cancel - cancel-er to cancel request.
 * @property {promiseRequest} promise - promise to execute request.
 */

class APIRequest {
  /**
   *
   * @param {Request} data
   */
  constructor({ cancel = () => {}, promise = () => {} } = {}) {
    this.cancel = cancel;
    this.promise = promise;
  }

  set data({ cancel, promise }) {
    this.updateCancel = cancel;
    this.updatePromise = promise;
  }

  set updateCancel(cancel) {
    this.cancel = cancel;
  }

  set updatePromise(promise) {
    this.promise = promise;
  }
}

export default APIRequest;
