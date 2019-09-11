import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  RefreshControl,
  FlatList,
  ScrollView
} from 'react-native';
import ServiceButton from './component/ServiceButton';
import Promotion from './component/Promotion';
import Header from './component/Header';
import PrimaryActions from './component/PrimaryActions';
import ListVouchers from './component/ListVouchers';

import { SERVICES_LIST } from './constants';

const defaultListener = () => {};

@observer
class Home extends Component {
  static propTypes = {
    onSavePoint: PropTypes.func,
    onSurplusNext: PropTypes.func,
    onMyVoucher: PropTypes.func,
    onTransaction: PropTypes.func,
    onServicePressed: PropTypes.func,
    onPromotionPressed: PropTypes.func,
    onVoucherPressed: PropTypes.func,
    onShowAllVouchers: PropTypes.func,
    hasPromotion: PropTypes.bool,
    refreshing: PropTypes.bool,
    promotions: PropTypes.array,
    farmNewsesData: PropTypes.array
  };

  static defaultProps = {
    onSavePoint: defaultListener,
    onSurplusNext: defaultListener,
    onMyVoucher: defaultListener,
    onTransaction: defaultListener,
    onServicePressed: defaultListener,
    onPromotionPressed: defaultListener,
    onVoucherPressed: defaultListener,
    onShowAllVouchers: defaultListener,
    hasPromotion: false,
    refreshing: false,
    promotions: [],
    farmNewsesData: []
  };

  renderServiceItem = ({ item, index }) => (
    <ServiceButton
      key={index}
      iconName={item.iconName}
      title={item.title}
      service_type={item.service_type}
      service_id={item.service_id}
      onPress={this.props.onServicePressed}
    />
  );

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.onPullToRefresh}
          />
        }
      >
        <View style={styles.container}>
          <Header name="Lê Huy Thực" />

          <PrimaryActions
            surplus="10,000,000đ"
            onSavePoint={this.props.onSavePoint}
            onSurplusNext={this.props.onSurplusNext}
            onMyVoucher={this.props.onMyVoucher}
            onTransaction={this.props.onTransaction}
          />

          {this.props.hasPromotion && (
            <Promotion
              data={this.props.promotions}
              onPress={this.props.onPromotionPressed}
            />
          )}

          <View
            style={{
              backgroundColor: '#FAFAFA',
              marginTop: 15
            }}
          >
            {this.props.farmNewsesData && (
              <ListVouchers
                data={this.props.farmNewsesData}
                title="Cửa hàng thân thiết"
              />
            )}

            <View style={styles.serviceBox}>
              <FlatList
                horizontal
                data={SERVICES_LIST}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => `${item.id}`}
                renderItem={this.renderServiceItem}
                ItemSeparatorComponent={() => (
                  <View style={{ width: ~~(Util.size.width / 28) }} />
                )}
              />
            </View>

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
    backgroundColor: '#fff'
  },
  serviceBox: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between',
    paddingHorizontal: MARGIN_HORIZONTAL
  }
});

export default Home;
