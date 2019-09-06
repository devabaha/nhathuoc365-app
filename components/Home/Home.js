import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableHighlight,
  FlatList,
  ScrollView,
  Platform
} from 'react-native';
import ServiceButton from './component/ServiceButton';
import Promotion from './component/Promotion';
import Header from './component/Header';
import PrimaryActions from './component/PrimaryActions';

import NewItemComponent3 from '../notify/NewItemComponent3';
import NewItemComponent4 from '../notify/NewItemComponent4';
import NewItemComponent5 from '../notify/NewItemComponent5';

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
              <ListHomeItems
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
              <ListHomeVoucherItems
                title="TiDi Voucher"
                data={this.props.newsesData}
              />
            )}

            {this.props.newsesData && (
              <ListHomeNewsItems
                title="TiDi News"
                data={this.props.newsesData}
              />
            )}

            <View style={{ height: 20, backgroundColor: 'transparent' }} />
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
  },
  addStoreTitle: {
    color: '#042C5C',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20
  },
  addStoreActionsBoxWrapper: {
    width: '100%',
    alignItems: 'center'
  },
  addStoreActionsBox: {
    flexDirection: 'column',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    margin: MARGIN_HORIZONTAL,
    position: 'absolute',
    top: -99,
    left: 0,
    right: 0,
    height: 140,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5
      },
      android: {
        elevation: 2,
        borderWidth: Util.pixel,
        borderColor: '#E1E1E1'
      }
    })
  },
  homeBoxWalletInfo: {
    flexDirection: 'row',
    paddingHorizontal: MARGIN_HORIZONTAL,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  homeBoxWalletAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ebebeb',
    paddingTop: 16
  },
  addStoreActionBtn: {
    width: ~~(Util.size.width / 3.5),
    paddingVertical: 4,
    paddingHorizontal: 0
  },
  addStoreActionBtnBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  addStoreActionLabel: {
    fontSize: 12,
    color: '#414242',
    marginTop: 5,
    fontWeight: '500'
  },
  homeBoxWalletInfoLabelRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    fontWeight: 'bold'
  },
  rightTitleBtnBox: {
    flex: 1,
    alignItems: 'flex-end'
  },
  myStoresBox: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: MARGIN_HORIZONTAL,
    paddingVertical: 8,
    flexDirection: 'row'
  },
  myFavoriteBox: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: MARGIN_HORIZONTAL,
    paddingVertical: 8,
    flexDirection: 'row'
  },
  boxButtonActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7
  },
  boxButtonAction: {
    flexDirection: 'row',
    borderWidth: Util.pixel,
    borderColor: '#666666',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: Util.size.width / 2 - 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonActionTitle: {
    color: '#333333',
    marginLeft: 4,
    fontSize: 14
  },
  iconNotication: {
    width: 22,
    height: 22,
    resizeMode: 'cover'
  },
  iconPoint: {
    width: 25,
    height: 25,
    resizeMode: 'cover'
  },
  iconTran: {
    width: 32,
    height: 32,
    resizeMode: 'cover'
  },
  iconNext: {
    width: 20,
    height: 20,
    resizeMode: 'cover'
  },
  haloNameWrapper: {
    marginTop: 16
  },
  haloName: {
    fontWeight: '500',
    fontSize: 16,
    color: '#FAFAFA'
  },
  haloNameBold: {
    fontWeight: 'bold'
  },
  walletNameLabel: {
    color: '#9B04F1',
    fontSize: 14,
    fontWeight: '500'
  },
  walletName: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
    color: '#9B04F1'
  },
  surplus: {
    fontSize: 18,
    color: '#042C5C',
    fontWeight: '600',
    lineHeight: 20
  }
});

const ListHomeItems = props => {
  return (
    <View>
      <View
        style={{
          paddingHorizontal: MARGIN_HORIZONTAL,
          paddingVertical: 4,
          flexDirection: 'row'
        }}
      >
        <Text style={styles.addStoreTitle}>{props.title}</Text>

        <View style={styles.rightTitleBtnBox}>
          <TouchableHighlight
            style={styles.right_title_btn}
            underlayColor="transparent"
            onPress={() => {}}
          >
            <Text style={[styles.addStoreTitle, { color: '#042C5C' }]}>
              Xem tất cả
            </Text>
          </TouchableHighlight>
        </View>
      </View>
      <FlatList
        data={props.data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return <NewItemComponent3 item={item} />;
        }}
        keyExtractor={item => `${item.id}`}
      />
    </View>
  );
};

const ListHomeVoucherItems = props => {
  return (
    <View>
      <View
        style={{
          paddingHorizontal: MARGIN_HORIZONTAL,
          paddingVertical: 4,
          flexDirection: 'row'
        }}
      >
        <Text style={styles.addStoreTitle}>{props.title}</Text>

        <View style={styles.rightTitleBtnBox}>
          <TouchableHighlight
            style={styles.right_title_btn}
            underlayColor="transparent"
            onPress={() => {}}
          >
            <Text style={[styles.addStoreTitle, { color: '#042C5C' }]}>
              Xem tất cả
            </Text>
          </TouchableHighlight>
        </View>
      </View>
      <FlatList
        data={props.data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return <NewItemComponent4 item={item} />;
        }}
        keyExtractor={item => `${item.id}`}
      />
    </View>
  );
};

const ListHomeNewsItems = props => {
  return (
    <View>
      <View
        style={{
          marginHorizontal: MARGIN_HORIZONTAL,
          marginVertical: 4,
          flexDirection: 'row'
        }}
      >
        <Text style={styles.addStoreTitle}>{props.title}</Text>

        <View style={styles.rightTitleBtnBox}>
          <TouchableHighlight
            style={styles.right_title_btn}
            underlayColor="transparent"
            onPress={() => {}}
          >
            <Text style={[styles.addStoreTitle, { color: '#042C5C' }]}>
              Xem tất cả
            </Text>
          </TouchableHighlight>
        </View>
      </View>
      <FlatList
        data={props.data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return <NewItemComponent5 item={item} />;
        }}
        keyExtractor={item => `${item.id}`}
      />
    </View>
  );
};

export default Home;
