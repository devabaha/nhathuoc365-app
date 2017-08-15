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
  RefreshControl,
  TextInput
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

// components
import ListHeader from '../stores/ListHeader';
import PopupConfirm from '../PopupConfirm';
import Sticker from '../Sticker';

@observer
export default class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {
          key: "O'Green Nguyễn Trí Thanh",
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
     cart_check_list: {},
     single: this.props.from != 'orders_item',
     coppy_sticker_flag: false
    }
  }

  componentWillMount() {
    if (!this.state.single) {
      Actions.refresh({
        renderRightButton: this._renderRightButton.bind(this)
      });
    }
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

  _onRefresh() {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  render() {
    var {single} = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={[styles.content, single ? null : {marginBottom: 0}]}>
          <View style={[styles.rows]}>
            <View style={styles.address_name_box}>
              <View>
                <View style={styles.box_icon_label}>
                  <Icon style={styles.icon_label} name="info-circle" size={16} color="#999999" />
                  <Text style={styles.input_label}>Thông tin đơn hàng</Text>
                </View>
                <Text style={styles.desc_content}>Mã số: ABARA-696969</Text>
              </View>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <View style={styles.orders_status_box}>
                    <Text style={styles.address_default_title}>Trạng thái</Text>
                    <Text style={[styles.orders_status, single ? null : {color: DEFAULT_COLOR}]}>{single ? "Chưa đặt hàng" : "Đang giao hàng"}</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          <View style={[styles.rows, styles.borderBottom]}>
            <View style={styles.address_name_box}>
              <View style={styles.box_icon_label}>
                <Icon style={styles.icon_label} name="credit-card" size={12} color="#999999" />
                <Text style={styles.input_label}>Phương thức thanh toán</Text>
              </View>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <Text style={styles.address_default_title}>Khi nhận hàng</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          {single && <ListHeader title="Thông tin này đã chính xác?" />}

          <View style={[styles.rows, styles.borderBottom, single ? null : styles.mt8]}>
            <View style={styles.address_name_box}>
              <View style={styles.box_icon_label}>
                <Icon style={styles.icon_label} name="truck" size={13} color="#999999" />
                <Text style={styles.input_label}>Địa chỉ giao hàng</Text>
              </View>
              <View style={styles.address_default_box}>
                {single ? (
                  <TouchableHighlight
                    underlayColor="transparent"
                    onPress={this.props.go_address_page}>
                    <Text style={[styles.address_default_title, styles.title_active]}>NHẤN ĐỂ THAY ĐỔI</Text>
                  </TouchableHighlight>
                ) : (
                  <TouchableHighlight
                    underlayColor="transparent"
                    onPress={this._showSticker.bind(this)}>
                    <Text style={[styles.address_default_title, styles.title_active]}>SAO CHÉP</Text>
                  </TouchableHighlight>
                )}
              </View>
            </View>

            <View style={styles.address_content}>
              <Text style={styles.address_name}>Đặng Ngọc Sơn</Text>
              <Text style={styles.address_content_phone}>(+84) 1653538222</Text>
              {single ? (
                <View>
                  <Text style={styles.address_content_address_detail}>Số 10 khu Chuyên Gia</Text>
                  <Text style={styles.address_content_phuong}>Phường Phương Lâm</Text>
                  <Text style={styles.address_content_city}>Thành Phố Hoà Bình</Text>
                  <Text style={styles.address_content_tinh}>Hoà Bình</Text>
                </View>
              ) : (
                <Text style={styles.address_content_address_detail}>Số 10 khu Chuyên Gia, Phường Phương Lâm, Thành Phố Hoà Bình, Hoà Bình</Text>
              )}
            </View>
          </View>

          <View style={[styles.rows, styles.borderBottom, styles.mt8]}>
            <View style={styles.box_icon_label}>
              <Icon style={styles.icon_label} name="pencil-square-o" size={15} color="#999999" />
              <Text style={styles.input_label}>Ghi chú</Text>
            </View>
            {single ? (
              <View>
                <Text style={styles.input_label_help}>(Thời gian giao hàng, ghi chú khác)</Text>

                <TextInput
                  style={[styles.input_address_text, {height: this.state.address_height | 50}]}
                  keyboardType="default"
                  maxLength={250}
                  placeholder="Nhập ghi chú của bạn tại đây"
                  placeholderTextColor="#999999"
                  multiline={true}
                  underlineColorAndroid="#ffffff"
                  onContentSizeChange={(e) => {
                    this.setState({address_height: e.nativeEvent.contentSize.height});
                  }}
                  />
              </View>
            ) : (
              <Text style={styles.input_note_value}>Giao hàng cho tôi trước 10 giờ trưa hôm nay</Text>
            )}
          </View>

          <View style={[styles.rows, styles.borderBottom, styles.mt8]}>
            <View style={styles.address_name_box}>
              <View style={styles.box_icon_label}>
                <Icon style={styles.icon_label} name="usd" size={14} color="#999999" />
                <Text style={styles.input_label}>Thành tiền</Text>
              </View>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <Text style={[styles.address_default_title, styles.title_active]}>816,220</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          <View style={[styles.rows, styles.borderBottom, styles.mt8]}>
            <View style={styles.address_name_box}>
              <View style={styles.box_icon_label}>
                <Icon style={styles.icon_label} name="shopping-cart" size={14} color="#999999" />
                <Text style={styles.input_label}>{single ? "Mặt hàng đã chọn" : "Mặt hàng đã mua"}</Text>
              </View>
            </View>
          </View>

          {this.state.data != null && <SectionList
            //renderSectionHeader={({section}) => <View style={styles.cart_section_box}><Text style={styles.cart_section_title}>{section.key}</Text></View>}
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

        {single && <TouchableHighlight
          style={styles.cart_payment_btn_box}
          underlayColor="transparent"
          onPress={this._onSave.bind(this)}>

          <View style={styles.cart_payment_btn}>
            <Icon name="check" size={24} color="#ffffff" />
            <Text style={styles.cart_payment_btn_title}>ĐẶT HÀNG</Text>
          </View>

        </TouchableHighlight>}

        <PopupConfirm
          ref_popup={ref => this.popup_message = ref}
          title="Đơn hàng của bạn sẽ được chúng tôi giao đúng hẹn. Xin cảm ơn"
          noTitle="Xem đơn hàng"
          noConfirm={this._viewOrders.bind(this)}
          yesTitle="Tiếp tục mua hàng"
          yesConfirm={this._continueShopping.bind(this)}
          height={150}
          otherClose={false}
          content={(title) => {
            return(
              <View style={styles.success_box}>
                <View style={styles.success_icon_box}>
                  <Icon name="check-circle" size={24} color={DEFAULT_COLOR} />
                  <Text style={styles.success_icon_label}>THÀNH CÔNG</Text>
                </View>
                <Text style={styles.success_title}>{title}</Text>
              </View>
            );
          }}
          />

        <Sticker
          active={this.state.coppy_sticker_flag}
          message="Sao chép thành công."
         />
      </View>
    );
  }

  _showSticker() {
    this.setState({
      coppy_sticker_flag: true
    }, () => {
      setTimeout(() => {
        this.setState({
          coppy_sticker_flag: false
        });
      }, 2000);
    });
  }

  _onSave() {
    if (this.popup_message) {
      this.popup_message.open();
    }
  }

  _popupClose() {
    if (this.popup_message) {
      this.popup_message.close();
    }
  }

  _viewOrders() {
    this._popupClose();

    this._goStores();

    setTimeout(() => {
      Actions.orders_item({

      });
    }, 1000);
  }

  _continueShopping() {
    this._popupClose();

    this._goStores();
  }

  _goStores() {
    Actions.stores({
      type: ActionConst.RESET
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    width: Util.size.width
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
    fontSize: 14,
    color: "#000000",
    fontWeight: '600'
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
    marginTop: 12,
    marginLeft: 22
  },
  address_content_phone: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600'
  },
  address_content_address_detail: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20
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
    marginTop: 4,
    marginLeft: 22
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

  mt8: {
    marginTop: 8
  },
  text_total_items: {
    fontSize: 12,
    color: "#666666"
  },

  input_address_text: {
    width: '100%',
    color: "#000000",
    fontSize: 14,
    marginTop: 4
  },
  input_label: {
    fontSize: 16,
    color: "#000000",
    marginLeft: 8
  },
  input_label_help: {
    fontSize: 12,
    marginTop: 2,
    color: "#666666"
  },

  box_icon_label: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon_label: {
  },

  success_box: {
    padding: 15
  },
  success_title: {
    textAlign: 'center',
    lineHeight: 20,
    color: "#000000"
  },
  success_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  success_icon_label: {
    color: DEFAULT_COLOR,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  },
  input_note_value: {
    fontSize: 14,
    marginTop: 8,
    color: "#404040",
    marginLeft: 22
  }

});
