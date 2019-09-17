/* @flow */

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class ListHeader extends Component {
  render() {
    let { title, alignLeft } = this.props;

    return (
      <View
        style={[
          styles.store_heading_box,
          {
            alignItems: alignLeft ? 'flex-start' : 'center'
          }
        ]}
      >
        <Text style={styles.store_heading_title}>{title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  store_heading_box: {
    width: '100%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  store_heading_title: {
    fontSize: 14,
    color: '#333333'
  }
});
