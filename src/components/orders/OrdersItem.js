import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Confirm from '../payment/Confirm';
import store from '../../store/Store';
import { Actions } from 'react-native-router-flux';

class OrdersItem extends Component {
  static onEnter = () => {
    Actions.refresh({
      onBack: this.props.onBack
    });
  };

  componentWillUnmount() {
    if (this.props.resetCardData) {
      store.resetCartData();
    }
  }

  componentDidMount() {
    EventTracker.logEvent('orders_item_page');
  }

  render() {
    return (
      <View style={styles.container}>
        <Confirm
          {...this.props.passProps}
          data={this.props.data}
          tel={this.props.tel}
          from_page="orders_item"
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
