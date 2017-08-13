/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  SectionList,
  RefreshControl
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

// components
import ListHeader from '../stores/ListHeader';

@observer
export default class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {
          key: "Thực phẩm sạch Anh Thực",
          data: [
            {id: 1, name: 'https://dl.airtable.com/Qh7rvfKTpixsA8EJY8gN_DF084%20-%202-thumbnail%402x.jpg'},
            {id: 2, name: 'https://dl.airtable.com/fHPF5j1wS4ygkQXajEJo_DF049%20-%203-thumbnail%402x.jpg'},
            {id: 3, name: 'https://dl.airtable.com/857k6KkTQjmYhntXG7bA_CAT0142-thumbnail%402x.jpg'},
            {id: 4, name: 'https://dl.airtable.com/49DRLvioQEmPia4ax2sB_CAT0169-thumbnail%402x.jpg.jpg'},
            {id: 5, name: 'https://dl.airtable.com/h6BemcmSYqFCa846oZQg_IMG_9563-thumbnail%402x.jpg'},
            {id: 6, name: 'https://dl.airtable.com/PFaOAMWQ4y1Tu8jmgxJV_DF059%20-%202-thumbnail%402x.jpg'}
          ]
        }
     ],
     refreshing: false,
     cart_check_list: {}
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          <View style={[styles.rows]}>
            <View style={styles.address_name_box}>
              <View>
                <Text style={styles.address_name}>Thông tin đơn hàng</Text>
                <Text style={styles.desc_content}>Mã số: ABARA-696969</Text>
              </View>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <View style={styles.orders_status_box}>
                    <Text style={styles.address_default_title}>Trạng thái</Text>
                    <Text style={styles.orders_status}>Chưa đặt hàng</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          <View style={[styles.rows, styles.borderBottom]}>
            <View style={styles.address_name_box}>
              <Text style={styles.address_name}>Phương thức thanh toán</Text>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <Text style={styles.address_default_title}>Khi nhận hàng</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          <ListHeader title="Thông tin này đã chính xác?" />

          <View style={[styles.rows]}>
            <View style={styles.address_name_box}>
              <Text style={styles.address_name}>Đặng Ngọc Sơn</Text>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={this.props.go_address_page}>
                  <Text style={[styles.address_default_title, styles.title_active]}>NHẤN ĐỂ THAY ĐỔI</Text>
                </TouchableHighlight>
              </View>
            </View>

            <View style={styles.address_content}>
              <Text style={styles.address_content_phone}>(+84) 1653538222</Text>
              <Text style={styles.address_content_address_detail}>Số 10 khu Chuyên Gia</Text>
              <Text style={styles.address_content_phuong}>Phường Phương Lâm</Text>
              <Text style={styles.address_content_city}>Thành Phố Hoà Bình</Text>
              <Text style={styles.address_content_tinh}>Hoà Bình</Text>
            </View>
          </View>

          <View style={[styles.rows, styles.borderBottom]}>
            <View style={styles.address_name_box}>
              <Text style={styles.address_name}>Thời gian giao hàng</Text>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <Text style={styles.address_default_title}>Trước 10 giờ sáng</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          <View style={[styles.rows, styles.borderBottom, styles.total_price]}>
            <View style={styles.address_name_box}>
              <Text style={styles.address_name}>Thành tiền</Text>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <Text style={[styles.address_default_title, styles.title_active]}>816,220</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          <ListHeader title="Mặt hàng đã chọn" />

          {this.state.data != null && <SectionList
            renderSectionHeader={({section}) => <View style={styles.cart_section_box}><Text style={styles.cart_section_title}>{section.key}</Text></View>}
            onEndReached={(num) => {

            }}
            ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            onEndReachedThreshold={0}
            style={styles.items_box}
            sections={this.state.data}
            extraData={this.state}
            renderItem={({item, index}) => {
              return(
                <View style={styles.cart_item_box}>
                  <View style={styles.cart_item_image_box}>
                    <Image style={styles.cart_item_image} source={{uri: item.name}} />
                  </View>

                  <View style={styles.cart_item_info}>
                    <View style={styles.cart_item_info_content}>
                      <Text style={styles.cart_item_info_name}>Bưởi Năm Roi Đà Lạt</Text>

                      <View style={styles.cart_item_price_box}>
                        <Text style={styles.cart_item_price_price_safe_off}>120,000</Text>
                        <Text style={styles.cart_item_price_price}>89,000</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.cart_item_weight}>0.5 kg</Text>
                </View>
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

          <View style={[styles.rows, styles.borderBottom]}>
            <View style={styles.address_name_box}>
              <Text style={styles.text_total_items}>10 sản phẩm</Text>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <Text style={[styles.address_default_title, styles.title_active]}>Thành tiền: 816,220</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>

        </ScrollView>

        <TouchableHighlight
          style={styles.cart_payment_btn_box}
          underlayColor="transparent"
          onPress={() => Actions.payment({})}>

          <View style={styles.cart_payment_btn}>
            <Icon name="check" size={24} color="#ffffff" />
            <Text style={styles.cart_payment_btn_title}>ĐẶT HÀNG</Text>
          </View>

        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    width: Util.size.width
  },
  content: {
    marginBottom: 60
  },
  rows: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  address_name_box: {
    flexDirection: 'row'
  },
  address_name: {
    fontSize: 16,
    color: "#000000",

  },
  address_default_box: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  address_default_title: {
    color: "#666666",
    fontSize: 12
  },
  title_active: {
    color: DEFAULT_COLOR
  },
  address_content: {
    marginTop: 8
  },
  address_content_phone: {
    color: "#404040",
    fontSize: 16,
    marginTop: 4
  },
  address_content_address_detail: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4
  },
  address_content_phuong: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4
  },
  address_content_city: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4
  },
  address_content_tinh: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4
  },

  desc_content: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4
  },
  orders_status_box: {
    alignItems: 'center'
  },
  orders_status: {
    fontSize: 12,
    color: "#fa7f50",
    fontWeight: '600',
    marginTop: 4
  },
  borderBottom: {
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },

  cart_section_box: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    backgroundColor: "#fa7f50"
  },
  cart_section_title: {
    color: "#ffffff",
    fontSize: 14,
    paddingLeft: 8,
    fontWeight: '600'
  },

  cart_item_box: {
    width: '100%',
    height: 80,
    paddingVertical: 8,
    flexDirection: 'row',
    backgroundColor: "#ffffff"
  },
  cart_item_image_box: {
    width: '30%',
    height: '100%',
    marginLeft: 8
  },
  cart_item_image: {
    height: '100%',
    resizeMode: 'cover'
  },
  cart_item_info: {
    width: Util.size.width * 0.7 - 8,
    height: '100%'
  },
  cart_item_info_content: {
    paddingHorizontal: 15
  },
  cart_item_info_name: {
    color: "#000000",
    fontSize: 14,
    fontWeight: '600',
  },
  cart_item_price_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  cart_item_price_price_safe_off: {
    textDecorationLine: 'line-through',
    fontSize: 14,
    color: "#666666",
    marginRight: 4
  },
  cart_item_price_price: {
    fontSize: 14,
    color: DEFAULT_COLOR
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#dddddd"
  },
  cart_item_weight: {
    position: 'absolute',
    right: 15,
    bottom: 8,
    color: "#666666",
    fontSize: 12
  },

  cart_payment_btn_box: {
    position: 'absolute',
    width: '100%',
    height: 60,
    bottom: 0,
    left: 0,
    right: 0
  },
  cart_payment_btn: {
    width: '100%',
    height: '100%',
    backgroundColor: DEFAULT_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cart_payment_btn_title: {
    color: "#ffffff",
    fontSize: 18,
    marginLeft: 8
  },

  total_price: {
    marginTop: 12
  },
  text_total_items: {
    fontSize: 12,
    color: "#666666"
  }
});
