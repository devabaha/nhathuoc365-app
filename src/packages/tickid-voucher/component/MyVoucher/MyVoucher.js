import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Image, StyleSheet, FlatList } from 'react-native';
import config from '../../config';

const defaultListener = () => {};

class MyVoucher extends Component {
  static propTypes = {};

  static defaultProps = {};

  render() {
    return (
      <ScrollView>
        <View></View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  }
});

export default MyVoucher;
