import React, {Component} from 'react';
import {View, StyleSheet, Keyboard, Alert} from 'react-native';
// 3-party libs
import Clipboard from '@react-native-community/clipboard';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {debounce} from 'lodash';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// network
import APIHandler from '../../../network/APIHandler';
// helpers
import {
  isConfigActive,
  getValueFromConfigKey,
} from 'app-helper/configKeyHandler';
import {getTheme} from 'src/Themes/Theme.context';
import {servicesHandler} from 'app-helper/servicesHandler';
// routing
import {pop, push, refresh, reset} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {ANALYTICS_EVENTS_NAME} from '../../../constants';
import {CONFIG_KEY} from 'app-helper/configKeyHandler';
import {
  CART_PAYMENT_STATUS,
  CART_PAYMENT_TYPES,
} from '../../../constants/cart/types';
import {USE_ONLINE} from 'app-packages/tickid-voucher';
import {SERVICES_TYPE} from 'app-helper/servicesHandler';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// entities
import {APIRequest} from '../../../network/Entity';
import EventTracker from 'app-helper/EventTracker';
// custom components
import Loading from '../../Loading';
import ListHeader from '../../stores/ListHeader';
import PopupConfirm from '../../PopupConfirm';
import Sticker from '../../Sticker';
import RightButtonChat from '../../RightButtonChat';
import {
  PaymentMethodSection,
  DeliverySection,
  StoreInfoSection,
  PricingAndPromotionSection,
  NoteSection,
  CommissionsSection,
  ActionButtonSection,
  OrderInfoSection,
  AddressSection,
  POSSection,
  ProductSection,
  DeliveryScheduleSection,
} from './components';
import {
  Input,
  ScreenWrapper,
  Container,
  Icon,
  Typography,
} from 'src/components/base';
import Button from 'src/components/Button';
import Indicator from 'src/components/Indicator';

class Confirm extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    orderEdited: () => {},
  };

  state = {
    single:
      this.props.from_page != 'orders_item' ||
      (this.props.data && this.props.data?.status == CART_STATUS_ORDERING),
    copy_sticker_flag: false,
    address_height: 50,
    continue_loading: false,
    data: this.props.data || store.cart_data,
    noteOffset: 0,
    suggest_register: false,
    name_register: '',
    tel_register: '',
    pass_register: '',
    paymentMethod: {},
    loading: false,
    isConfirming: false,
  };
  refs_confirm_page = React.createRef();
  unmounted = false;
  resetScrollToCoords = {x: 0, y: 0};
  getShippingInfoRequest = new APIRequest();
  reorderRequest = new APIRequest();
  requests = [this.getShippingInfoRequest, this.reorderRequest];
  eventTracker = new EventTracker();
  refNoteModalInput = null;
  deliveryTime = null;

  get theme() {
    return getTheme(this);
  }

  get isSiteUseShipNotConfirming() {
    return (
      !!getValueFromConfigKey(CONFIG_KEY.SITE_USE_SHIP) &&
      !this.state.isConfirming
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

  shouldComponentUpdate(nextProps, nextState) {
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

    return true;
  }

  componentDidMount() {
    this._initial(this.props);

    const is_paymenting =
      this.state.data && this.state.data.status == CART_STATUS_ORDERING;

    if (is_paymenting) {
      this.setState({loading: true});
      this._getOrdersItem(this.state.data.site_id, this.state.data.id);
    } else if (this.props.data) {
      this._getOrdersItem(this.props.data.site_id, this.props.data.id, false);
    }
    setTimeout(() =>
      refresh({
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
    }
  }

  async _siteInfo(site_id) {
    const {t} = this.props;
    try {
      const response = await APIHandler.site_detail(site_id);

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          store.setStoreData(response.data);

          this.cart_tel = response.data.tel;

          refresh({
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

  async _getOrdersItem(site_id, cart_id, is_paymenting = true) {
    try {
      const response = await APIHandler.site_cart_show(site_id, cart_id);
      console.log(response);
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
            delivery_time: this.deliveryTime || '',
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
                name_register: response.data.address?.name,
                tel_register: response.data.address?.tel,
              });

              // hide back button
              refresh({
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
      setTimeout(
        () =>
          !this.unmounted &&
          !!this.refs_confirm_page.current &&
          this.refs_confirm_page.current.scrollToEnd(),
      );

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
              this.setState({
                loading: false,
              });
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
    servicesHandler({
      type: SERVICES_TYPE.PAYMENT_TRANSACTION,
      siteId,
      cartId,
      onPop: () => {
        this.setState({loading: true});
        this._getOrdersItem(siteId, cartId);
      },
    });
  };

  handleProductLoading = (loading) => {
    this.setState({loading});
  };

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

  _goAddress = () => {
    push(
      appConfig.routes.myAddress,
      {
        isVisibleStoreAddress: true,
        addressId: store.cart_data?.address?.id,
      },
      this.theme,
    );
  };

  _goPaymentMethod = (cart_data) => {
    servicesHandler({
      type: SERVICES_TYPE.PAYMENT_METHOD,
      theme: this.theme,
      selectedMethod: cart_data.payment_method,
      selectedPaymentMethodDetail: cart_data.payment_method_detail,
      price: cart_data.total_before_view,
      totalPrice: cart_data.total_selected,
      extraFee: cart_data.item_fee,
      storeId: cart_data.site_id,
      cartId: cart_data.id,
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
  _removeItemCartConfirm = (item) => {
    if (this.refs_remove_item_confirm) {
      this.refs_remove_item_confirm.open();
    }

    this.cartItemConfirmRemove = item;
  };

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
              pop();
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
        copy_sticker_flag: true,
      },
      () => {
        setTimeout(() => {
          this.setState({
            copy_sticker_flag: false,
          });
        }, 2000);
      },
    );
  }

  _copyAddress(address) {
    const {t} = this.props;
    var address_string = `${t('confirm.address.title')}: ${address.name}, ${
      address.tel
    }, ${address.address}`;

    Clipboard.setString(address_string);

    this._showSticker();
  }

  handleChangeNote = (note) => {
    store.setUserCartNote(note);
    this.handleDebounceUpdateNote(note);
  };

  handleDebounceUpdateNote = debounce(
    (note) => this.handleUpdateNote(note),
    1000,
  );

  handleUpdateNote = async (note, isReloadData = false) => {
    if (this.refNoteModalInput) {
      this.refNoteModalInput.close();
    }

    const siteId = this.cartData.site_id;
    const cartId = this.cartData.id;
    const data = {user_note: note};

    try {
      const response = await APIHandler.edit_user_note(siteId, cartId, data);

      if (response?.status === STATUS_SUCCESS) {
        if (isReloadData) {
          this._getOrdersItem(siteId, cartId, false);
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message:
            response?.message || this.props.t('common:api.error.message'),
        });
      }
    } catch (e) {
      console.log('edit_user_note ' + e);
      flashShowMessage({
        type: 'danger',
        message: this.props.t('common:api.error.message'),
      });
    }
  };

  handleNoteUpdated = () => {
    this._getOrdersItem(this.cartData.site_id, this.cartData.id, false);
  };

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
    refresh({});

    this._goBack();

    clearTimeout(this._delayViewOrders);
    this._delayViewOrders = setTimeout(() => {
      push(
        appConfig.routes.ordersDetail,
        {
          title: `#${store.cart_data.cart_code}`,
          data: store.cart_data,
          tel: store.store_data.tel,
        },
        this.theme,
      );
    }, 500);
  }

  _continueShopping() {
    this._popupClose();

    this._goBack();

    // clear cart data on app
    store.resetCartData();
  }

  _goBack() {
    pop();
  }

  _onLayout(event) {
    if (this.state.noteOffset == 0) {
      this.setState({
        noteOffset: event.nativeEvent.layout.y - 8,
      });
    }
  }

  goBackStores(item) {
    if (store.no_refresh_home_change) {
      pop();
    } else {
      store.setStoreData({
        id: item.site_id,
        name: item.shop_name,
        tel: item.tel,
      });
      store.goStoreNow = true;

      reset(appConfig.routes.primaryTabbar);
    }
  }

  async _cancelCart() {
    this._closePopupCancel();

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
    push(appConfig.routes.phoneAuth, {
      tel: store.cart_data.address.tel,
    });
  }

  async _copyCart() {
    this._closePopupCopy();

    if (this.item_coppy) {
      this.reorderRequest.data = APIHandler.cart_reorder(
        this.item_coppy.site_id,
        this.item_coppy.id,
      );
      try {
        var response = await this.reorderRequest.promise();

        if (response && response.status == STATUS_SUCCESS) {
          store.setCartData(response.data);
          store.setOrdersKeyChange(store.orders_key_change + 1);
          Events.trigger(RELOAD_STORE_ORDERS);

          flashShowMessage({
            type: 'success',
            message: response.message,
          });

          pop();

          setTimeout(() => {
            push(
              appConfig.routes.paymentConfirm,
              {
                goConfirm: true,
              },
              this.theme,
            );
          }, 1000);
        }
      } catch (e) {
        console.log(e + ' site_cart_reorder');
      }
    }
  }

  async _editCart() {
    this._closePopupEdit();

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
  }

  _closePopupEdit() {
    if (this.refs_edit_cart) {
      this.refs_edit_cart.close();
    }
  }

  _closePopupCopy() {
    if (this.refs_coppy_cart) {
      this.refs_coppy_cart.close();
    }
  }

  confirmCopyCart(item) {
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

  confirmFeedback(cart_data) {
    push(
      appConfig.routes.rating,
      {
        cart_data,
      },
      this.theme,
    );
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

  renderCheckIcon = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name="check-circle"
        style={[titleStyle, styles.checkIcon]}
      />
    );
  };

  get successBoxInputStyle() {
    return {
      borderWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.border,
      borderRadius: this.theme.layout.borderRadiusSmall,
    };
  }

  get successBoxStyle() {
    return {
      borderTopLeftRadius: this.theme.layout.borderRadiusSmall,
      borderTopRightRadius: this.theme.layout.borderRadiusSmall,
    };
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
      (cart_data.status == CART_STATUS_ORDERING && address_data == null)
    ) {
      return (
        <ScreenWrapper style={styles.container}>
          <Indicator />
        </ScreenWrapper>
      );
    }

    const is_login =
      store.user_info != null && store.user_info.username != null;
    const is_ready = cart_data.status == CART_STATUS_READY;
    const can_reorder = cart_data.status == CART_STATUS_COMPLETED;
    const is_completed = cart_data.status >= CART_STATUS_COMPLETED;
    const is_paymenting = cart_data.status == CART_STATUS_ORDERING;
    const cartType = cart_data.cart_type_name;
    const isAllowedEditCart =
      is_ready &&
      !this.isPaid &&
      !isConfigActive(CONFIG_KEY.NOT_ALLOW_EDIT_CART_KEY);

    const isAllowedEditScheduleDeliveryTime =
      cart_data.status < CART_STATUS_PROCESSING;

    const comboAddress =
      (address_data?.province_name || '') +
      (address_data?.district_name ? ' • ' + address_data?.district_name : '') +
      (address_data?.ward_name ? ' • ' + address_data?.ward_name : '');

    const posCode = cart_data?.pos_details;

    const deliveryCode =
      cart_data.delivery_details &&
      (cart_data.delivery_details.ship_unit ||
        cart_data.delivery_details.unit) +
        ' - ' +
        (cart_data.delivery_details.ship_unit_id ||
          cart_data.delivery_details.booking_id);

    const itemFee = cart_data?.item_fee || {};
    const cashbackView = cart_data?.cashback_view || {};

    const storeInfo = cart_data?.store;

    return (
      <ScreenWrapper>
        {this.state.loading && <Loading center />}

        <KeyboardAwareScrollView
          ref={this.refs_confirm_page}
          style={styles.container}
          scrollEventThrottle={16}
          extraScrollHeight={100}
          keyboardShouldPersistTaps="handled"
          resetScrollToCoords={this.resetScrollToCoords}
          onMomentumScrollEnd={this.handleScroll}
          onScrollEndDrag={this.handleScroll}>
          <OrderInfoSection
            code={cart_data.cart_code}
            typeCode={cart_data.cart_type}
            typeView={cartType}
            statusCode={cart_data.status}
            statusView={cart_data.status_view}
            paymentStatusCode={cart_data.payment_status}
            paymentStatusView={cart_data.payment_status_name}
          />

          {!!cart_data?.pos_details && <POSSection code={posCode} />}

          {!!cart_data?.delivery_details && (
            <DeliverySection
              statusName={cart_data.delivery_details?.status_name}
              statusColor={
                this.theme.color.deliveryStatus[
                  cart_data.delivery_details?.status
                ] || this.theme.color.cartType[cart_data.cart_type]
              }
              code={deliveryCode}
            />
          )}

          {single && <ListHeader title={t('confirm.information.recheck')} />}

          {cart_data?.address_id != 0 && (
            <AddressSection
              marginTop={!single}
              name={address_data?.name}
              tel={address_data?.tel}
              address={address_data?.address}
              comboAddress={comboAddress}
              editable={single && !this.state.isConfirming}
              onPressActionBtn={
                single && !this.state.isConfirming
                  ? this._goAddress
                  : () => this._copyAddress(address_data)
              }
            />
          )}

          {isConfigActive(CONFIG_KEY.ALLOW_CHOOSE_DELIVERY_TIME_KEY) && (
            <DeliveryScheduleSection
              editable={isAllowedEditScheduleDeliveryTime}
              dateTime={this.cartData?.delivery_time}
              siteId={this.cartData.site_id}
              cartId={this.cartData.id}
              title={t('confirm.scheduleDelivery.title')}
              onDeliveryTimeChange={(deliveryTime) => {
                this.deliveryTime = deliveryTime;
              }}
            />
          )}

          <NoteSection
            siteId={this.cartData.site_id}
            cartId={this.cartData.id}
            editable={single}
            isShowActionTitle={!is_paymenting}
            value={single ? store.user_cart_note : cart_data.user_note}
            onChangeText={this.handleChangeNote}
            onNoteUpdated={this.handleNoteUpdated}
          />

          {!!storeInfo && (
            <StoreInfoSection
              name={storeInfo.name}
              address={storeInfo.full_address}
              image={storeInfo.img}
              tel={storeInfo.phone}
              originLatitude={Number(cart_data?.address?.latitude)}
              originLongitude={Number(cart_data?.address?.longitude)}
              destinationLatitude={Number(storeInfo.lat)}
              destinationLongitude={Number(storeInfo.lng)}
              isReverseDirection={storeInfo.is_reverse_direction}
            />
          )}

          <ProductSection
            title={
              single ? t('confirm.items.selected') : t('confirm.items.shopped')
            }
            products={cart_products_confirm}
            isProductVisible={single}
            isProductActionVisible={single && !this.state.isConfirming}
            onRemoveCartItem={this._removeItemCartConfirm}
            onProductLoadingStateChange={this.handleProductLoading}
          />

          {(!single ||
            !getValueFromConfigKey(CONFIG_KEY.SITE_USE_SHIP) ||
            this.state.isConfirming) && (
            <PaymentMethodSection
              isUnpaid={this.isUnpaid}
              cartData={cart_data}
              onPressChange={() => this._goPaymentMethod(cart_data)}
            />
          )}

          <PricingAndPromotionSection
            tempPrice={cart_data.total_before_view}
            itemFee={itemFee}
            cashbackView={cashbackView}
            totalItem={cart_data.count_selected}
            totalPrice={cart_data.total_selected}
            promotionName={cart_data.user_voucher?.voucher_name}
            isPromotionSelectable={single}
            selectedVoucher={cart_data.user_voucher}
            siteId={cart_data.site_id}
            voucherStatus={cart_data.voucher_status}
          />

          <CommissionsSection commissions={cart_data?.commissions} />

          <ActionButtonSection
            safeLayout={!single && !this.canTransaction}
            editable={isAllowedEditCart}
            onEdit={this.confirmEditCart.bind(this, cart_data)}
            cancelable={is_ready}
            onCancel={this.confirmCancelCart.bind(this, cart_data)}
            canReorder={can_reorder}
            onReorder={this.confirmCopyCart.bind(this, cart_data)}
            // canAddMore={is_paymenting}
            onAddMore={this.goBackStores.bind(this, cart_data)}
            canFeedback={is_completed && cart_data.status > 1}
            onFeedback={this.confirmFeedback.bind(this, cart_data)}
          />

          {(single || this.canTransaction) && <View style={styles.mt8}></View>}
        </KeyboardAwareScrollView>

        {this.state.suggest_register && !is_login ? (
          <PopupConfirm
            allPositive
            ref_popup={(ref) => (this.popup_message = ref)}
            title={t('confirm.order.popup.notLoggedIn.description')}
            yesTitle={t('confirm.order.popup.notLoggedIn.cancel')}
            yesConfirm={this._viewOrders.bind(this)}
            noTitle={t('confirm.order.popup.notLoggedIn.accept')}
            noConfirm={this._onRegister.bind(this)}
            height={300}
            otherClose={false}
            style={{
              marginTop: -(NAV_HEIGHT / 2),
            }}
            content={(title) => {
              return (
                <Container style={[styles.success_box, this.successBoxStyle]}>
                  <View style={styles.success_icon_box}>
                    <Typography
                      type={TypographyType.TITLE_MEDIUM_PRIMARY}
                      style={styles.success_icon_label}
                      renderIconBefore={this.renderCheckIcon}>
                      {t('confirm.order.popup.title')}
                    </Typography>
                  </View>
                  <Typography
                    type={TypographyType.LABEL_MEDIUM}
                    style={styles.success_title}>
                    {title}
                  </Typography>

                  <Input
                    ref={(ref) => (this.refs_name_register = ref)}
                    style={[
                      {
                        padding: 8,
                        marginTop: 12,
                      },
                      this.successBoxInputStyle,
                    ]}
                    keyboardType="default"
                    maxLength={100}
                    placeholder={t('confirm.order.popup.userPlaceholder')}
                    onChangeText={(value) => {
                      this.setState({
                        name_register: value,
                      });
                    }}
                    value={this.state.name_register}
                  />

                  <Input
                    ref={(ref) => (this.refs_tel_register = ref)}
                    style={[
                      {
                        padding: 8,
                        marginTop: 8,
                      },
                      this.successBoxInputStyle,
                    ]}
                    keyboardType="default"
                    maxLength={250}
                    placeholder={t('confirm.order.popup.telPlaceholder')}
                    onChangeText={(value) => {
                      this.setState({
                        tel_register: value,
                      });
                    }}
                    value={this.state.tel_register}
                  />
                </Container>
              );
            }}
          />
        ) : (
          <PopupConfirm
            allPositive
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
                <Container style={[styles.success_box, this.successBoxStyle]}>
                  <View style={styles.success_icon_box}>
                    <Typography
                      type={TypographyType.TITLE_MEDIUM_PRIMARY}
                      style={styles.success_icon_label}
                      renderIconBefore={this.renderCheckIcon}>
                      {t('confirm.order.popup.title')}
                    </Typography>
                  </View>
                  <Typography
                    type={TypographyType.LABEL_MEDIUM}
                    style={styles.success_title}>
                    {title}
                  </Typography>
                </Container>
              );
            }}
          />
        )}

        <Sticker
          active={this.state.copy_sticker_flag}
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
          title={t('cart:popup.reorder.message')}
          height={110}
          noConfirm={this._closePopupCopy.bind(this)}
          yesConfirm={this._copyCart.bind(this)}
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

        {(single || this.canTransaction) && (
          <Container
            row
            safeLayout={!store.keyboardTop}
            style={{bottom: store.keyboardTop}}>
            {single && this.state.isConfirming && (
              <Button
                neutral
                containerStyle={[
                  styles.cart_payment_btn_box,
                  {paddingRight: 0},
                ]}
                titleStyle={styles.cart_payment_btn_title}
                onPress={this.handleEditConfirmingCart.bind(this)}
                renderIconLeft={(titleStyle, buttonStyle, fontStyle) => {
                  return (
                    <Icon
                      bundle={BundleIconSetName.FONT_AWESOME}
                      name="edit"
                      style={[fontStyle, styles.btnBoxIcon]}
                    />
                  );
                }}>
                {t('confirm.edit')}
              </Button>
            )}

            <Button
              containerStyle={styles.cart_payment_btn_box}
              titleStyle={styles.cart_payment_btn_title}
              onPress={
                single
                  ? () => this.handleSubmit(cart_data)
                  : this.canTransaction &&
                    (() =>
                      this.goToTransaction(cart_data.site_id, cart_data.id))
              }
              renderIconLeft={(titleStyle, buttonStyle, fontStyle) => {
                return (
                  <Icon
                    bundle={BundleIconSetName.FONT_AWESOME}
                    name="check"
                    style={[fontStyle, styles.btnBoxIcon]}
                  />
                );
              }}>
              {single
                ? this.isSiteUseShipNotConfirming
                  ? t('confirm.confirmOrder')
                  : this.canTransaction
                  ? t('confirm.order.payTitle')
                  : t('confirm.order.title')
                : this.canTransaction
                ? t('confirm.order.payTitle')
                : ''}
            </Button>
          </Container>
        )}
      </ScreenWrapper>
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

  cart_payment_btn_box: {
    flex: 1,
  },
  cart_payment_btn_title: {
    marginLeft: 8,
  },

  mt8: {
    marginTop: 8,
  },

  success_box: {
    padding: 15,
  },
  success_title: {
    textAlign: 'center',
    lineHeight: 20,
  },
  success_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  success_icon_label: {
    fontWeight: '600',
    marginLeft: 8,
  },
  checkIcon: {
    fontSize: 24,
  },
  btnBoxIcon: {
    fontSize: 20,
  },
});

export default withTranslation(['orders', 'cart', 'common'])(observer(Confirm));
