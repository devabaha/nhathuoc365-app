import { Component } from 'react';
import config from '../config';
import { INITIALIZED } from '../constants';

class BaseContainer extends Component {
  constructor(props) {
    super(props);

    if (config[INITIALIZED] !== true) {
      throw new Error(
        'Run initialize method before using the Phone Card package!'
      );
    }
  }
}

export default BaseContainer;
