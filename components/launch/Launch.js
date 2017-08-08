/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

@observer
export default class Launch extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Im the Launch component {this.props.store.value}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
