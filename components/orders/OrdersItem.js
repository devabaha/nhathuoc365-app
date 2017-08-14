/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

// components
import Confirm from '../payment/Confirm';

export default class MyComponent extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Confirm from="orders_item" />
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
