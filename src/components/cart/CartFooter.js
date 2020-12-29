import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';
import store from '../../store/Store';
import Shimmer from 'react-native-shimmer';
import {NotiBadge} from '../Badges';
import LinearGradient from 'react-native-linear-gradient';

const ORDER_BTN_WIDTH = 100;
const WHITE_SPACE = 40;
const CART_ITEM_WIDTH = appConfig.device.width - ORDER_BTN_WIDTH - WHITE_SPACE;
class CartFooter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      loading: true,
      increment_loading: false,
      decrement_loading: false,
      perfix: props.perfix || '',
    };
  }
  unmounted = false;

  componentDidMount() {
    var {cart_data, cart_products, store_id} = store;

    var is_change_store = store.cart_store_id != store_id;
    if (is_change_store) {
      store.cart_store_id = store_id;
    }

    if (cart_data == null || cart_products == null || is_change_store) {
      this._getCart();
    } else {
      this.setState({
        loading: false,
      });
    }

    Events.on(NEXT_PREV_CART, NEXT_PREV_CART + this.state.perfix, (data) => {
      this._goTopIndex(data.index);
    });
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  async _getCart() {
    const {t} = this.props;
    try {
      const response = await APIHandler.site_cart_show(store.store_id);

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          store.setCartData(response.data);
        } else {
          store.resetCartData();
        }
      }
    } catch (e) {
      console.log(e + ' site_cart_show');
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
        });
    }
  }

  _item_qnt_decrement_handler(item) {
    if (item.quantity <= 1) {
      if (this.props.confirmRemove) {
        this.props.confirmRemove(item);
      }
    } else {
      this._item_qnt_decrement(item);
    }
  }

  _item_qnt_decrement(item) {
    this.setState(
      {
        decrement_loading: true,
      },
      async () => {
        const {t} = this.props;
        try {
          const data = {
            quantity: 1,
            model: item.model,
          };

          const response = await APIHandler.site_cart_minus(
            store.store_id,
            item.id,
            data,
          );

          if (response && response.status == STATUS_SUCCESS) {
            store.setCartData(response.data);

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
        } catch (e) {
          console.log(e + ' site_cart_minus');
          flashShowMessage({
            type: 'danger',
            message: t('common:api.error.message'),
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
          console.warn(e + ' site_cart_plus');
          flashShowMessage({
            type: 'danger',
            message: t('common:api.error.message'),
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

  _store_cart_prev() {
    if (store.cart_item_index <= 0) {
      return;
    }

    var index = store.cart_item_index - 1;
    store.setCartItemIndex(index);
    Events.trigger(NEXT_PREV_CART, {index});
  }

  _store_cart_next() {
    if (store.cart_item_index + 1 >= store.cart_products.length) {
      return;
    }

    var index = store.cart_item_index + 1;
    store.setCartItemIndex(index);
    Events.trigger(NEXT_PREV_CART, {index});
  }

  _goTopIndex(index) {
    if (store.cart_data == null || store.cart_products == null) {
      return;
    }
    if (index + 1 > store.cart_products.length) {
      index = 0;
    }
    if (this.refs_store_cart) {
      this.refs_store_cart.scrollToIndex({index, animated: true});
    }
  }

  renderItems({item}) {
    return (
      <View style={styles.store_cart_item}>
        <View style={styles.store_cart_item_image_box}>
          <CachedImage
            mutable
            style={styles.store_cart_item_image}
            source={{uri: item.image}}
          />
        </View>
        <View style={styles.store_cart_item_title_box}>
          <View style={{flex: 1}}>
            <Text numberOfLines={2} style={styles.store_cart_item_title}>
              {item.name}
            </Text>
            {!!item.classification && (
              <Text
                numberOfLines={1}
                style={[styles.store_cart_item_sub_title]}>
                {item.classification}
              </Text>
            )}
            <Text style={styles.store_cart_item_price}>{item.price_view}</Text>
          </View>

          <View style={styles.store_cart_calculator}>
            <TouchableHighlight
              onPress={this._item_qnt_decrement_handler.bind(this, item)}
              underlayColor="transparent"
              style={styles.p8}>
              <View style={styles.store_cart_item_qnt_change}>
                {this.state.decrement_loading ? (
                  <Indicator size="small" />
                ) : (
                  <AntDesignIcon name="minus" size={16} color="#404040" />
                )}
              </View>
            </TouchableHighlight>

            <Text style={styles.store_cart_item_qnt}>{item.quantity_view}</Text>

            <TouchableHighlight
              onPress={this._item_qnt_increment.bind(this, item)}
              underlayColor="transparent"
              style={styles.p8}>
              <View style={styles.store_cart_item_qnt_change}>
                {this.state.increment_loading ? (
                  <Indicator size="small" />
                ) : (
                  <AntDesignIcon name="plus" size={16} color="#404040" />
                )}
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }

  _onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);
    if (pageNum != store.cart_item_index) {
      store.setCartItemIndex(pageNum);
    }
  }

  _renderContent() {
    if (this.state.loading) {
      return (
        <View style={styles.store_cart_container}>
          <Indicator size="small" />
        </View>
      );
    }
    const {t} = this.props;
    var {cart_data, cart_products} = store;
    var isset_cart = !(cart_data == null || cart_products == null);

    if (isset_cart) {
      return (
        <View style={styles.store_cart_container}>
          <View style={styles.store_cart_content}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 7,
              }}
              ref={(ref) => (this.refs_store_cart = ref)}
              data={cart_products}
              decelerationRate="fast"
              pagingEnabled
              snapToInterval={CART_ITEM_WIDTH}
              onMomentumScrollEnd={this._onScrollEnd.bind(this)}
              extraData={cart_products}
              initialScrollIndex={store.cart_item_index}
              getItemLayout={(data, index) => {
                return {
                  length: CART_ITEM_WIDTH,
                  offset: CART_ITEM_WIDTH * index,
                  index,
                };
              }}
              renderItem={this.renderItems.bind(this)}
              keyExtractor={(item) => item.id}
              horizontal
            />

            <View pointerEvents="none" style={styles.maskContainer}>
              <LinearGradient
                style={styles.maskLinear}
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,.5)']}
                angle={90}
                useAngle
                locations={[0.3, 1]}
              />
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.store_cart_container}>
          <CenterText marginTop={-8} title={t('noFooterItems')} />
        </View>
      );
    }
  }

  _goPayment() {
    if (store.cart_data && store.cart_products) {
      if (store.cart_data.address_id != 0) {
        Actions.push(appConfig.routes.paymentConfirm, {
          goConfirm: true,
        });
      } else {
        Actions.create_address({
          redirect: 'confirm',
        });
      }
    } else {
      const {t} = this.props;
      return Alert.alert(
        t('notification.noItemSelected.title'),
        t('notification.noItemSelected.message'),
        [
          {
            text: t('notification.noItemSelected.accept'),
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
  }

  render() {
    const {t} = this.props;
    var {cart_data, cart_products} = store;
    var isset_cart = !(cart_data == null || cart_products == null);

    if (!isset_cart) {
      return null;
    }

    return (
      <View style={[styles.store_cart_box]}>
        {cart_data.promotions && cart_data.promotions.title && (
          <View
            style={{
              width: Util.size.width,
              paddingVertical: 5,
              paddingHorizontal: 20,
              backgroundColor: hexToRgbA(appConfig.colors.primary, 0.08),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Shimmer
              pauseDuration={5000}
              opacity={1}
              animationOpacity={0.6}
              highlightLength={0.5}
              animating>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '500',
                  color: appConfig.colors.primary,
                  textAlign: 'center',
                }}>
                {cart_data.promotions.title} {`${t('discount')} `}
                {cart_data.promotions.discount_text}
              </Text>
            </Shimmer>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            borderTopWidth: Util.pixel,
            borderTopColor: '#dddddd',
          }}>
          {this._renderContent.call(this)}

          <TouchableHighlight
            onPress={this._goPayment.bind(this)}
            style={styles.checkout_btn}
            underlayColor="transparent">
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: DEFAULT_COLOR,
              }}>
              <View style={styles.checkout_box}>
                <View>
                  <AntDesignIcon
                    name="shoppingcart"
                    size={22}
                    color="#ffffff"
                  />
                  {isset_cart && (
                    <NotiBadge
                      containerStyle={{right: '-50%'}}
                      label={cart_data.count}
                      show={!!cart_data.count}
                      animation
                    />
                  )}
                </View>
                <Text style={styles.checkout_title}>
                  {isset_cart ? t('payment.order') : t('payment.cart')}
                </Text>
              </View>

              {isset_cart && (
                <Text
                  style={{
                    fontSize: 14,
                    color: '#ffffff',
                    fontWeight: '600',
                    marginTop: 5,
                  }}>
                  {cart_data.total_selected}
                </Text>
              )}
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  store_cart_box: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    ...elevationShadowStyle(5, 0, 0),
  },
  store_cart_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  store_cart_btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  store_cart_btn_left: {},
  store_cart_btn_right: {},
  checkout_btn: {
    width: ORDER_BTN_WIDTH,
  },
  checkout_box: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkout_title: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 10,
  },
  store_cart_content: {
    flex: 1,
  },
  store_cart_item: {
    width: CART_ITEM_WIDTH,
    flexDirection: 'row',
    borderRightWidth: 0.5,
    borderColor: '#eee',
  },
  store_cart_item_image_box: {
    width: 66,
    height: 85,
    overflow: 'hidden',
  },
  store_cart_item_image: {
    flex: 1,
    resizeMode: 'contain',
  },
  store_cart_item_title_box: {
    flex: 1,
  },
  store_cart_item_title: {
    color: '#404040',
    fontSize: 12,
    fontWeight: '500',
  },
  store_cart_item_sub_title: {
    color: '#555',
    fontSize: 10,
    marginTop: 2,
  },
  store_cart_item_price: {
    fontSize: 12,
    color: '#fa7f50',
    fontWeight: '500',
    marginTop: appConfig.device.isIOS ? 2 : 0,
  },
  store_cart_calculator: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  store_cart_item_qnt_change: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Util.pixel,
    borderColor: '#404040',
    borderRadius: 3,
  },
  store_cart_item_qnt: {
    fontWeight: '600',
    color: '#404040',
    fontSize: 16,
    paddingHorizontal: 16,
  },

  p8: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  maskContainer: {
    width: WHITE_SPACE,
    height: '100%',
    position: 'absolute',
    right: 0,
  },
  maskLinear: {
    width: WHITE_SPACE,
    height: '100%',
  },
});

export default withTranslation(['cart', 'common'])(observer(CartFooter));
