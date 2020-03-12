import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

class SlotPicker extends Component {
  state = {};
  render() {
    return <ScrollView style={styles.container}></ScrollView>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default SlotPicker;
