import React from 'react';
import MyVoucherComponent from '../../component/MyVoucher';
import BaseContainer from '../BaseContainer';

class MyVoucher extends BaseContainer {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  componentWillMount() {
    this.validateRequiredMethods(['handlePressVoucher']);
  }

  handleOnRefresh = () => {
    this.setState({ refreshing: true });

    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1000);
  };

  render() {
    return (
      <MyVoucherComponent
        onPressVoucher={this.handlePressVoucher}
        onRefresh={this.handleOnRefresh}
        refreshing={this.state.refreshing}
      />
    );
  }
}

export default MyVoucher;
