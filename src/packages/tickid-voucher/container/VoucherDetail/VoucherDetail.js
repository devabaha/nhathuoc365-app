import React from 'react';
import PropTypes from 'prop-types';
import BaseContainer from '../BaseContainer';
import VoucherDetailComponent from '../../component/VoucherDetail';

class VoucherDetail extends BaseContainer {
  static propTypes = {
    voucher: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  componentWillMount() {
    this.validateRequiredMethods([]);
  }

  handleOnRefresh = () => {
    this.setState({ refreshing: true });

    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1000);
  };

  handleGetVoucher = () => {};

  render() {
    return (
      <VoucherDetailComponent
        image="https://ipos.vn/wp-content/uploads/2017/04/banner-02.png"
        onGetVoucher={this.handleGetVoucher}
        onRefresh={this.handleOnRefresh}
        refreshing={this.state.refreshing}
      />
    );
  }
}

export default VoucherDetail;
