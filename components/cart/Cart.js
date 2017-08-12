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
import { CheckBox } from '../../lib/react-native-elements';
import Swiper from 'react-native-swiper';

// components
import ListHeader from '../stores/ListHeader';

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
                <View style={styles.cart_item_check_box}>
                  <CheckBox
                    containerStyle={styles.cart_item_check}
                    checked={(() => {
                      if (this.state.cart_check_list[item.id] === undefined) {
                        this.state.cart_check_list[item.id] = true;
                      }
                      return this.state.cart_check_list[item.id];
                    })()}
                    checkedColor={DEFAULT_COLOR}
                    hiddenTextElement
                    onPress={() => {

                      var check = this.state.cart_check_list[item.id] !== true;
                      this.state.cart_check_list[item.id] = check;
                      this.setState({
                        cart_check_list: this.state.cart_check_list
                      });

                    }}
                    />
                </View>

                <View style={styles.cart_item_image_box}>
                  <Image style={styles.cart_item_image} source={{uri: item.name}} />
                </View>

                <View style={styles.cart_item_info}>
                  <View style={styles.cart_item_info_content}>
                    <Text style={styles.cart_item_info_name}>Bưởi Năm Roi Đà Lạt</Text>
                    <View style={styles.cart_item_actions}>
                      <TouchableHighlight
                        style={styles.cart_item_actions_btn}
                        underlayColor="transparent"
                        onPress={this._is_delete_cart_item.bind(this)}>
                        <Text style={styles.cart_item_btn_label}>-</Text>
                      </TouchableHighlight>

                      <Text style={styles.cart_item_actions_quantity}>0,5 kg</Text>

                      <TouchableHighlight
                        style={styles.cart_item_actions_btn}
                        underlayColor="transparent"
                        onPress={() => 1}>
                        <Text style={styles.cart_item_btn_label}>+</Text>
                      </TouchableHighlight>
                    </View>

                    <View style={styles.cart_item_price_box}>
                      <Text style={styles.cart_item_price_price_safe_off}>120,000</Text>
                      <Text style={styles.cart_item_price_price}>89,000</Text>
                    </View>
                  </View>
                </View>
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
          style={styles.cart_payment_btn_box}
          underlayColor="transparent"
          onPress={() => Actions.payment({})}>

          <View style={styles.cart_payment_btn}>
            <Icon name="shopping-cart" size={24} color="#ffffff" />
            <Text style={styles.cart_payment_btn_title}>ĐẶT HÀNG</Text>
          </View>

        </TouchableHighlight>

        <Modal
          entry="top"
          style={[styles.modal, styles.modal_confirm]}
          ref={ref => this.refs_modal_delete_cart_item = ref}>
          <Text style={styles.modal_confirm_title}>Bạn muốn bỏ sản phẩm này khỏi giỏ hàng?</Text>
          <View style={styles.modal_confirm_actions}>
            <TouchableHighlight
              style={[styles.modal_confirm_btn, styles.modal_confirm_btn_left]}
              underlayColor="transparent"
              onPress={() => this._delete_cart_item(false)}>
              <Text style={styles.modal_confirm_label}>Không</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.modal_confirm_btn}
              underlayColor="transparent"
              onPress={() => this._delete_cart_item(true)}>
              <Text style={styles.modal_confirm_label}>Có</Text>
            </TouchableHighlight>
          </View>
        </Modal>
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
    backgroundColor: "#dddddd"
  },

  items_box: {
    marginBottom: 170
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
    height: 100,
    paddingVertical: 8,
    flexDirection: 'row',
    backgroundColor: "#ffffff"
  },
  cart_item_image_box: {
    width: '20%',
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
  cart_item_actions: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center'
  },
  cart_item_actions_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 26,
    height: 26,
    borderWidth: Util.pixel,
    borderColor: "#666666",
    borderRadius: 3
  },
  cart_item_actions_quantity: {
    paddingHorizontal: 8,
    minWidth: '30%',
    textAlign: 'center',
    color: "#404040",
    fontWeight: '500'
  },
  cart_item_btn_label: {
    color: "#404040",
    fontSize: 20,
    lineHeight: isIOS ? 20 : 24
  },
  cart_item_check_box: {
    width: '10%',
    justifyContent: 'center',

  },
  cart_item_check: {
    padding: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#ffffff",
    borderWidth: 0,
    width: 24
  },
  cart_item_price_box: {
    flexDirection: 'row',
    alignItems: 'center'
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

  cart_payment_box: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: 170,
    backgroundColor: "#ffffff",
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderTopWidth: Util.pixel,
    borderTopColor: DEFAULT_COLOR
  },
  cart_payment_rows: {
    width: '100%',
    height: 28,
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

  modal_confirm: {
    width: '80%',
    height: 110,
    borderRadius: 3
  },
  modal_confirm_title: {
    paddingHorizontal: 20,
    marginTop: 16,
    textAlign: 'center',
    color: "#666666",
    fontSize: 14
  },
  modal_confirm_actions: {
    position: 'absolute',
    width: '100%',
    height: 42,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3
  },
  modal_confirm_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',

    borderTopWidth: Util.pixel,
    borderTopColor: "#dddddd",
  },
  modal_confirm_btn_left: {
    borderRightWidth: Util.pixel,
    borderRightColor: "#dddddd"
  },
  modal_confirm_label: {
    fontSize: 16,
    color: DEFAULT_COLOR
  }
});
