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
  Clipboard,
  Keyboard,
  Alert,
  Animated
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
import RightButtonCall from '../RightButtonCall';
import { CheckBox } from '../../lib/react-native-elements';

@observer
export default class Confirm extends Component {
  constructor(props) {
    super(props);

    var is_paymenting = props.data && props.data.status == CART_STATUS_ORDERING;

    this.state = {
     single: this.props.from_page != 'orders_item' || is_paymenting,
     coppy_sticker_flag: false,
     address_height: 50,
     continue_loading: false,
     data: null,
     noteOffset: 0,
     suggest_register: false,
     name_register: store.cart_data ? store.cart_data.address.name : '',
     tel_register: store.cart_data ? store.cart_data.address.tel : '',
     pass_register: ''
    }
  }

  componentWillMount() {
    if (this.state.single && store.noteHighlight) {
      this.animatedValue = new Animated.Value(0);
      store.noteHighlight = false;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.notice_data != nextProps.notice_data) {
      this.setState({
        notice_data: nextProps.notice_data
      }, () => {
        this._initial(nextProps);
      });
    }
  }

  componentDidMount() {
    this._initial(this.props);
  }

  _initial(props) {
    if (!this.state.single) {
      if (props.notice_data) {
        this._getOrdersItem(props.notice_data.site_id, props.notice_data.page_id);
      } else {
        Actions.refresh({
          renderRightButton: this._renderRightButton.bind(this)
        });
      }
    } else {
      // callback when unmount this sreen
      store.setStoreUnMount('confirm_head', this._unMount.bind(this));

      Actions.refresh({
        onBack: () => {
          this._unMount();

          Actions.pop();
        }
      });
    }
  }

  _unMount() {
    Keyboard.dismiss();
  }

  async _siteInfo(site_id) {
    try {
      var response = await APIHandler.site_detail(site_id);

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setStoreData(response.data);

          this.cart_tel = response.data.tel;

          Actions.refresh({
            title: '#' + this.state.data.cart_code,
            renderRightButton: this._renderRightButton.bind(this)
          });
        })();
      }

    } catch (e) {
      console.warn(e + ' site_info');

      return Alert.alert(
        'Thông báo',
        'Kết nối mạng bị lỗi',
        [
          {text: 'Thử lại', onPress: () => {
            this._siteInfo(site_id);
          }},
        ],
        { cancelable: false }
      );
    } finally {

    }
  }

  async _getOrdersItem(site_id, page_id) {
    try {
      var response = await APIHandler.site_cart_by_id(site_id, page_id);

      if (response && response.status == STATUS_SUCCESS) {

        this.setState({
          data: response.data
        }, () => {
          this._siteInfo(site_id);
        });
      }
    } catch (e) {
      console.warn(e + ' site_cart_by_id');

      return Alert.alert(
        'Thông báo',
        'Kết nối mạng bị lỗi',
        [
          {text: 'Thử lại', onPress: this._getOrdersItem.bind(this, site_id, page_id)},
        ],
        { cancelable: false }
      );
    } finally {

    }
  }

  _renderRightButton() {
    var cart_data = this.props.data;
    if (!cart_data) {
      cart_data = this.state.data || {};
    }

    return(
      <View style={styles.right_btn_box}>
        <RightButtonCall
          tel={this.props.tel || this.cart_tel}
        />

        <RightButtonChat
          store_id={cart_data.site_id || undefined}
          title={cart_data.shop_name || undefined}
          tel={this.props.tel || this.cart_tel}
         />
      </View>
    );
  }

  // update cart note
  _updateCartNote(callback) {
    this.setState({
      continue_loading: true
    }, async () => {
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
        console.warn(e + ' site_cart_node');

        return Alert.alert(
          'Thông báo',
          'Kết nối mạng bị lỗi',
          [
            {text: 'Thử lại', onPress: this._updateCartNote.bind(this, callback)},
          ],
          { cancelable: false }
        );
      } finally {
        this.setState({
          continue_loading: false
        });
      }
    });
  }

  // cart orders
  _siteCartOrders() {
    this.setState({
      continue_loading: true
    }, async () => {
      try {
        var response = await APIHandler.site_cart_orders(store.store_id);

        if (response && response.status == STATUS_SUCCESS) {

          if (this.popup_message) {
            this.popup_message.open();

            // first orders
            this.setState({
              continue_loading: false,
              suggest_register: response.data.total_orders == 1,
              name_register: response.data.address.name,
              tel_register: response.data.address.tel
            });

            // hide back button
            Actions.refresh({
              hideBackImage: true,
              onBack: () => false,
              panHandlers: null
            });

            Events.trigger(RELOAD_STORE_ORDERS);

            // update cart data
            action(() => {
              // update cart
              store.setCartData(response.data);
              // reload home screen
              store.setRefreshHomeChange(store.refresh_home_change + 1);
              // hide payment nav
              store.setPaymentNavShow(false);
              // reload orders list screen
              store.setOrdersKeyChange(store.orders_key_change + 1);
            })();
          }
        }
      } catch (e) {
        console.warn(e + ' site_cart_orders');

        return Alert.alert(
          'Thông báo',
          'Kết nối mạng bị lỗi',
          [
            {text: 'Thử lại', onPress: this._siteCartOrders.bind(this)},
          ],
          { cancelable: false }
        );
      } finally {

      }
    });
  }

  // on save
  _onSave() {

    Keyboard.dismiss();

    if (store.cart_data.count_selected <= 0) {
      return Alert.alert(
        'Thông báo',
        'Bạn cần chọn ít nhất (01) mặt hàng để tiếp tục',
        [
          {text: 'Đồng ý', onPress: () => {
            if (this.props.add_new) {
              this.props.add_new();
            }
          }},
        ],
        { cancelable: false }
      );
    }

    // required cart note

    // if (!store.user_cart_note) {
    //   return Alert.alert(
    //     'Thông báo',
    //     'Vui lòng nhập phần ghi chú',
    //     [
    //       {text: 'Đồng ý', onPress: () => {
    //         if (this.refs_cart_note) {
    //           this.refs_cart_note.focus();
    //         }
    //       }},
    //     ],
    //     { cancelable: false }
    //   );
    // }

    // end required cart note

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
    const onBack = () => {
      Actions.confirm({
        type: ActionConst.REPLACE
      });
    }

    Actions.address({
      type: ActionConst.REPLACE,
      onBack
    });
  }

  // show popup confirm remove item in cart
  _removeItemCartConfirm(item) {
    if (this.refs_remove_item_confirm) {
      this.refs_remove_item_confirm.open();
    }

    this.cartItemConfirmRemove = item;
  }

  // close popup confirm remove item in cart
  _closePopupConfirm() {
    if (this.refs_remove_item_confirm) {
      this.refs_remove_item_confirm.close();
    }
  }

  _delay() {
    var delay = 400 - (Math.abs(time() - this.start_time));
    return delay;
  }

  // xoá item trong giỏ hàng
  async _removeCartItem() {
    if (!this.cartItemConfirmRemove) {
      return;
    }

    this.start_time = time();

    this._closePopupConfirm();

    var item = this.cartItemConfirmRemove;

    try {
      var response = await APIHandler.site_cart_remove(store.store_id, item.id);

      if (response && response.status == STATUS_SUCCESS) {

        setTimeout(() => {
          action(() => {

            store.setCartData(response.data);
            // prev item in list
            if (isAndroid && store.cart_item_index > 0) {
              var index = store.cart_item_index - 1;
              store.setCartItemIndex(index);
              Events.trigger(NEXT_PREV_CART, {index});
            }

            if (store.cart_data == null || store.cart_products == null) {
              store.setRefreshHomeChange(store.refresh_home_change + 1);
              Actions.pop();
            }
          })();
        }, this._delay());
      }

      this.cartItemConfirmRemove = undefined;
    } catch (e) {
      console.warn(e + ' site_cart_remove');

      return Alert.alert(
        'Thông báo',
        'Kết nối mạng bị lỗi',
        [
          {text: 'Thử lại', onPress: this._removeCartItem.bind(this)},
        ],
        { cancelable: false }
      );
    } finally {

    }
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

    clearTimeout(this._delayViewOrders);
    this._delayViewOrders = setTimeout(() => {
      // define custom onback
      const onBack = action(() => {
        store.resetCartData();
        Actions.pop();
      });

      // onback
      Actions.orders_item({
        title: `#${store.cart_data.cart_code}`,
        data: store.cart_data,
        tel: store.store_data.tel,
        onBack
      });

      // add stack unmount
      store.setStoreUnMount('confirm', onBack);
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

  _onLayout(event) {
    if (this.state.noteOffset == 0) {
      this.setState({
        noteOffset: event.nativeEvent.layout.y - 8
      });
    }

    if (this.animatedValue) {
      Animated.timing(this.animatedValue, {
        toValue: 150,
        duration: 2000
      }).start();
    }
  }

  _scrollToTop(top = 0) {
    if (this.refs_confirm_page) {
      this.refs_confirm_page.scrollTo({x: 0, y: top, animated: true});
      this.setState({
        scrollTop: top
      });
    }
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
    }

    // show loading
    if (cart_data == null || cart_products_confirm == null || address_data == null) {
      return (
        <View style={styles.container}>
          <Indicator />
        </View>
      );
    }

    // animation
    var interpolateColor, interpolateColor2, animatedStyle, animatedStyle2;

    if (this.animatedValue) {
      interpolateColor = this.animatedValue.interpolate({
        inputRange: [0, 150],
        outputRange: [hexToRgbA(DEFAULT_COLOR, 0.8), hexToRgbA("#ffffff", 1)]
      });
      interpolateColor2 = this.animatedValue.interpolate({
        inputRange: [0, 150],
        outputRange: [hexToRgbA("#ffffff", 1), hexToRgbA("#000000", 1)]
      });

      animatedStyle = {
        backgroundColor: interpolateColor
      }
      animatedStyle2 = {
        // color: interpolateColor2
      }
    }

    var is_login = store.user_info != null && store.user_info.verify_flag == STATUS_VERIFYED;
    var is_ready = cart_data.status == CART_STATUS_READY;
    var is_reorder = cart_data.status == CART_STATUS_COMPLETED;
    var is_paymenting = cart_data.status == CART_STATUS_ORDERING;

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

                <View style={styles.payments_nav_items_right_active} />
              </View>
            </TouchableHighlight>
          </View>
        )}

        <ScrollView
          onScroll={(event) => {
            var scrollTop = event.nativeEvent.contentOffset.y;
            this.setState({ scrollTop });
          }}
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

          <View style={[styles.rows, styles.borderBottom, single ? null : styles.mt8, {
            paddingTop: 0,
            paddingRight: 0
          }]}>
            <View style={[styles.address_name_box, {
              paddingTop: 12
            }]}>
              <View style={styles.box_icon_label}>
                <Icon style={styles.icon_label} name="truck" size={13} color="#999999" />
                <Text style={styles.input_label}>Địa chỉ giao hàng</Text>
              </View>
              <View style={[styles.address_default_box, {
                position: 'absolute',
                top: 0,
                right: 0
              }]}>
                {single ? (
                  <TouchableHighlight
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 15
                    }}
                    underlayColor="transparent"
                    onPress={this._goAddress.bind(this)}>
                    <Text style={[styles.address_default_title, styles.title_active]}>NHẤN ĐỂ THAY ĐỔI</Text>
                  </TouchableHighlight>
                ) : (
                  <TouchableHighlight
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 15
                    }}
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

          <Animated.View
            onLayout={this._onLayout.bind(this)}
            style={[styles.rows, styles.borderBottom, styles.mt8, animatedStyle]}>
            <TouchableHighlight
              underlayColor="#ffffff"
              onPress={() => {
                if (this.refs_cart_note) {
                  this.refs_cart_note.focus();
                }
              }}
            >
              <View style={styles.box_icon_label}>
                <Icon style={styles.icon_label} name="pencil-square-o" size={15} color="#999999" />
                <Animated.Text style={[styles.input_label, animatedStyle2]}>Ghi chú</Animated.Text>
              </View>
            </TouchableHighlight>
            {single ? (
              <View>
                <TouchableHighlight
                  underlayColor="#ffffff"
                  onPress={() => {
                    if (this.refs_cart_note) {
                      this.refs_cart_note.focus();
                    }
                  }}
                >
                  <Text style={styles.input_label_help}>(Thời gian giao hàng, ghi chú khác)</Text>
                </TouchableHighlight>

                <TextInput
                  ref={ref => this.refs_cart_note = ref}
                  style={[styles.input_address_text, {height: this.state.address_height > 50 ? this.state.address_height : 50}]}
                  keyboardType="default"
                  maxLength={250}
                  placeholder="Nhập ghi chú của bạn tại đây"
                  placeholderTextColor="#999999"
                  multiline={true}
                  underlineColorAndroid="transparent"
                  onContentSizeChange={(e) => {
                    this.setState({address_height: e.nativeEvent.contentSize.height});
                  }}
                  onChangeText={(value) => {
                    action(() => {
                      store.setUserCartNote(value);
                    })();
                  }}
                  onFocus={this._scrollToTop.bind(this, this.state.noteOffset)}
                  value={store.user_cart_note || (store.cart_data ? store.cart_data.user_note : '')}
                  />
              </View>
            ) : (
              <Text style={styles.input_note_value}>{cart_data.user_note || "Không có ghi chú"}</Text>
            )}
          </Animated.View>

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

          {single ? (
            <FlatList
              style={styles.items_box}
              data={cart_products_confirm}
              extraData={cart_products_confirm}
              renderItem={({item, index}) => {
                return(
                  <ItemCartComponent
                    parentCtx={this}
                    item={item}
                  />
                );
              }}
              keyExtractor={item => item.id}
            />
          ) : (
            <FlatList
              style={styles.items_box}
              data={cart_products_confirm}
              extraData={cart_products_confirm}
              renderItem={({item, index}) => {
                // hide item not selected
                if (item.selected != 1) {
                  return null;
                }

                return(
                  <View style={[styles.cart_item_box, {
                    height: 80
                  }]}>
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

          {(is_ready || is_reorder || is_paymenting) && (
            <View style={styles.boxButtonActions}>
              {is_ready && (
                <TouchableHighlight
                  style={[styles.buttonAction, {
                    marginRight: 6
                  }]}
                  onPress={this.confirmCancelCart.bind(this, cart_data)}
                  underlayColor="transparent">
                  <View style={styles.boxButtonAction}>
                    <Icon name="comments-o" size={16} color="#333333" />
                    <Text style={styles.buttonActionTitle}>Huỷ đơn</Text>
                  </View>
                </TouchableHighlight>
              )}

              {is_ready && (
                <TouchableHighlight
                  style={[styles.buttonAction, {
                    marginLeft: 6
                  }]}
                  onPress={this.confirmEditCart.bind(this, cart_data)}
                  underlayColor="transparent">
                  <View style={styles.boxButtonAction}>
                    <Icon name="pencil-square-o" size={16} color="#333333" />
                    <Text style={styles.buttonActionTitle}>Sửa đơn</Text>
                  </View>
                </TouchableHighlight>
              )}

              {is_reorder && (
                <TouchableHighlight
                  style={styles.buttonAction}
                  onPress={this.confirmCoppyCart.bind(this, cart_data)}
                  underlayColor="transparent">
                  <View style={[styles.boxButtonAction, {
                    width: Util.size.width - 30
                  }]}>
                    <Icon name="refresh" size={16} color="#333333" />
                    <Text style={styles.buttonActionTitle}>Mua lại</Text>
                  </View>
                </TouchableHighlight>
              )}

              {is_paymenting && (
                <TouchableHighlight
                  style={styles.buttonAction}
                  onPress={this.goBackStores.bind(this, cart_data)}
                  underlayColor="transparent">
                  <View style={[styles.boxButtonAction, {
                    width: Util.size.width - 30
                  }]}>
                    <Icon name="plus" size={16} color="#333333" />
                    <Text style={styles.buttonActionTitle}>Chọn thêm mặt hàng</Text>
                  </View>
                </TouchableHighlight>
              )}
            </View>
          )}

        </ScrollView>

        {single && (
          <TouchableHighlight
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

          </TouchableHighlight>
        )}

        {this.state.suggest_register && !is_login ? (
          <PopupConfirm
            ref_popup={ref => this.popup_message = ref}
            title={"Bạn đã đặt hàng thành công.\n\nĐăng ký thành viên để hưởng nhiều ưu đãi, khuyến mãi hơn nữa!"}
            noTitle="Xem đơn hàng"
            noBlur
            noConfirm={this._viewOrders.bind(this)}
            yesTitle="Đăng ký ngay!"
            yesConfirm={this._onRegister.bind(this)}
            height={340}
            otherClose={false}
            style={{
              marginTop: -(NAV_HEIGHT/2)
            }}
            content={(title) => {
              return(
                <View style={styles.success_box}>
                  <View style={styles.success_icon_box}>
                    <Icon name="check-circle" size={24} color={DEFAULT_COLOR} />
                    <Text style={styles.success_icon_label}>THÀNH CÔNG</Text>
                  </View>
                  <Text style={styles.success_title}>{title}</Text>

                  <TextInput
                    ref={ref => this.refs_name_register = ref}
                    style={{
                      borderWidth: Util.pixel,
                      borderColor: "#dddddd",
                      padding: 8,
                      borderRadius: 3,
                      marginTop: 12
                    }}
                    keyboardType="default"
                    maxLength={100}
                    placeholder="Nhập tên của bạn"
                    placeholderTextColor="#999999"
                    underlineColorAndroid="transparent"
                    onChangeText={(value) => {
                      this.setState({
                        name_register: value
                      });
                    }}
                    value={this.state.name_register}
                    />

                  <TextInput
                    ref={ref => this.refs_tel_register = ref}
                    style={{
                      borderWidth: Util.pixel,
                      borderColor: "#dddddd",
                      padding: 8,
                      borderRadius: 3,
                      marginTop: 8
                    }}
                    keyboardType="default"
                    maxLength={250}
                    placeholder="Nhập số điện thoại"
                    placeholderTextColor="#999999"
                    underlineColorAndroid="transparent"
                    onChangeText={(value) => {
                      this.setState({
                        tel_register: value
                      });
                    }}
                    value={this.state.tel_register}
                    />

                  <TextInput
                    ref={ref => this.refs_pass_register = ref}
                    style={{
                      borderWidth: Util.pixel,
                      borderColor: "#dddddd",
                      padding: 8,
                      borderRadius: 3,
                      marginTop: 8
                    }}
                    keyboardType="default"
                    maxLength={50}
                    placeholder="Nhập mật khẩu"
                    placeholderTextColor="#999999"
                    underlineColorAndroid="transparent"
                    onChangeText={(value) => {
                      this.setState({
                        pass_register: value
                      });
                    }}
                    value={this.state.pass_register}
                    />
                </View>
              );
            }}
            />
        ) : (
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
        )}

        <Sticker
          active={this.state.coppy_sticker_flag}
          message="Sao chép thành công."
         />

       <PopupConfirm
         ref_popup={ref => this.refs_remove_item_confirm = ref}
         title="Bạn muốn bỏ sản phẩm này khỏi giỏ hàng?"
         height={110}
         noConfirm={this._closePopupConfirm.bind(this)}
         yesConfirm={this._removeCartItem.bind(this)}
         otherClose={false}
         />

       <PopupConfirm
         ref_popup={ref => this.refs_cancel_cart = ref}
         title="Huỷ bỏ đơn hàng này, bạn đã chắc chắn chưa?"
         height={110}
         noConfirm={this._closePopupCancel.bind(this)}
         yesConfirm={this._cancelCart.bind(this)}
         otherClose={false}
         />

       <PopupConfirm
         ref_popup={ref => this.refs_coppy_cart = ref}
         title="Giỏ hàng đang mua (nếu có) sẽ bị xoá! Bạn vẫn muốn sao chép đơn hàng này?"
         height={110}
         noConfirm={this._closePopupCoppy.bind(this)}
         yesConfirm={this._coppyCart.bind(this)}
         otherClose={false}
         />

       <PopupConfirm
         ref_popup={ref => this.refs_edit_cart = ref}
         title="Giỏ hàng đang mua (nếu có) sẽ bị xoá! Bạn vẫn muốn sửa đơn hàng này?"
         height={110}
         noConfirm={this._closePopupEdit.bind(this)}
         yesConfirm={this._editCart.bind(this)}
         otherClose={false}
         />
      </View>
    );
  }

  goBackStores(item) {
    action(() => {
      store.setStoreData({
        id: item.site_id,
        name: item.shop_name,
        tel: item.tel
      });
    })();

    Actions.myTabBar({
      type: ActionConst.RESET
    });

    setTimeout(() => {
      Actions.stores({
        title: item.shop_name
      });
    }, 1000);
  }

  async _cancelCart() {
    if (this.item_cancel) {

      try {
        var response = await APIHandler.site_cart_cancel(this.item_cancel.site_id, this.item_cancel.id);

        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setOrdersKeyChange(store.orders_key_change + 1);
            Events.trigger(RELOAD_STORE_ORDERS);
          })();
          this._getOrdersItem(this.item_cancel.site_id, this.item_cancel.id);
        }
      } catch (e) {
        console.warn(e + ' site_cart_cancel');

        return Alert.alert(
          'Thông báo',
          'Kết nối mạng bị lỗi',
          [
            {text: 'Thử lại', onPress: this._cancelCart.bind(this)},
          ],
          { cancelable: false }
        );
      } finally {

      }

    }

    this._closePopupCancel();
  }

  _closePopupCancel() {
    if (this.refs_cancel_cart) {
      this.refs_cancel_cart.close();
    }
  }

  confirmCancelCart(item) {
    this.item_cancel = item;

    if (this.refs_cancel_cart) {
      this.refs_cancel_cart.open();
    }
  }

  _onRegister() {
    var name = this.state.name_register;
    var tel = this.state.tel_register;
    var pass = this.state.pass_register;

    name = name.trim();
    tel = tel.trim();
    password = pass.trim();

    if (!name) {
      return Alert.alert(
        'Thông báo',
        'Hãy điền tên của bạn',
        [
          {text: 'Đồng ý', onPress: () => {
            this.refs_name_register.focus();
          }},
        ],
        { cancelable: false }
      );
    }

    if (!tel) {
      return Alert.alert(
        'Thông báo',
        'Hãy điền Số điện thoại',
        [
          {text: 'Đồng ý', onPress: () => {
            this.refs_tel_register.focus();
          }},
        ],
        { cancelable: false }
      );
    }

    if (!password) {
      return Alert.alert(
        'Thông báo',
        'Hãy điền Mật khẩu',
        [
          {text: 'Đồng ý', onPress: () => {
            this.refs_pass_register.focus();
          }},
        ],
        { cancelable: false }
      );
    }

    Keyboard.dismiss();

    // go register screen
    Actions.register({
      name_props: name,
      tel_props: tel,
      password_props: password,
      registerNow: true
    });
  }

  async _coppyCart() {
    if (this.item_coppy) {
      try {
        var response = await APIHandler.site_cart_reorder(this.item_coppy.site_id, this.item_coppy.id);
        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setCartData(response.data);
            store.setOrdersKeyChange(store.orders_key_change + 1);
            Events.trigger(RELOAD_STORE_ORDERS);
          })();

          Toast.show(response.message);

          Actions.pop();

          setTimeout(() => {
            Actions.confirm({
              goConfirm: true
            });
          }, 1000);
        }
      } catch (e) {
        console.warn(e + ' site_cart_reorder');

        return Alert.alert(
          'Thông báo',
          'Kết nối mạng bị lỗi',
          [
            {text: 'Thử lại', onPress: this._coppyCart.bind(this)},
          ],
          { cancelable: false }
        );
      } finally {

      }
    }

    this._closePopupCoppy();
  }

  async _editCart() {
    if (this.item_edit) {
      try {
        var response = await APIHandler.site_cart_edit(this.item_edit.site_id, this.item_edit.id);
        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setCartData(response.data);
            store.setOrdersKeyChange(store.orders_key_change + 1);
            Events.trigger(RELOAD_STORE_ORDERS);
          })();

          this.setState({
            single: true
          });

          this._getOrdersItem(this.item_edit.site_id, this.item_edit.id);

        }
      } catch (e) {
        console.warn(e + ' site_cart_edit');

        return Alert.alert(
          'Thông báo',
          'Kết nối mạng bị lỗi',
          [
            {text: 'Thử lại', onPress: this._editCart.bind(this)},
          ],
          { cancelable: false }
        );
      } finally {

      }
    }

    this._closePopupEdit();
  }

  _closePopupEdit() {
    if (this.refs_edit_cart) {
      this.refs_edit_cart.close();
    }
  }

  _closePopupCoppy() {
    if (this.refs_coppy_cart) {
      this.refs_coppy_cart.close();
    }
  }

  confirmCoppyCart(item) {
    this.item_coppy = item;

    if (this.refs_coppy_cart) {
      this.refs_coppy_cart.open();
    }
  }

  confirmEditCart(item) {
    this.item_edit = item;

    if (this.refs_edit_cart) {
      this.refs_edit_cart.open();
    }
  }

}

/* @flow */

class ItemCartComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      check_loading: false,
      increment_loading: false,
      decrement_loading: false
    }
  }

  _checkBoxHandler(item) {
    this.setState({
      check_loading: true
    }, async () => {
      try {
        if (item.selected == 1) {
          var response = await APIHandler.site_cart_unselect(store.store_id, item.id);
        } else {
          var response = await APIHandler.site_cart_select(store.store_id, item.id);
        }

        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setCartData(response.data);
          })();
        }

      } catch (e) {
        if (item.selected == 1) {
          console.warn(e + ' site_cart_unselect');
        } else {
          console.warn(e + ' site_cart_select');
        }

        return Alert.alert(
          'Thông báo',
          'Kết nối mạng bị lỗi',
          [
            {text: 'Thử lại', onPress: this._checkBoxHandler.bind(this, item)},
          ],
          { cancelable: false }
        );
      } finally {
        this.setState({
          check_loading: false
        });
      }
    });
  }

  // xử lý trừ số lượng, số lượng = 0 confirm xoá
  _item_qnt_decrement_handler(item) {

    if (item.quantity <= 1) {
      this.props.parentCtx._removeItemCartConfirm(item);
    } else {
      this._item_qnt_decrement(item);
    }
  }

  // giảm số lượng item trong giỏ hàng
  _item_qnt_decrement(item) {
    this.setState({
      decrement_loading: true
    }, async () => {
      try {
        var response = await APIHandler.site_cart_down(store.store_id, item.id);

        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setCartData(response.data);
          })();

        }
      } catch (e) {
        console.warn(e + ' site_cart_down');

        return Alert.alert(
          'Thông báo',
          'Kết nối mạng bị lỗi',
          [
            {text: 'Thử lại', onPress: this._item_qnt_decrement.bind(this, item)},
          ],
          { cancelable: false }
        );
      } finally {
        this.setState({
          decrement_loading: false
        });
      }
    });
  }

  // tăng số lượng sảm phẩm trong giỏ hàng
  _item_qnt_increment(item) {
    this.setState({
      increment_loading: true
    }, async () => {
      try {
        var response = await APIHandler.site_cart_up(store.store_id, item.id);

        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setCartData(response.data);
          })();

        }
      } catch (e) {
        console.warn(e + ' site_cart_up');

        return Alert.alert(
          'Thông báo',
          'Kết nối mạng bị lỗi',
          [
            {text: 'Thử lại', onPress: this._item_qnt_increment.bind(this, item)},
          ],
          { cancelable: false }
        );
      } finally {
        this.setState({
          increment_loading: false
        });
      }
    });
  }

  render() {
    var item = this.props.item;

    var {check_loading, increment_loading, decrement_loading} = this.state;
    var is_processing = check_loading || increment_loading || decrement_loading;

    return (
      <View style={[styles.cart_item_box, {
        height: 120
      }]}>
        <View style={styles.cart_item_check_box}>
          {check_loading ? (
            <Indicator size="small" />
          ) : (
            <CheckBox
              containerStyle={styles.cart_item_check}
              checked={item.selected == 1 ? true : false}
              checkedColor={DEFAULT_COLOR}
              hiddenTextElement
              onPress={is_processing ? null : this._checkBoxHandler.bind(this, item)}
              />
          )}
        </View>

        <View style={styles.cart_item_image_box}>
          <Image style={styles.cart_item_image} source={{uri: item.image}} />
        </View>

        <View style={styles.cart_item_info}>
          <View style={styles.cart_item_info_content}>
            <Text style={styles.cart_item_info_name}>{item.name}</Text>
            <View style={styles.cart_item_actions}>
              <TouchableHighlight
                style={styles.cart_item_actions_btn}
                underlayColor="transparent"
                onPress={is_processing ? null : this._item_qnt_decrement_handler.bind(this, item)}>
                <View>
                  {decrement_loading ? (
                    <Indicator size="small" />
                  ) : (
                    <Text style={styles.cart_item_btn_label}>-</Text>
                  )}
                </View>
              </TouchableHighlight>

              <Text style={styles.cart_item_actions_quantity}>{item.quantity_view}</Text>

              <TouchableHighlight
                style={styles.cart_item_actions_btn}
                underlayColor="transparent"
                onPress={is_processing ? null : this._item_qnt_increment.bind(this, item)}>
                <View>
                  {increment_loading ? (
                    <Indicator size="small" />
                  ) : (
                    <Text style={styles.cart_item_btn_label}>+</Text>
                  )}
                </View>
              </TouchableHighlight>
            </View>

            <View style={styles.cart_item_price_box}>
              {item.discount_percent > 0 && (
                <Text style={styles.cart_item_price_price_safe_off}>{item.discount}</Text>
              )}
              <Text style={styles.cart_item_price_price}>{item.price_view}</Text>
            </View>
          </View>
        </View>

        {item.discount_percent > 0 && (
          <View style={styles.item_safe_off}>
            <View style={styles.item_safe_off_percent}>
              <Text style={styles.item_safe_off_percent_val}>-{item.discount_percent}%</Text>
            </View>
          </View>
        )}

        {/*item.selected != 1 && (
          <TouchableHighlight
            underlayColor="transparent"
            onPress={this._checkBoxHandler.bind(this, item)}
            style={styles.uncheckOverlay}>
            <View></View>
          </TouchableHighlight>
        )*/}
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
    paddingVertical: 8,
    flexDirection: 'row',
    backgroundColor: "#ffffff",
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
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
    color: "#000000",
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
    backgroundColor: "#dddddd"
  },
  cart_item_weight: {
    position: 'absolute',
    right: 15,
    bottom: 8,
    color: "#666666",
    fontSize: 12
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
    flexDirection: 'row',
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
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
  },

  uncheckOverlay: {
    backgroundColor: "rgba(0,0,0,0.05)",
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  boxButtonActions: {
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16
  },
  boxButtonAction: {
    flexDirection: 'row',
    borderWidth: Util.pixel,
    borderColor: "#666666",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: Util.size.width / 2 - 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonActionTitle: {
    color: "#333333",
    marginLeft: 4,
    fontSize: 14
  }
});
