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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import SVGPhotoBroken from '../../images/photo_broken.svg';
import {CONFIG_KEY, isConfigActive} from 'src/helper/configKeyHandler';
import {CART_TYPES} from 'src/constants/cart';
import Loading from '../Loading';
import CTAProduct from './CTAProduct';
import {APIRequest} from 'src/network/Entity';
import NoResult from '../NoResult';
import Shimmer from 'react-native-shimmer';

const ITEM_KEY = 'ItemKey';
const CONTINUE_ORDER_CONFIRM = 'Tiếp tục';
const CART_HAS_ONLY_NORMAL_MESSAGE = `• Đơn hàng của bạn đang chứa sản phẩm thông thường.\r\n\r\n• Đơn hàng chỉ có thể chứa các sản phẩm cùng loại.\r\n\r\n• Chọn ${CONTINUE_ORDER_CONFIRM} để xóa đơn hàng hiện tại và tạo đơn hàng mới cho loại sản phẩm này.`;
const CART_HAS_ONLY_DROP_SHIP_MESSAGE = `• Đơn hàng của bạn đang chứa sản phẩm giao hộ.\r\n\r\n• Đơn hàng chỉ có thể chứa các sản phẩm cùng loại.\r\n\r\n• Chọn ${CONTINUE_ORDER_CONFIRM} để xóa đơn hàng hiện tại và tạo đơn hàng mới cho loại sản phẩm này.`;
class Item extends Component {
  static defaultProps = {
    showBtnProductStamps: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      listWarehouse: [],
      refreshing: false,
      item: props.item,
      item_data: null,
      images: null,
      loading: !this.props.preventUpdate,
      actionLoading: false,
      buying: false,
      like_loading: !this.props.preventUpdate,
      isSubActionLoading: false,
      like_flag: 0,
      scrollY: 0,
      cartTypeConfirmMessage: '',
    };

    this.animatedScrollY = new Animated.Value(0);
    this.unmounted = false;
    this.eventTracker = new EventTracker();
    this.refPopupConfirmCartType = React.createRef();
    this.productTempData = [];

    this.CTAProduct = new CTAProduct(props.t, this);
    this.getWarehouseRequest = new APIRequest();
    this.updateWarehouseRequest = new APIRequest();
    this.requests = [this.getWarehouseRequest, this.updateWarehouseRequest];
  }

  get subActionColor() {
    const is_like = this.state.like_flag == 1;
    return isConfigActive(CONFIG_KEY.OPEN_SITE_DROP_SHIPPING_KEY) &&
      !this.isServiceProduct(this.state.item_data || this.state.item)
      ? appConfig.colors.primary
      : is_like
      ? appConfig.colors.status.danger
      : appConfig.colors.primary;
  }

  isServiceProduct(product = {}) {
    return product.product_type === PRODUCT_TYPES.SERVICE;
  }

  componentDidMount() {
    !this.props.preventUpdate && this._initial(this.props);
    this.getListWarehouse();
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
    cancelRequests(this.requests);
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

  async getListWarehouse() {
    if (!isConfigActive(CONFIG_KEY.SELECT_STORE_KEY)) return;
    const {t} = this.props;
    try {
      this.getWarehouseRequest.data = APIHandler.user_site_store();
      const responseData = await this.getWarehouseRequest.promise();
      const listWarehouse =
        responseData?.stores?.map((store) => ({
          ...store,
          title: store.name,
          description: store.address,
          image: store.image_url,
        })) || [];
      this.setState({
        listWarehouse,
      });
    } catch (err) {
      console.log('user get warehouse', err);
      flashShowMessage({
        type: 'danger',
        message: err.message || t('common:api.error.message'),
      });
    } finally {
    }
  }

  async updateWarehouse(warehouse) {
    const data = {store_id: warehouse.id};
    try {
      this.updateWarehouseRequest.data = APIHandler.user_choose_store(data);
      const responseData = await this.updateWarehouseRequest.promise();
      flashShowMessage({
        type: 'success',
        message: responseData.message,
      });
      this._getData();
    } catch (error) {
      console.log('%cupdate_warehouse', 'color:red', error);
      flashShowMessage({
        type: 'danger',
        message: error.message || this.props.t('common:api.error.message'),
      });
    } finally {
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
    if (this.props.preventUpdate) {
      return null;
    }
    this.setState({refreshing: true});

    this._getDataFromServer(1000);
  }

  goToSchedule = (product) => {
    Actions.push(appConfig.routes.productSchedule, {
      productId: product.id,
    });
  };

  handlePressMainActionBtnProduct = (product, cartType) => {
    this.CTAProduct.handlePressMainActionBtnProduct(product, cartType);
  };

  handlePressSubAction = (product, cartType) => {
    this.CTAProduct.handlePressSubAction(product, cartType);
  };

  handlePressWarehouse = () => {
    Actions.push(appConfig.routes.modalList, {
      heading: this.props.t('opRegister:modal.warehouse.title'),
      data: this.state.listWarehouse,
      selectedItem: {id: store?.user_info?.store_id},
      onPressItem: this.onSelectWarehouse,
      onCloseModal: Actions.pop,
      modalStyle: {
        height: null,
        maxHeight: '80%',
      },
      ListEmptyComponent: (
        <NoResult iconName="warehouse" message="Không tìm thấy kho hàng" />
      ),
    });
  };

  onSelectWarehouse = (warehouse, closeModal) => {
    this.setState({loading: true});
    closeModal();
    this.updateWarehouse(warehouse);
  };

  // add item vào giỏ hàng
  _addCart = (
    item,
    quantity = 1,
    model = '',
    newPrice = null,
    buying = true,
  ) => {
    this.setState(
      {
        buying,
      },
      async () => {
        const data = {
          quantity,
          model,
        };
        if (newPrice) {
          data.new_price = newPrice;
        }
        const {t} = this.props;
        try {
          const response = await APIHandler.site_cart_plus(
            store.store_id,
            item.id,
            data,
          );

          if (response && response.status == STATUS_SUCCESS) {
            if (!this.unmounted && response.data.attrs) {
              Actions.push(appConfig.routes.itemAttribute, {
                itemId: item.id,
                onSubmit: (quantity, modal_key) =>
                  this._addCart(item, quantity, modal_key),
              });
            } else {
              flashShowMessage({
                message: response.message,
                type: 'success',
              });
            }
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
        } catch (e) {
          console.log(e + ' site_cart_plus');
          flashShowMessage({
            type: 'danger',
            message: t('common:api.error.message'),
          });
        } finally {
          if (!this.unmounted) {
            this.productTempData = [];
            this.setState({
              buying: false,
              isSubActionLoading: false,
            });
          }
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

  async _cancelCart(callBack) {
    const {t} = this.props;
    try {
      const response = await APIHandler.site_cart_canceling(
        store.cart_data?.site_id,
      );

      if (response && response.status == STATUS_SUCCESS) {
        store.resetCartData();
        callBack();

        store.setOrdersKeyChange(store.orders_key_change + 1);
        Events.trigger(RELOAD_STORE_ORDERS);

        flashShowMessage({
          type: 'success',
          message: response.message,
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: response?.message || t('common:api.error.message'),
        });
      }
    } catch (e) {
      console.log(e + ' site_cart_canceling');
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    } finally {
      !this.unmounted &&
        this.setState({
          actionLoading: false,
        });
    }
  }

  confirmCartType = () => {
    this.setState({actionLoading: true});
    this.closeConfirmCartTypePopUp();
    this._cancelCart(() => {
      if (this.productTempData.length > 0) {
        this._addCart(...this.productTempData);
      }
    });
  };

  closeConfirmCartTypePopUp = () => {
    if (this.refPopupConfirmCartType.current) {
      this.refPopupConfirmCartType.current.close();
    }
  };

  cancelConfirmCartType = () => {
    this.productTempData = [];
    this.closeConfirmCartTypePopUp();
  };

  renderPagination = (index, total, context, hasImages) => {
    const pagingMess = hasImages ? `${index + 1}/${total}` : '0/0';
    return (
      <View style={styles.paginationContainer}>
        <Text style={styles.paginationText}>{pagingMess}</Text>
      </View>
    );
  };

  renderNextButton() {
    return (
      <View style={[styles.swipeControlBtn, styles.swipeRightControlBtn]}>
        <Icon
          name="angle-right"
          style={[styles.iconSwipeControl, styles.iconSwipeControlRight]}
        />
      </View>
    );
  }

  renderPrevButton() {
    return (
      <View style={[styles.swipeControlBtn, styles.swipeLeftControlBtn]}>
        <Icon
          name="angle-left"
          style={[styles.iconSwipeControl, styles.iconSwipeControlLeft]}
        />
      </View>
    );
  }

  renderProductImages(images) {
    if (!images.length) {
      return (
        <View style={styles.noImageContainer}>
          <SVGPhotoBroken
            width="80"
            height="80"
            fill={appConfig.colors.primary}
          />
        </View>
      );
    }
    return images.map((image, index) => {
      return (
        <TouchableHighlight
          underlayColor="transparent"
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
    const images = product?.img || [];
    const hasImages = !!images.length;
    const isShowButtons = hasImages && images.length > 1;

    return (
      <View style={{paddingBottom: 30}}>
        <SkeletonLoading
          loading={!product}
          height={appConfig.device.width * 0.6}>
          <Swiper
            showsButtons={isShowButtons}
            renderPagination={(index, total, context) =>
              this.renderPagination(index, total, context, hasImages)
            }
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

  renderSubActionBtnIcon(product) {
    return this.state.like_loading || this.state.isSubActionLoading ? (
      <Indicator size="small" />
    ) : this.isServiceProduct(product) ? (
      <Icon name="heart" size={20} color={this.subActionColor} />
    ) : isConfigActive(CONFIG_KEY.OPEN_SITE_DROP_SHIPPING_KEY) ? (
      <MaterialCommunityIcons
        name="truck-fast"
        size={24}
        color={this.subActionColor}
      />
    ) : (
      <Icon name="heart" size={20} color={this.subActionColor} />
    );
  }

  renderBtnProductStamps = () => {
    return (
      !!this.props.showBtnProductStamps && (
        <Button
          containerStyle={styles.btnProductStampsContainer}
          btnContainerStyle={styles.btnProductStampsContentContainer}
          titleStyle={styles.btnProductStampsTitle}
          renderTitleComponent={(style) => (
            <Shimmer opacity={1} animationOpacity={0.3} pauseDuration={3000}>
              <Text style={style}>Xem sản phẩm đã quét</Text>
            </Shimmer>
          )}
          onPress={() => Actions.push(appConfig.routes.productStamps)}
        />
      )
    );
  };

  renderNoticeMessage(product) {
    return product?.notice?.message ? (
      <View
        style={[
          styles.noticeContainer,
          {
            backgroundColor: product.notice.bgColor || appConfig.colors.primary,
          },
        ]}>
        <Text style={styles.noticeMessage}>{product.notice.message}</Text>
      </View>
    ) : null;
  }

  renderDetailInfo(product) {
    console.log(product.detail_info);
    return product?.detail_info?.map((info, index) => {
      return (
        <View key={index} style={styles.item_content_item_container}>
          <View
            style={[styles.item_content_item, styles.item_content_item_left]}>
            <Text style={styles.item_content_item_title}>{info.name}</Text>
          </View>

          <View
            style={[styles.item_content_item, styles.item_content_item_right]}>
            <Text style={styles.item_content_item_value}>{info.info}</Text>
          </View>
        </View>
      );
    });
  }

  render() {
    // var {item, item_data} = this.state;
    const item = this.state.item_data || this.state.item;
    const is_like = this.state.like_flag == 1;
    const {t} = this.props;
    const unitName = item.unit_name;
    const storeName = store?.user_info?.store_name;
    const isInventoryVisible =
      !!item.inventory &&
      !isConfigActive(CONFIG_KEY.ALLOW_SITE_SALE_OUT_INVENTORY_KEY) &&
      item.product_type !== PRODUCT_TYPES.SERVICE;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        {(this.state.loading || this.state.actionLoading) && <Loading center />}
        <Header
          title={this.props.title}
          animatedValue={this.animatedScrollY}
          item={item}
          onPressWarehouse={this.handlePressWarehouse}
        />

        <SafeAreaView style={styles.container}>
          <Animated.ScrollView
            ref={(ref) => (this.refs_body_item = ref)}
            contentContainerStyle={{
              paddingTop: 60,
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
            {this.renderProductSwiper(item)}

            <View style={styles.item_heading_box}>
              <Text style={styles.item_heading_title}>{item.name}</Text>

              <View style={styles.item_heading_price_box}>
                {item.discount_percent > 0 && (
                  <Text style={styles.item_heading_safe_off_value}>
                    {item.discount}
                  </Text>
                )}
                <Text style={styles.item_heading_price}>
                  {item.price_view}
                  {!!unitName && (
                    <Text style={styles.item_unit_name}>/ {unitName}</Text>
                  )}
                </Text>
              </View>

              <View style={styles.item_actions_box}>
                <TouchableHighlight
                  onPress={() =>
                    this.handlePressSubAction(
                      item,
                      isConfigActive(CONFIG_KEY.OPEN_SITE_DROP_SHIPPING_KEY)
                        ? CART_TYPES.DROP_SHIP
                        : '',
                    )
                  }
                  underlayColor="transparent">
                  <View
                    style={[
                      styles.item_actions_btn,
                      styles.item_actions_btn_chat,
                      {
                        borderColor: this.subActionColor,
                      },
                    ]}>
                    <View style={styles.item_actions_btn_icon_container}>
                      {this.renderSubActionBtnIcon(item)}
                    </View>
                    <Text
                      style={[
                        styles.item_actions_title,
                        styles.item_actions_title_chat,
                        {
                          color: this.subActionColor,
                        },
                      ]}>
                      {!this.isServiceProduct(item) &&
                      isConfigActive(CONFIG_KEY.OPEN_SITE_DROP_SHIPPING_KEY)
                        ? 'Giao hộ'
                        : is_like
                        ? t('liked')
                        : t('like')}
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={() =>
                    this.handlePressMainActionBtnProduct(
                      item,
                      CART_TYPES.NORMAL,
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
                    <Text style={styles.item_actions_title}>
                      {this.isServiceProduct(item)
                        ? t('shopTitle.book')
                        : t('shopTitle.buy')}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
              {item.discount_percent > 0 && (
                <DiscountBadge
                  containerStyle={styles.discountBadge}
                  label={saleFormat(item.discount_percent)}
                />
              )}
              {isInventoryVisible && (
                <View style={styles.productsLeftContainer}>
                  <View style={styles.productsLeftBackground} />
                  <View style={styles.productsLeftBackgroundTagTail} />
                  <Text style={styles.productsLeftText}>
                    {t('productsLeft', {quantity: item.inventory})}
                  </Text>
                </View>
              )}
            </View>

            {item != null && (
              <View style={styles.item_content_box}>
                {this.renderBtnProductStamps()}
                {this.renderNoticeMessage(item)}
                {this.renderDetailInfo(item)}
                {storeName && (
                  <View style={styles.item_content_item_container}>
                    <View
                      style={[
                        styles.item_content_item,
                        styles.item_content_item_left,
                      ]}>
                      <View style={styles.item_content_icon_box}>
                        <MaterialCommunityIcons
                          name="warehouse"
                          size={16}
                          color="#999999"
                        />
                      </View>
                      <Text style={styles.item_content_item_title}>
                        Kho hàng
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.item_content_item,
                        styles.item_content_item_right,
                      ]}>
                      <Text style={styles.item_content_item_value}>
                        {storeName}
                      </Text>
                    </View>
                  </View>
                )}

                {item.brand != null && item.brand != '' && (
                  <View style={styles.item_content_item_container}>
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
                    <View
                      style={[
                        styles.item_content_item,
                        styles.item_content_item_right,
                      ]}>
                      <Text style={styles.item_content_item_value}>
                        {item.brand}
                      </Text>
                    </View>
                  </View>
                )}

                {item.made_in != null && item.made_in != '' && (
                  <View style={styles.item_content_item_container}>
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
                    <View
                      style={[
                        styles.item_content_item,
                        styles.item_content_item_right,
                      ]}>
                      <Text style={styles.item_content_item_value}>
                        {item.made_in}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            <View style={styles.item_content_text}>
              {item != null ? (
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
                  source={{html: item.content || ''}}
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

            {item != null && item.related && (
              <View style={[styles.items_box]}>
                <ListHeader title={`— ${t('relatedItems')} —`} />
                {item.related.map((item, index) => {
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
                onPress={this._goStores.bind(this, this.state.store_data)}
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

        <PopupConfirm
          ref_popup={this.refPopupConfirmCartType}
          title={this.state.cartTypeConfirmMessage}
          otherClose={false}
          type="warning"
          isConfirm
          yesTitle={CONTINUE_ORDER_CONFIRM}
          titleStyle={{textAlign: 'left'}}
          noConfirm={this.cancelConfirmCartType}
          yesConfirm={this.confirmCartType}
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
    flex: 0,
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
  item_unit_name: {
    color: '#999',
    fontSize: 15,
    fontWeight: '400',
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
    // width: '100%',
    // flexDirection: 'row',
    borderLeftWidth: Util.pixel,
    borderTopWidth: Util.pixel,
    borderColor: '#dddddd',
    // flexWrap: 'wrap',
  },
  item_content_item_container: {
    flexDirection: 'row',
  },
  item_content_item: {
    // height: 24,
    borderRightWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    flex: 1,
  },
  item_content_item_left: {
    // width: '45%',
  },
  item_content_item_right: {
    // width: '55%',
  },
  item_content_icon_box: {
    width: 24,
    alignItems: 'center',
  },
  item_content_item_title: {
    fontSize: 12,
    color: '#999999',
    paddingLeft: 4,
    textTransform: 'uppercase',
  },
  item_content_item_value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#404040',
    marginLeft: 4,
    flex: 1,
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
    left: 0,
    top: -5,
    position: 'absolute',
    width: null,
  },

  paginationContainer: {
    borderRadius: 20,
    position: 'absolute',
    bottom: -30,
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
    backgroundColor: 'rgba(255,255,255,.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeRightControlBtn: {
    right: 7,
  },
  swipeLeftControlBtn: {
    left: 7,
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
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
    backgroundColor: hexToRgbA(LightenColor(appConfig.colors.primary, 20), 0.5),
  },

  productsLeftContainer: {
    position: 'absolute',
    top: -5,
    right: 0,
    height: 22,
    justifyContent: 'center',
  },
  productsLeftBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#5f7d95',
  },
  productsLeftBackgroundTagTail: {
    position: 'absolute',
    right: '100%',
    width: 0,
    height: 0,
    borderTopWidth: 11,
    borderLeftWidth: 11,
    borderBottomWidth: 11,
    borderRightWidth: 11,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#5f7d95',
    borderLeftColor: 'transparent',
  },
  productsLeftText: {
    color: '#fff',
    fontStyle: 'italic',
    fontSize: 12,
    marginHorizontal: 8,
    elevation: 3,
  },
  noticeContainer: {
    padding: 15,
  },
  noticeMessage: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
  },

  btnProductStampsContainer: {
    backgroundColor: '#fafafa',
  },
  btnProductStampsContentContainer: {
    paddingVertical: 5,
    backgroundColor: 'transparent',
  },
  btnProductStampsTitle: {
    color: appConfig.colors.primary,
    ...(appConfig.device.isAndroid && {fontWeight: '700'}),
  },
});

export default withTranslation(['product', 'cart', 'common', 'opRegister'])(
  observer(Item),
);
