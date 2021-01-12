import React, {Component} from 'react';
import {
  TouchableHighlight,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import {DiscountBadge} from '../Badges';
import {CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Actions} from 'react-native-router-flux';
import store from 'app-store';
import appConfig from 'app-config';
import Button from 'react-native-button';

const styles = StyleSheet.create({
  cart_item_box: {
    width: '100%',
    paddingTop: 25,
    paddingBottom: 15,
    paddingHorizontal: 7,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
    alignItems: 'center',
  },
  cart_item_check_box: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    right: 5,
  },
  cart_item_check_icon: {
    color: appConfig.colors.primary,
    fontSize: 22,
  },
  cart_item_check: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    paddingRight: 0,
    marginRight: 0,
    backgroundColor: '#fff',
  },
  cart_item_image_box: {
    width: 100,
    height: 100,
  },
  cart_item_image: {
    height: '100%',
    resizeMode: 'contain',
  },
  cart_item_info: {
    flex: 1,
  },
  cart_item_info_content: {
    paddingHorizontal: 7,
  },
  cart_item_info_name: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    paddingRight: 30,
  },
  cart_item_sub_info_name: {
    color: '#555',
    fontSize: 12,
    marginTop: 3,
  },
  cart_item_price_box: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 7,
  },
  cart_item_price_price_safe_off: {
    textDecorationLine: 'line-through',
    fontSize: 14,
    color: '#666666',
    marginLeft: 7,
  },
  cart_item_price_price: {
    fontSize: 15,
    color: appConfig.colors.primary,
  },
  cart_item_quantity_container: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 11,
    backgroundColor: '#f0f0f0',
    height: 22,
    minWidth: 22,
  },
  cart_item_quantity_mess: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  cart_item_actions: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cart_item_calculations: {
    flexDirection: 'row',
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
    backgroundColor: 'rgba(255,255,255,.9)',
    borderWidth: 0,
    top: 15,
    right: 18,
    position: 'absolute',
    padding: 3,
  },
  cart_item_remove_icon: {
    color: '#333',
    fontSize: 15,
  },
  cart_item_actions_quantity: {
    paddingHorizontal: 8,
    minWidth: 50,
    textAlign: 'center',
    color: '#404040',
    fontWeight: '500',
  },
  cart_item_btn_label: {
    color: '#404040',
    fontSize: 20,
    lineHeight: isIOS ? 20 : 24,
  },
  discountBadge: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 20,
  },
});

class CartItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      check_loading: false,
      increment_loading: false,
      decrement_loading: false,
    };
  }

  _checkBoxHandler(item) {
    this.setState(
      {
        check_loading: true,
      },
      async () => {
        const {t} = this.props;
        try {
          const data = {
            model: item.model,
          };
          let response = null;

          if (item.selected == 1) {
            response = await APIHandler.site_cart_unselected(
              store.store_id,
              item.id,
              data,
            );
          } else {
            response = await APIHandler.site_cart_selected(
              store.store_id,
              item.id,
              data,
            );
          }

          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              store.setCartData(response.data);
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
          }
        } catch (e) {
          if (item.selected == 1) {
            console.log(e + ' site_cart_unselected');
          } else {
            console.log(e + ' site_cart_selected');
          }
          flashShowMessage({
            message: t('common:api.error.message'),
            type: 'danger',
          });
        } finally {
          !this.unmounted &&
            this.setState({
              check_loading: false,
            });
        }
      },
    );
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
    this.setState(
      {
        decrement_loading: true,
      },
      async () => {
        try {
          const {t} = this.props;
          const data = {
            quantity: 1,
            model: item.model,
          };

          const response = await APIHandler.site_cart_minus(
            store.store_id,
            item.id,
            data,
          );
          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              store.setCartData(response.data);
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
          }
        } catch (e) {
          console.log(e + ' site_cart_minus');
          flashShowMessage({
            message: t('common:api.error.message'),
            type: 'danger',
          });
        } finally {
          !this.unmounted &&
            this.setState({
              decrement_loading: false,
            });
        }
      },
    );
  }

  // tăng số lượng sảm phẩm trong giỏ hàng
  _item_qnt_increment(item) {
    this.setState(
      {
        increment_loading: true,
      },
      async () => {
        const {t} = this.props;
        try {
          const data = {
            quantity: 1,
            model: item.model,
          };

          const response = await APIHandler.site_cart_plus(
            store.store_id,
            item.id,
            data,
          );

          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              store.setCartData(response.data);

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
          }
        } catch (e) {
          console.log(e + ' site_cart_plus');
          flashShowMessage({
            message: t('common:api.error.message'),
            type: 'danger',
          });
        } finally {
          !this.unmounted &&
            this.setState({
              increment_loading: false,
            });
        }
      },
    );
  }

  onPressCartItem = () => {
    Actions.push(appConfig.routes.item, {
      item: this.props.item,
      title: this.props.item.name,
    });
  };

  renderFooterActionBtn() {
    const item = this.props.item;
    const {check_loading, increment_loading, decrement_loading} = this.state;
    const is_processing =
      check_loading || increment_loading || decrement_loading;

    if (!!this.props.noAction) {
      return (
        <View style={styles.cart_item_quantity_container}>
          <Text style={styles.cart_item_quantity_mess}>
            {item.quantity_view} {item.unit_name}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.cart_item_actions}>
        <View style={styles.cart_item_calculations}>
          <TouchableHighlight
            style={styles.cart_item_actions_btn}
            underlayColor="transparent"
            onPress={
              is_processing
                ? null
                : this._item_qnt_decrement_handler.bind(this, item)
            }>
            <View>
              {decrement_loading ? (
                <Indicator size="small" />
              ) : (
                <Text style={styles.cart_item_btn_label}>-</Text>
              )}
            </View>
          </TouchableHighlight>

          <Text style={styles.cart_item_actions_quantity}>
            {item.quantity_view}
          </Text>

          <TouchableHighlight
            style={styles.cart_item_actions_btn}
            underlayColor="transparent"
            onPress={
              is_processing ? null : this._item_qnt_increment.bind(this, item)
            }>
            <View>
              {increment_loading ? (
                <Indicator size="small" />
              ) : (
                <Text style={styles.cart_item_btn_label}>+</Text>
              )}
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.cart_item_check_box}>
          {check_loading ? (
            <Indicator size="small" />
          ) : (
            <Button
              hitSlop={HIT_SLOP}
              onPress={
                is_processing ? null : this._checkBoxHandler.bind(this, item)
              }>
              <FeatherIcon
                name={item.selected == 1 ? 'check-circle' : 'circle'}
                style={styles.cart_item_check_icon}
              />
            </Button>
          )}
        </View>
      </View>
    );
  }

  render() {
    const item = this.props.item;
    return (
      <TouchableHighlight underlayColor="#ccc" onPress={this.onPressCartItem}>
        <View style={styles.cart_item_box}>
          <View
            style={[
              styles.cart_item_image_box,
              this.props.noAction && {
                width: 80,
                height: 80,
              },
            ]}>
            <CachedImage
              mutable
              style={styles.cart_item_image}
              source={{uri: item.image}}
            />
          </View>

          <View style={styles.cart_item_info}>
            <View style={styles.cart_item_info_content}>
              <Text numberOfLines={2} style={styles.cart_item_info_name}>
                {item.name}
              </Text>

              {!!item.classification && (
                <Text numberOfLines={1} style={styles.cart_item_sub_info_name}>
                  {item.classification}
                </Text>
              )}

              <View style={styles.cart_item_price_box}>
                <Text style={styles.cart_item_price_price}>
                  {item.price_view}
                </Text>
                {item.discount_percent > 0 && (
                  <Text style={styles.cart_item_price_price_safe_off}>
                    {item.discount}
                  </Text>
                )}
              </View>

              {this.renderFooterActionBtn()}
            </View>
          </View>

          {item.discount_percent > 0 && (
            <DiscountBadge
              containerStyle={styles.discountBadge}
              label={saleFormat(item.discount_percent)}
            />
          )}

          {!!!this.props.noAction && (
            <Button
              onPress={this.props.onRemoveCartItem}
              hitSlop={HIT_SLOP}
              containerStyle={[
                styles.cart_item_actions_btn,
                styles.cart_item_remove_btn,
              ]}>
              <AntDesignIcon
                name="close"
                style={styles.cart_item_remove_icon}
              />
            </Button>
          )}
        </View>
      </TouchableHighlight>
    );
  }
}

export default CartItem;
