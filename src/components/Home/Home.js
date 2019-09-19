import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import Promotion from './component/Promotion';
import Header from './component/Header';
import PrimaryActions from './component/PrimaryActions';
import ListVouchers from './component/ListVouchers';
import ListServices from './component/ListServices';

import { SERVICES_LIST } from './constants';

const defaultListener = () => {};

@observer
class Home extends Component {
  static propTypes = {
    onActionPress: PropTypes.func,
    onSurplusNext: PropTypes.func,
    onPromotionPressed: PropTypes.func,
    onVoucherPressed: PropTypes.func,
    onShowAllVouchers: PropTypes.func,
    onPressService: PropTypes.func,
    hasPromotion: PropTypes.bool,
    refreshing: PropTypes.bool,
    promotions: PropTypes.array,
    farmNewsesData: PropTypes.array
  };

  static defaultProps = {
    onActionPress: defaultListener,
    onSurplusNext: defaultListener,
    onPromotionPressed: defaultListener,
    onVoucherPressed: defaultListener,
    onShowAllVouchers: defaultListener,
    onPressService: defaultListener,
    hasPromotion: false,
    refreshing: false,
    promotions: [],
    farmNewsesData: []
  };

  getRefreshControl() {
    return (
      <RefreshControl
        refreshing={this.props.refreshing}
        onRefresh={this.props.onPullToRefresh}
      />
    );
  }

  render() {
    return (
      <ScrollView refreshControl={this.getRefreshControl()}>
        <View style={styles.container}>
          <View style={styles.headerBackground} />

          <Header name="Lê Huy Thực" />

          <View style={styles.primaryActionsWrapper}>
            <PrimaryActions
              surplus="10,000,000đ"
              onPressItem={this.props.onActionPress}
              onSurplusNext={this.props.onSurplusNext}
            />
          </View>

          <ListServices
            data={SERVICES_LIST}
            onItemPress={this.props.onPressService}
          />

          <View style={styles.contentWrapper}>
            {this.props.hasPromotion && (
              <Promotion
                data={this.props.promotions}
                onPress={this.props.onPromotionPressed}
              />
            )}

            {this.props.farmNewsesData && (
              <ListVouchers
                data={this.props.farmNewsesData}
                title="Cửa hàng thân thiết"
              />
            )}

            {this.props.newsesData && (
              <ListVouchers
                title="TiDi Voucher"
                data={this.props.newsesData}
                onShowAll={this.props.onShowAllVouchers}
                onVoucherPressed={this.props.onVoucherPressed}
              />
            )}

            {this.props.newsesData && (
              <ListVouchers title="TiDi News" data={this.props.newsesData} />
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: BAR_HEIGHT,
    position: 'relative',
    backgroundColor: '#fff'
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: DEFAULT_COLOR,
    borderBottomRightRadius: 30
  },
  contentWrapper: {
    backgroundColor: '#f1f1f1'
  },
  primaryActionsWrapper: {
    paddingBottom: 8
  }
});

export default Home;
