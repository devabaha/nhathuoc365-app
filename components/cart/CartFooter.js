/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  FlatList,
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Button } from '../../lib/react-native-elements';
import { reaction } from 'mobx';

import store from '../../store/Store';

@observer
export default class CartFooter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      loading: true
    }

    reaction(() => store.cart_item_index, () => {
      this._goTopIndex(store.cart_item_index);
    });
  }

  componentDidMount() {
    var {cart_data, cart_products, site_id} = store;

    if (cart_data == null || cart_products == null || store.store_id != site_id) {
      this._getCart();
    }
  }

  async _getCart() {
    try {
      var response = await APIHandler.site_cart(store.store_id);

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setCartData(response.data);
        })();

      } else {
        action(() => {
          store.resetCartData();
        })();

      }

    } catch (e) {
      console.warn(e);
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  _item_qnt_decrement_handler(item) {

    if (item.quantity <= 1) {
      if (this.props.confirmRemove) {
        this.props.confirmRemove(item);
      }
    } else {
      this._item_qnt_decrement(item);
    }
  }

  async _item_qnt_decrement(item) {

    try {
      var response = await APIHandler.site_cart_down(store.store_id, item.id);

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setCartData(response.data);
        })();

      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  async _item_qnt_increment(item) {
    try {
      var response = await APIHandler.site_cart_up(store.store_id, item.id);

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setCartData(response.data);
        })();

      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  _store_cart_prev() {
    if (store.cart_item_index <= 0) {
      return;
    }

    store.setCartItemIndex(store.cart_item_index - 1);
  }

  _store_cart_next() {
    if (store.cart_item_index + 1 >= store.cart_products.length) {
      return;
    }

    store.setCartItemIndex(store.cart_item_index + 1);
  }

  _goTopIndex(index) {
    if (store.cart_products && store.cart_products.length == 0) {
      return;
    }
    if ((index + 1) >= store.cart_products.length) {
      index = 0;
    }
    if (this.refs_store_cart) {
        this.refs_store_cart.scrollToIndex({index, animated: true});
    }
  }

  renderItems({item}) {
    return(
      <View style={styles.store_cart_item}>
        <View style={styles.store_cart_item_image_box}>
          <Image style={styles.store_cart_item_image} source={{uri: item.image}} />
        </View>
        <View style={styles.store_cart_item_title_box}>
          <Text style={styles.store_cart_item_title}>{item.name}</Text>
          <Text style={styles.store_cart_item_price}>{item.price_view}</Text>
        </View>

        <View style={styles.store_cart_calculator}>
          <TouchableHighlight
            onPress={this._item_qnt_decrement_handler.bind(this, item)}
            underlayColor="transparent"
            style={styles.store_cart_item_qnt_change}>
            <Icon name="minus" size={16} color="#404040" />
          </TouchableHighlight>

          <Text style={styles.store_cart_item_qnt}>{item.quantity_view}</Text>

          <TouchableHighlight
            onPress={this._item_qnt_increment.bind(this, item)}
            underlayColor="transparent"
            style={styles.store_cart_item_qnt_change}>
            <Icon name="plus" size={16} color="#404040" />
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  _renderContent() {
    if (this.state.loading) {
      return(
        <View style={styles.store_cart_container}>
          <Indicator size="small" />
        </View>
      );
    }

    var {cart_data, cart_products} = store;
    var isset_cart = !(cart_data == null || cart_products == null);

    if (isset_cart) {
      return(
        <View style={styles.store_cart_container}>
          <View style={styles.store_cart_content}>
            <FlatList
              ref={ref => this.refs_store_cart = ref}
              data={cart_products}
              pagingEnabled
              scrollEnabled={false}
              extraData={cart_products}
              initialScrollIndex={store.cart_item_index}
              getItemLayout={(data, index) => {
                return {length: Util.size.width - 172, offset: (Util.size.width - 172) * index, index};
              }}
              renderItem={this.renderItems.bind(this)}
              keyExtractor={item => item.id}
              horizontal={true}
            />
          </View>

          <TouchableHighlight
            style={[styles.store_cart_btn, styles.store_cart_btn_left]}
            underlayColor="#f1efef"
            onPress={this._store_cart_prev.bind(this)}>
            <Icon name="chevron-left" size={24} color="#333333" />
          </TouchableHighlight>

          <TouchableHighlight
            style={[styles.store_cart_btn, styles.store_cart_btn_right]}
            underlayColor="#f1efef"
            onPress={this._store_cart_next.bind(this)}>
            <Icon name="chevron-right" size={24} color="#333333" />
          </TouchableHighlight>
        </View>
      );
    } else {
      return(
        <View style={styles.store_cart_container}>
          <CenterText
            marginTop={-8}
            title={"Giỏ hàng trống\nHãy Chọn mua mặt hàng ngay nào!"}
            />
        </View>
      );
    }
  }

  render() {
    var {cart_data, cart_products} = store;
    var isset_cart = !(cart_data == null || cart_products == null);

    return (
      <View style={styles.store_cart_box}>
        {this._renderContent.call(this)}

        <TouchableHighlight
          onPress={() => Actions.cart({
            ...this.props.goCartProps
          })}
          style={styles.checkout_btn}
          underlayColor="transparent"
          >
          <View style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: DEFAULT_COLOR
          }}>
            <View style={styles.checkout_box}>
              <Icon name="shopping-cart" size={22} color="#ffffff" />
              <Text style={styles.checkout_title}>{isset_cart ? "ĐẶT HÀNG" : "GIỎ HÀNG"}</Text>

              {isset_cart && (
                <View style={{
                  position: 'absolute',
                  left: 18,
                  top: 0,
                  backgroundColor: "red",
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  paddingHorizontal: 2
                }}>
                  <Text style={{
                    fontSize: 10,
                    color: '#ffffff',
                    fontWeight: '600'
                  }}>{cart_data.count}</Text>
                </View>
              )}
            </View>

            {isset_cart && (
              <Text style={{
                fontSize: 10,
                color: "#ffffff",
                fontWeight: '500'
              }}>{cart_data.total}</Text>
            )}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  store_cart_box: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 69,
    backgroundColor: '#ffffff',
    borderTopWidth: Util.pixel,
    borderTopColor: '#dddddd',
    flexDirection: 'row'
  },
  store_cart_container: {
    width: Util.size.width - 100,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  store_cart_btn: {
    height: '100%',
    width: 36,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0
  },
  store_cart_btn_left: {
    left: 0
  },
  store_cart_btn_right: {
    right: 0
  },
  checkout_btn: {
    width: 100,
    height: '100%',
  },
  checkout_box: {
    width: '100%',
    height: '56%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  checkout_title: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: '500',
    paddingLeft: 4
  },
  store_cart_content: {
    width: Util.size.width - 172,
    height: '100%'
  },
  store_cart_item: {
    width: Util.size.width - 172,
    height: '100%',
    flexDirection: 'row'
  },
  store_cart_item_image_box: {
    width: 60,
    height: 60,
    marginTop: 4,
    overflow: 'hidden',
    marginHorizontal: 4
  },
  store_cart_item_image: {
    height: '100%',
    resizeMode: 'cover'
  },
  store_cart_item_title_box: {
    flex: 1
  },
  store_cart_item_title: {
    color: "#404040",
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500'
  },
  store_cart_item_price: {
    fontSize: 10,
    color: '#fa7f50'
  },
  store_cart_calculator: {
    position: 'absolute',
    height: '50%',
    bottom: 0,
    right: 0,
    width: Util.size.width - 232,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  store_cart_item_qnt_change: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Util.pixel,
    borderColor: '#404040',
    borderRadius: 3
  },
  store_cart_item_qnt: {
    fontWeight: '600',
    color: "#404040",
    fontSize: 16,
    paddingHorizontal: 16
  }
});
