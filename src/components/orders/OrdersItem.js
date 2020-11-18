import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Confirm from '../payment/Confirm';
import store from '../../store/Store';

class OrdersItem extends Component {
  static defaultProps = {
    onReturn: () => {}
  };
  orderEdited = false;
  // static onEnter = () => {
  //   Actions.refresh({
  //     onBack: this.props.onBack
  //   });
  // };

  componentWillUnmount() {
    if (!this.orderEdited) {
      store.resetCartData();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Confirm
          {...this.props.passProps}
          data={this.props.data}
          tel={this.props.tel}
          from_page="orders_item"
          orderEdited={() => (this.orderEdited = true)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0
  }
});

export default OrdersItem;
