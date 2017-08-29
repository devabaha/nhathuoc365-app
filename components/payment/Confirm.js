/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  Clipboard
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';

// components
import ListHeader from '../stores/ListHeader';
import PopupConfirm from '../PopupConfirm';
import Sticker from '../Sticker';
import RightButtonChat from '../RightButtonChat';

@observer
export default class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
     cart_check_list: {},
     single: this.props.from != 'orders_item',
     coppy_sticker_flag: false,
     address_height: 50,
     continue_loading: false
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
        <RightButtonChat
          store_id={cart_data.site_id || undefined}
          title={cart_data.shop_name || undefined}
         />
      </View>
    );
  }

  // update cart note
  async _updateCartNote(callback) {
    this.setState({
      continue_loading: true
    });

    try {
      var response = await APIHandler.site_cart_node(store.store_id, {
        user_note: store.user_cart_note
      });

      if (response && response.status == STATUS_SUCCESS) {
        if (typeof callback == 'function') {
          callback();
        }
      }
    } catch (e) {
      console.warn(e);
    } finally {
      this.setState({
        continue_loading: false
      });
    }
  }

  // cart orders
  async _siteCartOrders() {
    this.setState({
      continue_loading: true
    });

    try {
      var response = await APIHandler.site_cart_orders(store.store_id);

      if (response && response.status == STATUS_SUCCESS) {
        if (this.popup_message) {
          this.popup_message.open();

          // update cart data
          action(() => {
            store.setCartData(response.data);
            this.setState({
              continue_loading: false
            });
          })();

          // hide back button
          Actions.refresh({
            hideBackImage: true
          });

          action(() => {
            // hide payment nav
            store.setPaymentNavShow(false);

            // reload orders list screen
            store.setOrdersKeyChange(store.orders_key_change + 1);
          })();
        }
      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  // on save
  _onSave() {

    if (store.user_cart_note) {
      // update cart note
      this._updateCartNote(() => {
        // cart orders
        this._siteCartOrders();
      });
    } else {
      // cart orders
      this._siteCartOrders();
    }
  }

  _goAddress() {
    Actions.address({
      type: ActionConst.REPLACE
    });
  }

  render() {
    var {single} = this.state;

    // from this
    if (single) {
      var { cart_data, cart_products_confirm } = store;
      var address_data = cart_data ? cart_data.address : null;
    }

    // from detail orders
    else {
      var cart_data = this.props.data;

      if (cart_data && Object.keys(cart_data.products).length > 0) {
        var cart_products_confirm = [];
        Object.keys(cart_data.products).map(key => {
          let product = cart_data.products[key];
          if (product.selected == 1) {
            cart_products_confirm.push(product);
          }
        });

        // set new data
        var cart_products_confirm = cart_products_confirm.reverse();
        var address_data = cart_data.address;
      }
    }

    // show loading
    if (cart_data == null || cart_products_confirm == null || address_data == null) {
      return (
        <View style={styles.container}>
          <Indicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {single && (
          <View style={styles.payments_nav}>
            <TouchableHighlight
              onPress={this._goAddress.bind(this)}
              underlayColor="transparent">
              <View style={styles.payments_nav_items}>
                <View style={[styles.payments_nav_icon_box, styles.payments_nav_icon_box_active]}>
                  <Icon style={[styles.payments_nav_icon, styles.payments_nav_icon_active]} name="map-marker" size={20} color="#999" />
                </View>
                <Text style={[styles.payments_nav_items_title, styles.payments_nav_items_title_active]}>1. Địa chỉ</Text>

                <View style={styles.payments_nav_items_active} />
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={() => {

              }}
              underlayColor="transparent">
              <View style={styles.payments_nav_items}>
                <View style={[styles.payments_nav_icon_box, styles.payments_nav_icon_box_active]}>
                  <Icon style={[styles.payments_nav_icon, styles.payments_nav_icon_active]} name="check" size={20} color="#999" />
                </View>
                <Text style={[styles.payments_nav_items_title, styles.payments_nav_items_title_active]}>2. Xác nhận</Text>

                <View style={styles.payments_nav_items_active} />
              </View>
            </TouchableHighlight>
          </View>
        )}

        <ScrollView
          //keyboardShouldPersistTaps="always"
          ref={ref => this.refs_confirm_page = ref}
          style={[styles.content, {
            marginBottom: single ? (store.keyboardTop + 60) : 0
          }]}>

          <View style={[styles.rows, {
            marginTop: single ? 8 : 0
          }]}>
            <View style={styles.address_name_box}>
              <View>
                <View style={styles.box_icon_label}>
                  <Icon style={styles.icon_label} name="info-circle" size={16} color="#999999" />
                  <Text style={styles.input_label}>Thông tin đơn hàng</Text>
                </View>
                <Text style={styles.desc_content}>Mã đơn hàng: #{cart_data.cart_code}</Text>
              </View>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <View style={styles.orders_status_box}>
                    <Text style={styles.address_default_title}>Trạng thái</Text>
                    <Text style={[styles.orders_status]}>{cart_data.status_view}</Text>
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
                  <Text style={styles.address_default_title}>{cart_data.payment}</Text>
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
                    onPress={this._goAddress.bind(this)}>
                    <Text style={[styles.address_default_title, styles.title_active]}>NHẤN ĐỂ THAY ĐỔI</Text>
                  </TouchableHighlight>
                ) : (
                  <TouchableHighlight
                    underlayColor="transparent"
                    onPress={this._coppyAddress.bind(this, address_data)}>
                    <Text style={[styles.address_default_title, styles.title_active]}>SAO CHÉP</Text>
                  </TouchableHighlight>
                )}
              </View>
            </View>

            <View style={styles.address_content}>
              <Text style={styles.address_name}>{address_data.name}</Text>
              <Text style={styles.address_content_phone}>{address_data.tel}</Text>
              {single ? (
                <View>
                  <Text style={styles.address_content_address_detail}>{address_data.address}</Text>
                  {/*<Text style={styles.address_content_phuong}>Phường Phương Lâm</Text>
                  <Text style={styles.address_content_city}>Thành Phố Hoà Bình</Text>
                  <Text style={styles.address_content_tinh}>Hoà Bình</Text>*/}
                </View>
              ) : (
                <Text style={styles.address_content_address_detail}>{address_data.address}</Text>
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
                  style={[styles.input_address_text, {height: this.state.address_height > 50 ? this.state.address_height : 50}]}
                  keyboardType="default"
                  maxLength={250}
                  placeholder="Nhập ghi chú của bạn tại đây"
                  placeholderTextColor="#999999"
                  multiline={true}
                  underlineColorAndroid="#ffffff"
                  onContentSizeChange={(e) => {
                    this.setState({address_height: e.nativeEvent.contentSize.height});
                  }}
                  onChangeText={(value) => {
                    action(() => {
                      store.setUserCartNote(value);
                    })();
                  }}
                  value={store.user_cart_note}
                  />
              </View>
            ) : (
              <Text style={styles.input_note_value}>{cart_data.user_note || "Không có ghi chú"}</Text>
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
                  <Text style={[styles.address_default_title, styles.title_active]}>{cart_data.total_selected}</Text>
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

          {cart_products_confirm != null && (
            <FlatList
              //renderSectionHeader={({section}) => <View style={styles.cart_section_box}><Text style={styles.cart_section_title}>{section.key}</Text></View>}
              onEndReached={(num) => {

              }}
              onEndReachedThreshold={0}
              style={styles.items_box}
              data={cart_products_confirm}
              extraData={cart_products_confirm}
              renderItem={({item, index}) => {
                // hide item not selected
                if (item.selected != 1) {
                  return null;
                }

                return(
                  <View style={styles.cart_item_box}>
                    <View style={styles.cart_item_image_box}>
                      <Image style={styles.cart_item_image} source={{uri: item.image}} />
                    </View>

                    <View style={styles.cart_item_info}>
                      <View style={styles.cart_item_info_content}>
                        <Text style={styles.cart_item_info_name}>{item.name}</Text>

                        <View style={styles.cart_item_price_box}>
                          {item.discount_percent > 0 && (
                            <Text style={styles.cart_item_price_price_safe_off}>{item.discount}</Text>
                          )}
                          <Text style={styles.cart_item_price_price}>{item.price_view}</Text>
                        </View>
                      </View>
                    </View>

                    <Text style={styles.cart_item_weight}>{item.quantity_view}</Text>

                    {item.discount_percent > 0 && (
                      <View style={styles.item_safe_off}>
                        <View style={styles.item_safe_off_percent}>
                          <Text style={styles.item_safe_off_percent_val}>-{item.discount_percent}%</Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              }}
              keyExtractor={item => item.id}
            />
          )}

          <View style={[styles.rows, styles.borderBottom, {
            borderTopWidth: 0
          }]}>
            <View style={styles.address_name_box}>
              <Text style={styles.text_total_items}>{cart_data.count_selected} sản phẩm</Text>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <Text style={[styles.address_default_title, styles.title_active]}>Thành tiền: {cart_data.total_selected}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>

        </ScrollView>

        {single && <TouchableHighlight
          style={[styles.cart_payment_btn_box, {
            bottom: store.keyboardTop
          }]}
          underlayColor="transparent"
          onPress={this._onSave.bind(this)}>

          <View style={styles.cart_payment_btn}>
            <View style={{
              minWidth: 20,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {this.state.continue_loading ? (
                <Indicator size="small" color="#ffffff" />
              ) : (
                <Icon name="check" size={20} color="#ffffff" />
              )}
            </View>
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

  _coppyAddress(address) {
    var address_string = `Địa chỉ giao hàng: ${address.name}, ${address.tel}, ${address.address}`;

    Clipboard.setString(address_string);

    this._showSticker();
  }

  _popupClose() {
    if (this.popup_message) {
      this.popup_message.close();
    }
  }

  _viewOrders() {
    this._popupClose();

    this._goBack();

    setTimeout(() => {
      Actions.orders_item({
        title: `Đơn hàng #${store.cart_data.cart_code}`,
        data: store.cart_data,
        onBack: () => {
          action(() => {
            store.resetCartData();
          })();
          Actions.pop();
        }
      });
    }, 1000);
  }

  _continueShopping() {
    this._popupClose();

    this._goBack();

    // clear cart data on app
    action(() => {
      store.resetCartData();
    })();
  }

  _goBack() {
    Actions.pop();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0
  },
  right_btn_box: {
    flexDirection: 'row'
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
    backgroundColor: "#ffffff",
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  cart_item_image_box: {
    width: '30%',
    height: '100%',
    marginLeft: 8
  },
  cart_item_image: {
    height: '100%',
    resizeMode: 'center'
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
    justifyContent: 'flex-end'
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

  payments_nav: {
    backgroundColor: '#ffffff',
    height: 60,
    flexDirection: 'row'
  },
  payments_nav_items: {
    justifyContent: 'center',
    height: 60,
    width: Util.size.width / 2,
    alignItems: 'center'
  },
  payments_nav_items_title: {
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '500',
    color: '#666666'
  },
  payments_nav_items_title_active: {
    color: DEFAULT_COLOR
  },
  payments_nav_items_active: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: DEFAULT_COLOR
  },
  borderBottom: {
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd"
  },
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8
  },

  payments_nav_icon_box: {
    borderWidth: Util.pixel,
    borderColor: "#cccccc",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4
  },
  payments_nav_icon_active: {
    color: DEFAULT_COLOR
  },
  payments_nav_icon_box_active: {
    borderColor: DEFAULT_COLOR
  }
});
