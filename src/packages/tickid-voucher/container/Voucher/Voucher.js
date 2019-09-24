import React from 'react';
import VoucherComponent from '../../component/Voucher';
import BaseContainer from '../BaseContainer';

class Voucher extends BaseContainer {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      provinceSelected: { id: 2, name: 'Hồ Chí Minh' }
    };
  }

  componentWillMount() {
    this.validateRequiredMethods([
      'handlePressVoucher',
      'handlePressMyVoucher',
      'handlePressSelectProvince'
    ]);
  }

  handleOnRefresh = () => {
    this.setState({ refreshing: true });

    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1000);
  };

  handleSetProvince = provinceSelected => {
    this.setState({ provinceSelected });
  };

  render() {
    return (
      <VoucherComponent
        onPressVoucher={this.handlePressVoucher}
        onPressMyVoucher={this.handlePressMyVoucher}
        onPressSelectProvince={this.handlePressSelectProvince.bind(this, {
          setProvince: this.handleSetProvince,
          provinceSelected: this.state.provinceSelected
        })}
        onRefresh={this.handleOnRefresh}
        refreshing={this.state.refreshing}
        provinceSelected={this.state.provinceSelected}
      />
    );
  }
}

export default Voucher;
