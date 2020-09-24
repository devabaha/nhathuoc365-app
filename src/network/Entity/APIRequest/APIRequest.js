/**
 * @class
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
  constructor({ cancel = () => {}, promise = () => {}, testID = 'init' } = {}) {
    this.id = new Date().getTime();
    this.cancel = cancel;
    this.promise = promise;
    this.testID = testID;
  }

  set data({ testID = 'init', cancel, promise }) {
    this.testID = testID;
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
