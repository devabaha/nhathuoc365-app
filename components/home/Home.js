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
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Button } from '../../lib/react-native-elements';
import store from '../../store/Store';
import Swiper from 'react-native-swiper';
import {reaction} from 'mobx';
import Communications from 'react-native-communications';

// components
import ItemGrid from './ItemGrid';
import ItemList from './ItemList';
import { ItemList as AdItemList } from '../dashboard/ItemList';
import NotifyItemComponent from '../notify/NotifyItemComponent';
import NewItemComponent from '../notify/NewItemComponent';
import Items from '../stores/Items';
import {
  TabTutorial,
  AddStoreTutorial,
  GoStoreTutorial
} from '../tutorial';

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
    reaction(() => store.refresh_home_change, () => this._getData(450));
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
      this.refs_home.scrollTo({x: 0, y: top, animated: true});

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
    this.setState({
      loading: true
    }, async () => {
      try {
        var response = await APIHandler.user_site_home();
        if (response && response.status == STATUS_SUCCESS) {
          setTimeout(() => {

            var {data} = response;

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
              // user_notice: data.notices.length > 0 ? data.notices : null, // ẩn đơn hàng của tôi
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
    return(
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

    Actions.scan_qr_code();
  }

  _closePopup() {
    if (this.refs_modal_add_store) {
        this.refs_modal_add_store.close();
    }
  }

  // pull to reload danh sách cửa hàng
  _onRefresh() {
    this.setState({refreshing: true});

    this._getData(1000);
  }

  // render rows cửa hàng trong list
  renderRow({item, index}, isAdmin) {
    if (index == 0) {
      this.defaultBoxHeight = 0;
    }

    this.defaultBoxHeight += 104;

    // store list
    return(
      <ItemList item={item} index={index} that={this} />
    );
  }

  renderAdRow({item, index}, isAdmin) {
    if (index == 0) {
      this.defaultBoxHeight = 0;
    }

    this.defaultBoxHeight += 104;

    // store list
    return(
      <AdItemList item={item} index={index} itemListOnPress={this._goAdStore.bind(this, item)} />
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
    action(() => {
      store.setStoreData(item);
    })();

    // hide tutorial go store
    if (this.props.that) {
      this.props.that.setState({
        show_go_store: false
      });
    }

    Actions.stores({
      title: item.name,
      goCategory: category_id
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
          onScroll={(event) => {
            var scrollTop = event.nativeEvent.contentOffset.y;
            this.setState({ scrollTop });
          }}
          ref={ref => this.refs_home = ref}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
          {(this.state.promotions && this.state.promotions.length > 0) && (
              <Swiper
                width={Util.size.width}
                height={(Util.size.width) * (160/320)}
                autoplayTimeout={3}
                showsPagination={true}
                horizontal
                autoplay>
                {this.state.promotions.map((banner, i) => {
                  return(
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
                        source={{uri: banner.banner}}
                        style={{
                          width: Util.size.width,
                          height: (Util.size.width) * (160/320)
                        }} />
                        </TouchableHighlight>
                    </View>
                  );
                })}
              </Swiper>
            )}

          {(<View>
              <View style={styles.add_store_actions_box}>
                <TouchableHighlight
                  onPress={() => {Communications.phonecall(this.state.store_data.tel, true)}}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={styles.add_store_action_btn_box}>
                    <Icon name="phone" size={20} color="#333333" />
                    <Text style={styles.add_store_action_label}>Gọi {this.state.store_data?this.state.store_data.name:""}</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={this._goChat.bind(this, this.state.store_data)}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={styles.add_store_action_btn_box}>
                    <Icon name="comments" size={20} color="#333333" />
                    <Text style={styles.add_store_action_label}>Chat {this.state.store_data?this.state.store_data.name:""}</Text>
                    {count_chat > 0 && <View style={[styles.stores_info_action_notify, styles.stores_info_action_notify_chat]}>
              <Text style={styles.stores_info_action_notify_value}>{count_chat}</Text></View>}
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={this._goStores.bind(this, this.state.store_data)}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={[styles.add_store_action_btn_box, {borderRightWidth: 0}]}>
                    <Icon name="shopping-cart" size={20} color="#333333" />
                    <Text style={styles.add_store_action_label}>Vào Cửa hàng</Text>
                    {store_data && store_data.count_cart > 0 && <View style={styles.stores_info_action_notify}>
                <Text style={styles.stores_info_action_notify_value}>{store_data.count_cart}</Text></View>}
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          )}

          {products && (
            <View style={{
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderBottomWidth: Util.pixel,
              borderColor: "#dddddd",
              marginTop: 4,
              flexDirection: 'row'
            }}>
              <Text style={styles.add_store_title}>{title_products}</Text>

              {(
                <View style={styles.right_title_btn_box}>
                  <TouchableHighlight
                    style={styles.right_title_btn}
                    underlayColor="transparent"
                    onPress={this._goStores.bind(this, this.state.store_data)}
                    >
                    <Text style={[styles.add_store_title, {color: "#fa7f50"}]}>XEM TẤT CẢ</Text>
                  </TouchableHighlight>
                </View>
              )}
            </View>
          )}

          {products && (
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}>
              {products.map((item, index) => (
                <Items
                  key={index}
                  item={item}
                  index={index}
                  onPress={this._goItem.bind(this, item)}
                  />
              ))}
            </View>
          )}
          <View style={styles.boxButtonActions}>
            <TouchableHighlight
                style={styles.buttonAction}
                onPress={this._goStores.bind(this, this.state.store_data)}
                underlayColor="transparent">
                <View style={[styles.boxButtonAction, {
                  width: Util.size.width - 30,
                  backgroundColor: "#fa7f50",
                  borderColor: "#999999"
                }]}>
                  <Icon name="plus" size={16} color="#ffffff" />
                  <Text style={[styles.buttonActionTitle, {
                    color: "#ffffff"
                  }]}>Vào cửa hàng {this.state.store_data?this.state.store_data.name:""}</Text>
                </View>
            </TouchableHighlight>
          </View>

          {like_products && (<View style={styles.lineView}/>)}
          {like_products && (
            <View style={{
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderBottomWidth: Util.pixel,
              borderColor: "#dddddd",
              marginTop: 4,
              flexDirection: 'row'
            }}>
              <Text style={styles.add_store_title}>{title_like_products}</Text>

              {(
                <View style={styles.right_title_btn_box}>
                  <TouchableHighlight
                    style={styles.right_title_btn}
                    underlayColor="transparent"
                    onPress={this._goStores.bind(this, this.state.store_data, 1)}
                    >
                    <Text style={[styles.add_store_title, {color: "#fa7f50"}]}>XEM TẤT CẢ</Text>
                  </TouchableHighlight>
                </View>
              )}
            </View>
          )}
          {like_products && (
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}>
              {like_products.map((item, index) => (
                <Items
                  key={index}
                  item={item}
                  index={index}
                  onPress={this._goItem.bind(this, item)}
                  />
              ))}
            </View>
          )}

          {categorie_products && (<View style={styles.lineView}/>)}
          {categorie_products && (
            <View style={{
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderBottomWidth: Util.pixel,
              borderColor: "#dddddd",
              marginTop: 4,
              alignItems: "center"
            }}>
              <Text style={styles.add_store_title}>DANH MỤC SẢN PHẨM</Text>
            </View>
          )}
          {categorie_products && (
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}>
              {categorie_products.map((item, index) => (
                <Items
                  key={index}
                  item={item}
                  index={index}
                  isCategories={true}
                  onPress={this._goStores.bind(this, this.state.store_data, item.id)}
                  />
              ))}
            </View>
          )}

          {hot_products && (<View style={styles.lineView}/>)}
          {hot_products && (
            <View style={{
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderBottomWidth: Util.pixel,
              borderColor: "#dddddd",
              marginTop: 4,
              flexDirection: 'row'
            }}>
              <Text style={styles.add_store_title}>{title_hot_products}</Text>

              {(
                <View style={styles.right_title_btn_box}>
                  <TouchableHighlight
                    style={styles.right_title_btn}
                    underlayColor="transparent"
                    onPress={this._goStores.bind(this, this.state.store_data,2)}
                    >
                    <Text style={[styles.add_store_title, {color: "#fa7f50"}]}>XEM TẤT CẢ</Text>
                  </TouchableHighlight>
                </View>
              )}
            </View>
          )}
          {hot_products && (
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}>
              {hot_products.map((item, index) => (
                <Items
                  key={index}
                  item={item}
                  index={index}
                  onPress={this._goItem.bind(this, item)}
                  />
              ))}
            </View>
          )}
          
          {stores_data && (
            <View>
              <View style={styles.myFavoriteBox}>
                <Text style={styles.add_store_title}>CỬA HÀNG LIÊN KẾT</Text>
              </View>
              <FlatList
                style={styles.stores_box}
                onEndReached={(num) => {

                }}
                onEndReachedThreshold={0}
                data={stores_data}
                renderItem={({item, index}) => this.renderRow({item, index}, false)}
                keyExtractor={item => item.id}
              />
            </View>
          )}

          {farm_newses_data && (<View style={styles.lineView}/>)}
          {farm_newses_data != null && (
            <View style={{
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderBottomWidth: Util.pixel,
              borderColor: "#dddddd",
              marginTop: 4,
              flexDirection: 'row'
            }}>
            <Text style={styles.add_store_title}>{title_farm_newses_data}</Text>

              <View style={styles.right_title_btn_box}>
                <TouchableHighlight
                  style={styles.right_title_btn}
                  underlayColor="transparent"
                  onPress={() => {
                    Actions.notifys_farm({
                      isNotifysTime: farm_newses_type == 1?false:true,
                      title: title_farm_newses_data,
                      news_type: "/" + farm_newses_type
                    });
                  }}>
                  <Text style={[styles.add_store_title, {color: DEFAULT_COLOR}]}>XEM TẤT CẢ</Text>
                </TouchableHighlight>
              </View>
          </View>
          )}
          {farm_newses_data && (
            <FlatList
              data={farm_newses_data}
              renderItem={({item, index}) => {
                if (index == 0) {
                  this.defaultNewBoxHeight = 0;
                }

                this.defaultNewBoxHeight += (isIOS ? 116 : 124);

                return(
                  <NewItemComponent
                    item={item} />
                );
              }}
              keyExtractor={item => item.id}
            />
          )}

          {newses_data && (<View style={styles.lineView}/>)}
          {newses_data != null && (
            <View style={{
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderBottomWidth: Util.pixel,
              borderColor: "#dddddd",
              marginTop: 4,
              flexDirection: 'row'
            }}>
            <Text style={styles.add_store_title}>{title_newses_data}</Text>

              <View style={styles.right_title_btn_box}>
                <TouchableHighlight
                  style={styles.right_title_btn}
                  underlayColor="transparent"
                  onPress={() => {
                    Actions.notifys_time({
                      isNotifysTime: newses_type == 1?false:true,
                      title: title_newses_data,
                      news_type: "/"+newses_type
                    });
                  }}>
                  <Text style={[styles.add_store_title, {color: DEFAULT_COLOR}]}>XEM TẤT CẢ</Text>
                </TouchableHighlight>
              </View>
          </View>
          )}
          {newses_data && (
            <FlatList
              data={newses_data}
              renderItem={({item, index}) => {
                if (index == 0) {
                  this.defaultNewBoxHeight = 0;
                }

                this.defaultNewBoxHeight += (isIOS ? 116 : 124);

                return(
                  <NewItemComponent
                    item={item} />
                );
              }}
              keyExtractor={item => item.id}
            />
          )}

          <View style={styles.right_title_btn_box}>
            <Text> </Text>
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
    backgroundColor: "#ffffff",
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd",
    marginBottom: 4
  },

  container: {
    flex: 1,
    marginBottom: BAR_HEIGHT,
    backgroundColor: BGR_SCREEN_COLOR
  },
  stores_box: {
    marginBottom: 8,
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd"
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
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20
  },
  add_store_actions_box: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  add_store_action_btn: {
    paddingVertical: 4
  },
  add_store_action_btn_box: {
    alignItems: 'center',
    // width: ~~((Util.size.width - 16) / 2),
    width: ~~(Util.size.width / 3),
    borderRightWidth: Util.pixel,
    borderRightColor: '#ebebeb'
  },
  add_store_action_label: {
    fontSize: 12,
    color: '#404040',
    marginTop: 4
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
