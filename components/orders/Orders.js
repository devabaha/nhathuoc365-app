/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  SectionList,
  RefreshControl
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import { CheckBox } from '../../lib/react-native-elements';

// components
import ListHeader from '../stores/ListHeader';
import PopupConfirm from '../PopupConfirm';

@observer
export default class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {
          key: "O'Green Nguyễn Trí Thanh",
          image: "http://cosp.com.vn/images/stores/2017/06/27/thiet-ke-shop-thuc-pham-sach.jpg",
          data: [
            {id: 1, name: 'https://dl.airtable.com/Qh7rvfKTpixsA8EJY8gN_DF084%20-%202-thumbnail%402x.jpg'},
            {id: 2, name: 'https://dl.airtable.com/fHPF5j1wS4ygkQXajEJo_DF049%20-%203-thumbnail%402x.jpg'},
            {id: 3, name: 'https://dl.airtable.com/857k6KkTQjmYhntXG7bA_CAT0142-thumbnail%402x.jpg'},
          ]
        },
        {
          key: "O'Green Nguyễn Lương Bằng",
          image: "http://cosp.com.vn/images/stores/2017/06/27/thiet-ke-shop-thuc-pham-sach.jpg",
          data: [
            {id: 4, name: 'https://dl.airtable.com/49DRLvioQEmPia4ax2sB_CAT0169-thumbnail%402x.jpg.jpg'},
            {id: 5, name: 'https://dl.airtable.com/h6BemcmSYqFCa846oZQg_IMG_9563-thumbnail%402x.jpg'},
            {id: 6, name: 'https://dl.airtable.com/PFaOAMWQ4y1Tu8jmgxJV_DF059%20-%202-thumbnail%402x.jpg'}
          ]
        },
        {
          key: "O'Green Đào Duy Anh",
          image: "http://cosp.com.vn/images/stores/2017/06/27/thiet-ke-shop-thuc-pham-sach.jpg",
          data: [
            {id: 7, name: 'https://dl.airtable.com/49DRLvioQEmPia4ax2sB_CAT0169-thumbnail%402x.jpg.jpg'},
            {id: 8, name: 'https://dl.airtable.com/h6BemcmSYqFCa846oZQg_IMG_9563-thumbnail%402x.jpg'},
            {id: 9, name: 'https://dl.airtable.com/PFaOAMWQ4y1Tu8jmgxJV_DF059%20-%202-thumbnail%402x.jpg'}
          ]
        }
     ],
     refreshing: false,
     cart_check_list: {}
    }
  }

  componentWillMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton.bind(this)
    });
  }

  _onRefresh() {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  _renderRightButton() {
    return null;

    return(
      <View style={styles.right_btn_box}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {

          }}>
          <View style={styles.right_btn_add_store}>
            <Icon name="commenting" size={20} color="#ffffff" />
            <View style={styles.stores_info_action_notify}>
              <Text style={styles.stores_info_action_notify_value}>3</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _is_delete_cart_item(item_id) {
    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.open();
    }
  }

  _delete_cart_item(item_id, flag) {
    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.close();
    }
  }

  render() {
    return (
      <View style={styles.container}>

        {this.state.data != null && <SectionList
          renderSectionHeader={({section}) => (
            <View style={styles.cart_section_box}>
              <Image style={styles.cart_section_image} source={{uri: section.image}} />
              <Text style={styles.cart_section_title}>{section.key}</Text>
            </View>
          )}
          onEndReached={(num) => {

          }}
          ItemSeparatorComponent={() => <View style={styles.separator}></View>}
          onEndReachedThreshold={0}
          style={styles.items_box}
          sections={this.state.data}
          extraData={this.state}
          renderItem={({item, index}) => {
            return(
              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => {
                  Actions.orders_item({});
                }}>
                <View style={styles.orders_item_box}>
                  <View style={styles.orders_item_icon_box}>
                    <Icon style={styles.orders_item_icon} name="shopping-cart" size={16} color="#999999" />
                    <Text style={styles.orders_item_icon_title}>Đơn hàng #ABARA-08638</Text>

                    <View style={styles.orders_status_box}>
                      <Text style={styles.orders_status_box_title}>Đang giao hàng</Text>
                    </View>
                  </View>

                  <View style={styles.orders_item_content}>
                    <View style={styles.orders_item_time_box}>
                      <Icon style={styles.orders_item_icon} name="clock-o" size={16} color="#999999" />
                      <Text style={styles.orders_item_time_title}>08:15 01/08</Text>
                    </View>
                    <View style={styles.orders_item_row}>
                      <View style={styles.orders_item_content_text}>
                        <Text style={styles.orders_item_content_value}>Tôm sú, dưa leo, cà rốt, mướp đắng, chuối tây, thịt heo,...</Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.orders_item_payment]}>
                    <View style={styles.orders_item_row}>
                      <Text style={[styles.orders_item_content_label, styles.note_label]}>Ghi chú: </Text>
                      <Text style={styles.orders_item_content_value}>Giao hàng trước 10 giờ trưa</Text>
                    </View>

                    <View style={[styles.orders_item_row, styles.row_payment]}>
                      <Text style={styles.orders_item_content_label}>1 sản phẩm</Text>
                      <View style={styles.orders_status_box}>
                        <Text style={styles.orders_item_content_value}>Tổng thanh toán: </Text>
                        <Text style={styles.orders_item_price_value}>860.250</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            );
          }}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />}

        <PopupConfirm
          ref_popup={ref => this.refs_modal_delete_cart_item = ref}
          title="Bạn muốn bỏ sản phẩm này khỏi giỏ hàng?"
          height={110}
          noConfirm={this._delete_cart_item.bind(this, false)}
          yesConfirm={this._delete_cart_item.bind(this, true)}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN
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
    width: 16,
    height: 16,
    backgroundColor: 'red',
    top: isAndroid ? 0 : -4,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#dddddd",
  },

  items_box: {

  },

  cart_section_box: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    borderBottomWidth: Util.pixel,
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd",
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
    height: 180,
    paddingVertical: 8,
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
    height: 96,
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
    height: 56,
    overflow: 'hidden',
    marginLeft: 22
  },
  orders_item_content_value: {
    fontSize: 14,
    color: "#404040"
  },
  orders_item_payment: {
    position: 'absolute',
    width: '100%',
    left: 0,
    bottom: 0,
    paddingHorizontal: 15,
    paddingVertical: 8
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
  }

});
