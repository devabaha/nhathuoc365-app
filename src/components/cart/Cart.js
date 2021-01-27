import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import { CheckBox } from 'react-native-elements';
import store from '../../store/Store';
import PopupConfirm from '../PopupConfirm';
import appConfig from 'app-config';
import EventTracker from '../../helper/EventTracker';

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      cart_check_list: {},
      loading: true
    };

    this.unmounted = false;
    this.eventTracker = new EventTracker();
  }

  componentWillUnMount() {
    this.unmounted = true;
    Actions.refresh({
      renderRightButton: this._renderRightButton.bind(this)
    });
    this.eventTracker.clearTracking();
  }

  componentDidMount() {
    this.start_time = time();

    var { cart_data, cart_products, store_id } = store;

    if (
      cart_data == null ||
      cart_products == null ||
      (cart_data && cart_data.site_id != store_id)
    ) {
      this._getCart();
    } else {
      setTimeout(() => {
        this.setState({
          loading: false
        });
      }, this._delay());
    }

    this.eventTracker.logCurrentView();
  }

  // lấy thông tin giỏ hàng
  async _getCart(delay) {
    const { t } = this.props;
    try {
      const response = await APIHandler.site_cart_show(store.store_id);

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          setTimeout(() => {
            store.setCartData(response.data);
          }, delay || this._delay());
        } else {
          store.resetCartData();
        }
      }
    } catch (e) {
      console.log(e + ' site_cart_show');
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
          refreshing: false
        });
    }
  }

  // pull to refresh
  _onRefresh() {
    this.setState({ refreshing: true });

    this._getCart(1000);
  }

  _renderRightButton() {
    var { store_data } = store;

    return (
      <View style={styles.right_btn_box}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
            Actions.amazing_chat({
              titleStyle: { width: 220 },
              phoneNumber: store.store_data.tel,
              title: store.store_data.name,
              site_id: store.store_id,
              user_id: store.user_info.id
            });
          }}
        >
          <View style={styles.right_btn_add_store}>
            <Icon name="commenting" size={20} color="#ffffff" />
            {store_data && store_data.count_chat > 0 && (
              <View style={styles.stores_info_action_notify}>
                <Text style={styles.stores_info_action_notify_value}>
                  {store_data.count_chat}
                </Text>
              </View>
            )}
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  // show popup confirm remove item in cart
  _removeItemCartConfirm(item) {
    if (this.refs_remove_item_confirm) {
      this.refs_remove_item_confirm.open();
    }

    this.cartItemConfirmRemove = item;
  }

  // xử lý trừ số lượng, số lượng = 0 confirm xoá
  _item_qnt_decrement_handler(item) {
    if (item.quantity <= 1) {
      this._removeItemCartConfirm(item);
    } else {
      this._item_qnt_decrement(item);
    }
  }

  // giảm số lượng item trong giỏ hàng
  async _item_qnt_decrement(item) {
    const { t } = this.props;
    try {
      const data = {
        quantity: 1,
        model: item.model
      };
      var response = await APIHandler.site_cart_minus(
        store.store_id,
        item.id,
        data
      );

      if (response && response.status == STATUS_SUCCESS) {
        store.setCartData(response.data);
        flashShowMessage({
          type: 'success',
          message: response.message
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message || t('common:api.error.message')
        });
      }
    } catch (e) {
      console.log(e + ' site_cart_minus');
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message')
      });
    }
  }

  // tăng số lượng sảm phẩm trong giỏ hàng
  async _item_qnt_increment(item) {
    const { t } = this.props;
    try {
      const data = {
        quantity: 1,
        model: item.model
      };

      const response = await APIHandler.site_cart_plus(
        store.store_id,
        item.id,
        data
      );

      if (response && response.status == STATUS_SUCCESS) {
        store.setCartData(response.data);
        flashShowMessage({
          type: 'success',
          message: response.message
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message || t('common:api.error.message')
        });
      }
    } catch (e) {
      console.log(e + ' site_cart_plus');
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message')
      });
    }
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

    this.start_time = time();

    this._closePopupConfirm();

    var item = this.cartItemConfirmRemove;

    try {
      const data = {
        quantity: 0,
        model: item.model
      };

      var response = await APIHandler.site_cart_update(
        store.store_id,
        item.id,
        data
      );

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          action(() => {
            store.setCartData(response.data);
            // prev item in list
            if (isAndroid && store.cart_item_index > 0) {
              store.setCartItemIndex(store.cart_item_index - 1);
            }
            flashShowMessage({
              type: 'success',
              message: response.message
            });
          })();
        }, this._delay());
      }

      this.cartItemConfirmRemove = undefined;
    } catch (e) {
      console.log(e + ' site_cart_update');
    }
  }

  async _checkBoxHandler(item) {
    const { t } = this.props;
    try {
      const data = {
        model: item.model
      };

      let response = null;
      if (item.selected == 1) {
        response = await APIHandler.site_cart_unselected(
          store.store_id,
          item.id,
          data
        );
      } else {
        response = await APIHandler.site_cart_selected(
          store.store_id,
          item.id,
          data
        );
      }

      if (response && response.status == STATUS_SUCCESS) {
        store.setCartData(response.data);
        flashShowMessage({
          type: 'success',
          message: response.message
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message || t('common:api.error.mesesage')
        });
      }
    } catch (e) {
      console.log(e + ' site_cart_selected');
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.mesesage')
      });
    } finally {
    }
  }

  // go payment screen
  _goPayment() {
    if (store.cart_data.count_selected > 0) {
      Actions.push(appConfig.routes.myAddress);
    } else {
      const { t } = this.props;
      return Alert.alert(
        t('notification.noItemSelected.title'),
        t('notification.noItemSelected.messsage'),
        [
          {
            text: t('notification.noItemSelected.accept'),
            onPress: () => {
              if (this.props.add_new) {
                this.props.add_new();
              }
            }
          }
        ],
        { cancelable: false }
      );
    }
  }

  render() {
    const { t } = this.props;
    // cart is loading
    if (this.state.loading) {
      return <Indicator />;
    }

    var { cart_data, cart_products } = store;

    // cart is empty
    if (cart_data == null || cart_products == null) {
      return <CenterText title={t('noItems')} />;
    }

    return (
      <View style={styles.container}>
        {cart_products != null && (
          <FlatList
            style={styles.items_box}
            data={cart_products}
            extraData={cart_products}
            renderItem={({ item, index }) => {
              return (
                <View style={[styles.cart_item_box]}>
                  <View style={styles.cart_item_check_box}>
                    <CheckBox
                      containerStyle={styles.cart_item_check}
                      checked={item.selected == 1 ? true : false}
                      checkedColor={DEFAULT_COLOR}
                      hiddenTextElement
                      onPress={this._checkBoxHandler.bind(this, item)}
                    />
                  </View>

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
                      <View style={styles.cart_item_actions}>
                        <TouchableHighlight
                          style={styles.cart_item_actions_btn}
                          underlayColor="transparent"
                          onPress={this._item_qnt_decrement_handler.bind(
                            this,
                            item
                          )}
                        >
                          <Text style={styles.cart_item_btn_label}>-</Text>
                        </TouchableHighlight>

                        <Text style={styles.cart_item_actions_quantity}>
                          {item.quantity_view}
                        </Text>

                        <TouchableHighlight
                          style={styles.cart_item_actions_btn}
                          underlayColor="transparent"
                          onPress={this._item_qnt_increment.bind(this, item)}
                        >
                          <Text style={styles.cart_item_btn_label}>+</Text>
                        </TouchableHighlight>
                      </View>

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

                  {item.discount_percent > 0 && (
                    <View style={styles.item_safe_off}>
                      <View style={styles.item_safe_off_percent}>
                        <Text style={styles.item_safe_off_percent_val}>
                          -{item.discount_percent}%
                        </Text>
                      </View>
                    </View>
                  )}

                  {item.selected != 1 && (
                    <TouchableHighlight
                      underlayColor="transparent"
                      onPress={this._checkBoxHandler.bind(this, item)}
                      style={styles.uncheckOverlay}
                    >
                      <View></View>
                    </TouchableHighlight>
                  )}
                </View>
              );
            }}
            keyExtractor={item => item.id}
          />
        )}

        <View style={styles.cart_payment_box}>
          {/*<View style={styles.cart_payment_rows}>
            <Text style={styles.cart_payment_label}>TIỀN HÀNG</Text>
            <View style={styles.cart_payment_price_box}>
              <Text style={styles.cart_payment_price}>{cart_data.total}</Text>
            </View>
          </View>
          <View style={[styles.cart_payment_rows, styles.borderBottom]}>
            <Text style={styles.cart_payment_label}>PHÍ DỊCH VỤ</Text>
            <View style={styles.cart_payment_price_box}>
              <Text style={styles.cart_payment_price}>MIỄN PHÍ</Text>
            </View>
          </View>*/}
          <View style={[styles.cart_payment_rows, styles.mt12]}>
            <Text style={[styles.cart_payment_label, styles.text_both]}>
              {t('payment.total')}
            </Text>
            <View style={styles.cart_payment_price_box}>
              <Text style={[styles.cart_payment_price, styles.text_both]}>
                {cart_data.total_selected}
              </Text>
            </View>
          </View>
        </View>

        <TouchableHighlight
          style={styles.cart_payment_btn_box}
          underlayColor="transparent"
          onPress={this._goPayment.bind(this)}
        >
          <View style={styles.cart_payment_btn}>
            <Icon name="shopping-cart" size={24} color="#ffffff" />
            <Text style={styles.cart_payment_btn_title}>
              {t('payment.order')}
            </Text>
          </View>
        </TouchableHighlight>

        <PopupConfirm
          ref_popup={ref => (this.refs_remove_item_confirm = ref)}
          title={t('popup.remove.message')}
          height={110}
          noConfirm={this._closePopupConfirm.bind(this)}
          yesConfirm={this._removeCartItem.bind(this)}
          otherClose={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

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
    minWidth: 16,
    paddingHorizontal: 2,
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
    backgroundColor: '#dddddd'
  },

  items_box: {
    marginBottom: 107
  },

  cart_section_box: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    backgroundColor: '#fa7f50'
  },
  cart_section_title: {
    color: '#ffffff',
    fontSize: 14,
    paddingLeft: 8,
    fontWeight: '600'
  },

  cart_item_box: {
    width: '100%',
    height: 94,
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
    resizeMode: 'cover'
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
    fontWeight: '600'
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
    alignItems: 'center'
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

  cart_payment_box: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: 107,
    backgroundColor: '#ffffff',
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderTopWidth: Util.pixel,
    borderTopColor: '#cccccc'
  },
  cart_payment_rows: {
    width: '100%',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cart_payment_price_box: {
    flex: 1,
    alignItems: 'flex-end'
  },
  cart_payment_price: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500'
  },
  cart_payment_label: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500'
  },
  text_both: {
    color: '#000000',
    fontSize: 18
  },
  borderBottom: {
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#cccccc'
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
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 8
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

  uncheckOverlay: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default withTranslation(['cart', 'common'])(observer(Cart));
