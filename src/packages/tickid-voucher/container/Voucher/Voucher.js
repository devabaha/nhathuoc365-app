import React from 'react';
import VoucherComponent from '../../component/Voucher';
import BaseContainer from '../BaseContainer';

class Voucher extends BaseContainer {
  componentWillMount() {
    this.validateRequiredMethods();
  }

  validateRequiredMethods() {
    const requiredMethods = ['handlePressVoucher', 'handlePressMyVoucher'];
    requiredMethods.forEach(method => {
      if (typeof this[method] !== 'function') {
        throw new Error(
          `Method ${method} is required in the class extends Voucher`
        );
      }
    });
  }

  render() {
    return (
      <VoucherComponent
        onPressVoucher={this.handlePressVoucher}
        onPressMyVoucher={this.handlePressMyVoucher}
      />
    );
  }
}

export default Voucher;
