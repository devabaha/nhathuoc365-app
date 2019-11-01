import React from 'react';
import PropTypes from 'prop-types';
import BaseContainer from '../BaseContainer';
import EnterCodeManualComponent from '../../component/EnterCodeManual';

const defaultListener = () => {};

class EnterCodeManual extends BaseContainer {
  static propTypes = {
    onSendCode: PropTypes.func,
    onClose: PropTypes.func,
    heading: PropTypes.string,
    message: PropTypes.string,
    placeholder: PropTypes.string
  };

  static defaultProps = {
    onSendCode: defaultListener,
    onClose: defaultListener,
    heading: '',
    message: '',
    placeholder: ''
  };

  render() {
    return (
      <EnterCodeManualComponent
        onClose={this.props.onClose}
        heading={this.props.heading}
        message={this.props.message}
        onSendCode={this.props.onSendCode}
        placeholder={this.props.placeholder}
      />
    );
  }
}

export default EnterCodeManual;
