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
}

export default BaseContainer;
