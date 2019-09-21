import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import VoucherItem from './VoucherItem';

const defaultListener = () => {};

class Voucher extends Component {
  static propTypes = {
    onPressVoucher: PropTypes.func
  };

  static defaultProps = {
    onPressVoucher: defaultListener
  };

  renderVouchers() {
    return (
      <FlatList
        data={[{}, {}, {}, {}]}
        keyExtractor={(item, key) => `${key}`}
        renderItem={this.renderVoucher}
      />
    );
  }

  renderVoucher = ({ item: voucher, index }) => {
    return (
      <VoucherItem
        image="https://ipos.vn/wp-content/uploads/2017/04/banner-02.png"
        title="[Loyal Tea] Giảm 30% menu toàn bộ đồ uống tại cơ sở số 2 Phạm Ngọc Thạch"
        onPress={() => this.props.onPressVoucher(voucher)}
        last={3 === index}
      />
    );
  };

  render() {
    return <View style={styles.container}>{this.renderVouchers()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  }
});

export default Voucher;
