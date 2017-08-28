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

const STORE_CATEGORY_KEY = 'KeyStoreCategory';
const STORE_KEY = 'KeyStore';

@observer
export default class Stores extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      loading: true,
      category_nav_index: 0,
      category_nav_id: 0,
      items_data: null,
      categories_data: null,
      header_title: "— Tất cả sản phẩm —",
      store_data: props.store_data,
      buying_idx: []
    }
  }

  componentDidMount() {

    var title = `Tìm kiếm tại ${this.props.title}`;

    Actions.refresh({
      showSearchBar: true,
      placeholder: title,
      searchOnpress: () => {
        return Actions.search({
          title,
          store_data: this.state.store_data
        });
      },
      renderRightButton: this._renderRightButton.bind(this)
    });

    this.start_time = time();

    this._getCategoriesNav();

    this._getItemByCateId(this.state.category_nav_id);

  }

  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 450 - (Math.abs(time() - this.start_time));
    return delay;
  }

  // lấy thông tin cửa hàng
  _getCategoriesNav() {
    var store_key = STORE_KEY + store.store_id;

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
    var store_key = STORE_KEY + store.store_id;

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
      console.warn(e);
    } finally {

    }
  }

  // lấy d/s sản phẩm theo category_id
  _getItemByCateId(category_id) {
    var store_category_key = STORE_CATEGORY_KEY + store.store_id + category_id;

    this.setState({
      loading: true,
      items_data: null
    });

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
        this.setState({
          items_data: data,
          loading: false,
          finish: true,
          refreshing: false
        });

        // animate true
        layoutAnimation();

      }, this._delay());
    }).catch(err => {
      this._getItemByCateIdFromServer(category_id);
    });
  }

  async _getItemByCateIdFromServer(category_id, delay) {
    var store_category_key = STORE_CATEGORY_KEY + store.store_id + category_id;

    this.setState({
      loading: true,
      items_data: null
    });

    try {
      var response = await APIHandler.site_category_product(store.store_id, category_id);

      if (response && response.status == STATUS_SUCCESS) {

        // delay append data
        setTimeout(() => {
          this.setState({
            items_data: response.data,
            loading: false,
            finish: true,
            refreshing: false
          });

          // cache in five minutes
          storage.save({
            key: store_category_key,
            data: response.data,
            expires: STORE_CATEGORY_CACHE
          });

          // animate true
          layoutAnimation();

        }, delay || this._delay());

      }

    } catch (e) {
      console.warn(e);
    }
  }

  _renderRightButton() {
    var {store_data} = this.state;

    return(
      <View style={styles.right_btn_box}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
            Actions.chat({
              title: store_data.name,
              store_id: store_data.id
            });
          }}>
          <View style={styles.right_btn_add_store}>
            <Icon name="commenting" size={20} color="#ffffff" />
            {store_data && store_data.count_chat > 0 && (
              <View style={styles.stores_info_action_notify}>
                <Text style={styles.stores_info_action_notify_value}>{store_data.count_chat}</Text>
              </View>
            )}
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._getItemByCateIdFromServer(this.state.category_nav_id, 1000);
  }

  _changeCategory(item, index) {
    if (this.refs_category_nav) {

      this._getItemByCateId(item.id);

      var categories_count = this.state.categories_data.length;
      var end_of_list = (categories_count - index - 1) >= 3;

      if (index > 0 && end_of_list) {
          this.refs_category_nav.scrollToIndex({index: index - 1, animated: true});
      } else if (!end_of_list) {
        this.refs_category_nav.scrollToEnd();
      }

      if (item.id == 0) {
        var header_title = "— Tất cả sản phẩm —";
      } else {
        var header_title = `— Sản phẩm ${item.name} —`;
      }

      this.setState({
        category_nav_index: index,
        category_nav_id: item.id,
        header_title
      });
      layoutAnimation();
    }
  }

  // tới màn hình chi tiết item
  _goItem(item) {

    Actions.item({
      title: item.name,
      item,
      store_data: this.state.store_data
    });
  }

  // add item vào giỏ hàng
  async _addCart(item) {
    var id_index = this.state.buying_idx.indexOf(item.id);
    if (id_index == -1) {
      this.state.buying_idx.push(item.id);
      this.setState({
        buying_idx: this.state.buying_idx
      });
    }

    try {
      var response = await APIHandler.site_cart_adding(store.store_id, item.id);

      if (response && response.status == STATUS_SUCCESS) {

        action(() => {
          store.setCartData(response.data);

          var index = null;
          if (response.data.products) {
            Object.keys(response.data.products).reverse().some((key, key_index) => {
              let value = response.data.products[key];
              if (value.id == item.id) {
                index = key_index;
                return true;
              }
            });
          }

          if (index !== null) {
            setTimeout(() => {
              store.setCartItemIndex(index);

              id_index = this.state.buying_idx.indexOf(item.id);
              if (id_index != -1) {
                this.state.buying_idx.splice(id_index, 1);
                this.setState({
                  buying_idx: this.state.buying_idx
                });
              }
            }, 250);
          }
        })();

      }

    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  // render danh sách sản phẩm
  _renderItemsContent() {
    var {cart_data, cart_products} = store;

    // show loading
    if (this.state.loading) {
      return <Indicator />
    }

    var {items_data, buying_idx, header_title} = this.state;

    // show products
    if (items_data, buying_idx) {

      return(
        <FlatList
          onEndReached={(num) => {

          }}
          onEndReachedThreshold={0}
          style={[styles.items_box]}
          ListHeaderComponent={() => <ListHeader title={header_title} />}
          data={items_data}
          extraData={this.state}
          renderItem={({item, index}) => (
            <Items
              item={item}
              index={index}
              buying_idx={buying_idx}
              onPress={this._goItem.bind(this, item)}
              cartOnPress={this._addCart.bind(this, item)}
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
      );
    } else {
      // no data
      return(
        <CenterText title="Chưa có sản phẩm nào" />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.categories_nav}>
          {this.state.categories_data != null ? (
            <FlatList
              ref={ref => this.refs_category_nav = ref}
              data={this.state.categories_data}
              extraData={this.state}
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

        {this._renderItemsContent.call(this)}

        {this.state.finish == true && <CartFooter
          goCartProps={{
            title: this.state.store_data.name,
            store_data: this.state.store_data
          }}
          confirmRemove={this._confirmRemoveCartItem.bind(this)}
         />}

        <PopupConfirm
          ref_popup={ref => this.refs_modal_delete_cart_item = ref}
          title="Bạn muốn bỏ sản phẩm này khỏi giỏ hàng?"
          height={110}
          noConfirm={() => {
            if (this.refs_modal_delete_cart_item) {
              this.refs_modal_delete_cart_item.close();
            }
          }}
          yesConfirm={this._removeCartItem.bind(this)}
          otherClose={false}
          />
      </View>
    );
  }

  _confirmRemoveCartItem(item) {
    this.cartItemConfirmRemove = item;

    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.open();
    }
  }

  async _removeCartItem() {
    if (!this.cartItemConfirmRemove) {
      return;
    }

    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.close();
    }

    var item = this.cartItemConfirmRemove;

    try {
      var response = await APIHandler.site_cart_remove(store.store_id, item.id);

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setCartData(response.data);
          // prev item in list
          if (isAndroid && store.cart_item_index > 0) {
            store.setCartItemIndex(store.cart_item_index - 1);
          }
        })();

      }
    } catch (e) {
      console.warn(e);
    } finally {
      this.cartItemConfirmRemove = undefined;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0
  },
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    paddingTop: isAndroid ? 4 : 0
  },
  right_btn_box: {
    flexDirection: 'row'
  },
  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    height: 16,
    backgroundColor: 'red',
    top: isAndroid ? 0 : -4,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 2
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  },

  items_box: {

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
