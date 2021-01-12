import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Animated,
  RefreshControl,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import Swiper from 'react-native-swiper';
import AutoHeightWebView from 'react-native-autoheight-webview';
import store from '../../store/Store';
import Items from '../stores/Items';
import ListHeader from '../stores/ListHeader';
import CartFooter from '../cart/CartFooter';
import PopupConfirm from '../PopupConfirm';
import RightButtonChat from '../RightButtonChat';
import appConfig from 'app-config';
import EventTracker from '../../helper/EventTracker';
import Header from './Header';
import {DiscountBadge} from '../Badges';
import Button from '../../components/Button';
import FastImage from 'react-native-fast-image';
import {PRODUCT_TYPES} from '../../constants';
import SkeletonLoading from '../SkeletonLoading';

const ITEM_KEY = 'ItemKey';

class Item extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      item: props.item,
      item_data: null,
      images: null,
      loading: true,
      buying: false,
      like_loading: true,
      like_flag: 0,
      scrollY: 0,
    };

    this.animatedScrollY = new Animated.Value(0);
    this.unmounted = false;
    this.eventTracker = new EventTracker();
  }

  isServiceProduct(product = {}) {
    return product.product_type === PRODUCT_TYPES.SERVICE;
  }

  componentDidMount() {
    this._initial(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.title != nextProps.title) {
      this.setState(
        {
          refreshing: false,
          item: nextProps.item,
          item_data: null,
          images: null,
          loading: true,
          buying: false,
          like_loading: true,
          like_flag: 0,
        },
        () => {
          this._initial(nextProps);
        },
      );
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();
  }

  logEventTracking(rootData) {
    if (rootData && !this.state.item_data) {
      const options = {
        params: {
          id: rootData.id,
          name: rootData.name,
        },
      };
      this.eventTracker.logCurrentView(options);
    }
  }

  _initial(props) {
    setTimeout(() =>
      Actions.refresh({
        title: props.title || props.t('common:screen.productDetail.mainTitle'),
        showSearchBar: true,
        smallSearch: true,
        placeholder: store.store_data.name,
        searchOnpress: () => {
          return Actions.push(appConfig.routes.searchStore, {
            title: `Tìm kiếm tại ${store.store_data.name}`,
            from_item: true,
            itemRefresh: this._itemRefresh.bind(this),
          });
        },
        right: this._renderRightButton,
        onBack: () => {
          this._unMount();

          Actions.pop();
        },
      }),
    );

    this.start_time = time();

    this._getData();
  }

  _unMount() {
    // remove Listenner next and prev item in cart
    Events.remove(NEXT_PREV_CART, NEXT_PREV_CART + 'item');
  }

  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 400 - Math.abs(time() - this.start_time);
    return delay;
  }
  // tới màn hình store
  _goStores(item) {
    if (store.no_refresh_home_change) {
      // Trong cua hang lien ket
      Actions.pop();
    } else {
      Actions.push(appConfig.routes.store, {
        title: store.store_data.name,
      });
    }
  }
  // Lấy chi tiết sản phẩm
  _getData(delay) {
    var {item} = this.state;
    var item_key = ITEM_KEY + item.id + store.user_info.id;

    // load
    storage
      .load({
        key: item_key,
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          extraFetchOptions: {},
          someFlag: true,
        },
      })
      .then((data) => {
        setTimeout(() => {
          if (isIOS) {
            layoutAnimation();
          }

          var images = [];

          if (data && data.img) {
            data.img.map((item) => {
              images.push({
                url: item.image,
              });
            });
          }

          this.logEventTracking(data);

          this.setState({
            item_data: data,
            images: images,
            like_flag: data.like_flag,
            loading: false,
            refreshing: false,
            like_loading: false,
          });
        }, delay || this._delay());
      })
      .catch((err) => {
        this._getDataFromServer(delay);
      });
  }

  async _getDataFromServer(delay) {
    var {item} = this.state;
    var item_key = ITEM_KEY + item.id + store.user_info.id;
    // alert(store.store_id +' - '+ item.id);
    const {t} = this.props;
    try {
      const response = await APIHandler.site_product(store.store_id, item.id);

      if (response && response.status == STATUS_SUCCESS) {
        // delay append data
        setTimeout(() => {
          if (isIOS) {
            layoutAnimation();
          }

          var images = [];

          if (response.data && response.data.img) {
            response.data.img.map((item) => {
              images.push({
                url: item.image,
              });
            });
          }

          this.logEventTracking(response.data);

          this.setState(
            {
              item_data: response.data,
              images: images,
              like_flag: response.data.like_flag,
              loading: false,
              refreshing: false,
              like_loading: false,
            },
            () => {
              // cache in five minutes
              storage.save({
                key: item_key,
                data: this.state.item_data,
                expires: ITEM_CACHE,
              });
            },
          );
        }, delay || this._delay());
      }
    } catch (e) {
      console.log(e + ' site_product');
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    }
  }

  _renderRightButton() {
    return (
      <View style={styles.right_btn_box}>
        {/* <RightButtonOrders /> */}
        <RightButtonChat tel={store.store_data.tel} />
      </View>
    );
  }

  _onRefresh() {
    this.setState({refreshing: true});

    this._getDataFromServer(1000);
  }

  goToSchedule = (product) => {
    Actions.push(appConfig.routes.productSchedule, {
      productId: product.id,
    });
  };

  handlePressActionBtnProduct = (product, quantity = 1, model = '') => {
    console.log(product);
    switch (product.product_type) {
      case PRODUCT_TYPES.NORMAL:
        this._addCart(product, quantity, model);
        break;
      case PRODUCT_TYPES.SERVICE:
        this.goToSchedule(product);
        break;
      default:
        this.goToSchedule(product);
        break;
    }
  };

  // add item vào giỏ hàng
  _addCart = (item, quantity = 1, model = '') => {
    this.setState(
      {
        buying: true,
      },
      async () => {
        const data = {
          quantity,
          model,
        };
        const {t} = this.props;
        try {
          const response = await APIHandler.site_cart_plus(
            store.store_id,
            item.id,
            data,
          );

          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              if (response.data.attrs) {
                Actions.push(appConfig.routes.itemAttribute, {
                  itemId: item.id,
                  onSubmit: (quantity, modal_key) =>
                    this._addCart(item, quantity, modal_key),
                });
              } else {
                store.setCartData(response.data);

                var index = null,
                  length = 0;
                if (response.data.products) {
                  length = Object.keys(response.data.products).length;

                  Object.keys(response.data.products)
                    .reverse()
                    .some((key, key_index) => {
                      let value = response.data.products[key];
                      if (value.id == item.id) {
                        index = key_index;
                        return true;
                      }
                    });
                }

                if (index !== null && index < length) {
                  store.setCartItemIndex(index);
                  Events.trigger(NEXT_PREV_CART, {index});
                }

                flashShowMessage({
                  message: response.message,
                  type: 'success',
                });
              }
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
            type: 'danger',
            message: t('common:api.error.message'),
          });
        } finally {
          !this.unmounted &&
            this.setState({
              buying: false,
            });
        }
      },
    );
  };

  _likeHandler(item) {
    this.setState(
      {
        like_loading: true,
      },
      async () => {
        try {
          var response = await APIHandler.site_like(
            store.store_id,
            item.id,
            this.state.like_flag == 1 ? 0 : 1,
          );

          if (response && response.status == STATUS_SUCCESS) {
            var like_flag = response.data.like_flag;

            this.setState(
              {
                like_flag,
                like_loading: false,
              },
              () => {
                this.state.item_data.like_flag = like_flag;

                // cache in five minutes
                var {item} = this.state;
                var item_key = ITEM_KEY + item.id + store.user_info.id;
                storage.save({
                  key: item_key,
                  data: this.state.item_data,
                  expires: ITEM_CACHE,
                });
              },
            );
          }
        } catch (e) {
          console.log(e + ' site_like');
          flashShowMessage({
            type: 'danger',
            message: t('common:api.error.message'),
          });
        }
      },
    );
  }

  _itemRefresh(item) {
    Actions.item({
      title: item.name,
      item,
    });
  }

  _confirmRemoveCartItem(item) {
    this.cartItemConfirmRemove = item;

    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.open();
    }
  }

  async _removeCartItem() {
    if (!this.cartItemConfirmRemove) {
      return;
    }

    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.close();
    }

    var item = this.cartItemConfirmRemove;
    const {t} = this.props;
    try {
      const data = {
        quantity: 0,
        model: item.model,
      };

      var response = await APIHandler.site_cart_update(
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
              var index = store.cart_item_index - 1;
              store.setCartItemIndex(index);
              Events.trigger(NEXT_PREV_CART, {index});
            }
            flashShowMessage({
              message: response.message,
              type: 'success',
            });
          })();
        }, 450);
      }

      this.cartItemConfirmRemove = undefined;
    } catch (e) {
      console.log(e + ' site_cart_update');
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    }
  }

  renderPagination = (index, total, context) => {
    return (
      <View style={styles.paginationContainer}>
        <Text style={styles.paginationText}>
          {index + 1}/{total}
        </Text>
      </View>
    );
  };

  renderNextButton() {
    return (
      <View style={styles.swipeControlBtn}>
        <Icon
          name="angle-right"
          style={[styles.iconSwipeControl, styles.iconSwipeControlRight]}
        />
      </View>
    );
  }

  renderPrevButton() {
    return (
      <View style={styles.swipeControlBtn}>
        <Icon
          name="angle-left"
          style={[styles.iconSwipeControl, styles.iconSwipeControlLeft]}
        />
      </View>
    );
  }

  renderProductImages(images) {
    return images.map((image, index) => {
      return (
        <TouchableHighlight
          underlayColor="rgba(0,0,0,.1)"
          onPress={() => {
            Actions.item_image_viewer({
              images: this.state.images,
              index,
            });
          }}
          key={index}>
          <View>
            <FastImage
              style={styles.swiper_image}
              source={{uri: image.image}}
              resizeMode="contain"
            />
          </View>
        </TouchableHighlight>
      );
    });
  }

  renderProductSwiper(product) {
    const images = product ? product.img || [] : [];
    const hasImages = images.length;

    return (
      <View>
        <SkeletonLoading
          loading={product == null}
          height={appConfig.device.width * 0.6}>
          <Swiper
            showsButtons={hasImages}
            renderPagination={this.renderPagination}
            nextButton={this.renderNextButton()}
            prevButton={this.renderPrevButton()}
            width={appConfig.device.width}
            height={appConfig.device.width * 0.6}
            containerStyle={styles.content_swiper}>
            {this.renderProductImages(images)}
          </Swiper>
        </SkeletonLoading>
      </View>
    );
  }

  renderCartFooter(product) {
    return (
      this.state.loading ||
      this.isServiceProduct(product) || (
        <CartFooter
          prefix="item"
          confirmRemove={this._confirmRemoveCartItem.bind(this)}
        />
      )
    );
  }

  renderMainActionBtnIcon(product) {
    return this.state.buying ? (
      <Indicator size="small" color="#ffffff" />
    ) : this.isServiceProduct(product) ? (
      <Icon name="calendar-plus-o" style={styles.item_actions_btn_icon} />
    ) : (
      <Icon name="cart-plus" style={styles.item_actions_btn_icon} />
    );
  }

  render() {
    var {item, item_data, like_loading, like_flag} = this.state;
    var is_like = like_flag == 1;
    const {t} = this.props;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Header
          title={this.props.title}
          animatedValue={this.animatedScrollY}
          item={item_data || item}
        />

        <SafeAreaView style={styles.container}>
          <Animated.ScrollView
            ref={(ref) => (this.refs_body_item = ref)}
            contentContainerStyle={{
              paddingTop: 15,
            }}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: this.animatedScrollY,
                    },
                  },
                },
              ],
              {
                useNativeDriver: true,
              },
            )}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }>
            {this.renderProductSwiper(item_data)}

            <View style={styles.item_heading_box}>
              <Text style={styles.item_heading_title}>
                {item_data ? item_data.name : item.name}
              </Text>

              <View style={styles.item_heading_price_box}>
                {item.discount_percent > 0 && (
                  <Text style={styles.item_heading_safe_off_value}>
                    {item_data ? item_data.discount : item.discount}
                  </Text>
                )}
                <Text style={styles.item_heading_price}>
                  {item_data ? item_data.price_view : item.price_view}
                </Text>
                {item.discount_percent > 0 && (
                  <DiscountBadge
                    containerStyle={styles.discountBadge}
                    label={saleFormat(item.discount_percent)}
                  />
                )}
              </View>

              <Text style={styles.item_heading_qnt}>
                {item_data ? item_data.unit_name_view : item.unit_name_view}
              </Text>

              <View style={styles.item_actions_box}>
                <TouchableHighlight
                  onPress={this._likeHandler.bind(this, item)}
                  underlayColor="transparent">
                  <View
                    style={[
                      styles.item_actions_btn,
                      styles.item_actions_btn_chat,
                      {
                        borderColor: is_like ? '#e31b23' : appConfig.colors.primary,
                      },
                    ]}>
                    <View style={styles.item_actions_btn_icon_container}>
                      {like_loading ? (
                        <Indicator size="small" />
                      ) : (
                        <Icon
                          name="heart"
                          size={20}
                          color={is_like ? '#e31b23' : appConfig.colors.primary}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.item_actions_title,
                        styles.item_actions_title_chat,
                        {
                          color: is_like ? '#e31b23' : appConfig.colors.primary,
                        },
                      ]}>
                      {is_like ? t('liked') : t('like')}
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={() =>
                    this.handlePressActionBtnProduct(
                      item_data ? item_data : item,
                    )
                  }
                  underlayColor="transparent">
                  <View
                    style={[
                      styles.item_actions_btn,
                      styles.item_actions_btn_add_cart,
                    ]}>
                    <View style={styles.item_actions_btn_icon_container}>
                      {this.renderMainActionBtnIcon(item)}
                    </View>
                    <Text
                      style={styles.item_actions_title}>
                      {this.isServiceProduct(item)
                        ? t('shopTitle.book')
                        : t('shopTitle.buy')}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>

            {item != null && (
              <View style={styles.item_content_box}>
                {item.brand != null && item.brand != '' && (
                  <View
                    style={[
                      styles.item_content_item,
                      styles.item_content_item_left,
                    ]}>
                    <View style={styles.item_content_icon_box}>
                      <Icon name="user" size={16} color="#999999" />
                    </View>
                    <Text style={styles.item_content_item_title}>
                      {t('information.brands')}
                    </Text>
                  </View>
                )}

                {item.brand != null && item.brand != '' && (
                  <View
                    style={[
                      styles.item_content_item,
                      styles.item_content_item_right,
                    ]}>
                    <Text style={styles.item_content_item_value}>
                      {item.brand}
                    </Text>
                  </View>
                )}

                {item.made_in != null && item.made_in != '' && (
                  <View
                    style={[
                      styles.item_content_item,
                      styles.item_content_item_left,
                    ]}>
                    <View style={styles.item_content_icon_box}>
                      <Icon name="map-marker" size={16} color="#999999" />
                    </View>
                    <Text style={styles.item_content_item_title}>
                      {t('information.origin')}
                    </Text>
                  </View>
                )}

                {item.made_in != null && item.made_in != '' && (
                  <View
                    style={[
                      styles.item_content_item,
                      styles.item_content_item_right,
                    ]}>
                    <Text style={styles.item_content_item_value}>
                      {item.made_in}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.item_content_text}>
              {item_data != null ? (
                <AutoHeightWebView
                  onError={() => console.log('on error')}
                  onLoad={() => console.log('on load')}
                  onLoadStart={() => console.log('on load start')}
                  onLoadEnd={() => console.log('on load end')}
                  onShouldStartLoadWithRequest={(result) => {
                    // console.log(result);
                    return true;
                  }}
                  style={styles.webview}
                  onHeightUpdated={(height) => this.setState({height})}
                  source={{html: item_data.content}}
                  zoomable={false}
                  scrollEnabled={false}
                  customStyle={`
                  * {
                    font-family: 'arial';
                  }
                  a {
                    pointer-events:none;
                    text-decoration: none !important;
                    color: #404040 !important;
                  }
                  p {
                    font-size: 15px;
                    line-height: 24px
                  }
                  img {
                    max-width: 100% !important;
                    height: auto !important;
                  }`}
                />
              ) : (
                <Indicator size="small" />
              )}
            </View>

            {item_data != null && item_data.related && (
              <View style={[styles.items_box]}>
                <ListHeader title={`— ${t('relatedItems')} —`} />
                {item_data.related.map((item, index) => {
                  return (
                    <Items
                      key={index}
                      item={item}
                      index={index}
                      onPress={this._itemRefresh.bind(this, item)}
                    />
                  );
                })}
              </View>
            )}
            <View style={styles.boxButtonActions}>
              <Button
                btnContainerStyle={styles.goToStoreBtn}
                titleStyle={styles.goToStoreTxt}
                title={t('goToStore')}
              />
            </View>
          </Animated.ScrollView>
          {this.renderCartFooter(item)}
        </SafeAreaView>
        <PopupConfirm
          ref_popup={(ref) => (this.refs_modal_delete_cart_item = ref)}
          title={t('cart:popup.remove.message')}
          height={110}
          otherClose={false}
          noConfirm={() => {
            if (this.refs_modal_delete_cart_item) {
              this.refs_modal_delete_cart_item.close();
            }
          }}
          yesConfirm={this._removeCartItem.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  right_btn_box: {
    flexDirection: 'row',
  },
  content_swiper: {
    flex: 0
  },
  swiper_image: {
    height: Util.size.width * 0.6,
    resizeMode: 'contain',
  },

  item_heading_box: {
    width: '100%',
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
  },
  item_heading_title: {
    fontSize: 20,
    color: '#404040',
    fontWeight: '600',
  },
  item_heading_price_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  item_heading_safe_off_value: {
    fontSize: 20,
    color: '#cccccc',
    textDecorationLine: 'line-through',
    paddingRight: 4,
  },
  item_heading_price: {
    fontSize: 20,
    color: appConfig.colors.primary,
    fontWeight: '600',
    paddingLeft: 4,
  },
  item_heading_qnt: {
    color: '#666666',
    fontSize: 12,
    marginTop: 4,
  },
  item_actions_box: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  item_actions_btn: {
    borderWidth: Util.pixel,
    borderColor: appConfig.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 40,
  },
  item_actions_btn_icon_container: {
    height: '100%',
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item_actions_btn_icon: {
    fontSize: 24,
    color: '#fff',
  },
  item_actions_btn_chat: {
    marginRight: 8,
  },
  item_actions_btn_add_cart: {
    marginLeft: 8,
    backgroundColor: appConfig.colors.primary,
  },
  item_actions_title: {
    marginLeft: 8,
    color: '#fff',
  },

  item_content_box: {
    width: '100%',
    flexDirection: 'row',
    borderLeftWidth: Util.pixel,
    borderTopWidth: Util.pixel,
    borderColor: '#dddddd',
    flexWrap: 'wrap',
  },
  item_content_item: {
    height: 24,
    borderRightWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  item_content_item_left: {
    width: '45%',
  },
  item_content_item_right: {
    width: '55%',
  },
  item_content_icon_box: {
    width: 24,
    alignItems: 'center',
  },
  item_content_item_title: {
    fontSize: 12,
    color: '#999999',
    paddingLeft: 4,
  },
  item_content_item_value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#404040',
    marginLeft: 4,
  },

  item_content_text: {
    width: '100%',
    paddingTop: 16,
  },

  items_box: {
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: appConfig.device.width,
  },

  boxButtonActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
  },
  goToStoreBtn: {
    paddingVertical: 10,
    borderRadius: 6,
  },
  goToStoreTxt: {
    fontSize: 14,
    letterSpacing: 1,
  },
  discountBadge: {
    left: 20,
    width: null,
  },

  paginationContainer: {
    borderRadius: 20,
    position: 'absolute',
    bottom: 10,
    right: 15,
    backgroundColor: 'rgba(255,255,255,.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  paginationText: {
    fontSize: 12,
    color: '#444',
  },

  swipeControlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSwipeControl: {
    fontSize: 30,
    color: '#444',
    bottom: 1,
  },
  iconSwipeControlLeft: {
    left: -2,
  },
  iconSwipeControlRight: {
    left: 2,
  },
  webview: {
    paddingHorizontal: 6,
    marginHorizontal: 15,
    width: appConfig.device.width - 30,
  },
});

export default withTranslation(['product', 'cart', 'common'])(observer(Item));
