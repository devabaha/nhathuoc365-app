/**
 * @class
 *
 * @callback cancelRequest
 * @returns {void}
 *
 * @typedef {Object} Execution
 * @property {number} executionId id of timer.
 * @property {cancelRequest} cancel - cancel-er to cancel execution.
 * @property {"interval" | "timeout"} type type of timer.
 */
const TIMER_TYPE = {
  INTERVAL: 'interval',
  TIMEOUT: 'timeout'
};

class Timer {
  /**
   *
   * @param {Execution} data
   */
  constructor({
    executionId = -1,
    beforeDie = null,
    afterDie = null,
    type = TIMER_TYPE.TIMEOUT,
    testID = 'init'
  } = {}) {
    this.id = new Date().getTime();
    this.executionId = executionId;
    this.beforeDie = beforeDie;
    this.afterDie = afterDie;
    this.type = type;
    this.testID = testID;
  }

  cancel() {
    switch (this.type) {
      case TIMER_TYPE.TIMEOUT:
        if (typeof this.beforeDie === 'function') {
          this.beforeDie();
        }
        clearTimeout(this.executionId);
        if (typeof this.afterDie === 'function') {
          this.afterDie();
        }
        break;
      case TIMER_TYPE.INTERVAL:
        if (typeof this.beforeDie === 'function') {
          this.beforeDie();
        }
        clearInterval(this.executionId);
        if (typeof this.afterDie === 'function') {
          this.afterDie();
        }
        break;
    }
  }

  set data({ executionId, beforeDie, afterDie, type, testID = 'init' }) {
    this.executionId = executionId;
    this.beforeDie = beforeDie;
    this.afterDie = afterDie;
    this.type = type;
    this.testID = testID;
  }

  set updateExecutionId(executionId) {
    this.executionId = executionId;
  }

  set updateBeforeDie(beforeDie) {
    this.beforeDie = beforeDie;
  }

  set updateAfterDie(afterDie) {
    this.afterDie = afterDie;
  }

  set updateType(type) {
    this.type = type;
  }

  set updateTestID(testID) {
    this.testID = testID;
  }
}

export default Timer;
