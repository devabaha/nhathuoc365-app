/* @flow */

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import appConfig from 'app-config';

export default class ListHeader extends Component {
  render() {
    let { title, alignLeft, containerStyle } = this.props;

    return (
      <View
        style={[
          styles.store_heading_box,
          {
            alignItems: alignLeft ? 'flex-start' : 'center'
          },
          containerStyle
        ]}
      >
        {!!title && <Text style={styles.store_heading_title}>{title}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  store_heading_box: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  store_heading_title: {
    fontSize: 14,
    color: '#333333',
    marginVertical: 15,
    textAlign: 'center',
    ...appConfig.styles.typography.heading3,
  }
});
