import React, { Component } from 'react';
import VoucherComponent from '../../component/Voucher';

class Voucher extends Component {
  componentWillMount() {
    if (typeof this.handlePressVoucher !== 'function') {
      throw new Error(
        'Method `handlePressVoucher` is required in the class extends Voucher'
      );
    }
  }

  render() {
    return <VoucherComponent onPressVoucher={this.handlePressVoucher} />;
  }
}

export default Voucher;
