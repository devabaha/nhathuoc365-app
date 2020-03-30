import React, { Component } from 'react';
import Button from 'react-native-button';
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
    onPressEnterVoucher: PropTypes.func,
    onPressUseOnline: PropTypes.func,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
    apiFetching: PropTypes.bool,
    isUseOnlineMode: PropTypes.bool,
    campaigns: PropTypes.array
  };

  static defaultProps = {
    onPressVoucher: defaultListener,
    onPressEnterVoucher: defaultListener,
    onPressUseOnline: defaultListener,
    onRefresh: defaultListener,
    refreshing: false,
    apiFetching: false,
    isUseOnlineMode: false,
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
        isUseOnlineMode={this.props.isUseOnlineMode}
        avatar={voucher.data.shop_logo_url}
        onPress={() => this.props.onPressVoucher(voucher)}
        onPressUseOnline={() => this.props.onPressUseOnline(voucher)}
        last={this.totalCampaigns - 1 === index}
      />
    );
  };

  render() {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        {this.props.apiFetching && (
          <View style={{ flex: 1 }}>
            <LoadingComponent loading />
          </View>
        )}
        {this.hasCampaigns && this.renderMyVouchers()}

        {!this.props.apiFetching && !this.hasCampaigns && (
          <NoResult
            title={t('my.noVoucher.title')}
            text={t('my.noVoucher.description', { appName: APP_NAME_SHOW })}
          />
        )}

        <View style={styles.getVoucherWrapper}>
          <Button
            containerStyle={styles.getVoucherBtn}
            style={styles.getVoucherTitle}
            onPress={() => {
              this.props.onPressEnterVoucher();
            }}
          >
            {t('my.enterVoucher')}
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginBottom: config.device.bottomSpace
  },
  getVoucherWrapper: {
    backgroundColor: config.colors.white,
    height: 62,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  getVoucherBtn: {
    backgroundColor: config.colors.primary,
    borderRadius: 8,
    paddingVertical: 14
  },
  getVoucherTitle: {
    color: config.colors.white,
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16
  }
});

export default MyVoucher;
