/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import store from '../../store/Store';

@observer
export default class Items extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buying: false
    }
  }

  // add item vào giỏ hàng
  _addCart(item) {
    this.setState({
      buying: true
    }, async () => {
      try {
        var response = await APIHandler.site_cart_adding(store.store_id, item.id);

        if (response && response.status == STATUS_SUCCESS) {

          action(() => {
            store.setCartData(response.data);

            var index = null, length = 0;
            if (response.data.products) {
              length = Object.keys(response.data.products).length;

              Object.keys(response.data.products).reverse().some((key, key_index) => {
                let value = response.data.products[key];
                if (value.id == item.id) {
                  index = key_index;
                  return true;
                }
              });
            }

            if (index !== null && index < length) {
              store.setCartItemIndex(index);
              Events.trigger(NEXT_PREV_CART, {index});

              this.setState({
                buying: false
              });
            }
          })();

        }

      } catch (e) {
        console.warn(e);
      } finally {

      }
    });
  }

  render() {
    let {item, index, onPress} = this.props;

    var quantity = 0;

    return (
      <TouchableHighlight
        onPress={onPress}
        underlayColor="transparent">
        <View style={[styles.item_box, {borderRightWidth: index%2 == 0 ? Util.pixel : 0}]}>

          <View style={styles.item_image_box}>
            <Image style={styles.item_image} source={{uri: item.image}} />
          </View>

          <View style={styles.item_info_box}>
            <View style={styles.item_info_made}>
              {item.made_in != '' && (
                <View style={styles.directionRow}>
                  <Icon name="map-marker" size={12} color="#666666" />
                  <Text style={styles.item_info_made_title}>{item.made_in}</Text>
                </View>
              )}

              <View style={styles.item_info_weight}>
                <Text style={styles.item_info_made_title}>{item.unit_name_view}</Text>
              </View>
            </View>
            <Text style={styles.item_info_name}>{item.name}</Text>
            <View style={styles.price_box}>
              {item.discount_percent > 0 && (
                <Text style={styles.item_safe_off_price}>{item.discount}</Text>
              )}

              <Text style={[styles.item_info_price, {
                color: item.discount_percent > 0 ? "#fa7f50" : DEFAULT_COLOR
              }]}>{item.price_view}</Text>
            </View>
          </View>

          <TouchableHighlight
            style={styles.item_add_cart_btn}
            underlayColor="transparent"
            onPress={this._addCart.bind(this, item)}>
            <View style={{
              width: '100%',
              height: '100%'
            }}>
              {this.state.buying ? (
                <Indicator size="small" />
              ) : (
                <View style={styles.item_add_cart_box}>
                  <Icon name="cart-plus" size={24} color={DEFAULT_COLOR} />
                  <Text style={styles.item_add_cart_title}>Chọn mua</Text>
                  {quantity > 0 && (
                    <View style={styles.quantity_box}>
                      <Text style={styles.quantity_value}>{quantity}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </TouchableHighlight>

          {item.discount_percent > 0 && (
            <View style={styles.item_safe_off}>
              <View style={styles.item_safe_off_percent}>
                <Text style={styles.item_safe_off_percent_val}>-{item.discount_percent}%</Text>
              </View>
            </View>
          )}

        </View>
      </TouchableHighlight>
    );
  }
}

Items.PropTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  item_box: {
    width: ~~(Util.size.width / 2),
    height: ~~(Util.size.width / 2),
    borderRightWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff"
  },
  directionRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  item_image_box: {
    width: '100%',
    height: '80%'
  },
  item_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  item_info_box: {
    width: '100%',
    minHeight: '34%',
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 2,
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)"
  },
  item_info_made: {
    flexDirection: 'row'
  },
  item_info_made_title: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666666',
    paddingHorizontal: 8
  },
  item_info_weight: {
    flex: 1,
    alignItems: 'flex-end'
  },
  item_info_name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#404040',
    marginTop: 2
  },
  item_info_price: {
    fontSize: 16,
    fontWeight: '600',
    color: DEFAULT_COLOR,
    marginLeft: 4,
  },
  item_add_cart_btn: {
    position: 'absolute',
    top: 4,
    right: 0,
    width: 60,
    height: 40,
    zIndex: 2
  },
  item_add_cart_box: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  item_add_cart_title: {
    color: "#404040",
    fontSize: 8
  },

  item_safe_off: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_safe_off_percent: {
    backgroundColor: '#fa7f50',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  item_safe_off_percent_val: {
    color: "#ffffff",
    fontSize: 12
  },
  item_safe_off_price: {
    color: "#404040",
    fontSize: 12,
    textDecorationLine: 'line-through'
  },

  quantity_box: {
    position: 'absolute',
    top: 0,
    right: 8,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: "red",
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2
  },
  quantity_value: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: '500'
  },
  price_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  }
});
