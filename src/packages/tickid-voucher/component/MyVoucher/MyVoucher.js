import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import MyVoucherItem from './MyVoucherItem';

const defaultListener = () => {};

class MyVoucher extends Component {
  static propTypes = {
    onPressVoucher: PropTypes.func,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
    campaigns: PropTypes.array
  };

  static defaultProps = {
    onPressVoucher: defaultListener,
    onRefresh: defaultListener,
    refreshing: false,
    campaigns: []
  };

  get totalCampaigns() {
    return this.props.campaigns.length;
  }

  renderMyVouchers() {
    return (
      <FlatList
        data={this.props.campaigns}
        keyExtractor={item => `${item.data.id}`}
        renderItem={this.renderMyVoucher}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.onRefresh}
          />
        }
      />
    );
  }

  renderMyVoucher = ({ item: voucher, index }) => {
    return (
      <MyVoucherItem
        title={voucher.data.title}
        remaining=""
        avatar={voucher.data.shop_logo_url}
        onPress={() => this.props.onPressVoucher(voucher)}
        last={this.totalCampaigns - 1 === index}
      />
    );
  };

  render() {
    return <View style={styles.container}>{this.renderMyVouchers()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  }
});

export default MyVoucher;
