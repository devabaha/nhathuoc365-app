import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VoucherDetailComponent from '../../component/VoucherDetail';

class VoucherDetail extends Component {
  static propTypes = {
    voucher: PropTypes.object
  };

  render() {
    return (
      <VoucherDetailComponent image="https://ipos.vn/wp-content/uploads/2017/04/banner-02.png" />
    );
  }
}

export default VoucherDetail;
