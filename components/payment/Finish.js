/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

// library

@observer
export default class Finish extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Im the Finish component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccc",
    width: Util.size.width
  },
});
