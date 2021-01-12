import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  TextInput,
  Clipboard,
  Keyboard,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import {Actions, ActionConst} from 'react-native-router-flux';
import store from '../../store/Store';
import ListHeader from '../stores/ListHeader';
import PopupConfirm from '../PopupConfirm';
import Sticker from '../Sticker';
import RightButtonChat from '../RightButtonChat';
import RightButtonCall from '../RightButtonCall';
import appConfig from 'app-config';
import Button from 'react-native-button';
import {USE_ONLINE} from 'app-packages/tickid-voucher';
import EventTracker from '../../helper/EventTracker';
import {ANALYTICS_EVENTS_NAME} from '../../constants';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import CartItem from './CartItem';

class Confirm extends Component {
  static defaultProps = {
    orderEdited: () => {},
  };
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
      name_register: '',
      tel_register: '',
      pass_register: '',
      paymentMethod: {},
    };

    this.unmounted = false;
    this.eventTracker = new EventTracker();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.notice_data != nextProps.notice_data) {
      this.setState(
        {
          notice_data: nextProps.notice_data,
        },
        () => {
          this._initial(nextProps);
        },
      );
    }
  }

  componentDidMount() {
    this._initial(this.props);

    setTimeout(() =>
      Actions.refresh({
        right: this._renderRightButton(),
      }),
    );
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  _initial(props) {
    if (!this.state.single) {
      if (props.notice_data) {
        this._getOrdersItem(
          props.notice_data.site_id,
          props.notice_data.page_id,
        );
      } else {
        Actions.refresh({
          renderRightButton: this._renderRightButton.bind(this),
        });
      }
    } else {
      // callback when unmount this sreen
      store.setStoreUnMount('confirm_head', this._unMount.bind(this));

      Actions.refresh({
        onBack: () => {
          this._unMount();

          Actions.pop();
        },
      });
    }
  }

  _unMount() {
    Keyboard.dismiss();
  }

  async _siteInfo(site_id) {
    const {t} = this.props;
    try {
      const response = await APIHandler.site_detail(site_id);

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          store.setStoreData(response.data);

          this.cart_tel = response.data.tel;

          Actions.refresh({
            title: '#' + this.state.data.cart_code,
            renderRightButton: this._renderRightButton.bind(this),
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('common:api.error.message'),
          });
        }
      }
    } catch (e) {
      console.log(e + ' site_info');
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    }
  }

  async _getOrdersItem(site_id, page_id) {
    try {
      const response = await APIHandler.site_cart_show(site_id, page_id);

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          this.setState(
            {
              data: response.data,
            },
            () => {
              this._siteInfo(site_id);
            },
          );

          // message: lấy thông tin thành công
          // Toast.show(response.message);
        }
      }
    } catch (e) {
      console.log(e + ' site_cart_show');
    }
  }

  _renderRightButton() {
    var cart_data = this.props.data;
    if (!cart_data) {
      cart_data = this.state.data || {};
    }

    return (
      <View style={styles.right_btn_box}>
        {/* <RightButtonCall tel={this.props.tel || this.cart_tel} /> */}

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
    this.setState(
      {
        continue_loading: true,
      },
      async () => {
        try {
          const response = await APIHandler.site_cart_note(store.store_id, {
            user_note: store.user_cart_note,
          });
          console.log(response);
          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              if (typeof callback == 'function') {
                callback();
              }

              // Nhập lưu ý thành công
              // Toast.show(response.message);
            }
          }
        } catch (e) {
          console.log(e + ' site_cart_note');
        } finally {
          !this.unmounted &&
            this.setState({
              continue_loading: false,
            });
        }
      },
    );
  }

  // cart orders
  _siteCartOrders() {
    this.setState(
      {
        continue_loading: true,
      },
      async () => {
        const {t} = this.props;
        try {
          const data = {
            ref_user_id: store.cart_data ? store.cart_data.ref_user_id : '',
          };
          const response = await APIHandler.site_cart_order(
            store.store_id,
            data,
          );

          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              if (this.popup_message) {
                this.popup_message.open();

                // first orders
                this.setState({
                  suggest_register: response.data.total_orders == 1,
                  name_register: response.data.address.name,
                  tel_register: response.data.address.tel,
                });

                // hide back button
                Actions.refresh({
                  hideBackImage: true,
                  onBack: () => false,
                  panHandlers: null,
                });

                Events.trigger(RELOAD_STORE_ORDERS);
                this.eventTracker.logEvent(ANALYTICS_EVENTS_NAME.cart.order, {
                  params: {
                    id: response.data.id,
                  },
                });

                // update cart data
                // update cart
                store.setCartData(response.data);
                // reload home screen
                store.setRefreshHomeChange(store.refresh_home_change + 1);
                // hide payment nav
                store.setPaymentNavShow(false);
                // reload orders list screen
                store.setOrdersKeyChange(store.orders_key_change + 1);
              }
              flashShowMessage({
                type: 'success',
                message: response.message,
              });
            } else {
              flashShowMessage({
                type: 'danger',
                message: response.message || t('common:api.error.message'),
              });
            }
          }
        } catch (e) {
          console.log(e + ' site_cart_order');
          flashShowMessage({
            type: 'danger',
            message: t('common:api.error.message'),
          });
        } finally {
          !this.unmounted &&
            this.setState({
              continue_loading: false,
            });
        }
      },
    );
  }

  // on save
  _onSave() {
    Keyboard.dismiss();

    if (store.cart_data.count_selected <= 0) {
      const {t} = this.props;
      return Alert.alert(
        t('cart:notification.noItemSelected.title'),
        t('cart:notification.noItemSelected.message'),
        [
          {
            text: t('cart:notification.noItemSelected.accept'),
            onPress: () => {
              if (this.props.add_new) {
                this.props.add_new();
              }
            },
          },
        ],
        {cancelable: false},
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
      Actions.push(appConfig.routes.paymentConfirm, {
        type: ActionConst.REPLACE,
      });
    };

    Actions.push(appConfig.routes.myAddress, {
      type: ActionConst.REPLACE,
      // onBack
    });
  }

  _goPaymentMethod = (cart_data) => {
    Actions.push(appConfig.routes.paymentMethod, {
      onConfirm: this.onConfirmPaymentMethod,
      selectedMethod: cart_data.payment_method,
      price: cart_data.total_before_view,
      totalPrice: cart_data.total_selected,
      extraFee: cart_data.item_fee,
      onUpdatePaymentMethod: (data) => {
        if (!this.state.single) {
          this.setState({data});
        }
      },
    });
  };

  onConfirmPaymentMethod = (method, extraData) => {
    const paymentMethod = {
      ...method,
      ...extraData,
    };
    this.setState({paymentMethod});
  };

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
    var delay = 400 - Math.abs(time() - this.start_time);
    return delay;
  }

  // xoá item trong giỏ hàng
  async _removeCartItem() {
    if (!this.cartItemConfirmRemove) {
      return;
    }
    const {t} = this.props;

    this.start_time = time();

    this._closePopupConfirm();

    var item = this.cartItemConfirmRemove;

    try {
      const data = {
        quantity: 0,
        model: item.model,
      };

      const response = await APIHandler.site_cart_update(
        store.store_id,
        item.id,
        data,
      );

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          setTimeout(() => {
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
          }, this._delay());

          flashShowMessage({
            message: response.message,
            type: 'success',
          });
        } else {
          flashShowMessage({
            message: response.message || t('common:api.error.message'),
            type: 'danger',
          });
        }
        this.cartItemConfirmRemove = undefined;
      }
    } catch (e) {
      console.log(e + ' site_cart_update');
      flashShowMessage({
        message: t('common:api.error.message'),
        type: 'danger',
      });
    }
  }

  _showSticker() {
    this.setState(
      {
        coppy_sticker_flag: true,
      },
      () => {
        setTimeout(() => {
          this.setState({
            coppy_sticker_flag: false,
          });
        }, 2000);
      },
    );
  }

  _coppyAddress(address) {
    const {t} = this.props;
    var address_string = `${t('confirm.address.title')}: ${address.name}, ${
      address.tel
    }, ${address.address}`;

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
      Actions.orders_item({
        title: `#${store.cart_data.cart_code}`,
        data: store.cart_data,
        tel: store.store_data.tel,
      });

      // add stack unmount
      store.setStoreUnMount('confirm', () => {
        store.resetCartData();
        Actions.pop();
      });
    }, 500);
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
        noteOffset: event.nativeEvent.layout.y - 8,
      });
    }
  }

  // _scrollToTop(top = 0) {
  //   if (this.refs_confirm_page) {
  //     this.refs_confirm_page.scrollTo({ x: 0, y: top, animated: true });
  //     this.setState({
  //       scrollTop: top
  //     });
  //   }
  // }

  openMyVoucher = () => {
    Actions.push(appConfig.routes.myVoucher, {
      mode: USE_ONLINE,
      siteId: this.props.store
        ? this.props.store.cart_store_id
        : store.cart_store_id,
      onUseVoucherOnlineSuccess: this.handleUseVoucherOnlineSuccess,
      onUseVoucherOnlineFailure: this.handleUseOnlineFailure,
    });
  };

  openCurrentVoucher = (userVoucher) => {
    Actions.push(appConfig.routes.voucherDetail, {
      mode: USE_ONLINE,
      title: userVoucher.voucher_name,
      voucherId: userVoucher.id,
      onRemoveVoucherSuccess: this.handleRemoveVoucherSuccess,
      onRemoveVoucherFailure: this.handleRemoveVoucherFailure,
    });
  };

  handleUseVoucherOnlineSuccess = (cartData, fromDetailVoucher = false) => {
    Actions.pop();
    if (fromDetailVoucher) {
      setTimeout(Actions.pop, 0);
    }
    action(() => {
      store.setCartData(cartData);
    })();
  };

  handleUseOnlineFailure = (response) => {};

  handleRemoveVoucherSuccess = (cartData) => {
    Actions.pop();
    action(() => {
      store.setCartData(cartData);
    })();
  };

  handleRemoveVoucherFailure = (response) => {};

  render() {
    const {t} = this.props;
    var {single} = this.state;
    // from this
    if (single) {
      var {cart_data, cart_products_confirm} = store;
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
        Object.keys(cart_data.products).map((key) => {
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
    if (
      cart_data == null ||
      cart_products_confirm == null ||
      address_data == null
    ) {
      return (
        <View style={styles.container}>
          <Indicator />
        </View>
      );
    }

    var is_login = store.user_info != null && store.user_info.username != null;
    var is_ready = cart_data.status == CART_STATUS_READY;
    var is_reorder = cart_data.status == CART_STATUS_COMPLETED;
    var is_paymenting = cart_data.status == CART_STATUS_ORDERING;

    return (
      <>
        {single && (
          <View style={styles.payments_nav}>
            <TouchableHighlight
              onPress={this._goAddress.bind(this)}
              underlayColor="transparent">
              <View style={styles.payments_nav_items}>
                <View
                  style={[
                    styles.payments_nav_icon_box,
                    styles.payments_nav_icon_box_active,
                  ]}>
                  <Icon
                    style={[
                      styles.payments_nav_icon,
                      styles.payments_nav_icon_active,
                    ]}
                    name="map-marker"
                    size={18}
                    color="#999"
                  />
                </View>
                <Text
                  style={[
                    styles.payments_nav_items_title,
                    styles.payments_nav_items_title_active,
                  ]}>
                  {t('confirm.process.step1')}
                </Text>

                <View style={styles.payments_nav_items_active} />
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => {}} underlayColor="transparent">
              <View style={styles.payments_nav_items}>
                <View
                  style={[
                    styles.payments_nav_icon_box,
                    styles.payments_nav_icon_box_active,
                  ]}>
                  <Icon
                    style={[
                      styles.payments_nav_icon,
                      styles.payments_nav_icon_active,
                    ]}
                    name="check"
                    size={18}
                    color="#999"
                  />
                </View>
                <Text
                  style={[
                    styles.payments_nav_items_title,
                    styles.payments_nav_items_title_active,
                  ]}>
                  {t('confirm.process.step2')}
                </Text>

                <View style={styles.payments_nav_items_right_active} />
              </View>
            </TouchableHighlight>
          </View>
        )}

        <KeyboardAwareScrollView style={styles.container}>
          <KeyboardAwareScrollView
            scrollEventThrottle={16}
            // onScroll={event => {
            //   const scrollTop = event.nativeEvent.contentOffset.y;
            //   this.setState({ scrollTop });
            // }}
            keyboardShouldPersistTaps="handled"
            ref={(ref) => (this.refs_confirm_page = ref)}
            style={[
              // styles.content,
              {
                // marginBottom: single ? store.keyboardTop + 60 : 0
              },
            ]}
            contentContainerStyle={{paddingTop: single ? 60 : 0}}>
            <View
              style={[
                styles.rows,
                {
                  marginTop: single ? 8 : 0,
                },
              ]}>
              <TouchableHighlight
                underlayColor="transparent"
                // onPress={() =>
                //   Actions.push(appConfig.routes.qrBarCode, {
                //     title: 'Mã đơn hàng',
                //     address: cart_data.cart_code,
                //     content: 'Dùng QRCode mã đơn hàng để xem thông tin'
                //   })
                // }
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
                      <Text style={styles.input_label}>
                        {t('confirm.information.title')}
                      </Text>
                    </View>
                    <Text style={styles.desc_content}>
                      {`${t('confirm.information.ordersCode')}:`}{' '}
                      {cart_data.cart_code}
                    </Text>
                  </View>
                  <View style={styles.address_default_box}>
                    <View style={styles.orders_status_box}>
                      <Text style={styles.address_default_title}>
                        {t('confirm.information.status')}
                      </Text>
                      <Text style={[styles.orders_status]}>
                        {cart_data.status_view}
                      </Text>
                    </View>
                  </View>
                  {/* <View
                  style={[
                    styles.profile_list_icon_box,
                    styles.profile_list_icon_box_angle
                  ]}
                >
                  <Icon name="angle-right" size={16} color="#999999" />
                </View> */}
                </View>
              </TouchableHighlight>
            </View>

            {single && <ListHeader title={t('confirm.information.recheck')} />}

            <View
              style={[
                styles.rows,
                styles.borderBottom,
                single ? null : styles.mt8,
                {
                  paddingTop: 0,
                  paddingRight: 0,
                },
              ]}>
              <View
                style={[
                  styles.address_name_box,
                  {
                    paddingTop: 12,
                  },
                ]}>
                <View style={styles.box_icon_label}>
                  <Icon
                    style={styles.icon_label}
                    name="truck"
                    size={13}
                    color="#999999"
                  />
                  <Text style={styles.input_label}>
                    {t('confirm.address.title')}
                  </Text>
                </View>
                <View
                  style={[
                    styles.address_default_box,
                    {
                      position: 'absolute',
                      top: 0,
                      right: 0,
                    },
                  ]}>
                  {single ? (
                    <TouchableHighlight
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 15,
                      }}
                      underlayColor="transparent"
                      onPress={this._goAddress.bind(this)}>
                      <Text
                        style={[
                          styles.address_default_title,
                          styles.title_active,
                        ]}>
                        {t('confirm.change')}
                      </Text>
                    </TouchableHighlight>
                  ) : (
                    <TouchableHighlight
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 15,
                      }}
                      underlayColor="transparent"
                      onPress={this._coppyAddress.bind(this, address_data)}>
                      <Text
                        style={[
                          styles.address_default_title,
                          styles.title_active,
                        ]}>
                        {t('confirm.copy.title')}
                      </Text>
                    </TouchableHighlight>
                  )}
                </View>
              </View>

              <View style={styles.address_content}>
                <Text style={styles.address_name}>{address_data.name}</Text>
                <Text style={styles.address_content_phone}>
                  {address_data.tel}
                </Text>
                {single ? (
                  <View>
                    <Text style={styles.address_content_address_detail}>
                      {address_data.address}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.address_content_address_detail}>
                    {address_data.address}
                  </Text>
                )}
              </View>
            </View>

            <View
              style={[
                styles.rows,
                styles.borderBottom,
                single ? null : styles.mt8,
                {
                  paddingTop: 0,
                  paddingRight: 0,
                },
              ]}>
              <View
                style={[
                  styles.address_name_box,
                  {
                    paddingTop: 12,
                  },
                ]}>
                <View style={styles.box_icon_label}>
                  <Icon
                    style={styles.icon_label}
                    name="dollar"
                    size={13}
                    color={DEFAULT_COLOR}
                  />
                  <Text style={styles.input_label}>
                    {t('confirm.paymentMethod.title')}
                  </Text>
                </View>
                <View
                  style={[
                    styles.address_default_box,
                    {
                      position: 'absolute',
                      top: 0,
                      right: 0,
                    },
                  ]}>
                  <TouchableHighlight
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 15,
                    }}
                    underlayColor="transparent"
                    onPress={() => this._goPaymentMethod(cart_data)}>
                    <Text
                      style={[
                        styles.address_default_title,
                        styles.title_active,
                      ]}>
                      {t('confirm.change')}
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>

              <View style={{flexDirection: 'row', ...styles.address_content}}>
                {cart_data.payment_method ? (
                  <View style={styles.paymentMethodContainer}>
                    {cart_data.payment_method.image && (
                      <CachedImage
                        mutable
                        source={{uri: cart_data.payment_method.image}}
                        style={styles.imagePaymentMethod}
                      />
                    )}
                    {cart_data.payment_method.name && (
                      <Text style={[styles.address_name]}>
                        {cart_data.payment_method.name}
                      </Text>
                    )}
                  </View>
                ) : (
                  <Text style={styles.placeholder}>
                    {t('confirm.paymentMethod.unselected')}
                  </Text>
                )}
              </View>
            </View>
            <View
              onLayout={this._onLayout.bind(this)}
              style={[styles.rows, styles.borderBottom, styles.mt8]}>
              <TouchableHighlight
                underlayColor="#ffffff"
                onPress={() => {
                  if (this.refs_cart_note) {
                    this.refs_cart_note.focus();
                  }
                }}>
                <View style={styles.box_icon_label}>
                  <Icon
                    style={styles.icon_label}
                    name="pencil-square-o"
                    size={15}
                    color="#999999"
                  />
                  <Text style={styles.input_label}>
                    {`${t('confirm.note.title')} `}
                  </Text>
                  <Text style={styles.input_label_help}>
                    ({t('confirm.note.description')})
                  </Text>
                </View>
              </TouchableHighlight>
              {single ? (
                <View>
                  <TextInput
                    ref={(ref) => (this.refs_cart_note = ref)}
                    style={[
                      styles.input_address_text,
                      {
                        height:
                          this.state.address_height > 50
                            ? this.state.address_height
                            : 50,
                      },
                    ]}
                    keyboardType="default"
                    maxLength={250}
                    placeholder={t('confirm.note.placeholder')}
                    placeholderTextColor="#999999"
                    multiline={true}
                    underlineColorAndroid="transparent"
                    onContentSizeChange={(e) => {
                      this.setState({
                        address_height: e.nativeEvent.contentSize.height,
                      });
                    }}
                    onChangeText={(value) => {
                      action(() => {
                        store.setUserCartNote(value);
                      })();
                    }}
                    // onFocus={this._scrollToTop.bind(this, this.state.noteOffset)}
                    value={
                      store.user_cart_note ||
                      (store.cart_data ? store.cart_data.user_note : '')
                    }
                  />
                </View>
              ) : (
                <Text style={styles.input_note_value}>
                  {cart_data.user_note || t('confirm.note.noNote')}
                </Text>
              )}
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
                  <Text style={styles.input_label}>
                    {single
                      ? t('confirm.items.selected')
                      : t('confirm.items.shopped')}
                  </Text>
                </View>
              </View>
            </View>

            <FlatList
              style={styles.items_box}
              data={cart_products_confirm}
              extraData={cart_products_confirm}
              renderItem={({item, index}) => {
                // hide item not selected
                if (!single && item.selected != 1) {
                  return null;
                }

                return (
                  <CartItem
                    parentCtx={this}
                    item={item}
                    onRemoveCartItem={() => this._removeItemCartConfirm(item)}
                    noAction={!single}
                  />
                );
              }}
              keyExtractor={(item) => item.id}
            />

            <View
              style={[
                styles.rows,
                styles.borderBottom,
                {
                  borderTopWidth: 0,
                  backgroundColor: '#fafafa',
                },
              ]}>
              <View style={[styles.address_name_box]}>
                <Text style={[styles.text_total_items, styles.feeLabel]}>
                  {t('confirm.payment.price.temp')}
                </Text>
                <View style={styles.address_default_box}>
                  <TouchableHighlight
                    underlayColor="transparent"
                    onPress={() => 1}>
                    <Text
                      style={[
                        styles.address_default_title,
                        styles.title_active,
                        styles.feeValue,
                        {color: '#333333'},
                      ]}>
                      {cart_data.total_before_view}
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>

              {Object.keys(cart_data.promotions).length > 0 &&
                cart_data.promotions != null && (
                  <View style={[styles.address_name_box, styles.feeBox]}>
                    <Text
                      style={[
                        styles.text_total_items,
                        styles.feeLabel,
                        {color: 'brown'},
                      ]}>
                      {cart_data.promotions.title}
                    </Text>
                    <View style={styles.address_default_box}>
                      <TouchableHighlight
                        underlayColor="transparent"
                        onPress={() => 1}>
                        <Text
                          style={[
                            styles.address_default_title,
                            styles.title_active,
                            styles.feeValue,
                            {color: 'brown'},
                          ]}>
                          {t('confirm.payment.discount.prefix')}{' '}
                          {cart_data.promotions.discount_text}
                        </Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                )}

              {Object.keys(cart_data.item_fee).map((index) => {
                return (
                  <View
                    key={index}
                    style={[styles.address_name_box, styles.feeBox]}>
                    <Text
                      style={[
                        styles.text_total_items,
                        styles.feeLabel,
                        {color: DEFAULT_COLOR},
                      ]}>
                      {index}
                    </Text>
                    <View style={styles.address_default_box}>
                      <TouchableHighlight
                        underlayColor="transparent"
                        onPress={() => 1}>
                        <Text
                          style={[
                            styles.address_default_title,
                            styles.title_active,
                            styles.feeValue,
                          ]}>
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
                  borderTopWidth: 0,
                },
              ]}>
              <View style={styles.address_name_box}>
                <Text
                  style={[
                    styles.text_total_items,
                    styles.feeLabel,
                    styles.both,
                  ]}>
                  {`${t('confirm.payment.price.total')} `}
                  <Text style={{fontWeight: '400', fontSize: 14}}>
                    ({cart_data.count_selected} {t('confirm.unitName')})
                  </Text>
                </Text>
                <View style={styles.address_default_box}>
                  <TouchableHighlight
                    underlayColor="transparent"
                    onPress={() => 1}>
                    <Text
                      style={[
                        styles.address_default_title,
                        styles.title_active,
                        styles.feeValue,
                        styles.both,
                      ]}>
                      {cart_data.total_selected}
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>

            {single && (
              <View
                style={[styles.rows, styles.borderBottom, {marginVertical: 8}]}>
                <View style={styles.address_name_box}>
                  <View style={styles.useVoucherLabelWrapper}>
                    <Material name="ticket-percent" size={20} color="#05b051" />
                    <Text
                      style={[
                        styles.text_total_items,
                        styles.feeLabel,
                        styles.both,
                        styles.useVoucherLabel,
                      ]}>
                      {t('confirm.payment.discount.title')}
                    </Text>
                  </View>
                  <Button
                    containerStyle={[
                      styles.address_default_box,
                      styles.addVoucherWrapper,
                    ]}
                    onPress={
                      cart_data.user_voucher
                        ? this.openCurrentVoucher.bind(
                            this,
                            cart_data.user_voucher,
                          )
                        : this.openMyVoucher
                    }>
                    {cart_data.user_voucher ? (
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={[styles.addVoucherLabel, {marginLeft: 10}]}>
                        <Material
                          name="check-circle"
                          size={16}
                          color="#05b051"
                        />
                        {` ${cart_data.user_voucher.voucher_name}`}
                      </Text>
                    ) : (
                      <Text style={styles.addVoucherLabel}>
                        {t('confirm.payment.discount.add')}
                      </Text>
                    )}
                  </Button>
                </View>
              </View>
            )}

            {Object.keys(cart_data.cashback_view).map((index) => {
              return (
                <View
                  key={index}
                  style={[
                    styles.rows,
                    styles.borderBottom,
                    {
                      borderTopWidth: 0,
                    },
                  ]}>
                  <View style={styles.address_name_box}>
                    <Text
                      style={[
                        styles.text_total_items,
                        styles.feeLabel,
                        styles.both,
                      ]}>
                      {index}
                    </Text>
                    <View style={styles.address_default_box}>
                      <Text
                        style={[
                          styles.address_default_title,
                          styles.title_active,
                          styles.feeValue,
                          styles.both,
                        ]}>
                        {cart_data.cashback_view[index]}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
            {(is_ready || is_reorder || is_paymenting) && (
              <View style={styles.boxButtonActions}>
                {is_ready && (
                  <TouchableHighlight
                    style={[
                      styles.buttonAction,
                      {
                        marginRight: 6,
                      },
                    ]}
                    onPress={this.confirmCancelCart.bind(this, cart_data)}
                    underlayColor="transparent">
                    <View style={styles.boxButtonAction}>
                      <Icon name="times" size={16} color="#555" />
                      <Text style={styles.buttonActionTitle}>
                        {t('confirm.cancel')}
                      </Text>
                    </View>
                  </TouchableHighlight>
                )}

                {is_ready && (
                  <TouchableHighlight
                    style={[
                      styles.buttonAction,
                      {
                        marginLeft: 6,
                      },
                    ]}
                    onPress={this.confirmEditCart.bind(this, cart_data)}
                    underlayColor="transparent">
                    <View
                      style={[
                        styles.boxButtonAction,
                        {
                          backgroundColor: '#fa7f50',
                          borderColor: '#999999',
                        },
                      ]}>
                      <Icon name="pencil-square-o" size={16} color="#ffffff" />
                      <Text
                        style={[
                          styles.buttonActionTitle,
                          {
                            color: '#ffffff',
                          },
                        ]}>
                        {t('confirm.edit')}
                      </Text>
                    </View>
                  </TouchableHighlight>
                )}

                {is_reorder && (
                  <TouchableHighlight
                    style={styles.buttonAction}
                    onPress={this.confirmCoppyCart.bind(this, cart_data)}
                    underlayColor="transparent">
                    <View
                      style={[
                        styles.boxButtonAction,
                        {
                          backgroundColor: '#fa7f50',
                          borderColor: '#999999',
                        },
                      ]}>
                      <Icon name="refresh" size={16} color="#ffffff" />
                      <Text
                        style={[
                          styles.buttonActionTitle,
                          {
                            color: '#ffffff',
                          },
                        ]}>
                        {t('confirm.rebuy')}
                      </Text>
                    </View>
                  </TouchableHighlight>
                )}

                {is_paymenting && (
                  <TouchableHighlight
                    style={styles.buttonAction}
                    onPress={this.goBackStores.bind(this, cart_data)}
                    underlayColor="transparent">
                    <View
                      style={[
                        styles.boxButtonAction,
                        {
                          backgroundColor: '#fa7f50',
                          borderColor: '#999999',
                        },
                      ]}>
                      <Icon name="plus" size={16} color="#ffffff" />
                      <Text
                        style={[
                          styles.buttonActionTitle,
                          {
                            color: '#ffffff',
                          },
                        ]}>
                        {t('confirm.addMoreItems')}
                      </Text>
                    </View>
                  </TouchableHighlight>
                )}
              </View>
            )}

            {cart_data.status > 1 && (
              <View
                style={[
                  styles.boxButtonActions,
                  {
                    paddingTop: 0,
                  },
                ]}>
                <TouchableHighlight
                  style={styles.buttonAction}
                  onPress={() => {
                    Actions.rating({
                      cart_data,
                    });
                  }}
                  underlayColor="transparent">
                  <View
                    style={[
                      styles.boxButtonAction,
                      {
                        backgroundColor: DEFAULT_COLOR,
                        borderColor: '#999999',
                      },
                    ]}>
                    <Icon
                      style={styles.starReviews}
                      name="star"
                      size={12}
                      color="#ffffff"
                    />

                    <Text
                      style={[
                        styles.buttonActionTitle,
                        {
                          color: '#ffffff',
                        },
                      ]}>
                      {t('confirm.feedback')}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            )}
          </KeyboardAwareScrollView>
        </KeyboardAwareScrollView>

        {this.state.suggest_register && !is_login ? (
          <PopupConfirm
            ref_popup={(ref) => (this.popup_message = ref)}
            title={t('confirm.order.popup.notLoggedIn.description')}
            noTitle={t('confirm.order.popup.notLoggedIn.cancel')}
            noBlur
            noConfirm={this._viewOrders.bind(this)}
            yesTitle={t('confirm.order.popup.notLoggedIn.accept')}
            yesConfirm={this._onRegister.bind(this)}
            height={300}
            otherClose={false}
            style={{
              marginTop: -(NAV_HEIGHT / 2),
            }}
            content={(title) => {
              return (
                <View style={styles.success_box}>
                  <View style={styles.success_icon_box}>
                    <Icon name="check-circle" size={24} color={DEFAULT_COLOR} />
                    <Text style={styles.success_icon_label}>
                      {t('confirm.order.popup.title')}
                    </Text>
                  </View>
                  <Text style={styles.success_title}>{title}</Text>

                  <TextInput
                    ref={(ref) => (this.refs_name_register = ref)}
                    style={{
                      borderWidth: Util.pixel,
                      borderColor: '#dddddd',
                      padding: 8,
                      borderRadius: 3,
                      marginTop: 12,
                    }}
                    keyboardType="default"
                    maxLength={100}
                    placeholder={t('confirm.order.popup.userPlaceholder')}
                    placeholderTextColor="#999999"
                    underlineColorAndroid="transparent"
                    onChangeText={(value) => {
                      this.setState({
                        name_register: value,
                      });
                    }}
                    value={this.state.name_register}
                  />

                  <TextInput
                    ref={(ref) => (this.refs_tel_register = ref)}
                    style={{
                      borderWidth: Util.pixel,
                      borderColor: '#dddddd',
                      padding: 8,
                      borderRadius: 3,
                      marginTop: 8,
                    }}
                    keyboardType="default"
                    maxLength={250}
                    placeholder={t('confirm.order.popup.telPlaceholder')}
                    placeholderTextColor="#999999"
                    underlineColorAndroid="transparent"
                    onChangeText={(value) => {
                      this.setState({
                        tel_register: value,
                      });
                    }}
                    value={this.state.tel_register}
                  />

                  {/*<TextInput
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
                    />*/}
                </View>
              );
            }}
          />
        ) : (
          <PopupConfirm
            ref_popup={(ref) => (this.popup_message = ref)}
            title={t('confirm.order.popup.loggedIn.description')}
            noTitle={t('confirm.order.popup.loggedIn.cancel')}
            noConfirm={this._viewOrders.bind(this)}
            yesTitle={t('confirm.order.popup.loggedIn.accept')}
            yesConfirm={this._continueShopping.bind(this)}
            height={150}
            otherClose={false}
            content={(title) => {
              return (
                <View style={styles.success_box}>
                  <View style={styles.success_icon_box}>
                    <Icon name="check-circle" size={24} color={DEFAULT_COLOR} />
                    <Text style={styles.success_icon_label}>
                      {t('confirm.order.popup.title')}
                    </Text>
                  </View>
                  <Text style={styles.success_title}>{title}</Text>
                </View>
              );
            }}
          />
        )}

        <Sticker
          active={this.state.coppy_sticker_flag}
          message={t('confirm.copy.success')}
        />

        <PopupConfirm
          ref_popup={(ref) => (this.refs_remove_item_confirm = ref)}
          title={t('cart:popup.remove.message')}
          height={110}
          noConfirm={this._closePopupConfirm.bind(this)}
          yesConfirm={this._removeCartItem.bind(this)}
          otherClose={false}
        />

        <PopupConfirm
          ref_popup={(ref) => (this.refs_cancel_cart = ref)}
          title={t('cart:popup.cancel.message')}
          height={110}
          noConfirm={this._closePopupCancel.bind(this)}
          yesConfirm={this._cancelCart.bind(this)}
          otherClose={false}
        />

        <PopupConfirm
          ref_popup={(ref) => (this.refs_coppy_cart = ref)}
          title="Giỏ hàng đang mua (nếu có) sẽ bị xoá! Bạn vẫn muốn sao chép đơn hàng này?"
          height={110}
          noConfirm={this._closePopupCoppy.bind(this)}
          yesConfirm={this._coppyCart.bind(this)}
          otherClose={false}
        />

        <PopupConfirm
          ref_popup={(ref) => (this.refs_edit_cart = ref)}
          title={t('cart:popup.edit.message')}
          height={110}
          noConfirm={this._closePopupEdit.bind(this)}
          yesConfirm={this._editCart.bind(this)}
          otherClose={false}
        />

        {single && (
          <TouchableHighlight
            style={[
              styles.cart_payment_btn_box,
              {
                // bottom: store.keyboardTop
                position: undefined,
              },
            ]}
            underlayColor="transparent"
            onPress={this._onSave.bind(this)}>
            <View style={styles.cart_payment_btn}>
              <View
                style={{
                  minWidth: 20,
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {this.state.continue_loading ? (
                  <Indicator size="small" color="#ffffff" />
                ) : (
                  <Icon name="check" size={20} color="#ffffff" />
                )}
              </View>
              <Text style={styles.cart_payment_btn_title}>
                {t('confirm.order.title')}
              </Text>
            </View>
          </TouchableHighlight>
        )}
        {appConfig.device.isIOS && <KeyboardSpacer />}
      </>
    );
  }

  goBackStores(item) {
    if (store.no_refresh_home_change) {
      Actions.pop();
    } else {
      store.setStoreData({
        id: item.site_id,
        name: item.shop_name,
        tel: item.tel,
      });
      store.goStoreNow = true;

      Actions.primaryTabbar({
        type: ActionConst.RESET,
      });
    }
  }

  async _cancelCart() {
    if (this.item_cancel) {
      try {
        const response = await APIHandler.site_cart_canceling(
          this.item_cancel.site_id,
          this.item_cancel.id,
        );

        if (!this.unmounted) {
          if (response && response.status == STATUS_SUCCESS) {
            store.setOrdersKeyChange(store.orders_key_change + 1);
            Events.trigger(RELOAD_STORE_ORDERS);

            this._getOrdersItem(this.item_cancel.site_id, this.item_cancel.id);

            flashShowMessage({
              type: 'success',
              message: response.message,
            });
          }
        }
      } catch (e) {
        console.log(e + ' site_cart_canceling');
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
    Actions.push(appConfig.routes.phoneAuth, {
      tel: store.cart_data.address.tel,
    });
  }

  async _coppyCart() {
    if (this.item_coppy) {
      try {
        var response = await APIHandler.site_cart_reorder(
          this.item_coppy.site_id,
          this.item_coppy.id,
        );
        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setCartData(response.data);
            store.setOrdersKeyChange(store.orders_key_change + 1);
            Events.trigger(RELOAD_STORE_ORDERS);
          })();

          flashShowMessage({
            type: 'success',
            message: response.message,
          });

          Actions.pop();

          setTimeout(() => {
            Actions.push(appConfig.routes.paymentConfirm, {
              goConfirm: true,
            });
          }, 1000);
        }
      } catch (e) {
        console.log(e + ' site_cart_reorder');
      }
    }

    this._closePopupCoppy();
  }

  async _editCart() {
    if (this.item_edit) {
      try {
        const response = await APIHandler.site_cart_update_ordering(
          this.item_edit.site_id,
          this.item_edit.id,
        );

        if (!this.unmounted) {
          if (response && response.status == STATUS_SUCCESS) {
            this.props.orderEdited();
            store.setCartData(response.data);
            store.setOrdersKeyChange(store.orders_key_change + 1);
            Events.trigger(RELOAD_STORE_ORDERS);

            this.setState({
              single: true,
            });

            this._getOrdersItem(this.item_edit.site_id, this.item_edit.id);
            flashShowMessage({
              type: 'success',
              message: response.message,
            });
          }
        }
      } catch (e) {
        console.log(e + ' site_cart_update_ordering');
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

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 0,
  },
  right_btn_box: {
    flexDirection: 'row',
  },

  content: {
    marginBottom: 60,
  },
  rows: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  address_name_box: {
    flexDirection: 'row',
  },
  address_name: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  address_default_box: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  address_default_title: {
    color: '#666666',
    fontSize: 12,
  },
  title_active: {
    color: DEFAULT_COLOR,
  },
  address_content: {
    marginTop: 12,
    marginLeft: 22,
  },
  address_content_phone: {
    color: '#404040',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },
  address_content_address_detail: {
    color: '#404040',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  address_content_phuong: {
    color: '#404040',
    fontSize: 14,
    marginTop: 4,
  },
  address_content_city: {
    color: '#404040',
    fontSize: 14,
    marginTop: 4,
  },
  address_content_tinh: {
    color: '#404040',
    fontSize: 14,
    marginTop: 4,
  },

  desc_content: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    marginLeft: 22,
  },
  orders_status_box: {
    alignItems: 'center',
  },
  orders_status: {
    fontSize: 12,
    color: '#fa7f50',
    fontWeight: '600',
    marginTop: 4,
  },
  borderBottom: {
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
  },

  cart_section_box: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    backgroundColor: '#fa7f50',
  },
  cart_section_title: {
    color: '#ffffff',
    fontSize: 14,
    paddingLeft: 8,
    fontWeight: '600',
  },

  cart_item_box: {
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
    alignItems: 'center',
  },
  cart_item_image_box: {
    width: 50,
  },
  cart_item_image: {
    height: '100%',
    resizeMode: 'contain',
  },
  cart_item_info: {
    flex: 1,
  },
  cart_item_info_content: {
    paddingHorizontal: 15,
  },
  cart_item_info_name: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  cart_item_sub_info_name: {
    color: '#555',
    fontSize: 12,
  },
  cart_item_actions: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  cart_item_actions_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 22,
    height: 22,
    borderWidth: Util.pixel,
    borderColor: '#666666',
    borderRadius: 3,
  },
  cart_item_remove_btn: {
    backgroundColor: '#babbbf',
    marginRight: 15,
    borderWidth: 0,
  },
  cart_item_remove_icon: {
    color: '#fff',
  },
  cart_item_actions_quantity: {
    paddingHorizontal: 8,
    minWidth: '30%',
    textAlign: 'center',
    color: '#404040',
    fontWeight: '500',
  },
  cart_item_btn_label: {
    color: '#404040',
    fontSize: 20,
    lineHeight: isIOS ? 20 : 24,
  },

  cart_item_price_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: '#dddddd',
  },
  cart_item_weight: {
    position: 'absolute',
    right: 15,
    bottom: 8,
    color: '#666666',
    fontSize: 12,
  },

  cart_item_price_price_safe_off: {
    textDecorationLine: 'line-through',
    fontSize: 14,
    color: '#666666',
    marginRight: 4,
  },
  cart_item_price_price: {
    fontSize: 14,
    color: DEFAULT_COLOR,
  },

  cart_payment_btn_box: {
    position: 'absolute',
    width: '100%',
    height: 60,
    bottom: 0,
    left: 0,
    right: 0,
  },
  cart_payment_btn: {
    width: '100%',
    height: '100%',
    backgroundColor: DEFAULT_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cart_payment_btn_title: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 8,
  },

  mt8: {
    marginTop: 8,
  },
  text_total_items: {
    fontSize: 14,
    color: '#000000',
  },

  input_address_text: {
    width: '100%',
    color: '#000000',
    fontSize: 14,
    marginTop: 4,
  },
  input_label: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 8,
  },
  input_label_help: {
    fontSize: 12,
    marginTop: 2,
    color: '#666666',
  },

  box_icon_label: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon_label: {
    fontSize: 14,
    width: 15,
  },

  success_box: {
    padding: 15,
  },
  success_title: {
    lineHeight: 20,
    color: '#000000',
  },
  success_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  success_icon_label: {
    color: DEFAULT_COLOR,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  input_note_value: {
    fontSize: 14,
    marginTop: 8,
    color: '#404040',
    marginLeft: 22,
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
    justifyContent: 'flex-start',
  },
  item_safe_off_percent: {
    backgroundColor: '#fa7f50',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  item_safe_off_percent_val: {
    color: '#ffffff',
    fontSize: 12,
  },

  payments_nav: {
    backgroundColor: '#ffffff',
    height: 60,
    flexDirection: 'row',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',

    position: 'absolute',
    zIndex: 1,
  },
  payments_nav_items: {
    justifyContent: 'center',
    height: 60,
    width: Util.size.width / 2,
    alignItems: 'center',
  },
  payments_nav_items_title: {
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  payments_nav_items_title_active: {
    color: DEFAULT_COLOR,
  },
  payments_nav_items_active: {
    position: 'absolute',
    width: Util.size.width / 4 - 14,
    top: 20,
    right: 0,
    height: Util.pixel,
    backgroundColor: DEFAULT_COLOR,
  },
  payments_nav_items_right_active: {
    position: 'absolute',
    width: Util.size.width / 4 - 14,
    top: 20,
    left: 0,
    height: Util.pixel,
    backgroundColor: DEFAULT_COLOR,
  },
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8,
  },

  payments_nav_icon_box: {
    borderWidth: Util.pixel,
    borderColor: '#cccccc',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  payments_nav_icon_active: {
    color: DEFAULT_COLOR,
  },
  payments_nav_icon_box_active: {
    borderColor: DEFAULT_COLOR,
  },

  uncheckOverlay: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  boxButtonActions: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  buttonAction: {
    flex: 1,
  },
  boxButtonAction: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: Util.pixel,
    borderColor: '#666666',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    // width: Util.size.width / 2 - 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActionTitle: {
    color: '#333333',
    marginLeft: 4,
    fontSize: 14,
  },
  starReviews: {
    marginLeft: 2,
  },
  feeBox: {
    marginTop: 12,
  },
  feeLabel: {
    fontSize: 16,
  },
  feeValue: {
    fontSize: 16,
  },
  both: {
    fontWeight: '600',
  },
  profile_list_icon_box: {
    // backgroundColor: "#cc9900",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    marginLeft: 4,
    marginRight: -20,
  },
  profile_list_icon_box_angle: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
  },
  useVoucherLabelWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  useVoucherLabel: {
    marginLeft: 4,
  },
  addVoucherWrapper: {
    flex: 1,
    borderLeftWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ebebeb',
  },
  addVoucherLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imagePaymentMethod: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 7,
  },
  placeholder: {
    color: '#999999',
  },
});

export default withTranslation(['orders', 'cart', 'common'])(observer(Confirm));
