/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  Alert
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
      loading: true,
      increment_loading: false,
      decrement_loading: false,
      perfix: props.perfix || ''
    }
  }

  componentDidMount() {
    var {cart_data, cart_products, store_id} = store;

    var is_change_store = store.cart_store_id != store_id;
    if (is_change_store) {
      store.cart_store_id = store_id;
    }

    if (cart_data == null || cart_products == null || is_change_store) {
      this._getCart();
    } else {
      this.setState({
        loading: false
      });
    }

    Events.on(NEXT_PREV_CART, NEXT_PREV_CART + this.state.perfix, (data) => {
      this._goTopIndex(data.index);
    });
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
      console.warn(e + ' site_cart');

      store.addApiQueue('site_cart', this._getCart.bind(this));
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

  _item_qnt_decrement(item) {
    this.setState({
      decrement_loading: true
    }, async () => {
      try {
        var response = await APIHandler.site_cart_down(store.store_id, item.id);

        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setCartData(response.data);
            this.setState({
              decrement_loading: false
            });
            Toast.show(response.message);
          })();

        }
      } catch (e) {
        console.warn(e + ' site_cart_down');

        store.addApiQueue('site_cart_down', this._item_qnt_decrement.bind(this, item));
      } finally {

      }
    });
  }

  _item_qnt_increment(item) {
    this.setState({
      increment_loading: true
    }, async () => {
      try {
        var response = await APIHandler.site_cart_up(store.store_id, item.id);

        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setCartData(response.data);
            this.setState({
              increment_loading: false
            });
            Toast.show(response.message);
          })();

        }
      } catch (e) {
        console.warn(e + ' site_cart_up');

        store.addApiQueue('site_cart_up', this._item_qnt_increment.bind(this, item));
      } finally {

      }
    });
  }

  _store_cart_prev() {
    if (store.cart_item_index <= 0) {
      return;
    }

    var index = store.cart_item_index - 1;
    store.setCartItemIndex(index);
    Events.trigger(NEXT_PREV_CART, {index});
  }

  _store_cart_next() {
    if (store.cart_item_index + 1 >= store.cart_products.length) {
      return;
    }

    var index = store.cart_item_index + 1;
    store.setCartItemIndex(index);
    Events.trigger(NEXT_PREV_CART, {index});
  }

  _goTopIndex(index) {
    if (store.cart_data == null || store.cart_products == null) {
      return;
    }
    if ((index + 1) > store.cart_products.length) {
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
          <CachedImage mutable style={styles.store_cart_item_image} source={{uri: item.image}} />
        </View>
        <View style={styles.store_cart_item_title_box}>
          <Text style={styles.store_cart_item_title}>{sub_string(item.name, 32)}</Text>
          <Text style={[styles.store_cart_item_price, {
            position: 'absolute',
            right: 0,
            top: 18
          }]}>{item.price_view}</Text>
        </View>

        <View style={styles.store_cart_calculator}>
          <TouchableHighlight
            onPress={this._item_qnt_decrement_handler.bind(this, item)}
            underlayColor="transparent"
            style={styles.p8}>

            <View style={styles.store_cart_item_qnt_change}>
              {this.state.decrement_loading ? (
                <Indicator size="small" />
              ) : (
                <Icon name="minus" size={16} color="#404040" />
              )}
            </View>
          </TouchableHighlight>

          <Text style={styles.store_cart_item_qnt}>{item.quantity_view}</Text>

          <TouchableHighlight
            onPress={this._item_qnt_increment.bind(this, item)}
            underlayColor="transparent"
            style={styles.p8}>

            <View style={styles.store_cart_item_qnt_change}>
              {this.state.increment_loading ? (
                <Indicator size="small" />
              ) : (
                <Icon name="plus" size={16} color="#404040" />
              )}
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  _onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);
    if (pageNum != store.cart_item_index) {
      store.setCartItemIndex(pageNum);
    }
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
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ref={ref => this.refs_store_cart = ref}
              data={cart_products}
              pagingEnabled
              onMomentumScrollEnd={this._onScrollEnd.bind(this)}
              extraData={cart_products}
              initialScrollIndex={store.cart_item_index}
              getItemLayout={(data, index) => {
                return {length: Util.size.width - 140, offset: (Util.size.width - 140) * index, index};
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
            <Icon name="angle-left" size={36} color="rgba(0,0,0,.3)" />
          </TouchableHighlight>

          <TouchableHighlight
            style={[styles.store_cart_btn, styles.store_cart_btn_right]}
            underlayColor="#f1efef"
            onPress={this._store_cart_next.bind(this)}>
            <Icon name="angle-right" size={36} color="rgba(0,0,0,.3)" />
          </TouchableHighlight>
        </View>
      );
    } else {
      return(
        <View style={styles.store_cart_container}>
          <CenterText
            marginTop={-8}
            title={"Giỏ hàng trống\nHãy mua sắm ngay!"}
            />
        </View>
      );
    }
  }

  _goPayment() {
    if (store.cart_data && store.cart_products) {
      if (store.cart_data.address_id != 0) {
        Actions.confirm({
          goConfirm: true
        });
      } else {
        Actions.create_address({
          redirect: 'confirm'
        });
      }

    } else {
      return Alert.alert(
        'Thông báo',
        'Bạn cần chọn ít nhất (01) mặt hàng để tiếp tục',
        [
          {text: 'Đồng ý', onPress: () => {
            if (this.props.add_new) {
              this.props.add_new();
            }
          }},
        ],
        { cancelable: false }
      );
    }
  }

  render() {
    var {cart_data, cart_products} = store;
    var isset_cart = !(cart_data == null || cart_products == null);

    if (!isset_cart) {
      return null;
    }

    return (
      <View style={[styles.store_cart_box, {
        height: (cart_data.promotions && cart_data.promotions.title) ? 87 : 69
      }]}>
        {(cart_data.promotions && cart_data.promotions.title) && (
          <View style={{
            width: Util.size.width,
            height: 18,
            backgroundColor: 'brown',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              fontSize: 10,
              color: '#ffffff'
            }}>{cart_data.promotions.title} giảm {cart_data.promotions.discount_text}</Text>
          </View>
        )}

        <View style={{
          flexDirection: 'row',
          height: 69,
          borderTopWidth: Util.pixel,
          borderTopColor: '#dddddd'
        }}>
          {this._renderContent.call(this)}

          <TouchableHighlight
            onPress={this._goPayment.bind(this)}
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
                  fontSize: 14,
                  color: "#ffffff",
                  fontWeight: '600'
                }}>{cart_data.total}</Text>
              )}
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  store_cart_box: {
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // bottom: 0,
    height: 69,
    backgroundColor: '#ffffff'
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
    width: 24,
    backgroundColor: 'transparent',
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
    width: Util.size.width - 140,
    height: '100%'
  },
  store_cart_item: {
    width: Util.size.width - 140,
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
    resizeMode: 'contain'
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
    fontSize: 12,
    color: '#fa7f50',
    fontWeight: '500'
  },
  store_cart_calculator: {
    position: 'absolute',
    height: '52%',
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
    paddingHorizontal: 8
  },

  p8: {
    height: '100%',
    width: 36,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
