/* @flow */

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
  Alert,
  Platform
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Button } from '../../lib/react-native-elements';
import store from '../../store/Store';
import Swiper from 'react-native-swiper';
import { reaction } from 'mobx';
import Communications from 'react-native-communications';

// components
import ItemGrid from './ItemGrid';
import ItemList from './ItemList';
import NotifyItemComponent from '../notify/NotifyItemComponent';
import NewItemComponent3 from '../notify/NewItemComponent3';
import NewItemComponent4 from '../notify/NewItemComponent4';
import NewItemComponent5 from '../notify/NewItemComponent5';
import Items from '../stores/Items';
import { TabTutorial, AddStoreTutorial, GoStoreTutorial } from '../tutorial';
import _drawerIconLocation from '../../images/icon_location.png';
import _drawerIconNotication from '../../images/notication.png';
import _drawerIconPoints from '../../images/points.png';
import _drawerIconTrans from '../../images/trans.png';
import _drawerIconVoucher from '../../images/voucher.png';
import _drawerIconScanQrcode from '../../images/scan_qrcode.png';
import _drawerIconPhoneCard from '../../images/phone_card.png';
import _drawerIconRada from '../../images/icon_rada.png';
import _drawerIconPayBill from '../../images/pay_bill.png';
import _drawerIconNext from '../../images/next.png';

const SERVICES_DATA_1 = [
  {
    iconName: _drawerIconScanQrcode,
    title: 'Quét Mã \n QR',
    service_type: 'scan_qc_code',
    service_id: 0
  },
  {
    iconName: _drawerIconPhoneCard,
    title: 'Nạp tiền \n điện thoại',
    service_type: 'phone_card',
    service_id: 1
  },
  {
    iconName: _drawerIconRada,
    title: 'Dịch vụ \n Rada',
    service_type: 'rada',
    service_id: 3
  },
  {
    iconName: _drawerIconPayBill,
    title: 'Đặt lịch\n giữ chỗ',
    service_type: 'booking',
    service_id: 3
  }
];

@observer
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stores_data: null,
      store_data: null,
      refreshing: false,
      loading: false,
      user_notice: null,
      finish: false,
      scrollTop: 0,
      show_tutorial_tab: false,
      show_add_store: false,
      show_go_store: false,
      promotions: null,
      products: null,
      like_products: null,
      categorie_products: null
    };

    this._goSearchStore = this._goSearchStore.bind(this);
    this._goListStore = this._goListStore.bind(this);
    this._getData = this._getData.bind(this);
    // auto refresh home
    reaction(
      () => store.refresh_home_change && !store.no_refresh_home_change,
      () => this._getData(450)
    );
  }

  componentWillMount() {}

  componentDidMount() {
    this._getData();

    store.parentTab = '_home';

    if (!store.launched) {
      store.launched = true;
      Actions.error();
    }
  }

  componentWillReceiveProps() {
    if (store.goStoreNow) {
      store.goStoreNow = undefined;
      return Actions.stores();
    }

    store.parentTab = '_home';

    this._closePopup();

    store.getNoitify();

    if (this.state.finish && store.is_stay_home) {
      if (this.state.scrollTop == 0) {
        this._scrollOverTopAndReload();
      } else {
        this._scrollToTop(0);
      }
    }

    store.is_stay_home = true;
  }

  _scrollToTop(top = 0) {
    if (this.refs_home) {
      this.refs_home.scrollTo({ x: 0, y: top, animated: true });

      clearTimeout(this._scrollTimer);
      this._scrollTimer = setTimeout(() => {
        this.setState({
          scrollTop: top
        });
      }, 500);
    }
  }

  _scrollOverTopAndReload() {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this._scrollToTop(-60);

        this._getData(1000);
      }
    );
  }

  // lấy dữ liệu trang home
  _getData(delay) {
    if (store.no_refresh_home_change) {
      return;
    }
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          var response = await APIHandler.user_site_home();
          if (response && response.status == STATUS_SUCCESS) {
            setTimeout(() => {
              var { data } = response;

              // Animation is true when first loaded
              if (this.state.store_data == null) {
                layoutAnimation();
              }

              if (data.vote_cart && data.vote_cart.site_id) {
                Actions.rating({
                  cart_data: data.vote_cart
                });
              }
              this.setState({
                finish: true,
                loading: false,
                refreshing: false,
                show_add_store: false,
                stores_data:
                  data.sites && data.sites.length > 0 ? data.sites : null,
                store_data: data.site,
                user_notice: data.notices.length > 0 ? data.notices : null,
                newses_data:
                  data.newses && data.newses.length ? data.newses : null,
                newses_type: data.newses_type,
                title_newses_data: data.title_newses,
                farm_newses_data:
                  data.farm_newses && data.farm_newses.length
                    ? data.farm_newses
                    : null,
                farm_newses_type: data.farm_newses_type,
                title_farm_newses_data: data.title_farm_newses,
                promotions:
                  data.promotions && data.promotions.length
                    ? data.promotions
                    : null,
                products:
                  data.products && data.products.length ? data.products : null,
                title_products: data.title_products,
                like_products:
                  data.like_products && data.like_products.length
                    ? data.like_products
                    : null,
                title_like_products: data.title_like_products,
                hot_products:
                  data.hot_products && data.hot_products.length
                    ? data.hot_products
                    : null,
                title_hot_products: data.title_hot_products,
                categorie_products:
                  data.categories && data.categories.length
                    ? data.categories
                    : null,
                view_all_sites: data.view_all_sites == 1,
                view_all_notices: data.view_all_notices == 1,
                view_all_newses: data.view_all_newses == 1
              });
              store.setStoreData(data.site);

              //this._scrollToTop(0);
            }, delay || 0);
          }
        } catch (e) {
          console.warn(e + ' user_home');

          store.addApiQueue('user_home', this._getData.bind(this));
        }
      }
    );
  }

  // render button trên navbar
  _renderRightButton() {
    return (
      <TouchableHighlight
        style={styles.right_btn_add_store}
        underlayColor="transparent"
        onPress={this._showPopupAddStore.bind(this)}
      >
        <View
          style={{
            height: 34,
            alignItems: 'center',
            marginTop: -8
          }}
        >
          <Icon name="phone" size={22} color="#FAFAFA" />
          <Text
            style={{
              fontSize: 10,
              color: '#FAFAFA',
              marginTop: 2
            }}
          >
            Gọi hỗ trợ
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  _showPopupAddStore() {
    if (this.refs_modal_add_store) {
      this.refs_modal_add_store.open();
    }
  }

  // tới màn hình tìm cửa hàng theo mã CH
  _goSearchStore() {
    this._closePopup();

    Actions.search_store();
  }

  // tới màn hình tìm cửa hàng theo danh sách
  _goListStore() {
    this._closePopup();

    Actions.list_store();
  }

  _goScanQRCode() {
    this._closePopup();

    Actions.qr_bar_code({
      title: 'Quét QR Code',
      index: 1,
      wallet: store.user_info.default_wallet
    });
  }

  _goQRCode() {
    this._closePopup();
    Actions.qr_bar_code({ title: 'Mã tài khoản' });
  }

  _closePopup() {
    if (this.refs_modal_add_store) {
      this.refs_modal_add_store.close();
    }
  }

  // pull to reload danh sách cửa hàng
  _onRefresh() {
    this.setState({ refreshing: true });

    this._getData(1000);
  }

  // render rows cửa hàng trong list
  renderRow({ item, index }, isAdmin) {
    if (index == 0) {
      this.defaultBoxHeight = 0;
    }

    this.defaultBoxHeight += 104;

    // store list
    return <ItemList item={item} index={index} that={this} />;
  }

  _goAdStore(item) {
    Actions.sale_menu({
      item_data: item,
      title: item.name
    });
  }

  // tới màn hình chat
  _goChat(item) {
    action(() => {
      store.setStoreData(item);
    })();

    Actions.chat({
      tel: item.tel
    });
  }

  async _pushGoNews(page_id) {
    try {
      var response = await APIHandler.user_news(page_id);
      if (response && response.status == STATUS_SUCCESS) {
        if (currentSceneName == 'notify_item') {
          setTimeout(() => {
            Actions.notify_item({
              title: response.data.title,
              data: response.data,
              type: ActionConst.REFRESH
            });
          }, 660);
        } else {
          setTimeout(() => {
            Actions.notify_item({
              title: response.data.title,
              data: response.data
            });
          }, 660);
        }
      }
    } catch (e) {
      console.warn(e + ' user_news');

      Store.addApiQueue('user_news', this._pushGoNews.bind(this, page_id));
    } finally {
    }
  }

  // tới màn hình store
  _goStores(item, category_id) {
    // action(() => {
    //   store.setStoreData(item);
    // })();

    // hide tutorial go store
    // if (this.props.that) {
    //   this.props.that.setState({
    //     show_go_store: false
    //   });
    // }

    Actions.list_store({
      title: 'Cửa hàng'
    });
  }

  _cachedStore(key, thenFunc = () => 1, catchFunc = () => 1) {
    storage
      .load({
        key,
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          extraFetchOptions: {},
          someFlag: true
        }
      })
      .then(data => {
        thenFunc(data);
      })
      .catch(err => {
        catchFunc(err);
      });
  }

  _goDetail(item) {
    Actions.notify_item({
      title: item.title,
      data: item
    });
  }

  _goItem(item) {
    Actions.item({
      title: item.name,
      item
    });
  }

  render() {
    console.log(this.state);
    var {
      loading,
      finish,
      store_data,
      stores_data,
      farm_newses_data,
      title_farm_newses_data,
      farm_newses_type,
      newses_data,
      title_newses_data,
      newses_type,
      user_notice,
      view_all_newses,
      view_all_notices,
      view_all_sites,
      promotions,
      show_tutorial_tab,
      show_add_store,
      show_go_store,
      products,
      like_products,
      hot_products,
      title_products,
      title_like_products,
      title_hot_products,
      categorie_products
    } = this.state;

    var count_chat = parseInt(store.notify_chat[store.store_id]);

    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ marginBottom: 15 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          <View style={styles.header}>
            <Text style={styles.add_store_action_label}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: '#FAFAFA'
                }}
              >
                Lê Huy Thực
              </Text>
            </Text>
            <View style={styles.home_box_wallet_info_label_right}>
              <Image
                style={styles.icon_notication}
                source={_drawerIconNotication}
              />
            </View>
          </View>

          {/*Thong tin Vi*/}
          {
            <View
              style={{
                backgroundColor: '#FAFAFA'
              }}
            >
              <View style={styles.add_store_actions_box}>
                <View style={styles.home_box_wallet_info}>
                  <Text
                    style={[styles.add_store_wallet_label, { lineHeight: 20 }]}
                  >
                    Ví tích điểm
                  </Text>
                  <Text
                    style={[
                      styles.add_store_wallet_label,
                      {
                        fontSize: 20,
                        fontWeight: 'bold',
                        lineHeight: 20
                      }
                    ]}
                  >
                    {' '}
                    TIDI
                  </Text>
                  <View style={styles.home_box_wallet_info_label_right}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: '#042C5C',
                        fontWeight: 'bold',
                        lineHeight: 20
                      }}
                    >
                      6,390,000đ
                    </Text>
                  </View>
                  <TouchableHighlight
                    onPress={this._goQRCode.bind(this, this.state.store_data)}
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
                      <Image
                        style={styles.icon_next}
                        source={_drawerIconNext}
                      />
                    </View>
                  </TouchableHighlight>
                </View>
                <View style={styles.home_box_wallet_action}>
                  <TouchableHighlight
                    onPress={this._goQRCode.bind(this, this.state.store_data)}
                    underlayColor="transparent"
                    style={styles.add_store_action_btn}
                  >
                    <View style={styles.add_store_action_btn_box}>
                      <Image
                        style={styles.icon_points}
                        source={_drawerIconPoints}
                      />
                      <Text style={styles.add_store_action_label}>
                        Tích điểm
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
                    style={styles.add_store_action_btn}
                  >
                    <View style={styles.add_store_action_btn_box}>
                      <Image
                        style={styles.icon_tran}
                        source={_drawerIconTrans}
                      />
                      <Text style={styles.add_store_action_label}>
                        Giao dịch
                      </Text>
                    </View>
                  </TouchableHighlight>

                  <TouchableHighlight
                    onPress={this._goScanQRCode.bind(
                      this,
                      this.state.store_data
                    )}
                    underlayColor="transparent"
                    style={styles.add_store_action_btn}
                  >
                    <View style={[styles.add_store_action_btn_box, {}]}>
                      <Image
                        style={styles.icon_tran}
                        source={_drawerIconVoucher}
                      />
                      <Text style={styles.add_store_action_label}>
                        Voucher của tôi
                      </Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          }

          {/* <Image /> */}
          {this.state.promotions && this.state.promotions.length > 0 && (
            <View
              style={{
                backgroundColor: '#FAFAFA',
                marginTop: 45
              }}
            >
              <Swiper
                width={Util.size.width - 30}
                height={(Util.size.width - 30) * 0.33}
                autoplayTimeout={3}
                showsPagination={true}
                marginHorizontal={MARGIN_HORIZONTAL}
                marginVertical={10}
                backgroundColor={'#E9E9E9'}
                borderRadius={4}
                autoplay
              >
                {this.state.promotions.map((banner, i) => {
                  return (
                    <View
                      key={i}
                      style={{
                        width: Util.size.width,
                        alignItems: 'center',
                        borderRadius: 4
                      }}
                    >
                      <TouchableHighlight
                        onPress={this._goDetail.bind(this, banner.news)}
                        underlayColor="transparent"
                      >
                        <CachedImage
                          source={{ uri: banner.banner }}
                          style={{
                            width: Util.size.width,
                            height: Util.size.width * 0.4
                          }}
                        />
                      </TouchableHighlight>
                    </View>
                  );
                })}
              </Swiper>
            </View>
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
                    iconName={item.iconName}
                    title={item.title}
                    service_type={item.service_type}
                    service_id={item.service_id}
                    key={index}
                    style={index !== SERVICES_DATA_1.length - 1 && {}}
                    onPress={() => {}}
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
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultBox: {
    width: '100%',
    height: 0,
    backgroundColor: '#FAFAFA',
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
    marginBottom: 4
  },
  header: {
    padding: 15,
    paddingTop: 25,
    backgroundColor: DEFAULT_COLOR,
    paddingBottom: 100,
    flex: 1,
    flexDirection: 'row',
    // borderWidth: Util.pixel,
    // borderColor: "#dddddd",
    borderBottomRightRadius: 30
  },
  container: {
    flex: 1,
    paddingBottom: BAR_HEIGHT - 16,
    backgroundColor: '#FAFAFA'
  },
  stores_box: {
    marginBottom: 8,
    borderTopWidth: Util.pixel,
    borderColor: '#dddddd'
  },
  serviceBox: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: MARGIN_HORIZONTAL
  },
  add_store_box: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    paddingBottom: 8,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
  },
  add_store_title: {
    color: '#042C5C',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20
  },
  add_store_actions_box: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 5,
    margin: MARGIN_HORIZONTAL,
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    height: 125,
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
  home_box_wallet_info: {
    flexDirection: 'row',
    paddingHorizontal: MARGIN_HORIZONTAL,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  home_box_wallet_action: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 15
  },
  add_store_action_btn: {
    width: ~~(Util.size.width / 3.5),
    paddingVertical: 4,
    paddingHorizontal: 0
  },
  add_store_action_btn_box: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: 15
  },
  add_store_action_btn_box_balance: {
    width: ~~(Util.size.width / 2),
    borderLeftWidth: Util.pixel,
    borderLeftColor: '#ebebeb',
    marginTop: -2
  },
  add_store_action_label_balance: {
    fontSize: 24,
    color: '#FAFAFA',
    marginTop: 4,
    fontWeight: 'bold'
  },
  add_store_action_label_name: {
    fontSize: 14,
    color: '#FAFAFA'
  },
  add_store_action_label: {
    fontSize: 13,
    color: '#414242',
    marginTop: 5
  },
  add_store_wallet_label: {
    fontSize: 12,
    color: '#9B04F1'
  },
  home_box_wallet_info_label_right: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    fontWeight: 'bold'
  },
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8
  },
  modal_add_store: {
    width: '90%',
    height: 180,
    borderRadius: 3
  },
  modal_add_store_title: {
    color: '#404040',
    fontSize: 18,
    marginTop: 12,
    marginLeft: MARGIN_HORIZONTAL,
    marginBottom: 8
  },
  modal_add_store_btn: {
    marginTop: 12
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: '#cccccc'
  },

  profile_list_opt: {
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
  },
  right_title_btn_box: {
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
  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    backgroundColor: 'red',
    bottom: 22,
    right: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8
  },
  stores_info_action_notify_chat: {},
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#FAFAFA',
    fontWeight: '600'
  },
  boxButtonActions: {
    // backgroundColor: "#FAFAFA",
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
  lineView: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgb(225,225,225)'
  },
  icon_notication: {
    width: 22,
    height: 22,
    resizeMode: 'cover'
  },
  icon_points: {
    width: 25,
    height: 25,
    resizeMode: 'cover'
  },
  icon_tran: {
    width: 27,
    height: 27,
    resizeMode: 'cover'
  },
  icon_next: {
    width: 20,
    height: 20,
    resizeMode: 'cover'
  },
  icon_service: {
    width: 40,
    height: 40,
    resizeMode: 'cover'
  }
});

const ServiceButton = props => {
  return (
    <TouchableHighlight
      underlayColor="transparent"
      style={[{}]}
      onPress={() => {
        if (props.service_type === 'scan_qc_code') {
          Actions.qr_bar_code({
            title: 'Quét QR Code',
            index: 1,
            wallet: store.user_info.default_wallet
          });
        }
        if (props.service_type == 'phone_card') {
          Actions.phonecard({
            service_type: props.service_type,
            service_id: props.service_id
          });
        } else if (props.service_type == 'nap_tkc') {
          Actions.nap_tkc({
            service_type: props.service_type,
            service_id: props.service_id
          });
        } else if (props.service_type == 'md_card') {
          Actions.md_card({
            service_type: props.service_type,
            service_id: props.service_id
          });
        }
      }}
    >
      <View
        style={[
          {
            alignItems: 'center',
            width: ~~(Util.size.width / 5)
          },
          props.style
        ]}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
          <Image style={styles.icon_service} source={props.iconName} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: '#262C35',
              fontSize: 12,
              textAlign: 'center'
            }}
          >
            {props.title}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

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
        <Text style={styles.add_store_title}>{props.title}</Text>

        <View style={styles.right_title_btn_box}>
          <TouchableHighlight
            style={styles.right_title_btn}
            underlayColor="transparent"
            onPress={() => {
              Actions.notifys_time({
                isNotifysTime: newses_type == 1 ? false : true,
                title: title_newses_data,
                news_type: '/' + newses_type
              });
            }}
          >
            <Text style={[styles.add_store_title, { color: '#042C5C' }]}>
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
        <Text style={styles.add_store_title}>{props.title}</Text>

        <View style={styles.right_title_btn_box}>
          <TouchableHighlight
            style={styles.right_title_btn}
            underlayColor="transparent"
            onPress={() => {
              Actions.notifys_time({
                isNotifysTime: newses_type == 1 ? false : true,
                title: title_newses_data,
                news_type: '/' + newses_type
              });
            }}
          >
            <Text style={[styles.add_store_title, { color: '#042C5C' }]}>
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
        <Text style={styles.add_store_title}>{props.title}</Text>

        <View style={styles.right_title_btn_box}>
          <TouchableHighlight
            style={styles.right_title_btn}
            underlayColor="transparent"
            onPress={() => {
              Actions.notifys_time({
                isNotifysTime: newses_type == 1 ? false : true,
                title: title_newses_data,
                news_type: '/' + newses_type
              });
            }}
          >
            <Text style={[styles.add_store_title, { color: '#042C5C' }]}>
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
