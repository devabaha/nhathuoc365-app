/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  Alert
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';
import * as Animatable from 'react-native-animatable';

@observer
export class OrdersItemComponent extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    var {item, onPress} = this.props;
    var is_paymenting = item.status == CART_STATUS_ORDERING;
    // var is_ready = item.status == CART_STATUS_READY;
    // var is_reorder = item.status == CART_STATUS_COMPLETED;
    var is_ready = false;
    var is_reorder = false;

    var notify = store.notify_admin_chat[item.user_id] || 0;

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => {
          Actions.order({
            title: '#' + item.cart_code,
            item_data: item
          });
        }}>

        <View style={styles.orders_item_box}>
          <View style={styles.orders_item_icon_box}>
            <Icon style={styles.orders_item_icon} name="user" size={16} color="#999999" />
            <Text style={styles.orders_item_icon_title}>{item.user.name}</Text>

            <View style={styles.orders_status_box}>
              <Text style={[styles.orders_status_box_title, {
                color: is_paymenting ? "#fa7f50" : DEFAULT_ADMIN_COLOR
              }]}>{item.status_view}</Text>
            </View>
          </View>

          <View style={styles.orders_item_content}>
            {item.orders_time != null && item.orders_time != '' && (
              <View style={styles.orders_item_time_box}>
                <Icon style={styles.orders_item_icon} name="shopping-cart" size={12} color="#999999" />
                <Text style={styles.orders_item_time_title}>#{item.cart_code + "  "}</Text>

                <Icon style={styles.orders_item_icon} name="clock-o" size={12} color="#999999" />
                <Text style={styles.orders_item_time_title}>{item.orders_time}</Text>
              </View>
            )}

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

          {notify > 0 && (
            <Animatable.View
              animation="slideInDown"
              iterationCount="infinite"
              direction="alternate"
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '30%',
                minHeight: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent'
              }}>

              <Icon name="comment-o" size={30} color="red" />
              <Text style={{
                position: 'absolute',
                fontSize: 14,
                color: "red",
                fontWeight: '500'
              }}>{notify}</Text>
            </Animatable.View>
          )}
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  orders_item_box: {
    width: '100%',
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#ffffff",
    marginTop: 8,
    borderTopWidth: Util.pixel,
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
    paddingHorizontal: 15,
    marginTop: 8
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
    color: DEFAULT_ADMIN_COLOR,
  },
  orders_item_content_text: {
    marginTop: 8,
    overflow: 'hidden',
    marginLeft: 22
  },
  orders_item_content_value: {
    fontSize: 14,
    color: "#404040"
  },
  orders_item_payment: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 8
  },
  orders_item_price_value: {
    color: DEFAULT_ADMIN_COLOR,
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
    marginLeft: 4
  },
  note_label: {
    marginLeft: 22
  },
  orders_item_note_content: {
    flex: 1
  }
});
