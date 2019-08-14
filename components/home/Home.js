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
  Alert
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
import NewItemComponent2 from '../notify/NewItemComponent2';
import Items from '../stores/Items';
import {
  TabTutorial,
  AddStoreTutorial,
  GoStoreTutorial
} from '../tutorial';

const SERVICES_DATA_1 = [
  {
    iconName: 'mobile',
    title: 'Nạp tiền điện thoại'
  },
  {
    iconName: 'credit-card',
    title: 'Mã thẻ di động'
  },
  {
    iconName: 'plane',
    title: 'Vé máy bay'
  },
  {
    iconName: 'percent',
    title: 'Mã giảm giá'
  }
];
const SERVICES_DATA_2 = [
  {
    iconName: 'wrench',
    title: 'Dịch vụ sửa chữa'
  },
  {
    iconName: 'home',
    title: 'Dịch vụ gia đình'
  },
  {
    iconName: 'car',
    title: 'Sân bay đường dài'
  },
  {
    iconName: 'ellipsis-h',
    title: 'Tất cả dịch vụ'
  }
]

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
    reaction(() => store.refresh_home_change && !store.no_refresh_home_change, () => this._getData(450));
  }

  componentWillMount() {

  }

  componentDidMount() {
    // Actions.refresh({
    //   renderRightButton: this._renderRightButton.bind(this)
    // });

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
    this.setState({
      refreshing: true
    }, () => {
      this._scrollToTop(-60);

      this._getData(1000);
    });
  }

  // lấy dữ liệu trang home
  _getData(delay) {
    if (store.no_refresh_home_change) {
      return;
    }
    this.setState({
      loading: true
    }, async () => {
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
              stores_data: data.sites && data.sites.length > 0 ? data.sites : null,
              store_data: data.site,
              user_notice: data.notices.length > 0 ? data.notices : null,
              newses_data: data.newses && data.newses.length ? data.newses : null,
              newses_type: data.newses_type,
              title_newses_data: data.title_newses,
              farm_newses_data: data.farm_newses && data.farm_newses.length ? data.farm_newses : null,
              farm_newses_type: data.farm_newses_type,
              title_farm_newses_data: data.title_farm_newses,
              promotions: data.promotions && data.promotions.length ? data.promotions : null,
              products: data.products && data.products.length ? data.products : null,
              title_products: data.title_products,
              like_products: data.like_products && data.like_products.length ? data.like_products : null,
              title_like_products: data.title_like_products,
              hot_products: data.hot_products && data.hot_products.length ? data.hot_products : null,
              title_hot_products: data.title_hot_products,
              categorie_products: data.categories && data.categories.length ? data.categories : null,
              view_all_sites: data.view_all_sites == 1,
              view_all_notices: data.view_all_notices == 1,
              view_all_newses: data.view_all_newses == 1,
            });
            store.setStoreData(data.site);

            //this._scrollToTop(0);
          }, delay || 0);
        }
      } catch (e) {
        console.warn(e + ' user_home');

        store.addApiQueue('user_home', this._getData.bind(this));
      }
    });
  }

  // render button trên navbar
  _renderRightButton() {
    return (
      <TouchableHighlight
        style={styles.right_btn_add_store}
        underlayColor="transparent"
        onPress={this._showPopupAddStore.bind(this)}>
        <View style={{
          height: 34,
          alignItems: 'center',
          marginTop: -8
        }}>
          <Icon name="phone" size={22} color="#ffffff" />
          <Text style={{
            fontSize: 10,
            color: '#ffffff',
            marginTop: 2
          }}>Gọi hỗ trợ</Text>
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

    Actions.qr_bar_code({ title: "Quét QR Code", index: 1, wallet: store.user_info.default_wallet });
  }

  _goQRCode() {
    this._closePopup();
    Actions.qr_bar_code({ title: "Mã tài khoản" });
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
    return (
      <ItemList item={item} index={index} that={this} />
    );
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
      title: "Cửa hàng",
    });
  }
  _cachedStore(key, thenFunc = () => 1, catchFunc = () => 1) {
    storage.load({
      key,
      autoSync: true,
      syncInBackground: true,
      syncParams: {
        extraFetchOptions: {
        },
        someFlag: true,
      },
    }).then(data => {
      thenFunc(data);
    }).catch(err => {
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
          style={{marginBottom: 15}}
          refreshControl={<RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />}
        >
          <View style={styles.header}>
            <Text style={styles.add_store_action_label}>
              {`Xin chào, `}
              <Text style={{
                fontWeight: 'bold',
                fontSize: 18
              }}>
                Lê Huy Thực
                </Text>
            </Text>
          </View>

          {(<View>
            <View style={styles.add_store_actions_box}>
              <TouchableHighlight
                onPress={this._goQRCode.bind(this, this.state.store_data)}
                underlayColor="transparent"
                style={styles.add_store_action_btn}>
                <View style={styles.add_store_action_btn_box}>
                  <Icon name="qrcode" size={24} color="#ffffff" />
                  <Text style={styles.add_store_action_label}>Mã TK</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={this._goScanQRCode.bind(this, this.state.store_data)}
                underlayColor="transparent"
                style={styles.add_store_action_btn}>
                <View style={styles.add_store_action_btn_box}>
                  <Icon name="minus-square-o" size={24} color="#ffffff" />
                  <Text style={styles.add_store_action_label}>Quét mã</Text>
                </View>
              </TouchableHighlight>

              {store.user_info.default_wallet && (
                <TouchableHighlight
                  onPress={() => Actions.vnd_wallet({ title: store.user_info.default_wallet.name, wallet: store.user_info.default_wallet })}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={[styles.add_store_action_btn_box,
                  {
                    width: ~~(Util.size.width / 2),
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 15
                  }
                  ]}>
                    <View>
                      <Text style={[
                        styles.add_store_action_label,
                        { textAlign: 'left' }
                      ]}>
                        {store.user_info.default_wallet.name}
                      </Text>
                      <Text style={[
                        styles.add_store_action_label_balance,
                        { textAlign: 'left' }
                      ]}>
                        {store.user_info.default_wallet.balance_view}
                      </Text>
                    </View>
                    <Icon name='chevron-right' color='#ffffff' />
                  </View>
                </TouchableHighlight>)}
            </View>
          </View>
          )}


          <View style={styles.serviceBox}>
            {SERVICES_DATA_1.map((service, index) =>
              <ServiceButton
                iconName={service.iconName}
                title={service.title}
                key={index}
                style={index !== SERVICES_DATA_1.length - 1 && {
                  borderRightColor: '#dddddd',
                  borderRightWidth: 1
                }}
                onPress={() => { }}
              />
            )}
          </View>

          <View style={styles.serviceBox}>
            {SERVICES_DATA_2.map((service, index) =>
              <ServiceButton
                iconName={service.iconName}
                title={service.title}
                key={index}
                style={index !== SERVICES_DATA_1.length - 1 && {
                  borderRightColor: '#dddddd',
                  borderRightWidth: 1
                }}
                onPress={() => { }}
              />
            )}
          </View>

          {/* <Image /> */}
          {(this.state.promotions && this.state.promotions.length > 0) && (
            <Swiper
              width={Util.size.width}
              height={(Util.size.width) * .42}
              autoplayTimeout={3}
              showsPagination={true}
              horizontal
              autoplay>
              {this.state.promotions.map((banner, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      width: Util.size.width,
                      alignItems: 'center'
                    }}>
                    <TouchableHighlight
                      onPress={this._goDetail.bind(this, banner.news)}
                      underlayColor="transparent">
                      <CachedImage
                        source={{ uri: banner.banner }}
                        style={{
                          width: Util.size.width,
                          height: (Util.size.width) * .4
                        }} />
                    </TouchableHighlight>
                  </View>
                );
              })}
            </Swiper>
          )}

          {farm_newses_data && (
            <ListHomeItems
              data={farm_newses_data}
              title="Gian hàng thân thiết"
            />
          )}

          {newses_data && (
            <ListHomeItems
              data={newses_data}
              title="TickID Voucher"
            />
          )}

          {newses_data && (
            <ListHomeItems
              data={newses_data}
              title="Tin tức"
            />
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultBox: {
    width: '100%',
    height: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd",
    marginBottom: 4
  },
  header: {
    padding: 15,
    paddingTop: 45,
    backgroundColor: DEFAULT_COLOR
  },
  container: {
    flex: 1,
    paddingBottom: BAR_HEIGHT,
    backgroundColor: BGR_SCREEN_COLOR
  },
  stores_box: {
    marginBottom: 8,
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  serviceBox: {
    flexDirection: 'row',
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1
  },
  add_store_box: {
    width: '100%',
    backgroundColor: "#ffffff",
    paddingBottom: 8,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  add_store_title: {
    color: "#404040",
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20
  },
  add_store_actions_box: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: DEFAULT_COLOR,
    borderBottomWidth: Util.pixel,
    borderTopWidth: Util.pixel,
    borderColor: "#ffffff"
  },
  add_store_action_btn: {
    paddingVertical: 4,

  },
  add_store_action_btn_box: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    // width: ~~((Util.size.width - 16) / 2),
    width: ~~(Util.size.width / 4),
    borderLeftWidth: Util.pixel,
    borderLeftColor: '#ebebeb'
  },
  add_store_action_btn_box_balance: {
    // alignItems: 'center',
    // width: ~~((Util.size.width - 16) / 2),
    width: ~~(Util.size.width / 2),
    borderLeftWidth: Util.pixel,
    borderLeftColor: '#ebebeb',
    marginTop: -2
  },
  add_store_action_label_balance: {
    fontSize: 24,
    color: '#ffffff',
    marginTop: 4,
    fontWeight: 'bold'
  },
  add_store_action_label_name: {
    fontSize: 14,
    color: '#ffffff',
  },
  add_store_action_label: {
    fontSize: 14,
    color: 'white',
    marginTop: 0
  },

  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8
  },

  modal_add_store: {
    width: '90%',
    // height: 228,
    height: 180,
    borderRadius: 3
  },
  modal_add_store_title: {
    color: "#404040",
    fontSize: 18,
    marginTop: 12,
    marginLeft: 15,
    marginBottom: 8
  },
  modal_add_store_btn: {
    marginTop: 12
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#cccccc"
  },

  profile_list_opt: {
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },

  right_title_btn_box: {
    flex: 1,
    alignItems: 'flex-end'
  },
  myStoresBox: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row'
  },
  myFavoriteBox: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 15,
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
  stores_info_action_notify_chat: {

  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  },

  boxButtonActions: {
    // backgroundColor: "#ffffff",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7
  },
  boxButtonAction: {
    flexDirection: 'row',
    borderWidth: Util.pixel,
    borderColor: "#666666",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: Util.size.width / 2 - 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonActionTitle: {
    color: "#333333",
    marginLeft: 4,
    fontSize: 14
  },
  lineView: {
    height: 1,
    width: "100%",
    backgroundColor: "rgb(225,225,225)"
  }
});

const ServiceButton = (props) => {
  return (
    <TouchableHighlight
      underlayColor='transparent'
      style={[{
        alignItems: 'center',
        justifyContent: 'center',
        width: ~~(Util.size.width / 4),
        paddingVertical: 10
      }]}
      onPress={props.onPress}
    >
      <View style={[{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 10
      }, props.style]}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Icon name={props.iconName} color='#404040' size={24} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{
            color: '#404040',
            fontSize: 14,
            textAlign: 'center'
          }}>
            {props.title}
          </Text>
        </View>
      </View>
    </TouchableHighlight >
  )
}

const ListHomeItems = (props) => {
  return (
    <View>
      <View style={{
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderBottomWidth: Util.pixel,
        borderColor: "#dddddd",
        marginTop: 4,
        flexDirection: 'row'
      }}>
        <Text style={styles.add_store_title}>{props.title}</Text>

        <View style={styles.right_title_btn_box}>
          <TouchableHighlight
            style={styles.right_title_btn}
            underlayColor="transparent"
            onPress={() => {
              Actions.notifys_time({
                isNotifysTime: newses_type == 1 ? false : true,
                title: title_newses_data,
                news_type: "/" + newses_type
              });
            }}>
            <Text style={[styles.add_store_title, { color: DEFAULT_COLOR }]}>
              Tất cả
            </Text>
          </TouchableHighlight>
        </View>
      </View>
      <FlatList
        data={props.data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          // if (index == 0) {
          //   this.defaultNewBoxHeight = 0;
          // }

          // this.defaultNewBoxHeight += (isIOS ? 116 : 124);

          return (
            <NewItemComponent2
              item={item} />
          );
        }}
        keyExtractor={item => item.id}
      />
    </View>
  )
}