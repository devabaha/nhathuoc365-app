/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

// librarys
import { Actions, ActionConst } from 'react-native-router-flux';

// components
import Confirm from '../payment/Confirm';
import store from '../../store/Store';

export default class OrdersItem extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Confirm
          {...this.props.passProps}
          data={this.props.data}
          tel={this.props.tel}
          from_page="orders_item" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0
  },
});
