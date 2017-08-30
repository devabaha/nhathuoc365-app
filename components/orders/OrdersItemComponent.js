/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class OrdersItemComponent extends Component {
  render() {
    var {item, onPress, storeOnPress, from} = this.props;
    var single = from != "store_orders";

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={onPress}>

        <View style={[styles.orders_item_box, {
          paddingTop: single ? 0 : 12
        }]}>
          {single && (
            <TouchableHighlight
              underlayColor="transparent"
              onPress={storeOnPress}>
              <View style={styles.cart_section_box}>
                <Image style={styles.cart_section_image} source={{uri: item.shop_logo_url}} />
                <Text style={styles.cart_section_title}>{item.shop_name}</Text>
              </View>
            </TouchableHighlight>
          )}

          <View style={styles.orders_item_icon_box}>
            <Icon style={styles.orders_item_icon} name="shopping-cart" size={16} color="#999999" />
            <Text style={styles.orders_item_icon_title}>Đơn hàng #{item.cart_code}</Text>

            <View style={styles.orders_status_box}>
              <Text style={styles.orders_status_box_title}>{item.status_view}</Text>
            </View>
          </View>

          <View style={styles.orders_item_content}>
            <View style={styles.orders_item_time_box}>
              <Icon style={styles.orders_item_icon} name="clock-o" size={14} color="#999999" />
              <Text style={styles.orders_item_time_title}>{item.orders_time}</Text>
            </View>

            <View style={styles.orders_item_row}>
              {Object.keys(item.products).length > 0 && (
                <View style={styles.orders_item_content_text}>
                  <Text style={styles.orders_item_content_value}>{(() => {
                    var items_string = '';
                    Object.keys(item.products).reverse().map(key => {
                      let item_product = item.products[key];
                      if (item_product.selected == 1) {
                        items_string += item_product.name + ' (' + item_product.quantity_view + '), ';
                      }
                    });
                    return sub_string(items_string, 100);
                  })()}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.orders_item_payment]}>
            {item.user_note != null && (
              <View style={styles.orders_item_row}>
                <Text style={[styles.orders_item_content_label, styles.note_label]}>Ghi chú: </Text>
                <View style={styles.orders_item_note_content}>
                  <Text style={styles.orders_item_content_value}>{item.user_note}</Text>
                </View>
              </View>
            )}

            <View style={[styles.orders_item_row, styles.row_payment]}>
              <Text style={styles.orders_item_content_label}>{item.count_selected} sản phẩm</Text>
              <View style={styles.orders_status_box}>
                <Text style={styles.orders_item_content_value}>Tổng thanh toán: </Text>
                <Text style={styles.orders_item_price_value}>{item.total_selected}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

OrdersItemComponent.PropTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  storeOnPress: PropTypes.func
}

const styles = StyleSheet.create({
  cart_section_box: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    borderBottomWidth: Util.pixel,
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd",
    marginBottom: 8
  },
  cart_section_image: {
    width: 26,
    height: 26,
    resizeMode: 'cover',
    marginLeft: 15,
    borderRadius: 13
  },
  cart_section_title: {
    color: "#000000",
    fontSize: 14,
    paddingLeft: 8,
    fontWeight: '500'
  },

  orders_item_box: {
    width: '100%',
    // height: 180,
    paddingBottom: 8,
    backgroundColor: "#ffffff",
    marginBottom: 8,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  orders_item_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  orders_item_icon_title: {
    marginLeft: 8,
    fontSize: 14,
    color: "#404040",
    fontWeight: '500'
  },

  orders_item_content: {
    width: '70%',
    paddingHorizontal: 15
  },
  orders_item_row: {
    flexDirection: 'row',
    paddingVertical: 2
  },
  orders_item_content_label: {
    fontSize: 14,
    color: "#404040",
    fontWeight: '500'
  },
  orders_status_box: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row'
  },
  orders_status_box_title: {
    fontSize: 12,
    color: DEFAULT_COLOR,
  },
  orders_item_content_text: {
    marginTop: 8,
    overflow: 'hidden',
    marginLeft: 22
  },
  orders_item_content_value: {
    fontSize: 14,
    color: "#404040",
    lineHeight: 20
  },
  orders_item_payment: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 8
  },
  orders_item_price_value: {
    color: DEFAULT_COLOR,
    fontSize: 14,
    fontWeight: '500'
  },
  row_payment: {
    borderTopWidth: Util.pixel,
    borderTopColor: "#dddddd",
    paddingTop: 8,
    marginTop: 4
  },
  orders_item_time_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 22
  },
  orders_item_time_title: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 8
  },
  note_label: {
    marginLeft: 22
  },
  orders_item_note_content: {
    flex: 1
  }
});
