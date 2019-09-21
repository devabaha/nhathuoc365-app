import { Component } from 'react';
import config from '../config';
import { VOUCHER_INITIALIZED } from '../constants';

class BaseContainer extends Component {
  constructor(props) {
    super(props);

    if (config[VOUCHER_INITIALIZED] !== true) {
      throw new Error(
        'Run initialize method before using the Voucher package!'
      );
    }
  }

  validateRequiredMethods(requiredMethods = []) {
    requiredMethods.forEach(method => {
      if (typeof this[method] !== 'function') {
        throw new Error(
          `Method ${method} is required in the class extends Voucher`
        );
      }
    });
  }
}

export default BaseContainer;
