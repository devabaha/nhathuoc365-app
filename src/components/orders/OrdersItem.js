import React, {Component} from 'react';
// configs
import store from 'app-store';
// custom components
import Confirm from '../payment/Confirm';

class OrdersItem extends Component {
  static defaultProps = {
    onReturn: () => {},
  };
  orderEdited = false;

  componentWillUnmount() {
    if (!this.orderEdited) {
      store.resetCartData();
    }
  }

  render() {
    return (
      <Confirm
        {...this.props}
        data={this.props.data}
        tel={this.props.tel}
        from_page="orders_item"
        orderEdited={() => (this.orderEdited = true)}
      />
    );
  }
}

export default OrdersItem;
