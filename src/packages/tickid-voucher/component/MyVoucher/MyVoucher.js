import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import LoadingComponent from '@tickid/tickid-rn-loading';
import MyVoucherItem from './MyVoucherItem';
import NoResult from '../NoResult';

const defaultListener = () => {};

class MyVoucher extends Component {
  static propTypes = {
    onPressVoucher: PropTypes.func,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
    showLoading: PropTypes.bool,
    campaigns: PropTypes.array
  };

  static defaultProps = {
    onPressVoucher: defaultListener,
    onRefresh: defaultListener,
    refreshing: false,
    showLoading: false,
    campaigns: []
  };

  get totalCampaigns() {
    return this.props.campaigns.length;
  }

  get hasCampaigns() {
    return this.totalCampaigns > 0;
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
        remaining={voucher.data.remain_time}
        avatar={voucher.data.shop_logo_url}
        onPress={() => this.props.onPressVoucher(voucher)}
        last={this.totalCampaigns - 1 === index}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.showLoading && <LoadingComponent loading />}
        {this.hasCampaigns ? (
          this.renderMyVouchers()
        ) : (
          <NoResult
            title="Bạn chưa có phiếu giảm giá"
            text={'Đi săn voucher ở ' + APP_NAME_SHOW + ' Voucher ngay thôi'}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginBottom: config.device.bottomSpace
  }
});

export default MyVoucher;
