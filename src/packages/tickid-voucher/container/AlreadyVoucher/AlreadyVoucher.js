import React from 'react';
import PropTypes from 'prop-types';
import BaseContainer from '../BaseContainer';
import AlreadyVoucherComponent from '../../component/AlreadyVoucher';

const defaultListener = () => {};

class AlreadyVoucher extends BaseContainer {
  static propTypes = {
    onCheckMyVoucher: PropTypes.func,
    onClose: PropTypes.func,
    heading: PropTypes.string,
    message: PropTypes.string
  };

  static defaultProps = {
    onCheckMyVoucher: defaultListener,
    onClose: defaultListener,
    heading: '',
    message: ''
  };

  render() {
    return (
      <AlreadyVoucherComponent
        onClose={this.props.onClose}
        heading={this.props.heading}
        message={this.props.message}
        onCheckMyVoucher={this.props.onCheckMyVoucher}
      />
    );
  }
}

export default AlreadyVoucher;
