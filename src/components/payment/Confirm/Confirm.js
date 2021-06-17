import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  Clipboard,
  Keyboard,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import {Actions, ActionConst} from 'react-native-router-flux';
import store from '../../../store/Store';
import ListHeader from '../../stores/ListHeader';
import PopupConfirm from '../../PopupConfirm';
import Sticker from '../../Sticker';
import RightButtonChat from '../../RightButtonChat';
import RightButtonCall from '../../RightButtonCall';
import appConfig from 'app-config';
import Button from 'react-native-button';
import {USE_ONLINE} from 'app-packages/tickid-voucher';
import EventTracker from '../../../helper/EventTracker';
import {ANALYTICS_EVENTS_NAME} from '../../../constants';
import CartItem from '../CartItem';
import Tag from '../../Tag';
import Loading from '../../Loading';
import {CONFIG_KEY, isConfigActive} from '../../../helper/configKeyHandler';
import APIHandler from '../../../network/APIHandler';
import {APIRequest} from '../../../network/Entity';
import Container from '../../Layout/Container/Container';
import {
  CART_PAYMENT_STATUS,
  CART_PAYMENT_TYPES,
} from '../../../constants/cart/types';
import RoundButton from '../../RoundButton';
import {PaymentMethodSection} from './components';

class Confirm extends Component {
  static defaultProps = {
    orderEdited: () => {},
  };
  constructor(props) {
    super(props);

    const is_paymenting =
      props.data && props.data.status == CART_STATUS_ORDERING;

    this.state = {
      single: this.props.from_page != 'orders_item' || is_paymenting,
      coppy_sticker_flag: false,
      address_height: 50,
      continue_loading: false,
      data: props.data || store.cart_data,
      noteOffset: 0,
      suggest_register: false,
      name_register: '',
      tel_register: '',
      pass_register: '',
      paymentMethod: {},
      loading: false,
      isConfirming: false,
    };

    this.refs_confirm_page = React.createRef();
    this.unmounted = false;
    this.resetScrollToCoords = {x: 0, y: 0};
    this.getShippingInfoRequest = new APIRequest();
    this.reorderRequest = new APIRequest();
    this.requests = [this.getShippingInfoRequest, this.reorderRequest];
    this.eventTracker = new EventTracker();
  }

  get isSiteUseShipNotConfirming() {
    return (
      store?.store_data?.[CONFIG_KEY.SITE_USE_SHIP] && !this.state.isConfirming
    );
  }

  get cartData() {
    return this.state.single ? store?.cart_data : this.state.data;
  }

  get isUnpaid() {
    return (
      this.cartData.payment_status === null ||
      this.cartData.payment_status === undefined ||
      this.cartData.payment_status === CART_PAYMENT_STATUS.UNPAID
    );
  }

  get isPaid() {
    return this.cartData.payment_status === CART_PAYMENT_STATUS.PAID;
  }

  get canTransaction() {
    return (
      this.cartData.cart_payment_type === CART_PAYMENT_TYPES.PAY &&
      this.isUnpaid
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
    const is_paymenting =
      this.state.data && this.state.data.status == CART_STATUS_ORDERING;

    if (is_paymenting) {
      this.setState({loading: true});
      this._getOrdersItem(this.state.data.site_id, this.state.data.id);
    } else if (this.props.item) {
      this._getOrdersItem(this.props.item.site_id, this.props.item.id, false);
    }
    setTimeout(() =>
      Actions.refresh({
        right: this._renderRightButton(),
      }),
    );
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    cancelRequests(this.requests);
  }

  _initial(props) {
    if (!this.state.single) {
      if (props.notice_data) {
        this._getOrdersItem(
          props.notice_data.site_id,
          props.notice_data.page_id,
        );
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
            right: this._renderRightButton.bind(this),
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

  async _getOrdersItem(site_id, page_id, is_paymenting = true) {
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
          if (is_paymenting) {
            store.setCartData(response.data);
          }
          // message: lấy thông tin thành công
          // Toast.show(response.message);
        }
      }
    } catch (e) {
      console.log(e + ' site_cart_show');
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
        });
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
              }

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

              if (
                response.data.cart_payment_type === CART_PAYMENT_TYPES.PAY &&
                (!response.data.payment_status ||
                  response.data.payment_status === CART_PAYMENT_STATUS.UNPAID)
              ) {
                // store.resetCartData();
                this.goToTransaction(response.data.site_id, response.data.id);
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
              loading: false,
            });
        }
      },
    );
  }

  async getShippingInfo(siteId, cartId) {
    const {t} = this.props;

    this.getShippingInfoRequest.data = APIHandler.cart_confirmed(
      siteId,
      cartId,
    );

    try {
      const response = await this.getShippingInfoRequest.promise();
      console.log(response);
      setTimeout(() => this.refs_confirm_page.current.scrollToEnd());

      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            store.setCartData(response.data);
            this.setState({isConfirming: true});
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('common:api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('common:api.error.message'),
        });
      }
    } catch (err) {
      console.log('get_shipping_info', err);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    } finally {
      setTimeout(() =>
        this.setState({
          loading: false,
        }),
      );
    }
  }

  handleEditConfirmingCart() {
    this.setState({isConfirming: false});
  }

  handleSubmit(cart_data) {
    this.setState({
      loading: true,
    });
    Keyboard.dismiss();

    if (cart_data.count_selected <= 0) {
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

    if (this.isSiteUseShipNotConfirming) {
      this.getShippingInfo(store.store_id, this.state.data.id);
    } else {
      this._onSave();
    }
  }

  goToTransaction = (siteId, cartId) => {
    Actions.push(appConfig.routes.transaction, {
      siteId,
      cartId,
      onPop: () => {
        this.setState({loading: true});
        this._getOrdersItem(siteId, cartId);
      },
    });
  };

  // on save
  _onSave() {
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
      selectedPaymentMethodDetail: cart_data.payment_method_detail,
      price: cart_data.total_before_view,
      totalPrice: cart_data.total_selected,
      extraFee: cart_data.item_fee,
      store_id: cart_data.site_id,
      cart_id: cart_data.id,
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
    /**
     * @todo
     * force update props of prev screen
     * for the case this screen pushed from Orders
     * so Orders can refresh to update status of this cart before it shown.
     */
    Actions.refresh({});

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
    store.resetCartData();
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
  //   if (this.refs_confirm_page.current) {
  //     this.refs_confirm_page.current.scrollTo({ x: 0, y: top, animated: true });
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
      this.reorderRequest.data = APIHandler.cart_reorder(
        this.item_coppy.site_id,
        this.item_coppy.id,
      );
      try {
        var response = await this.reorderRequest.promise();

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

  handleScroll = (e) => {
    if (appConfig.device.isAndroid) return;
    const {contentOffset, contentSize, layoutMeasurement} = e.nativeEvent;
    this.resetScrollToCoords = {
      x: 0,
      y:
        contentOffset.y >= contentSize.height - layoutMeasurement.height
          ? contentSize.height - layoutMeasurement.height
          : contentOffset.y,
    };
  };

  renderCartProducts(products, single) {
    return (
      <View style={styles.items_box}>
        {products.map((product, index) => {
          if (!single && product.selected != 1) {
            return null;
          }

          return (
            <CartItem
              key={index}
              parentCtx={this}
              item={product}
              onRemoveCartItem={() => this._removeItemCartConfirm(product)}
              noAction={!single || this.state.isConfirming}
            />
          );
        })}
      </View>
    );
  }

  renderCommissions(cart_data) {
    const commissions = cart_data?.commissions || [];
    if (typeof commissions === 'string' || commissions.length === 0)
      return null;

    return (
      <View
        style={[styles.rows, styles.borderBottom, styles.commissionContainer]}>
        {commissions.map((commission, index) => {
          const isLast = index === commissions.length - 1;
          return (
            <View
              key={index}
              style={[
                styles.address_name_box,
                styles.feeBox,
                isLast && styles.lastCommission,
              ]}>
              <Text
                style={[
                  styles.text_total_items,
                  styles.feeLabel,
                  isLast && styles.both,
                  !isLast && {color: appConfig.colors.primary},
                  styles.commissionTitle,
                ]}>
                {commission.name}
              </Text>
              <View>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <Text
                    style={[
                      styles.address_default_title,
                      styles.title_active,
                      styles.feeValue,
                      isLast && styles.both,
                    ]}>
                    {commission.value_view}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

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

    const is_login =
      store.user_info != null && store.user_info.username != null;
    const is_ready = cart_data.status == CART_STATUS_READY;
    const can_reorder = cart_data.status == CART_STATUS_COMPLETED;
    const is_completed = cart_data.status >= CART_STATUS_COMPLETED;
    const is_paymenting = cart_data.status == CART_STATUS_ORDERING;
    const cartType = cart_data.cart_type_name;

    const comboAddress =
      (address_data.province_name || '') +
      (address_data.district_name ? ' • ' + address_data.district_name : '') +
      (address_data.ward_name ? ' • ' + address_data.ward_name : '');

    const deliveryCode =
      cart_data.delivery_details &&
      (cart_data.delivery_details.ship_unit ||
        cart_data.delivery_details.unit) +
        ' - ' +
        (cart_data.delivery_details.ship_unit_id ||
          cart_data.delivery_details.booking_id);

    return (
      <>
        {this.state.loading && <Loading center />}

        <KeyboardAwareScrollView
          ref={this.refs_confirm_page}
          style={styles.container}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          resetScrollToCoords={this.resetScrollToCoords}
          onMomentumScrollEnd={this.handleScroll}
          onScrollEndDrag={this.handleScroll}
          >
          <View
            style={styles.rows}>
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
                    <Icon5
                      style={styles.icon_label}
                      name="info-circle"
                      size={14}
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
                    <Text
                      style={[
                        [
                          styles.orders_status,
                          {
                            color:
                              appConfig.colors.orderStatus[cart_data.status] ||
                              appConfig.colors.primary,
                          },
                        ],
                      ]}>
                      {cart_data.status_view}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            <View style={styles.tagContainer}>
              <View style={styles.cartTypeMainContainer}>
                {!!cartType && (
                  <View style={styles.cartTypeContainer}>
                    <Tag
                      label={cartType}
                      fill={appConfig.colors.cartType[cart_data.cart_type]}
                      animate={false}
                      strokeWidth={0}
                      labelStyle={styles.cartTypeLabel}
                      labelContainerStyle={styles.cartTypeLabelContainer}
                    />
                  </View>
                )}
              </View>

              {!!cart_data.payment_status_name && (
                <View style={styles.cartTypeContainer}>
                  <Tag
                    label={cart_data.payment_status_name}
                    fill={hexToRgbA(
                      appConfig.colors.paymentStatus[cart_data.payment_status],
                      0.1,
                    )}
                    animate={false}
                    strokeWidth={0}
                    labelStyle={[
                      styles.cartTypeLabel,
                      {
                        color:
                          appConfig.colors.paymentStatus[
                            cart_data.payment_status
                          ],
                      },
                    ]}
                    labelContainerStyle={styles.cartTypeLabelContainer}
                  />
                </View>
              )}
            </View>
            <View style={styles.tagContainer}>
              {!!deliveryCode && (
                <Tag
                  label={deliveryCode}
                  fill={
                    appConfig.colors.delivery[
                      cart_data.delivery_details?.status
                    ] || appConfig.colors.cartType[cart_data.cart_type]
                  }
                  animate={false}
                  strokeWidth={0}
                  labelStyle={styles.cartTypeLabel}
                  labelContainerStyle={[
                    styles.cartTypeLabelContainer,
                    styles.tagsLabelContainer,
                  ]}
                />
              )}
            </View>
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
                <Icon5 style={styles.icon_label} name="truck" size={12} />
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
                {!this.state.isConfirming &&
                  (single ? (
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
                  ))}
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

              {!!comboAddress && (
                <Text style={styles.comboAddress}>{comboAddress}</Text>
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
                <Icon5 style={styles.icon_label} name="pen-square" size={15} />
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
                <Icon5
                  style={styles.icon_label}
                  name="shopping-cart"
                  size={12}
                />
                <Text style={styles.input_label}>
                  {single
                    ? t('confirm.items.selected')
                    : t('confirm.items.shopped')}
                </Text>
              </View>
            </View>
          </View>

          {this.renderCartProducts(cart_products_confirm, single)}

          {(!single ||
            !store?.store_data[CONFIG_KEY.SITE_USE_SHIP] ||
            this.state.isConfirming) && (
            <PaymentMethodSection
              isUnpaid={this.isUnpaid}
              cartData={cart_data}
              onPressChange={() => this._goPaymentMethod(cart_data)}
            />)}

          <View
            style={[
              styles.rows,
              styles.borderBottom,
              styles.mt8,
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
                style={[styles.text_total_items, styles.feeLabel, styles.both]}>
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
                      <Material name="check-circle" size={16} color="#05b051" />
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

          {this.renderCommissions(cart_data)}
          <View style={styles.boxButtonActions}>
            {is_ready && !this.isPaid && (
              <RoundButton
                onPress={this.confirmEditCart.bind(this, cart_data)}
                wrapperStyle={styles.buttonActionWrapper}
                bgrColor={appConfig.colors.status.info}
                width={30}
                title={t('confirm.edit')}
                titleStyle={styles.btnActionTitle}>
                <Icon name="pencil" size={16} color="#fff" />
              </RoundButton>
            )}

            {is_ready && (
              <RoundButton
                onPress={this.confirmCancelCart.bind(this, cart_data)}
                wrapperStyle={styles.buttonActionWrapper}
                bgrColor={appConfig.colors.status.danger}
                width={30}
                title={t('confirm.cancel')}
                titleStyle={styles.btnActionTitle}>
                <Icon name="times" size={16} color="#fff" />
              </RoundButton>
            )}

            {can_reorder && (
              <RoundButton
                onPress={this.confirmCoppyCart.bind(this, cart_data)}
                wrapperStyle={styles.buttonActionWrapper}
                bgrColor={appConfig.colors.status.success}
                width={30}
                title={t('confirm.reorder')}
                titleStyle={styles.btnActionTitle}>
                <Icon name="refresh" size={16} color="#fff" />
              </RoundButton>
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
                      backgroundColor: appConfig.colors.marigold,
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

            {is_completed && cart_data.status > 1 && (
              <RoundButton
                onPress={() =>
                  Actions.rating({
                    cart_data,
                  })
                }
                wrapperStyle={styles.buttonActionWrapper}
                bgrColor={appConfig.colors.marigold}
                width={30}
                title={t('confirm.feedback')}
                titleStyle={styles.btnActionTitle}>
                <Icon name="star" size={16} color="#fff" />
              </RoundButton>
            )}
          </View>
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

        {single ? (
          <Container row style={{bottom: store.keyboardTop}}>
            {this.state.isConfirming && (
              <TouchableHighlight
                style={styles.cart_payment_btn_box}
                underlayColor="transparent"
                onPress={this.handleEditConfirmingCart.bind(this)}>
                <View
                  style={[styles.cart_payment_btn, {backgroundColor: '#bbb'}]}>
                  <View style={styles.cart_payment_btn_icon}>
                    <Icon name="edit" size={20} color="#fff" />
                  </View>
                  <Text style={styles.cart_payment_btn_title}>
                    {t('confirm.edit')}
                  </Text>
                </View>
              </TouchableHighlight>
            )}
            <TouchableHighlight
              style={styles.cart_payment_btn_box}
              underlayColor="transparent"
              onPress={() => this.handleSubmit(cart_data)}>
              <View style={styles.cart_payment_btn}>
                <View style={styles.cart_payment_btn_icon}>
                  {this.state.continue_loading ? (
                    <Indicator size="small" color="#ffffff" />
                  ) : (
                    <Icon name="check" size={20} color="#ffffff" />
                  )}
                </View>
                <Text style={styles.cart_payment_btn_title}>
                  {this.isSiteUseShipNotConfirming
                    ? t('confirm.confirmOrder')
                    : this.canTransaction
                    ? t('confirm.order.payTitle')
                    : t('confirm.order.title')}
                </Text>
              </View>
            </TouchableHighlight>
          </Container>
        ) : (
          this.canTransaction && (
            <Container row style={{bottom: store.keyboardTop}}>
              <TouchableHighlight
                style={styles.cart_payment_btn_box}
                underlayColor="transparent"
                onPress={() =>
                  this.goToTransaction(cart_data.site_id, cart_data.id)
                }>
                <View style={styles.cart_payment_btn}>
                  <View style={styles.cart_payment_btn_icon}>
                    {this.state.continue_loading ? (
                      <Indicator size="small" color="#ffffff" />
                    ) : (
                      <Icon name="check" size={20} color="#ffffff" />
                    )}
                  </View>
                  <Text style={styles.cart_payment_btn_title}>
                    {t('confirm.order.payTitle')}
                  </Text>
                </View>
              </TouchableHighlight>
            </Container>
          )
        )}
      </>
    );
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
    flex: 1,
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
    fontWeight: '600',
    marginTop: 4,
  },
  borderBottom: {
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
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
    // position: 'absolute',
    flex: 1,
    // width: '100%',
    height: 60 + appConfig.device.bottomSpace,
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
    paddingBottom: appConfig.device.bottomSpace
  },
  cart_payment_btn_icon: {
    minWidth: 20,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cart_payment_btn_title: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 8,
    textTransform: 'uppercase',
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
    width: 15,
    color: '#999',
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

  boxButtonActions: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    // alignItems: 'center',
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
    flex: 1,
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
  imagePaymentMethodDetail: {
    // marginLeft: 15,
    marginRight: 10,
  },
  placeholder: {
    color: '#999999',
  },

  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
    paddingLeft: 20,
  },
  cartTypeMainContainer: {},
  cartTypeContainer: {},
  cartTypeLabelContainer: {
    // marginRight: 5,
    paddingVertical: 3,
  },
  cartTypeLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
  },

  comboAddress: {
    marginHorizontal: -15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    color: '#333',
    letterSpacing: 0.2,
    marginTop: 10,
    fontSize: 13,
    fontWeight: '400',
  },

  commissionContainer: {
    borderTopWidth: 0,
    backgroundColor: '#fafafa',
    marginBottom: 12,
    paddingTop: 0,
  },
  lastCommission: {
    borderTopWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginHorizontal: -15,
    marginVertical: -12,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  commissionTitle: {
    paddingRight: 15,
  },

  paymentStatusContainer: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginTop: 5,
    borderRadius: 4,
    // alignSelf: 'flex-start',
  },
  paymentStatusTitle: {
    fontSize: 12,
  },

  buttonActionWrapper: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'flex-start',
  },
  btnActionTitle: {
    fontWeight: '500',
  },
});

export default withTranslation(['orders', 'cart', 'common'])(observer(Confirm));