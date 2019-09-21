import React from 'react';
import VoucherComponent from '../../component/Voucher';
import BaseContainer from '../BaseContainer';

class Voucher extends BaseContainer {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  componentWillMount() {
    this.validateRequiredMethods([
      'handlePressVoucher',
      'handlePressMyVoucher'
    ]);
  }

  handleOnRefresh = () => {
    this.setState({ refreshing: true });

    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1000);
  };

  render() {
    return (
      <VoucherComponent
        onPressVoucher={this.handlePressVoucher}
        onPressMyVoucher={this.handlePressMyVoucher}
        onRefresh={this.handleOnRefresh}
        refreshing={this.state.refreshing}
      />
    );
  }
}

export default Voucher;
