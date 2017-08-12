/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

// library

@observer
export default class Confirm extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Im the Confirm component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#666",
    width: Util.size.width
  },
});
