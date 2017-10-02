/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  RefreshControl
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Button } from '../../lib/react-native-elements';
import store from '../../store/Store';

// components
import Items from './Items';
import ListHeader from './ListHeader';
import CartFooter from '../cart/CartFooter';
import PopupConfirm from '../PopupConfirm';
import RightButtonChat from '../RightButtonChat';
import RightButtonOrders from '../RightButtonOrders';

const STORE_CATEGORY_KEY = 'KeyStoreCategory';
const STORE_KEY = 'KeyStore';

@observer
export default class Stores extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      category_nav_index: 0,
      categories_data: null
    }

    action(() => {
      store.setStoresFinish(false);
    })();
  }

  componentDidMount() {

    var title = `Tìm kiếm tại ${this.props.title}`;

    Actions.refresh({
      showSearchBar: true,
      smallSearch: true,
      placeholder: title,
      searchOnpress: () => {
        return Actions.search({
          title
        });
      },
      renderRightButton: this._renderRightButton.bind(this),
      onBack: () => {
        this._unMount();
        Actions.pop();
      }
    });

    store.pushBack = this._unMount.bind(this);

    this.start_time = time();

    // get categories navigator
    this._getCategoriesNav();

    // callback when unmount this sreen
    store.setStoreUnMount('stores', this._unMount.bind(this));

    // notify chat
    store.getNoitifyChat();
  }

  _unMount() {

  }

  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 400 - (Math.abs(time() - this.start_time));
    return delay;
  }

  // lấy thông tin cửa hàng
  _getCategoriesNav() {
    var store_key = STORE_KEY + store.store_id + store.user_info.id;

    // load
    storage.load({
      key: store_key,
      autoSync: true,
      syncInBackground: true,
      syncParams: {
        extraFetchOptions: {
        },
        someFlag: true,
      },
    }).then(data => {
      setTimeout(() => {
        this.setState({
          categories_data: data,
        });
      }, this._delay());
    }).catch(err => {
      this._getCategoriesNavFromServer();
    });
  }

  async _getCategoriesNavFromServer() {
    var store_key = STORE_KEY + store.store_id + store.user_info.id;

    try {
      var response = await APIHandler.site_info(store.store_id);

      if (response && response.status == STATUS_SUCCESS) {

        setTimeout(() => {
          this.setState({
            categories_data: [{id: 0, name: "Tất cả"}, ...response.data.categories],
          }, () => {
            // cache in five minutes
            storage.save({
              key: store_key,
              data: this.state.categories_data,
              expires: STORE_CACHE
            });
          });
        }, this._delay());
      }

    } catch (e) {
      console.warn(e + ' site_info');

      return Alert.alert(
        'Thông báo',
        'Kết nối mạng bị lỗi',
        [
          {text: 'Thử lại', onPress: () => {
            this._getCategoriesNavFromServer();
          }},
        ],
        { cancelable: false }
      );
    } finally {

    }
  }

  _renderRightButton() {
    return(
      <View style={styles.right_btn_box}>
        <RightButtonOrders
          tel={store.store_data.tel}
         />
        <RightButtonChat
          tel={store.store_data.tel}
         />
      </View>
    );
  }

  _changeCategory(item, index, nav_only) {
    if (this.refs_category_nav) {

      var categories_count = this.state.categories_data.length;
      var end_of_list = (categories_count - index - 1) >= 3;

      // nav
      if (index > 0 && end_of_list) {
        this.refs_category_nav.scrollToIndex({index: index - 1, animated: true});
      } else if (!end_of_list) {
        this.refs_category_nav.scrollToEnd();
      } else if (index == 0) {
        this.refs_category_nav.scrollToIndex({index, animated: true});
      }

      // content
      if (this.refs_category_screen && !nav_only) {
        this.refs_category_screen.scrollToIndex({index: index, animated: true});
      }

      this.setState({
        category_nav_index: index
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.categories_nav}>
          {this.state.categories_data != null ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ref={ref => this.refs_category_nav = ref}
              data={this.state.categories_data}
              extraData={this.state.category_nav_index}
              keyExtractor={item => item.id}
              horizontal={true}
              style={styles.categories_nav}
              renderItem={({item, index}) => {
                let active = this.state.category_nav_index == index;
                return(
                  <TouchableHighlight
                    onPress={() => this._changeCategory(item, index)}
                    underlayColor="transparent">
                    <View style={styles.categories_nav_items}>
                      <Text style={[styles.categories_nav_items_title, active ? styles.categories_nav_items_title_active : null]}>{item.name}</Text>

                      {active && <View style={styles.categories_nav_items_active} />}
                    </View>
                  </TouchableHighlight>
                );
              }}
            />
          ) : (
            <Indicator size="small" />
          )}
        </View>

        {//this._renderItemsContent.call(this)
        }

        {this.state.categories_data != null ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ref={ref => this.refs_category_screen = ref}
            data={this.state.categories_data}
            extraData={this.state.category_nav_index}
            keyExtractor={item => item.id}
            horizontal={true}
            pagingEnabled
            onMomentumScrollEnd={this._onScrollEnd.bind(this)}
            style={{
              backgroundColor: BGR_SCREEN_COLOR,
              width: Util.size.width
            }}
            getItemLayout={(data, index) => {
              return {length: Util.size.width, offset: Util.size.width * index, index};
            }}
            renderItem={({item, index}) => <CategoryScreen item={item} index={index} cate_index={this.state.category_nav_index} that={this} />}
          />
        ) : (
          <Indicator />
        )}


        {store.stores_finish == true && (
          <CartFooter
            perfix="stores"
            confirmRemove={this._confirmRemoveCartItem.bind(this)}
           />
        )}

        <PopupConfirm
          ref_popup={ref => this.refs_modal_delete_cart_item = ref}
          title="Bạn muốn bỏ sản phẩm này khỏi giỏ hàng?"
          height={110}
          noConfirm={this._closePopup.bind(this)}
          yesConfirm={this._removeCartItem.bind(this)}
          otherClose={false}
          />
      </View>
    );
  }

  _onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);

    this._changeCategory(null, pageNum, true);
  }

  _confirmRemoveCartItem(item) {
    this.cartItemConfirmRemove = item;

    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.open();
    }
  }

  _closePopup() {
    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.close();
    }
  }

  async _removeCartItem() {
    if (!this.cartItemConfirmRemove) {
      return;
    }

    this._closePopup();

    var item = this.cartItemConfirmRemove;

    try {
      var response = await APIHandler.site_cart_remove(store.store_id, item.id);

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          action(() => {
            store.setCartData(response.data);
            // prev item in list
            if (isAndroid && store.cart_item_index > 0) {
              var index = store.cart_item_index - 1;
              store.setCartItemIndex(index);
              Events.trigger(NEXT_PREV_CART, {index});
            }
          })();
        }, 450);
      }

      this.cartItemConfirmRemove = undefined;
    } catch (e) {
      console.warn(e + ' site_cart_remove');

      return Alert.alert(
        'Thông báo',
        'Kết nối mạng bị lỗi',
        [
          {text: 'Thử lại', onPress: () => {
            this._removeCartItem();
          }},
        ],
        { cancelable: false }
      );
    } finally {

    }
  }
}


class CategoryScreen extends Component {
  constructor(props) {
    super(props);

    var {item, index} = props;

    if (item.id == 0) {
      var header_title = `— Tất cả —`;
    } else {
      var header_title = `— Sản phẩm ${item.name} —`;
    }

    this.state = {
      loading: false,
      refreshing: false,
      header_title,
      items_data: null,
      items_data_bak: null,
      page: 0
    }
  }

  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 400 - (Math.abs(time() - this.start_time));
    return delay;
  }

  componentDidMount() {
    var {item, index, cate_index} = this.props;
    this.start_time = 0;

    setTimeout(() => {
      // get list products by category_id
      this._getItemByCateId(item.id);
    }, index * 1000);
  }

  componentWillReceiveProps(nextProps) {
    var {item, index, cate_index} = nextProps;

    if (index == cate_index && this.state.items_data == null && this.props != nextProps) {
      this.start_time = time();
      // get list products by category_id
      this._getItemByCateId(item.id);
    }
  }

  // tới màn hình chi tiết item
  _goItem(item) {

    Actions.item({
      title: item.name,
      item
    });
  }

  _onRefresh() {
    this.setState({
      refreshing: true,
      page: 0
    }, () => {
      this._getItemByCateIdFromServer(this.props.item.id, 1000);
    });
  }

  // lấy d/s sản phẩm theo category_id
  _getItemByCateId(category_id) {
    var store_category_key = STORE_CATEGORY_KEY + store.store_id + category_id + store.user_info.id;

    this.setState({
      loading: this.state.items_data ? false : true
    }, () => {
      // load
      storage.load({
      	key: store_category_key,
      	autoSync: true,
      	syncInBackground: true,
      	syncParams: {
      	  extraFetchOptions: {
      	  },
      	  someFlag: true,
      	},
      }).then(data => {
        // delay append data
        setTimeout(() => {
          layoutAnimation();

          this.setState({
            items_data: data.length > STORES_LOAD_MORE ? [...data, {id: -1, type: 'loadmore'}] : data,
            items_data_bak: data,
            loading: false,
            refreshing: false,
            page: 1
          });

          action(() => {
            store.setStoresFinish(true);
          })();

        }, this._delay());
      }).catch(err => {
        this._getItemByCateIdFromServer(category_id);
      });
    });
  }

  async _getItemByCateIdFromServer(category_id, delay, loadmore) {
    var store_category_key = STORE_CATEGORY_KEY + store.store_id + category_id + store.user_info.id;

    try {
      var response = await APIHandler.site_category_product(store.store_id, category_id, this.state.page);

      if (response && response.status == STATUS_SUCCESS) {
        if (response.data) {
          if (loadmore) {
              this.state.page += 1;
          } else {
            this.state.page = 1;
          }

          // delay append data
          setTimeout(() => {
            layoutAnimation();

            var items_data = loadmore ? [...this.state.items_data_bak, ...response.data] : response.data;
            this.setState({
              items_data: response.data.length >= STORES_LOAD_MORE ? [...items_data, {id: -1, type: 'loadmore'}] : items_data,
              items_data_bak: items_data,
              loading: false,
              refreshing: false,
              page: this.state.page
            });

            action(() => {
              store.setStoresFinish(true);
            })();

            // cache in five minutes
            if (response.data && !loadmore) {
              storage.save({
                key: store_category_key,
                data: items_data,
                expires: STORE_CATEGORY_CACHE
              });
            }
          }, delay || this._delay());

        } else {
          this.setState({
            loading: false,
            refreshing: false,
            items_data: this.state.items_data_bak
          });
        }
      }

    } catch (e) {
      console.warn(e + ' site_category_product');

      return Alert.alert(
        'Thông báo',
        'Kết nối mạng bị lỗi',
        [
          {text: 'Thử lại', onPress: () => {
            this._getItemByCateIdFromServer(category_id, delay, loadmore);
          }},
        ],
        { cancelable: false }
      );
    }
  }

  _loadMore() {
    this._getItemByCateIdFromServer(this.props.item.id, 0, true);
  }

  render() {
    // show loading
    if (this.state.loading) {
      return(
        <View style={styles.containerScreen}>
          <Indicator />
        </View>
      );
    }

    var {items_data, header_title} = this.state;

    // show products
    if (items_data) {
      return(
        <View style={styles.containerScreen}>
          <FlatList
            style={[styles.items_box]}
            ListHeaderComponent={() => <ListHeader title={header_title} />}
            data={items_data}
            extraData={items_data}
            renderItem={({item, index}) => (
              <Items
                item={item}
                index={index}
                onPress={item.type != 'loadmore' ? this._goItem.bind(this, item) : this._loadMore.bind(this)}
                />
            )}
            keyExtractor={item => item.id}
            numColumns={2}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          />
        </View>
      );
    } else {
      // no data
      return(
        <View style={styles.containerScreen}>
          <CenterText title="Chưa có mặt hàng nào :(" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  containerScreen: {
    width: Util.size.width,
    flex: 1
  },

  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0
  },
  right_btn_box: {
    flexDirection: 'row'
  },

  items_box: {
    width: Util.size.width
  },

  categories_nav: {
    backgroundColor: '#ffffff',
    height: 40,
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd"
  },
  categories_nav_items: {
    justifyContent: 'center',
    height: '100%'
  },
  categories_nav_items_title: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#666666'
  },
  categories_nav_items_title_active: {
    color: DEFAULT_COLOR
  },
  categories_nav_items_active: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: DEFAULT_COLOR
  }
});
