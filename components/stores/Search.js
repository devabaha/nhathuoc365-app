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
export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      loading: true,
      header_title: "— Tất cả sản phẩm —",
      search_data: null,
      store_data: props.store_data,
      search_value: ''
    }
  }

  componentWillMount() {
    Actions.refresh({
      showSearchBar: true,
      searchValue: '',
      placeholder: this.props.title,
      autoFocus: true,
      inputAnimate: true,
      onFocus: () => {

      },
      onChangeText: (text) => {
        Actions.refresh({
          searchValue: text
        });

        this.setState({
          search_value: text
        });
      },
      cancelIsPop: true
    });
  }

  componentDidMount() {

  }

  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 450 - (Math.abs(time() - this.start_time));
    return delay;
  }

  async _getItemByCateIdFromServer(category_id, delay) {

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

          // animate true
          layoutAnimation();

        }, delay || this._delay());

      }

    } catch (e) {
      console.warn(e);
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

    // show products
    if (this.state.items_data) {

      return(
        <FlatList
          onEndReached={(num) => {

          }}
          onEndReachedThreshold={0}
          style={[styles.items_box]}
          ListHeaderComponent={() => <ListHeader title={this.state.header_title} />}
          data={this.state.items_data}
          renderItem={({item, index}) => (
            <Items
              item={item}
              index={index}
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
    marginBottom: 69
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
