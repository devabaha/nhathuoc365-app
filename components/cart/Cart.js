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
import Modal from 'react-native-modalbox';
import { Button } from 'react-native-elements';
import Swiper from 'react-native-swiper';

// components
import ListHeader from '../stores/ListHeader';

@autobind
@observer
export default class Cart extends Component {
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
          ]
        },
        {
          key: "Thực phẩm sạch Ngọc Sơn",
          data: [
            {id: 4, name: 'https://dl.airtable.com/49DRLvioQEmPia4ax2sB_CAT0169-thumbnail%402x.jpg.jpg'},
            {id: 5, name: 'https://dl.airtable.com/h6BemcmSYqFCa846oZQg_IMG_9563-thumbnail%402x.jpg'},
            {id: 6, name: 'https://dl.airtable.com/PFaOAMWQ4y1Tu8jmgxJV_DF059%20-%202-thumbnail%402x.jpg'},
          ]
        },
        {
          key: "Thực phẩm sạch Đào Tài",
          data: [
            {id: 7, name: 'https://dl.airtable.com/JNaHnxaoQqyU8wwDyNsV_1.1%20Ba%20roi%20rut%20suong-thumbnail%402x.jpg.jpg'},
            {id: 8, name: 'https://dl.airtable.com/wJpDFze3T0mTRXvXiYIb_DF078%20-%202-thumbnail%402x.jpg'},
            {id: 9, name: 'https://dl.airtable.com/UKLNZUjeT3u14Odw69OP_9-thumbnail%402x.jpg.jpg'},
            {id: 10, name: 'https://dl.airtable.com/Q9spiMmGTWCuYT0s8kNa_CAT0147-thumbnail%402x.jpg.jpg'}
          ]
        }
     ],
     refreshing: false
    }
  }

  componentWillMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton
    });
  }

  _onRefresh() {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  _renderRightButton() {
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

  render() {
    return (
      <View style={styles.container}>

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
                    <Text style={styles.cart_item_info_quantity}>0,5 kg</Text>
                    <Text style={styles.cart_item_info_ship_status}>Giao hàng trong 1 giờ</Text>
                  </View>
                </View>

                <View style={styles.cart_item_price}>
                  <Text style={styles.cart_item_price_value}>67,600</Text>
                </View>
              </View>
            );
          }}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />}

        <View style={styles.cart_payment_box}>
          <View style={styles.cart_payment_rows}>
            <Text style={styles.cart_payment_label}>TIỀN HÀNG</Text>
            <View style={styles.cart_payment_price_box}>
              <Text style={styles.cart_payment_price}>816,220</Text>
            </View>
          </View>
          <View style={[styles.cart_payment_rows, styles.borderBottom]}>
            <Text style={styles.cart_payment_label}>PHÍ DỊCH VỤ (3 CỬA HÀNG)</Text>
            <View style={styles.cart_payment_price_box}>
              <Text style={styles.cart_payment_price}>MIỄN PHÍ</Text>
            </View>
          </View>
          <View style={[styles.cart_payment_rows, styles.mt12]}>
            <Text style={[styles.cart_payment_label, styles.text_both]}>TỔNG CỘNG</Text>
            <View style={styles.cart_payment_price_box}>
              <Text style={[styles.cart_payment_price, styles.text_both]}>816,220</Text>
            </View>
          </View>
        </View>

        <TouchableHighlight
          sytle={styles.cart_payment_btn_box}
          underlayColor="transparent"
          onPress={() => 1}>

          <View style={styles.cart_payment_btn}>
            <Icon name="shopping-cart" size={24} color="#ffffff" />
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
    ...MARGIN_SCREEN,
    marginBottom: 0
  },
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8
  },
  right_btn_box: {
    flexDirection: 'row'
  },
  stores_info_action_notify: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: 'red',
    top: -4,
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
    backgroundColor: "#dddddd"
  },

  items_box: {
    marginBottom: 170
  },

  cart_section_box: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    backgroundColor: "#f1f1f1"
  },
  cart_section_title: {
    color: "#999999",
    fontSize: 14,
    paddingLeft: 8,
    fontWeight: '600'
  },

  cart_item_box: {
    width: '100%',
    height: 80,
    // paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    backgroundColor: "#ffffff"
  },
  cart_item_image_box: {
    width: '25%',
    height: '100%',
    backgroundColor: '#ebebeb'
  },
  cart_item_image: {
    height: '100%',
    resizeMode: 'cover'
  },
  cart_item_info: {
    width: '55%',
    height: '100%'
  },
  cart_item_info_content: {
    paddingHorizontal: 8
  },
  cart_item_info_name: {
    color: "#000000",
    fontSize: 14,
    fontWeight: '600',
  },
  cart_item_info_quantity: {
    color: 10,
    color: "#666666",
    marginTop: 4
  },
  cart_item_info_ship_status: {
    color: DEFAULT_COLOR,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500'
  },
  cart_item_price: {
    width: '20%',
    height: '100%'
  },
  cart_item_price_value: {
    color: DEFAULT_COLOR,
    fontSize: 14,
    fontWeight: '600'
  },

  cart_payment_box: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: 170,
    backgroundColor: "#f1f1f1",
    paddingVertical: 4,
    paddingHorizontal: 15
  },
  cart_payment_rows: {
    width: '100%',
    height: 28,
    backgroundColor: '#f1f1f1',
    flexDirection: 'row',
    alignItems: 'center'
  },
  cart_payment_price_box: {
    flex: 1,
    alignItems: 'flex-end'
  },
  cart_payment_price: {
    fontSize: 14,
    color: "#666666",
    fontWeight: '500'
  },
  cart_payment_label: {
    fontSize: 14,
    color: "#666666",
    fontWeight: '500'
  },
  text_both: {
    color: "#000000",
    fontSize: 18
  },
  borderBottom: {
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#cccccc"
  },
  mt12: {
    marginTop: 10
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
    position: 'absolute',
    width: '100%',
    height: 60,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: DEFAULT_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cart_payment_btn_title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  }
});
