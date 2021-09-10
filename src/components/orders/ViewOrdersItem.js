/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  FlatList,
  Animated
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import EventTracker from '../../helper/EventTracker';
import Clipboard from '@react-native-community/clipboard';

class ViewOrdersItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coppy_sticker_flag: false,
      address_height: 50,
      continue_loading: false,
      cart_data: props.data,
      noteOffset: 0,
      suggest_register: false,
      name_register: props.data.address ? props.data.address.name : '',
      tel_register: props.tel
    };
    this.eventTracker = new EventTracker();
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  _showSticker() {
    this.setState(
      {
        coppy_sticker_flag: true
      },
      () => {
        setTimeout(() => {
          this.setState({
            coppy_sticker_flag: false
          });
        }, 2000);
      }
    );
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

  _goBack() {
    Actions.pop();
  }

  _onLayout(event) {
    if (this.state.noteOffset == 0) {
      this.setState({
        noteOffset: event.nativeEvent.layout.y - 8
      });
    }
  }

  _scrollToTop(top = 0) {
    if (this.refs_confirm_page) {
      this.refs_confirm_page.scrollTo({ x: 0, y: top, animated: true });
      this.setState({
        scrollTop: top
      });
    }
  }

  render() {
    var { loading, cart_data } = this.state;
    var cart_data = this.state.data;
    if (!cart_data) {
      cart_data = this.props.data;
    }

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

    // show loading
    if (cart_data == null) {
      return (
        <View style={styles.container}>
          <Indicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView
          onScroll={event => {
            var scrollTop = event.nativeEvent.contentOffset.y;
            this.setState({ scrollTop });
          }}
          //keyboardShouldPersistTaps="always"
          scrollEventThrottle={16}
          ref={ref => (this.refs_confirm_page = ref)}
          style={[
            styles.content,
            {
              marginBottom: 0
            }
          ]}
        >
          <View
            style={[
              styles.rows,
              {
                marginTop: 0
              }
            ]}
          >
            <View style={styles.address_name_box}>
              <View>
                <View style={styles.box_icon_label}>
                  <Icon
                    style={styles.icon_label}
                    name="info-circle"
                    size={16}
                    color="#999999"
                  />
                  <Text style={styles.input_label}>Thông tin đơn hàng</Text>
                </View>
                <Text style={styles.desc_content}>
                  Mã đơn hàng: {cart_data.cart_code}
                </Text>
              </View>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}
                >
                  <View style={styles.orders_status_box}>
                    <Text style={styles.address_default_title}>Trạng thái</Text>
                    <Text style={[styles.orders_status]}>
                      {cart_data.status_view}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          <View style={[styles.rows, styles.borderBottom]}>
            <View style={styles.address_name_box}>
              <View style={styles.box_icon_label}>
                <Icon
                  style={styles.icon_label}
                  name="credit-card"
                  size={12}
                  color="#999999"
                />
                <Text style={styles.input_label}>Phương thức thanh toán</Text>
              </View>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}
                >
                  <Text style={styles.address_default_title}>
                    {cart_data.payment}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.rows,
              styles.borderBottom,
              styles.mt8,
              {
                paddingTop: 0,
                paddingRight: 0
              }
            ]}
          >
            <View
              style={[
                styles.address_name_box,
                {
                  paddingTop: 12
                }
              ]}
            >
              <View style={styles.box_icon_label}>
                <Icon
                  style={styles.icon_label}
                  name="truck"
                  size={13}
                  color="#999999"
                />
                <Text style={styles.input_label}>Địa chỉ giao hàng</Text>
              </View>
              <View
                style={[
                  styles.address_default_box,
                  {
                    position: 'absolute',
                    top: 0,
                    right: 0
                  }
                ]}
              ></View>
            </View>
            {address_data ? (
              <View style={styles.address_content}>
                <Text style={styles.address_name}>
                  {address_data ? address_data.name : 'Chưa nhập'}
                </Text>
                <Text style={styles.address_content_phone}>
                  {address_data ? address_data.tel : 'Chưa nhập'}
                </Text>

                <Text style={styles.address_content_address_detail}>
                  {address_data ? address_data.address : 'Chưa nhập'}
                </Text>
              </View>
            ) : (
              <View style={styles.address_content}>
                <Text style={styles.address_name}>
                  {address_data ? address_data.name : 'Chưa nhập'}
                </Text>
              </View>
            )}
          </View>

          <Animated.View
            onLayout={this._onLayout.bind(this)}
            style={[styles.rows, styles.borderBottom, styles.mt8]}
          >
            <TouchableHighlight
              underlayColor="#ffffff"
              onPress={() => {
                if (this.refs_cart_note) {
                  this.refs_cart_note.focus();
                }
              }}
            >
              <View style={styles.box_icon_label}>
                <Icon
                  style={styles.icon_label}
                  name="pencil-square-o"
                  size={15}
                  color="#999999"
                />
                <Animated.Text style={[styles.input_label]}>
                  Ghi chú
                </Animated.Text>
              </View>
            </TouchableHighlight>

            <Text style={styles.input_note_value}>
              {cart_data.user_note || 'Không có ghi chú'}
            </Text>
          </Animated.View>

          <View style={[styles.rows, styles.borderBottom, styles.mt8]}>
            <View style={styles.address_name_box}>
              <View style={styles.box_icon_label}>
                <Icon
                  style={styles.icon_label}
                  name="usd"
                  size={14}
                  color="#999999"
                />
                <Text style={styles.input_label}>Thành tiền</Text>
              </View>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}
                >
                  <Text
                    style={[styles.address_default_title, styles.title_active]}
                  >
                    {cart_data.total_selected}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          <View style={[styles.rows, styles.borderBottom, styles.mt8]}>
            <View style={styles.address_name_box}>
              <View style={styles.box_icon_label}>
                <Icon
                  style={styles.icon_label}
                  name="shopping-cart"
                  size={14}
                  color="#999999"
                />
                <Text style={styles.input_label}>Mặt hàng đã mua</Text>
              </View>
            </View>
          </View>
          <FlatList
            style={styles.items_box}
            data={cart_products_confirm}
            extraData={cart_products_confirm}
            renderItem={({ item, index }) => {
              // hide item not selected
              if (item.selected != 1) {
                return null;
              }

              return (
                <View
                  style={[
                    styles.cart_item_box,
                    {
                      height: 80
                    }
                  ]}
                >
                  <View style={styles.cart_item_image_box}>
                    <CachedImage
                      mutable
                      style={styles.cart_item_image}
                      source={{ uri: item.image }}
                    />
                  </View>

                  <View style={styles.cart_item_info}>
                    <View style={styles.cart_item_info_content}>
                      <Text style={styles.cart_item_info_name}>
                        {item.name}
                      </Text>

                      {!!item.classification && (
                        <Text style={styles.cart_item_info_name}>
                          {item.classification}
                        </Text>
                      )}
                      <View style={styles.cart_item_price_box}>
                        {item.discount_percent > 0 && (
                          <Text style={styles.cart_item_price_price_safe_off}>
                            {item.discount}
                          </Text>
                        )}
                        <Text style={styles.cart_item_price_price}>
                          {item.price_view}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.cart_item_weight}>
                    {item.quantity_view}
                  </Text>

                  {item.discount_percent > 0 && (
                    <View style={styles.item_safe_off}>
                      <View style={styles.item_safe_off_percent}>
                        <Text style={styles.item_safe_off_percent_val}>
                          -{item.discount_percent}%
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            }}
            keyExtractor={item => item.id}
          />

          <View
            style={[
              styles.rows,
              styles.borderBottom,
              {
                borderTopWidth: 0,
                backgroundColor: '#fafafa'
              }
            ]}
          >
            <View style={[styles.address_name_box]}>
              <Text style={[styles.text_total_items, styles.feeLabel]}>
                Giá tạm tính
              </Text>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}
                >
                  <Text
                    style={[
                      styles.address_default_title,
                      styles.title_active,
                      styles.feeValue,
                      { color: '#333333' }
                    ]}
                  >
                    {cart_data.total_before}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>

            {cart_data.promotions &&
              Object.keys(cart_data.promotions).length > 0 &&
              cart_data.promotions != null && (
                <View style={[styles.address_name_box, styles.feeBox]}>
                  <Text
                    style={[
                      styles.text_total_items,
                      styles.feeLabel,
                      { color: 'brown' }
                    ]}
                  >
                    {cart_data.promotions.title}
                  </Text>
                  <View style={styles.address_default_box}>
                    <TouchableHighlight
                      underlayColor="transparent"
                      onPress={() => 1}
                    >
                      <Text
                        style={[
                          styles.address_default_title,
                          styles.title_active,
                          styles.feeValue,
                          { color: 'brown' }
                        ]}
                      >
                        Giảm {cart_data.promotions.discount_text}
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>
              )}

            {cart_data.item_fee &&
              Object.keys(cart_data.item_fee).map(index => {
                return (
                  <View
                    key={index}
                    style={[styles.address_name_box, styles.feeBox]}
                  >
                    <Text
                      style={[
                        styles.text_total_items,
                        styles.feeLabel,
                        { color: DEFAULT_COLOR }
                      ]}
                    >
                      {index}
                    </Text>
                    <View style={styles.address_default_box}>
                      <TouchableHighlight
                        underlayColor="transparent"
                        onPress={() => 1}
                      >
                        <Text
                          style={[
                            styles.address_default_title,
                            styles.title_active,
                            styles.feeValue
                          ]}
                        >
                          {cart_data.item_fee[index]}
                        </Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                );
              })}
          </View>

          <View
            style={[
              styles.rows,
              styles.borderBottom,
              {
                borderTopWidth: 0
              }
            ]}
          >
            <View style={styles.address_name_box}>
              <Text
                style={[styles.text_total_items, styles.feeLabel, styles.both]}
              >
                Thành tiền{' '}
                <Text style={{ fontWeight: '400', fontSize: 14 }}>
                  ({cart_data.count_selected} sản phẩm)
                </Text>
              </Text>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}
                >
                  <Text
                    style={[
                      styles.address_default_title,
                      styles.title_active,
                      styles.feeValue,
                      styles.both
                    ]}
                  >
                    {cart_data.total_selected}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

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
    backgroundColor: '#ffffff',
    borderTopWidth: Util.pixel,
    borderColor: '#dddddd'
  },
  address_name_box: {
    flexDirection: 'row'
  },
  address_name: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600'
  },
  address_default_box: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  address_default_title: {
    color: '#666666',
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
    color: '#404040',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600'
  },
  address_content_address_detail: {
    color: '#404040',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20
  },
  address_content_phuong: {
    color: '#404040',
    fontSize: 14,
    marginTop: 4
  },
  address_content_city: {
    color: '#404040',
    fontSize: 14,
    marginTop: 4
  },
  address_content_tinh: {
    color: '#404040',
    fontSize: 14,
    marginTop: 4
  },

  desc_content: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    marginLeft: 22
  },
  orders_status_box: {
    alignItems: 'center'
  },
  orders_status: {
    fontSize: 12,
    color: '#fa7f50',
    fontWeight: '600',
    marginTop: 4
  },
  borderBottom: {
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
  },

  cart_item_box: {
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
  },
  cart_item_image_box: {
    width: '20%',
    height: '100%',
    marginLeft: 8
  },
  cart_item_image: {
    height: '100%',
    resizeMode: 'contain'
  },
  cart_item_info: {
    width: Util.size.width * 0.68 - 8,
    height: '100%'
  },
  cart_item_info_content: {
    paddingHorizontal: 15
  },
  cart_item_info_name: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 30
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
    borderColor: '#666666',
    borderRadius: 3
  },
  cart_item_actions_quantity: {
    paddingHorizontal: 8,
    minWidth: '30%',
    textAlign: 'center',
    color: '#404040',
    fontWeight: '500'
  },
  cart_item_btn_label: {
    color: '#404040',
    fontSize: 20,
    lineHeight: isIOS ? 20 : 24
  },
  cart_item_check_box: {
    width: '10%',
    justifyContent: 'center',
    marginLeft: '2%'
  },
  cart_item_check: {
    padding: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    width: 24
  },
  cart_item_price_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: '#dddddd'
  },
  cart_item_weight: {
    position: 'absolute',
    right: 15,
    bottom: 8,
    color: '#666666',
    fontSize: 12
  },

  cart_item_price_price_safe_off: {
    textDecorationLine: 'line-through',
    fontSize: 14,
    color: '#666666',
    marginRight: 4
  },
  cart_item_price_price: {
    fontSize: 14,
    color: DEFAULT_COLOR
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
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 8
  },

  mt8: {
    marginTop: 8
  },
  text_total_items: {
    fontSize: 14,
    color: '#000000'
  },

  input_address_text: {
    width: '100%',
    color: '#000000',
    fontSize: 14,
    marginTop: 4
  },
  input_label: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 8
  },
  input_label_help: {
    fontSize: 12,
    marginTop: 2,
    color: '#666666'
  },

  box_icon_label: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon_label: {},

  success_box: {
    padding: 15
  },
  success_title: {
    lineHeight: 20,
    color: '#000000'
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
    color: '#404040',
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
    color: '#ffffff',
    fontSize: 12
  },

  payments_nav: {
    backgroundColor: '#ffffff',
    height: 60,
    flexDirection: 'row',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
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
    width: Util.size.width / 4 - 14,
    top: 20,
    right: 0,
    height: Util.pixel,
    backgroundColor: DEFAULT_COLOR
  },
  payments_nav_items_right_active: {
    position: 'absolute',
    width: Util.size.width / 4 - 14,
    top: 20,
    left: 0,
    height: Util.pixel,
    backgroundColor: DEFAULT_COLOR
  },
  borderBottom: {
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd'
  },
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8
  },

  payments_nav_icon_box: {
    borderWidth: Util.pixel,
    borderColor: '#cccccc',
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
  },

  uncheckOverlay: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  boxButtonActions: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16
  },
  boxButtonAction: {
    flexDirection: 'row',
    borderWidth: Util.pixel,
    borderColor: '#666666',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: Util.size.width / 2 - 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonActionTitle: {
    color: '#333333',
    marginLeft: 4,
    fontSize: 14
  },
  starReviews: {
    marginLeft: 2
  },
  feeBox: {
    marginTop: 12
  },
  feeLabel: {
    fontSize: 16
  },
  feeValue: {
    fontSize: 16
  },
  both: {
    fontWeight: '600'
  }
});

export default observer(ViewOrdersItem);
