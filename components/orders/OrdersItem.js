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
          data={this.props.data}
          from="orders_item" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0
  },
});
