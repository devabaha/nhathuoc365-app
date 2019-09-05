import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
  TouchableHighlight,
  FlatList,
  ScrollView,
  Platform
} from 'react-native';

// library
import { Actions } from 'react-native-router-flux';
import store from '../../store/Store';
import { reaction } from 'mobx';

// components
import ServiceButton from './component/ServiceButton';
import Promotion from './component/Promotion';
import NewItemComponent3 from '../notify/NewItemComponent3';
import NewItemComponent4 from '../notify/NewItemComponent4';
import NewItemComponent5 from '../notify/NewItemComponent5';
import _drawerIconNotication from '../../images/notication.png';
import _drawerIconPoints from '../../images/points.png';
import _drawerIconTrans from '../../images/trans.png';
import _drawerIconVoucher from '../../images/voucher.png';
import _drawerIconNext from '../../images/next.png';

import { SERVICES_DATA_1 } from './constants';

@observer
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      store_data: null,
      refreshing: false,
      loading: false,
      scrollTop: 0,
      promotions: null
    };

    // auto refresh home
    reaction(
      () => store.refresh_home_change && !store.no_refresh_home_change,
      () => this.getHomeDataFromApi(450)
    );
  }

  get hasPromotion() {
    return (
      Array.isArray(this.state.promotions) && this.state.promotions.length > 0
    );
  }

  componentDidMount() {
    this.getHomeDataFromApi();

    store.parentTab = '_home';

    if (!store.launched) {
      store.launched = true;
      Actions.error();
    }
  }

  // lấy dữ liệu trang home
  getHomeDataFromApi = (delay = 0) => {
    if (store.no_refresh_home_change) {
      return;
    }
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          const response = await APIHandler.user_site_home();
          if (response && response.status == STATUS_SUCCESS) {
            setTimeout(() => {
              const { data } = response;
              this.setState({
                loading: false,
                refreshing: false,
                store_data: data.site,
                newses_data:
                  data.newses && data.newses.length ? data.newses : null,
                farm_newses_data:
                  data.farm_newses && data.farm_newses.length
                    ? data.farm_newses
                    : null,
                promotions:
                  data.promotions && data.promotions.length
                    ? data.promotions
                    : null
              });
              store.setStoreData(data.site);
            }, delay || 0);
          }
        } catch (e) {
          console.warn(e + ' user_home');
          store.addApiQueue('user_home', this.getHomeDataFromApi.bind(this));
        }
      }
    );
  };

  goScanQRCodeScene() {
    Actions.qr_bar_code({
      title: 'Quét QR Code',
      index: 1,
      wallet: store.user_info.default_wallet
    });
  }

  goQRCodeScene() {
    Actions.qr_bar_code({ title: 'Mã tài khoản' });
  }

  onPullToRefresh() {
    this.setState({ refreshing: true });

    const delayOneSecond = 1000;
    this.getHomeDataFromApi(delayOneSecond);
  }

  handlePromotionPressed(item) {
    Actions.notify_item({
      title: item.title,
      data: item
    });
  }

  handleServicePressed = (serviceType, serviceId) => {
    switch (serviceType) {
      case 'scan_qc_code':
        Actions.qr_bar_code({
          title: 'Quét QR Code',
          index: 1,
          wallet: store.user_info.default_wallet
        });
        break;
      case 'phone_card':
        Actions.phonecard({
          service_type: serviceType,
          service_id: serviceId
        });
        break;
      case 'nap_tkc':
        Actions.nap_tkc({
          service_type: serviceType,
          service_id: serviceId
        });
        break;
      case 'md_card':
        Actions.md_card({
          service_type: serviceType,
          service_id: serviceId
        });
        break;
    }
  };

  render() {
    const { farm_newses_data, newses_data } = this.state;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onPullToRefresh.bind(this)}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.haloNameWrapper}>
              <Text style={styles.haloName}>Xin chào,</Text>
              <Text style={[styles.haloName, styles.haloNameBold]}>
                {' '}
                Lê Huy Thực
              </Text>
            </Text>
            <View style={styles.homeBoxWalletInfoLabelRight}>
              <Image
                style={styles.iconNotication}
                source={_drawerIconNotication}
              />
            </View>
          </View>

          <View style={styles.addStoreActionsBoxWrapper}>
            <View style={styles.addStoreActionsBox}>
              <View style={styles.homeBoxWalletInfo}>
                <Text style={styles.walletNameLabel}>Ví tích điểm</Text>
                <Text style={styles.walletName}> Tick</Text>
                <View style={styles.homeBoxWalletInfoLabelRight}>
                  <Text style={styles.surplus}>6,390,000đ</Text>
                </View>
                <TouchableHighlight
                  onPress={this.goQRCodeScene.bind(this, this.state.store_data)}
                  underlayColor="transparent"
                >
                  <View
                    style={{
                      fontSize: 20,
                      color: '#042C5C',
                      fontWeight: 'bold',
                      lineHeight: 20,
                      marginLeft: 10
                    }}
                  >
                    <Image style={styles.iconNext} source={_drawerIconNext} />
                  </View>
                </TouchableHighlight>
              </View>

              <View style={styles.homeBoxWalletAction}>
                <TouchableHighlight
                  onPress={this.goQRCodeScene.bind(this, this.state.store_data)}
                  underlayColor="transparent"
                  style={styles.addStoreActionBtn}
                >
                  <View style={styles.addStoreActionBtnBox}>
                    <Image
                      style={styles.iconPoint}
                      source={_drawerIconPoints}
                    />
                    <Text style={styles.addStoreActionLabel}>Tích điểm</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={this.goScanQRCodeScene.bind(
                    this,
                    this.state.store_data
                  )}
                  underlayColor="transparent"
                  style={styles.addStoreActionBtn}
                >
                  <View style={[styles.addStoreActionBtnBox, {}]}>
                    <Image
                      style={styles.iconTran}
                      source={_drawerIconVoucher}
                    />
                    <Text style={styles.addStoreActionLabel}>
                      Voucher của tôi
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={() =>
                    Actions.vnd_wallet({
                      title: store.user_info.default_wallet.name,
                      wallet: store.user_info.default_wallet
                    })
                  }
                  underlayColor="transparent"
                  style={styles.addStoreActionBtn}
                >
                  <View style={styles.addStoreActionBtnBox}>
                    <Image style={styles.iconTran} source={_drawerIconTrans} />
                    <Text style={styles.addStoreActionLabel}>Giao dịch</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          {this.hasPromotion && (
            <Promotion
              data={this.state.promotions}
              onPress={this.handlePromotionPressed}
            />
          )}

          <View
            style={{
              backgroundColor: '#FAFAFA',
              marginTop: 15
            }}
          >
            {farm_newses_data && (
              <ListHomeItems
                data={farm_newses_data}
                title="Cửa hàng thân thiết"
              />
            )}

            <View style={styles.serviceBox}>
              <FlatList
                ref="service_list"
                horizontal
                showsHorizontalScrollIndicator={false}
                data={SERVICES_DATA_1}
                extraData={this.state}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => (
                  <View style={{ width: ~~(Util.size.width / 28) }} />
                )}
                renderItem={({ item, index }) => (
                  <ServiceButton
                    key={index}
                    iconName={item.iconName}
                    title={item.title}
                    service_type={item.service_type}
                    service_id={item.service_id}
                    onPress={this.handleServicePressed}
                  />
                )}
              />
            </View>

            {newses_data && (
              <ListHomeVoucherItems data={newses_data} title="TiDi Voucher" />
            )}

            {newses_data && (
              <ListHomeNewsItems data={newses_data} title="TiDi News" />
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
    paddingBottom: BAR_HEIGHT
  },
  header: {
    padding: 15,
    paddingTop: 25,
    backgroundColor: DEFAULT_COLOR,
    paddingBottom: 100,
    flexDirection: 'row',
    borderBottomRightRadius: 30
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
        keyExtractor={item => item.id}
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
        keyExtractor={item => item.id}
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
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Home;
