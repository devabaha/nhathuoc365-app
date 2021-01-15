import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import Animated, {
  call,
  timing,
  Easing,
  Clock,
  Value,
  interpolate,
  concat,
} from 'react-native-reanimated';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {Actions} from 'react-native-router-flux';
import Shimmer from 'react-native-shimmer';
import Button from 'react-native-button';

import appConfig from 'app-config';
import store from '../../store/Store';
import {DiscountBadge, NotiBadge} from '../Badges';
import {debounce} from 'lodash';
import PopupConfirm from '../PopupConfirm';

const ORDER_BTN_WIDTH = 100;
const WHITE_SPACE = 30;
const CART_ITEM_WIDTH = appConfig.device.width - ORDER_BTN_WIDTH - WHITE_SPACE;
class CartFooter extends Component {
  static defaultProps = {
    animatedScrollY: new Animated.Value(0),
    animatedContentOffsetY: new Animated.Value(0),
    animating: false,
  };
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      loading: true,
      increment_loading: false,
      decrement_loading: false,
      prefix: props.prefix || '',
      containerHeight: 0,
    };
  }
  unmounted = false;
  cartItemConfirmRemove = null;
  refs_modal_delete_cart_item = React.createRef();
  currentAnimatedScrollY = this.props.animatedContentOffsetY;

  clock = new Clock();
  showAnimating = false;
  hideAnimating = false;
  translateY = new Value(0);
  forceShowingAnimating = false;

  get animatedStyle() {
    return {
      left: concat(
        interpolate(this.translateY, {
          inputRange: [0, 1],
          outputRange: [0, 100],
        }),
        '%',
      ),
      opacity: interpolate(this.translateY, {
        inputRange: [0, 0.4],
        outputRange: [1, 0],
      }),
      bottom: 0,
      // bottom: interpolate(this.translateY, {
      //   inputRange: [0, 1],
      //   outputRange: [0, -this.state.containerHeight],
      // }),
    };
  }

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

    Events.on(NEXT_PREV_CART, NEXT_PREV_CART + this.state.prefix, (data) => {
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

  confirmRemove(item) {
    this.cartItemConfirmRemove = item;

    if (this.refs_modal_delete_cart_item.current) {
      this.refs_modal_delete_cart_item.current.open();
    }
  }

  _item_qnt_decrement_handler(item) {
    if (item.quantity <= 1) {
      if (this.props.confirmRemove) {
        this.props.confirmRemove(item);
      } else {
        this.confirmRemove(item);
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

  onPressCartItem = (item) => {
    Actions.push(appConfig.routes.item, {item, title: item.name});
  };

  renderItems({item}) {
    return (
      <View style={styles.store_cart_item_container}>
        <TouchableHighlight
          underlayColor="#fafafa"
          onPress={() => this.onPressCartItem(item)}>
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
                <Text numberOfLines={1} style={styles.store_cart_item_title}>
                  {item.name}
                </Text>
                {!!item.classification && (
                  <Text
                    numberOfLines={1}
                    style={[styles.store_cart_item_sub_title]}>
                    {item.classification}
                  </Text>
                )}
                <Text style={styles.store_cart_item_price}>
                  {item.price_view}
                </Text>
              </View>
              <View style={styles.store_cart_actions}>
                <View style={styles.store_cart_calculator}>
                  <TouchableHighlight
                    onPress={this._item_qnt_decrement_handler.bind(this, item)}
                    underlayColor="#eee"
                    hitSlop={HIT_SLOP}
                    style={styles.p8}>
                    <View style={styles.store_cart_item_qnt_change}>
                      {this.state.decrement_loading ? (
                        <Indicator size="small" />
                      ) : (
                        <AntDesignIcon name="minus" size={14} color="#404040" />
                      )}
                    </View>
                  </TouchableHighlight>

                  <Text style={styles.store_cart_item_qnt}>
                    {item.quantity_view}
                  </Text>

                  <TouchableHighlight
                    onPress={this._item_qnt_increment.bind(this, item)}
                    underlayColor="#eee"
                    hitSlop={HIT_SLOP}
                    style={styles.p8}>
                    <View style={styles.store_cart_item_qnt_change}>
                      {this.state.increment_loading ? (
                        <Indicator size="small" />
                      ) : (
                        <AntDesignIcon name="plus" size={14} color="#404040" />
                      )}
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>

        {!!item.discount_percent && (
          <DiscountBadge
            containerStyle={styles.discountBadgeContainer}
            contentContainerStyle={styles.discountBadgeContentContainer}
            label={
              <Text style={styles.discountBadgeLabel}>
                {saleFormat(item.discount_percent)}
              </Text>
            }
          />
        )}
        <TouchableOpacity
          onPress={this._confirmRemoveCartItem.bind(this, item)}
          hitSlop={HIT_SLOP}
          style={[
            styles.store_cart_item_qnt_change,
            styles.store_cart_item_remove,
          ]}>
          <AntDesignIcon
            name="close"
            style={styles.store_cart_item_remove_icon}
          />
        </TouchableOpacity>
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
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,.4)']}
                angle={90}
                useAngle
                locations={[0.3, 0.8]}
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

  _confirmRemoveCartItem(item) {
    this.cartItemConfirmRemove = item;

    if (this.refs_modal_delete_cart_item.current) {
      this.refs_modal_delete_cart_item.current.open();
    }
  }

  _closePopup() {
    if (this.refs_modal_delete_cart_item.current) {
      this.refs_modal_delete_cart_item.current.close();
    }
  }

  async _removeCartItem() {
    if (!this.cartItemConfirmRemove) {
      return;
    }

    this._closePopup();

    const item = this.cartItemConfirmRemove;

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

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          action(() => {
            store.setCartData(response.data);
            // prev item in list
            if (isAndroid && store.cart_item_index > 0) {
              const index = store.cart_item_index - 1;
              store.setCartItemIndex(index);
              Events.trigger(NEXT_PREV_CART, {index});
            }
          })();
        }, 450);

        flashShowMessage({
          message: response.message,
          type: 'success',
        });
      }

      this.cartItemConfirmRemove = undefined;
    } catch (e) {
      console.log(e + ' site_cart_update');
    }
  }

  handleContainerLayout = (e) => {
    const containerHeight = Math.round(e.nativeEvent.layout.height);
    if (containerHeight !== this.state.containerHeight) {
      this.setState({
        containerHeight,
      });
    }
  };

  forceShowCart = debounce(() => {
    this.forceShowingAnimating = true;
    this.animating(0);
    this.hideAnimating = false;
  }, 200);

  animating = (toValue, callback = () => {}) => {
    timing(this.translateY, {
      toValue,
      duration: 350,
      easing: Easing.quad,
    }).start(({finished}) => callback(finished));
  };

  scrollListener = (scrollingValue, offsetValue) => {
    const diff = Math.round(scrollingValue - offsetValue);
    if (diff > 100 && !this.forceShowingAnimating) {
      if (this.hideAnimating) return;
      this.hideAnimating = true;
      this.showAnimating = false;
      this.animating(1);
    } else if (diff < -100) {
      if (this.showAnimating) return;
      this.hideAnimating = false;
      this.showAnimating = true;
      this.animating(0);
    } else if (diff === 0) {
      this.forceShowingAnimating = false;
    }
  };

  renderQuickOpenCartBtn(isset_cart, cart_data) {
    const extraStyle = {
      right: concat(
        interpolate(this.translateY, {
          inputRange: [0, 1],
          outputRange: [-50, 0],
        }),
        '%',
      ),
      bottom: interpolate(this.translateY, {
        inputRange: [0, 1],
        outputRange: [-50, this.state.containerHeight * 0.2],
      }),
      opacity: interpolate(this.translateY, {
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      height: this.state.containerHeight * 0.8,
    };
    const ButtonComponent = appConfig.device.isIOS
      ? TouchableHighlight
      : Button;
    return (
      <Animated.View style={[styles.quickOpenCartBtnWrapper, extraStyle]}>
        <View style={styles.quickOpenCartBtnContainer}>
          <ButtonComponent
            underlayColor={LightenColor(appConfig.colors.primary, -10)}
            onPress={this.forceShowCart}>
            <Animated.View style={styles.quickOpenCartBtnContentContainer}>
              <View style={[styles.checkout_box]}>
                <View>
                  <Ionicons name="ios-cart" size={22} color="#fff" />
                  {isset_cart && (
                    <NotiBadge
                      containerStyle={{right: '-50%'}}
                      label={cart_data.count}
                      show={!!cart_data.count}
                      animation
                    />
                  )}
                </View>
              </View>

              {isset_cart && (
                <View style={styles.totalPriceContainer}>
                  <Text style={styles.totalPrice}>
                    {cart_data.total_selected}
                  </Text>
                </View>
              )}
            </Animated.View>
          </ButtonComponent>
        </View>
      </Animated.View>
    );
  }

  render() {
    const {t} = this.props;
    var {cart_data, cart_products} = store;
    var isset_cart = !(cart_data == null || cart_products == null);

    if (!isset_cart) {
      return null;
    }

    return (
      <>
        <Animated.Code
          exec={call(
            [this.props.animatedScrollY, this.props.animatedContentOffsetY],
            ([scrollingValue, offsetValue]) =>
              this.scrollListener(scrollingValue, offsetValue),
          )}
        />

        <View>
          {this.props.animating &&
            this.renderQuickOpenCartBtn(isset_cart, cart_data)}

          <Animated.View
            onLayout={this.handleContainerLayout}
            style={[
              styles.store_cart_box,
              {
                position: this.props.animating ? 'absolute' : undefined,
              },
              this.animatedStyle,
            ]}>
            {cart_data.promotions && cart_data.promotions.title && (
              <View style={styles.discountContainer}>
                <Shimmer
                  pauseDuration={5000}
                  opacity={1}
                  animationOpacity={0.6}
                  highlightLength={0.5}
                  animating>
                  <Text style={styles.discountTxt}>
                    {cart_data.promotions.title} {`${t('discount')} `}
                    {cart_data.promotions.discount_text}
                  </Text>
                </Shimmer>
              </View>
            )}

            <View style={styles.store_cart_content_container}>
              {this._renderContent()}

              <TouchableHighlight
                onPress={this._goPayment.bind(this)}
                style={[styles.checkout_btn]}
                underlayColor={LightenColor(appConfig.colors.primary, -10)}>
                <View style={styles.checkout_content_btn}>
                  <View style={[styles.checkout_box]}>
                    <View>
                      <Ionicons name="ios-cart" size={22} color="#fff" />
                      {isset_cart && (
                        <NotiBadge
                          containerStyle={{right: '-50%'}}
                          label={cart_data.count}
                          show={!!cart_data.count}
                          animation
                        />
                      )}
                    </View>
                    <View>
                      {(isset_cart ? t('payment.order') : t('payment.cart'))
                        .split(' ')
                        .map((text, index) => (
                          <Text key={index} style={styles.checkout_title}>
                            {text}
                          </Text>
                        ))}
                    </View>
                  </View>

                  {isset_cart && (
                    <View style={styles.totalPriceContainer}>
                      <Text style={styles.totalPrice}>
                        {cart_data.total_selected}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableHighlight>
            </View>
          </Animated.View>
        </View>

        <PopupConfirm
          ref_popup={this.refs_modal_delete_cart_item}
          title={t('cart:popup.remove.message')}
          height={110}
          noConfirm={this._closePopup.bind(this)}
          yesConfirm={this._removeCartItem.bind(this)}
          otherClose={false}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  store_cart_box: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    ...elevationShadowStyle(7, 0, 0),
    width: '100%',
  },
  store_cart_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  discountContainer: {
    width: Util.size.width,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.05),
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountTxt: {
    fontSize: 10,
    fontWeight: 'bold',
    color: appConfig.colors.primary,
    textAlign: 'center',
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
  checkout_content_btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appConfig.colors.primary,
  },
  checkout_box: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  checkout_title: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 12,
  },
  store_cart_content: {
    flex: 1,
  },
  store_cart_content_container: {
    flexDirection: 'row',
    borderTopWidth: Util.pixel,
    borderTopColor: '#dddddd',
  },
  store_cart_item_container: {
    width: CART_ITEM_WIDTH,
    overflow: 'hidden',
  },
  store_cart_item: {
    width: '100%',
    flexDirection: 'row',
    borderRightWidth: 0.5,
    borderColor: '#eee',
    padding: 7,
  },
  store_cart_item_image_box: {
    width: 75,
    height: 75,
  },
  store_cart_item_image: {
    flex: 1,
    resizeMode: 'contain',
  },
  store_cart_item_title_box: {
    flex: 1,
    marginLeft: 10,
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
  store_cart_actions: {
    flexDirection: 'row',
    marginTop: 7,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  store_cart_calculator: {
    // marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  store_cart_item_qnt_change: {
    width: 22,
    height: 22,
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
  store_cart_item_remove: {
    backgroundColor: '#cc7171',
    borderWidth: 0,
    position: 'absolute',
    left: 10,
    top: 3,
    width: 20,
    height: 20,
    borderRadius: 5,
    // borderTopLeftRadius: 0,
    // borderBottomLeftRadius: 0,
    ...elevationShadowStyle(2),
  },
  store_cart_item_remove_icon: {
    color: '#fff',
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

  quickOpenCartBtnWrapper: {
    position: 'absolute',
    right: 0,
    minWidth: ORDER_BTN_WIDTH,
    borderTopLeftRadius: ORDER_BTN_WIDTH / 2,
    borderBottomLeftRadius: ORDER_BTN_WIDTH / 2,
    backgroundColor: appConfig.colors.primary,
    ...elevationShadowStyle(7, 0, 0, 0.5, appConfig.colors.primary),
    paddingHorizontal: 7,
  },
  quickOpenCartBtnContainer: {
    flex: 1,
    borderTopLeftRadius: ORDER_BTN_WIDTH / 2,
    borderBottomLeftRadius: ORDER_BTN_WIDTH / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickOpenCartBtnContentContainer: {
    height: '100%',
    minWidth: ORDER_BTN_WIDTH,
    borderTopLeftRadius: ORDER_BTN_WIDTH / 2,
    borderBottomLeftRadius: ORDER_BTN_WIDTH / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    left: 5,
  },
  totalPriceContainer: {
    paddingHorizontal: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 7,
  },
  totalPrice: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
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
  discountBadgeContainer: {
    position: 'absolute',
    bottom: 0,
    height: undefined,
    backgroundColor: '#fff',
    width: undefined,
    ...elevationShadowStyle(3),
  },
  discountBadgeContentContainer: {
    backgroundColor: appConfig.colors.marigold,
    paddingVertical: 2,
  },
  discountBadgeLabel: {
    fontSize: 10,
  },
});

export default withTranslation(['cart', 'common'])(observer(CartFooter));
