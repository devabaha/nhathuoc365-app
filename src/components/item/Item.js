import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Animated,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Shimmer from 'react-native-shimmer';
import {isEmpty} from 'lodash';
import {Actions} from 'react-native-router-flux';

import appConfig from 'app-config';
import store from 'app-store';
import {CONFIG_KEY, isConfigActive} from 'src/helper/configKeyHandler';
import {goConfirm} from 'app-helper/product';
import {servicesHandler, SERVICES_TYPE} from 'app-helper/servicesHandler';
import {
  calculateLikeCountFriendly,
  getSocialCommentsCount,
  getSocialLikeCount,
  getSocialLikeFlag,
  handleSocialActionBarPress,
} from 'app-helper/social';
import {shareImages} from 'app-helper/share';
import {isOutOfStock} from 'app-helper/product';

import {MEDIA_TYPE, ORDER_TYPES} from '../../constants';
import {CART_TYPES} from 'src/constants/cart';
import {
  PRODUCT_BUTTON_ACTION_LOADING_PARAM,
  PRODUCT_BUTTON_ACTION_TYPE,
} from 'src/constants/product';
import {
  ACCESSORY_TYPE,
  SOCIAL_BUTTON_TYPES,
  SOCIAL_DATA_TYPES,
} from 'src/constants/social';

import {APIRequest} from 'src/network/Entity';

import CartFooter from '../cart/CartFooter';
import PopupConfirm from '../PopupConfirm';
import RightButtonChat from '../RightButtonChat';
import EventTracker from '../../helper/EventTracker';
import Header from './Header';
import {DiscountBadge} from '../Badges';
import Button from '../../components/Button';
import SkeletonLoading from '../SkeletonLoading';

import Loading from '../Loading';
import CTAProduct from './CTAProduct';
import NoResult from '../NoResult';
import HomeCardList, {HomeCardItem} from '../Home/component/HomeCardList';
import ListStoreProduct from '../stores/ListStoreProduct';
import CustomAutoHeightWebview from '../CustomAutoHeightWebview';
import {Container} from '../Layout';
import ActionContainer from '../Social/ActionContainer';
import ListProducts from '../Home/component/ListProducts';
import ModalWholesale from './ModalWholesale';
import Video from '../Video';
import MediaCarousel from './MediaCarousel';

import SVGPhotoBroken from '../../images/photo_broken.svg';

const ITEM_KEY = 'ItemKey';
const WEBVIEW_HEIGHT_COLLAPSED = 300;
const MIN_WEBVIEW_HEIGHT_TO_COLLAPSE = WEBVIEW_HEIGHT_COLLAPSED * 1.5;
const WEBVIEW_COLLAPSED_MASK_HEIGHT = WEBVIEW_HEIGHT_COLLAPSED / 4;

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
      [PRODUCT_BUTTON_ACTION_LOADING_PARAM.BUY_NOW]: false,
      [PRODUCT_BUTTON_ACTION_LOADING_PARAM.ADD_TO_CART]: false,
      [PRODUCT_BUTTON_ACTION_LOADING_PARAM.LIKE]: false,
      [PRODUCT_BUTTON_ACTION_LOADING_PARAM.DROP_SHIP]: false,
      preparePostForSaleDataLoading: false,
      like_flag: props?.item?.like_flag || 0,
      scrollY: 0,

      webviewContentHeight: undefined,
      isWebviewContentCollapsed: undefined,
      selectedIndex: 0,
    };

    this.refPlayer = React.createRef();

    this.animatedScrollY = new Animated.Value(0);
    this.unmounted = false;
    this.eventTracker = new EventTracker();
    this.refPopupConfirmCartType = React.createRef();
    this.refWebview = React.createRef();
    this.refModalWholesale = React.createRef();
    this.productTempData = [];

    this.CTAProduct = new CTAProduct(this);
    this.getWarehouseRequest = new APIRequest();
    this.updateWarehouseRequest = new APIRequest();
    this.requests = [this.getWarehouseRequest, this.updateWarehouseRequest];
  }

  get product() {
    return this.state.item_data || this.state.item || {};
  }

  get subActionColor() {
    const is_like = this.state.like_flag == 1;
    return appConfig.colors.primary;
  }

  get isDisabledSubBtnAction() {
    return (
      this.isDisabledBuyingProduct &&
      isConfigActive(CONFIG_KEY.OPEN_SITE_DROP_SHIPPING_KEY)
    );
  }

  get isDisabledBuyingProduct() {
    return isOutOfStock(this.product);
  }

  get hasProductGroups() {
    return this.product?.product_groups?.length;
  }

  isServiceProduct(product = {}) {
    return product.order_type === ORDER_TYPES.BOOKING;
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
          [PRODUCT_BUTTON_ACTION_LOADING_PARAM.BUY_NOW]: false,
          [PRODUCT_BUTTON_ACTION_LOADING_PARAM.LIKE]: true,
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
    if (!isConfigActive(CONFIG_KEY.CHOOSE_STORE_SITE_KEY)) return;
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
    // var {item} = this.state;
    // var item_key = ITEM_KEY + item.id + store.user_info.id;

    // // load
    // storage
    //   .load({
    //     key: item_key,
    //     autoSync: true,
    //     syncInBackground: true,
    //     syncParams: {
    //       extraFetchOptions: {},
    //       someFlag: true,
    //     },
    //   })
    //   .then((data) => {
    //     setTimeout(() => {
    //       if (isIOS) {
    //         layoutAnimation();
    //       }

    //       var images = [];

    //       if (data && data.img) {
    //         data.img.map((item) => {
    //           images.push({
    //             url: item.image,
    //           });
    //         });
    //       }

    //       this.logEventTracking(data);

    //       this.setState({
    //         item_data: data,
    //         images: images,
    //         like_flag: data.like_flag,
    //         loading: false,
    //         refreshing: false,
    //         like_loading: false,
    //       });
    //     }, delay || this._delay());
    //   })
    //   .catch((err) => {
    this._getDataFromServer(delay);
    // });
  }

  async _getDataFromServer(delay) {
    var {item} = this.state;
    var item_key = ITEM_KEY + item.id + store.user_info.id;
    // alert(store.store_id +' - '+ item.id);
    const {t} = this.props;
    try {
      const response = await APIHandler.site_product(store.store_id, item.id);
      if (this.unmounted) return;

      if (response && response.status == STATUS_SUCCESS) {
        const productSocialFormat = this.getProductWithSocialFormat(
          response.data,
        );
        store.updateSocialProducts(productSocialFormat.id, {
          like_count: productSocialFormat.like_count || 0,
          like_flag: productSocialFormat.like_flag || 0,
          share_count: productSocialFormat.share_count || 0,
          comment_count: productSocialFormat.comment_count || 0,
          like_count_friendly:
            calculateLikeCountFriendly(productSocialFormat) || 0,
        });
        // delay append data
        // setTimeout(() => {
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

        if (response?.data?.video) {
          images.unshift({
            type: MEDIA_TYPE.YOUTUBE_VIDEO,
            url: response.data.video,
          });
        }

        this.logEventTracking(response.data);

        this.setState(
          {
            item_data: response.data,
            images: images,
            like_flag: response.data.like_flag,
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
        // }, delay || this._delay());
      } else {
        flashShowMessage({
          type: 'danger',
          message: response?.message || t('common:api.error.message'),
        });
      }
    } catch (e) {
      console.log(e + ' site_product');
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
          [PRODUCT_BUTTON_ACTION_LOADING_PARAM.LIKE]: false,
          refreshing: false,
        });
    }
  }

  getProductWithSocialFormat(
    product = this.state.item_data || this.state.item || {},
  ) {
    return {
      ...product,
      like_flag: product.is_liked_product,
    };
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

  handlePressMainActionBtnProduct = (product, cartType, isOrderNow = false) => {
    this.CTAProduct.handlePressMainActionBtnProduct({
      product,
      cartType,
      isOrderNow,
      callbackSuccess: isOrderNow
        ? () => {
            goConfirm();
          }
        : undefined,
    });
  };

  handlePressSubAction = (product, cartType) => {
    this.CTAProduct.handlePressSubAction({product, cartType});
  };

  handlePressWarehouse = () => {
    Actions.push(appConfig.routes.modalList, {
      heading: this.props.t('opRegister:modal.store.title'),
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

  handlePostForSale = (product) => {
    this.setState({
      preparePostForSaleDataLoading: true,
    });

    if (!!product?.content) {
      if (this.refWebview.current) {
        this.refWebview.current.getInnerText();
      } else {
        this.handleCompletingPreparingPostForSaleData();
      }
    } else if (!!product?.img?.length) {
      this.handleSharingImages(product.img, product?.name, product?.url);
    } else {
      this.handleCompletingPreparingPostForSaleData();
    }
  };

  handleGetInnerTextWebview = (innerText, product) => {
    Clipboard.setString(innerText);
    this.handleSharingImages(product?.img, product?.name, product?.url);
  };

  handleSharingImages = (images = [], title, metadataUrl) => {
    const imageUrls = images.map((item) => {
      return item.image;
    });

    shareImages(
      imageUrls,
      //callback
      () => {
        if (appConfig.device.isIOS) {
          flashShowMessage({
            type: 'success',
            message: this.props.t('copyContent'),
            duration: 3000,
          });
        } else {
          Toast.show(this.props.t('copyContent'));
        }
      },
      title,
      '',
      metadataUrl,
    )
      .catch((err) => console.log(err))
      .finally(this.handleCompletingPreparingPostForSaleData);
  };

  handleCompletingPreparingPostForSaleData = () => {
    this.setState({preparePostForSaleDataLoading: false});
  };

  onSelectWarehouse = (warehouse, closeModal) => {
    this.setState({loading: true});
    closeModal();
    this.updateWarehouse(warehouse);
  };

  _likeHandler(item) {
    this.setState(
      {
        [PRODUCT_BUTTON_ACTION_LOADING_PARAM.LIKE]: true,
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
                [PRODUCT_BUTTON_ACTION_LOADING_PARAM.LIKE]: false,
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

  handlePressProduct = (product) => {
    Actions.push(appConfig.routes.item, {
      title: product.name,
      item: product,
    });
  };

  handleShowAllGroupProduct = (group) => {
    const service = {
      type: SERVICES_TYPE.GROUP_PRODUCT,
      title: group.title,
      groupId: group.id,
    };
    servicesHandler(service);
  };

  handleWebviewContentLayout = (e) => {
    if (!this.state.webviewContentHeight) {
      this.setState({
        webviewContentHeight: e.height,
        isWebviewContentCollapsed:
          e.height >= MIN_WEBVIEW_HEIGHT_TO_COLLAPSE ? true : undefined,
      });
    }
  };

  handleWholesalePress = () => {
    if (this.refModalWholesale.current) {
      this.refModalWholesale.current.open();
    }
  };

  toggleCollapseWebviewContent = () => {
    this.setState((prevState) => ({
      isWebviewContentCollapsed: !prevState.isWebviewContentCollapsed,
    }));
  };

  handleChangeImageIndex = (index, image) => {
    this.setState({selectedIndex: index});
  };

  get actionButtonData() {
    const {t} = this.props;

    const containerStyle = {
      flex: 1,
      marginRight: 0,
      paddingHorizontal: 0,
    };

    const contentContainerStyle = {
      flex: 1,
    };

    const mainActionContainerStyle = {
      ...containerStyle,
      backgroundColor: appConfig.colors.primary,
    };

    const iconStyle = {
      color: appConfig.colors.primary,
      fontSize: 20,
    };

    const mainActionIconStyle = {
      ...iconStyle,
      color: appConfig.colors.white,
    };

    const titleStyle = {
      color: appConfig.colors.primary,
    };

    const mainActionTitleStyle = {
      ...titleStyle,
      color: appConfig.colors.white,

      fontWeight: '500',
    };

    const likeButtonData = {
      type: PRODUCT_BUTTON_ACTION_TYPE.LIKE,
      iconName: this.state.like_flag == 1 ? 'heart' : 'heart-outline',
      iconStyle,
      containerStyle: {width: 42},
      loading: this.state[PRODUCT_BUTTON_ACTION_LOADING_PARAM.LIKE],
      disabled: this.state[PRODUCT_BUTTON_ACTION_LOADING_PARAM.LIKE],

      onPress: () => {
        this.handlePressSubAction(this.product);
      },
    };

    const buttonsData = [likeButtonData];
    const isProductOutOfStock = isOutOfStock(this.product);
    const isDisabledActionBtn =
      this.state[PRODUCT_BUTTON_ACTION_LOADING_PARAM.BUY_NOW] ||
      this.state[PRODUCT_BUTTON_ACTION_LOADING_PARAM.DROP_SHIP] ||
      this.state[PRODUCT_BUTTON_ACTION_LOADING_PARAM.ADD_TO_CART];

    // const addToCartButtonData = {
    //   type: PRODUCT_BUTTON_ACTION_TYPE.ADD_TO_CART,
    //   title: isProductOutOfStock
    //     ? t('shopTitle.outOfStock')
    //     : t('shopTitle.buy'),
    //   loading: this.state[PRODUCT_BUTTON_ACTION_LOADING_PARAM.ADD_TO_CART],
    //   disabled: isDisabledActionBtn,
    //   iconName: 'cart-plus',
    //   iconBundle: FontAwesome5Icon,
    //   iconStyle: [iconStyle, {fontSize: 17}],
    //   isHidden: isProductOutOfStock,
    //   contentContainerStyle,

    //   onPress: () =>
    //     this.handlePressMainActionBtnProduct(this.product, CART_TYPES.NORMAL),
    // };

    const dropShipButtonData = {
      type: PRODUCT_BUTTON_ACTION_TYPE.DROP_SHIP,
      iconName: 'truck-fast',
      iconStyle: iconStyle,
      title: isProductOutOfStock
        ? t('shopTitle.outOfStock')
        : t('shopTitle.dropShip'),
      loading: this.state[PRODUCT_BUTTON_ACTION_LOADING_PARAM.DROP_SHIP],
      disabled: isDisabledActionBtn,
      isHidden: isProductOutOfStock,
      contentContainerStyle,
      containerStyle: [
        containerStyle,
        {backgroundColor: hexToRgbA(appConfig.colors.primary, 0.1)},
      ],
      titleStyle: [titleStyle, {fontWeight: '500'}],

      onPress: () =>
        this.handlePressSubAction(this.product, CART_TYPES.DROP_SHIP),
    };

    const buyNowButtonData = {
      type: PRODUCT_BUTTON_ACTION_TYPE.ADD_TO_CART,
      iconName: 'cart',
      iconBundle: Ionicons,
      iconStyle: mainActionIconStyle,
      title: isProductOutOfStock
        ? t('shopTitle.outOfStock')
        : t('shopTitle.buy'),
      loading: this.state[PRODUCT_BUTTON_ACTION_LOADING_PARAM.ADD_TO_CART],
      disabled: isDisabledActionBtn || isProductOutOfStock,
      contentContainerStyle,
      containerStyle: [
        mainActionContainerStyle,
        isProductOutOfStock && {
          backgroundColor: appConfig.colors.disabled,
          borderColor: appConfig.colors.disabled,
        },
      ],
      titleStyle: mainActionTitleStyle,

      onPress: () =>
        this.handlePressMainActionBtnProduct(
          this.product,
          CART_TYPES.NORMAL,
          // true,
        ),
    };

    const bookingButtonData = {
      type: PRODUCT_BUTTON_ACTION_TYPE.BOOKING,
      iconName: 'calendar-plus-o',
      iconBundle: FontAwesomeIcon,
      title: t('shopTitle.book'),
      containerStyle: mainActionContainerStyle,
      titleStyle: mainActionTitleStyle,
      iconStyle: mainActionIconStyle,

      onPress: () =>
        this.handlePressMainActionBtnProduct(this.product, CART_TYPES.NORMAL),
    };

    if (this.isServiceProduct(this.product)) {
      // Booking
      buttonsData.push(bookingButtonData);
    } else if (isConfigActive(CONFIG_KEY.OPEN_SITE_DROP_SHIPPING_KEY)) {
      // Drop ship
      buttonsData.push(dropShipButtonData, buyNowButtonData);
      // buttonsData.push([dropShipButtonData]);
    } else {
      // Buy now
      buttonsData.push(buyNowButtonData);
    }
    return buttonsData;
  }

  renderPagination = (index, total, hasImages) => {
    const pagingMess = hasImages ? `${index + 1}/${total}` : '0/0';
    return (
      <View pointerEvents="none" style={styles.paginationContainer}>
        <Text style={styles.paginationText}>{pagingMess}</Text>
      </View>
    );
  };

  renderNextButton() {
    return (
      <View style={[styles.swipeControlBtn, styles.swipeRightControlBtn]}>
        <FontAwesomeIcon
          name="angle-right"
          style={[styles.iconSwipeControl, styles.iconSwipeControlRight]}
        />
      </View>
    );
  }

  renderPrevButton() {
    return (
      <View style={[styles.swipeControlBtn, styles.swipeLeftControlBtn]}>
        <FontAwesomeIcon
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
          underlayColor="transparent"
          onPress={() => {
            Actions.item_image_viewer({
              images: this.state.images,
              index,
            });
          }}
          key={index}>
          <View style={{height: '100%'}}>
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

  renderItem = ({item: image, index}) => {
    return (
      <View style={{width: appConfig.device.width}}>
        {image?.image ? (
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => {
              console.log(this.state.images);
              Actions.item_image_viewer({
                images: this.state.images,
                index: index - 1,
              });
            }}>
            <View style={{height: '100%'}}>
              <FastImage
                style={styles.swiper_image}
                source={{uri: image.image}}
                resizeMode="contain"
              />
            </View>
          </TouchableHighlight>
        ) : (
          <Video
            refPlayer={this.refPlayer}
            type="youtube"
            videoId={image}
            containerStyle={{
              justifyContent: 'center',
              height: appConfig.device.height / 2,
            }}
            height={appConfig.device.height / 2}
            autoAdjustLayout
            youtubeIframeProps={{play: this.state.selectedIndex === index}}
          />
        )}
      </View>
    );
  };

  renderProductSwiper(product) {
    const images = product?.img || [];
    const hasImages = !!images.length;
    const isShowButtons = hasImages && images.length > 1;

    return (
      <View>
        <SkeletonLoading
          style={styles.noImageContainer}
          loading={this.state.loading}
          height={appConfig.device.width}>
          {!images.length ? (
            <View style={[styles.noImageContainer, styles.swiper_no_image]}>
              <SVGPhotoBroken
                width="80"
                height="80"
                fill={appConfig.colors.primary}
              />
            </View>
          ) : (
            <MediaCarousel
              height={appConfig.device.height / 2}
              data={this.state.images}
            />
            // <Swiper
            //   loop={false}
            //   showsButtons={isShowButtons}
            //   renderPagination={(index, total, context) =>
            //     this.renderPagination(index, total, context, hasImages)
            //   }
            //   buttonWrapperStyle={{
            //     alignItems: 'flex-end',
            //   }}
            //   nextButton={this.renderNextButton()}
            //   prevButton={this.renderPrevButton()}
            //   width={appConfig.device.width}
            //   height={appConfig.device.height / 2}
            //   containerStyle={styles.content_swiper}>
            //   {this.renderProductImages(images)}
            // </Swiper>
          )}
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

  renderPostForSaleBtn(product) {
    return (
      (!!product?.img?.length || !!product.content) && (
        <TouchableOpacity
          hitSlop={HIT_SLOP}
          disabled={this.state.preparePostForSaleDataLoading}
          onPress={() => this.handlePostForSale(product)}
          style={styles.postForSaleWrapper}>
          <View
            style={[
              styles.postForSaleContainer,
              this.state.preparePostForSaleDataLoading &&
                styles.postForSaleContainerLoading,
            ]}>
            <Text style={styles.postForSaleTitle}>
              {this.props.t('shopTitle.postForSale')}
            </Text>
          </View>

          <View
            style={[
              styles.postForSaleIconContainer,
              this.state.preparePostForSaleDataLoading &&
                styles.postForSaleIconContainerLoading,
            ]}>
            {this.state.preparePostForSaleDataLoading ? (
              <Loading size="small" />
            ) : (
              <MaterialCommunityIcons
                name="share"
                style={styles.postForSaleIcon}
              />
            )}
          </View>
        </TouchableOpacity>
      )
    );
  }

  renderWholesaleInfo = (product) => {
    if (!product?.detail_price_steps?.length) return;

    const {t} = this.props;

    const wholesaleValue = t('wholesale.value', {
      price: product.detail_price_steps[0].unit_price,
      quantity: product?.detail_price_steps[0].quantity,
    });

    return (
      <View style={styles.wholesaleContainer}>
        <View style={[styles.item_content_item, styles.item_content_item_left]}>
          <Text style={styles.item_content_item_title}>
            {t('wholesale.title')}
          </Text>
        </View>

        <TouchableOpacity
          onPress={this.handleWholesalePress}
          style={[styles.item_content_item, styles.item_content_item_right]}>
          <Text style={styles.item_content_item_value}>{wholesaleValue}</Text>
          <FontAwesomeIcon
            name="angle-right"
            style={styles.wholesaleRightIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

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
    if (!Array.isArray(product?.detail_info)) return;
    return product.detail_info.map((info, index) => {
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

  handleItemNews = (item) => () => {
    Actions.notify_item({
      title: item.title,
      data: item,
    });
  };

  renderListNews = ({item, index}) => {
    return (
      <View>
        <HomeCardItem
          title={item.title}
          imageUrl={item.image_url}
          onPress={this.handleItemNews(item)}
        />
      </View>
    );
  };

  renderWebviewContentCollapseBtn = () => {
    return (
      this.state.isWebviewContentCollapsed !== undefined && (
        <TouchableOpacity onPress={this.toggleCollapseWebviewContent}>
          <Container row center padding={15}>
            <Text style={styles.webviewContentShowMoreTitle}>
              {this.state.isWebviewContentCollapsed
                ? this.props.t('common:showMore')
                : this.props.t('common:showLess')}
            </Text>
            <FontAwesomeIcon
              name={
                this.state.isWebviewContentCollapsed ? 'angle-down' : 'angle-up'
              }
              style={styles.webviewContentShowMoreIcon}
            />
          </Container>
        </TouchableOpacity>
      )
    );
  };

  renderActionButton = (button, index) => {
    const IconComponent = button.iconBundle || MaterialCommunityIcons;
    return (
      <View
        key={index}
        style={[
          styles.item_actions_btn,
          {
            borderColor: this.subActionColor,
            marginLeft: index ? 10 : 0,
            minWidth: 42,
          },
          button.containerStyle,
        ]}>
        <TouchableHighlight
          hitSlop={HIT_SLOP}
          disabled={button.disabled}
          onPress={button.onPress}
          underlayColor={'rgba(0,0,0,.05)'}
          style={[
            {
              paddingHorizontal: 10,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            },
            button.contentContainerStyle,
          ]}>
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}>
            {!!button.loading ? (
              <Loading
                size="small"
                wrapperStyle={!!button.title && {position: undefined}}
                style={{padding: 0}}
              />
            ) : (
              !!button.iconName && (
                <IconComponent
                  name={button.iconName}
                  style={button.iconStyle}
                />
              )
            )}
            {((!!button.title && !!button.iconName) ||
              (!!button.title && !button.loading)) && (
              <Text
                // numberOfLines={1}
                style={[
                  styles.item_actions_title,
                  {
                    color: this.subActionColor,
                    marginLeft: !!button.iconName ? 10 : 0,
                    textTransform: 'uppercase',
                  },
                  button.titleStyle,
                ]}>
                {button.title}
                {/* {!this.isServiceProduct(item) &&
              isConfigActive(CONFIG_KEY.OPEN_SITE_DROP_SHIPPING_KEY)
                ? t('shopTitle.dropShip')
                : is_like
                ? t('liked')
                : t('like')} */}
              </Text>
            )}
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  renderActionButtons = () => {
    const buttonBlocks = this.actionButtonData.filter((btn) =>
      Array.isArray(btn),
    );
    const fistButtonBlock = (
      <View key={-1} style={styles.item_actions_box}>
        {this.actionButtonData.map((button, index) => {
          if (Array.isArray(button) || !!button.isHidden) {
            return null;
          }

          return this.renderActionButton(button, index);
        })}
      </View>
    );

    const othersButtonBlock = buttonBlocks.map((block, index) => {
      const hasBtn = block.filter((btn) => !btn.isHidden);

      return (
        !!hasBtn?.length && (
          <View key={index} style={styles.item_actions_box}>
            {block.map((btn, i) => this.renderActionButton(btn, i))}
          </View>
        )
      );
    });

    return [fistButtonBlock, othersButtonBlock];
  };

  render() {
    // var {item, item_data} = this.state;
    const item = this.state.item_data || this.state.item;
    const productWithSocialDataFormat = item?.object
      ? this.getProductWithSocialFormat(item)
      : {};
    const is_like = this.state.like_flag == 1;
    const {t} = this.props;
    const unitName = item.unit_name && item.unit_name_view;
    const storeName = store?.user_info?.store_name;
    const isInventoryVisible =
      !!item.inventory &&
      !isConfigActive(CONFIG_KEY.ALLOW_SITE_SALE_OUT_INVENTORY_KEY) &&
      item.order_type !== ORDER_TYPES.BOOKING;

    const extraSocialProps = {
      accessoryTypes: [ACCESSORY_TYPE.RATING],
      placeholder: this.props.t('placeholderRating'),
      disableEditComment: true,
    };

    return (
      <View style={styles.container}>
        {(this.state.loading || this.state.actionLoading) && <Loading center />}
        <Header
          title={this.props.title}
          animatedValue={this.animatedScrollY}
          item={item}
          onPressWarehouse={this.handlePressWarehouse}
        />

        <View style={styles.container}>
          <Animated.ScrollView
            ref={(ref) => (this.refs_body_item = ref)}
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

            <View style={[styles.block, styles.item_heading_box]}>
              <View style={styles.boxDiscount}>
                {item.discount_percent > 0 ? (
                  <View>
                    <DiscountBadge
                      containerStyle={styles.discountBadge}
                      label={saleFormat(item.discount_percent)}
                      contentContainerStyle={styles.discountBadgeContent}
                    />
                  </View>
                ) : (
                  <View />
                )}
                {isInventoryVisible && (
                  <View style={styles.productsLeftContainer}>
                    {/* <View style={styles.productsLeftBackground} />
                  <View style={styles.productsLeftBackgroundTagTail} /> */}
                    <Text style={styles.productsLeftText}>
                      {t('productsLeft', {quantity: item.inventory})}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.item_heading_title}>{item.name}</Text>

              {!!item.commission_value && (
                <Text style={styles.commissionText}>
                  {item.commission_value_view}
                </Text>
              )}

              <View style={styles.item_heading_price_box}>
                <Container centerVertical={false} flex>
                  {item.discount_percent > 0 && (
                    <Text style={styles.item_heading_safe_off_value}>
                      <Text style={{textDecorationLine: 'line-through'}}>
                        {item.discount_view}
                      </Text>
                    </Text>
                  )}
                  <Text style={styles.item_heading_price}>
                    {item.price_view}
                    {!!unitName && (
                      <Text style={styles.item_heading_safe_off_value}>
                        / {unitName}
                      </Text>
                    )}
                  </Text>
                </Container>

                {isConfigActive(CONFIG_KEY.ENABLE_POST_FOR_SALE_KEY) &&
                  this.renderPostForSaleBtn(item)}
              </View>

              {this.renderActionButtons()}
            </View>

            {item != null && !this.state.loading && (
              <>
                {this.renderWholesaleInfo(item)}

                <View style={[styles.block, styles.item_content_box]}>
                  {this.renderBtnProductStamps()}
                  {this.renderNoticeMessage(item)}
                  {this.renderDetailInfo(item)}
                </View>
              </>
            )}

            {!!item.object && (
              <ActionContainer
                style={styles.actionContainer}
                isLiked={getSocialLikeFlag(
                  SOCIAL_DATA_TYPES.PRODUCT,
                  productWithSocialDataFormat,
                )}
                likeCount={getSocialLikeCount(
                  SOCIAL_DATA_TYPES.PRODUCT,
                  productWithSocialDataFormat,
                )}
                commentsCount={getSocialCommentsCount(
                  SOCIAL_DATA_TYPES.PRODUCT,
                  productWithSocialDataFormat,
                )}
                commentTitle={this.props.t('common:review')}
                totalCommentsTitle={this.props.t('common:reviews')}
                disableShare
                // disableComment={isConfigActive(CONFIG_KEY.DISABLE_SOCIAL_COMMENT)}
                onActionBarPress={(type) =>
                  handleSocialActionBarPress(
                    SOCIAL_DATA_TYPES.PRODUCT,
                    type,
                    productWithSocialDataFormat,
                    true,
                    extraSocialProps,
                  )
                }
                hasInfoExtraBottom={false}
                onPressTotalComments={() =>
                  handleSocialActionBarPress(
                    SOCIAL_DATA_TYPES.PRODUCT,
                    SOCIAL_BUTTON_TYPES.COMMENT,
                    productWithSocialDataFormat,
                    false,
                    extraSocialProps,
                  )
                }
              />
            )}

            {!!item?.short_content && (
              <View
                style={[
                  styles.block,
                  styles.item_content_text,
                  styles.shortContentBox,
                ]}>
                <Text style={styles.shortContentItem}>
                  {item.short_content}
                </Text>
              </View>
            )}

            {!!item?.content && (
              <>
                <View style={[styles.block, styles.item_content_text]}>
                  <CustomAutoHeightWebview
                    ref={(inst) => (this.refWebview.current = inst)}
                    onSizeUpdated={this.handleWebviewContentLayout}
                    containerStyle={[
                      {
                        width: '100%',
                      },
                      this.state.isWebviewContentCollapsed !== undefined &&
                        !!this.state.isWebviewContentCollapsed &&
                        styles.webviewCollapsedContainer,
                    ]}
                    content={item.content}
                    onGetInnerText={(innerText) =>
                      this.handleGetInnerTextWebview(innerText, item)
                    }
                  />
                  {!!this.state.isWebviewContentCollapsed && (
                    <LinearGradient
                      style={styles.webviewCollapsedMask}
                      colors={['rgba(255,255,255,.3)', 'rgba(255,255,255,1)']}
                      locations={[0.2, 0.8]}
                    />
                  )}
                </View>
                {this.renderWebviewContentCollapseBtn()}
              </>
            )}

            <View style={styles.extraInfo}>
              {this.hasProductGroups ? (
                this.product.product_groups.map((productGroup, index) => {
                  let {id, products, title, display_type} = productGroup;
                  return (
                    <ListProducts
                      containerStyle={{
                        marginHorizontal: -15,
                      }}
                      key={id}
                      type={display_type}
                      data={products}
                      title={title}
                      onPressProduct={this.handlePressProduct}
                      onShowAll={() =>
                        this.handleShowAllGroupProduct(productGroup)
                      }
                    />
                  );
                })
              ) : this.props.apiFetching ? (
                <ListProductSkeleton />
              ) : null}
              {item.news_linking !== null &&
                !isEmpty(item.news_linking) &&
                typeof item.news_linking === 'object' && (
                  <View style={[styles.newsWrapper, styles.newsWrapperExtra]}>
                    <HomeCardList
                      onShowAll={null}
                      data={item.news_linking}
                      title={
                        <Text style={styles.titleRelated}>
                          {t('TIN TỨC LIÊN QUAN')}
                        </Text>
                      }>
                      {({item: news, index}) => {
                        return (
                          <HomeCardItem
                            title={news.title}
                            imageUrl={news.image_url}
                            onPress={this.handleItemNews(news)}
                            last={item.news_linking.length - 1 === index}
                          />
                        );
                      }}
                    </HomeCardList>
                  </View>
                )}
            </View>

            <View style={styles.boxButtonActions}>
              <Button
                onPress={this._goStores.bind(this, this.state.store_data)}
                btnContainerStyle={styles.goToStoreBtn}
                titleStyle={styles.goToStoreTxt}
                title={t('goToStore')}
              />
            </View>
          </Animated.ScrollView>
        </View>

        {this.renderCartFooter(item)}

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

        <ModalWholesale
          data={item.detail_price_steps || []}
          innerRef={(inst) => (this.refModalWholesale.current = inst)}
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
  block: {
    paddingHorizontal: 15,
    borderColor: appConfig.colors.border,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },

  titleRelated: {
    paddingHorizontal: 10,
    paddingTop: 5,
    textAlign: 'center',
    ...appConfig.styles.typography.heading3,
  },

  right_btn_box: {
    flexDirection: 'row',
  },
  content_swiper: {
    flex: 0,
  },
  swiper_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  swiper_no_image: {
    height: appConfig.device.height / 2 - 70,
    resizeMode: 'contain',
  },

  item_heading_box: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#fff',
  },
  boxDiscount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item_heading_title: {
    marginTop: 10,
    marginBottom: 15,
    ...appConfig.styles.typography.heading1,
  },
  commissionText: {
    fontSize: 16,
    marginBottom: 10,
    color: appConfig.colors.cherry,
  },
  item_heading_price_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_heading_safe_off_value: {
    ...appConfig.styles.typography.secondary,
    fontSize: 16,
    marginBottom: 10,
  },
  item_heading_price: {
    ...appConfig.styles.typography.heading1,
    color: appConfig.colors.primary,
  },
  item_actions_box: {
    flexDirection: 'row',
    marginTop: 15,
    overflow: 'hidden',
    flex: 1,
    // justifyContent: 'center',
  },
  item_actions_btn: {
    borderWidth: 0.5,
    borderColor: appConfig.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    // width: (appConfig.device.width - 45) / 2,
    borderRadius: 5,
    // paddingHorizontal: 20,
    overflow: 'hidden',
  },

  postForSaleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  postForSaleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: appConfig.colors.primary,
    borderWidth: 0.5,
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  postForSaleContainerLoading: {
    opacity: 0.3,
  },
  postForSaleIconContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    minWidth: 30,
    minHeight: 20,
    padding: 2,
    top: appConfig.device.isIOS ? -9 : -9,
    transform: [{rotate: '-30deg'}],
  },
  postForSaleIconContainerLoading: {
    transform: [{rotate: '0deg'}],
  },
  postForSaleIcon: {
    color: appConfig.colors.primary,
    fontSize: 20,
  },
  postForSaleTitle: {
    color: appConfig.colors.primary,
    fontSize: 12,
    fontWeight: '400',
  },

  item_actions_btn_icon_container: {
    height: '100%',
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item_actions_btn_icon: {
    fontSize: 20,
    color: '#fff',
  },
  item_actions_btn_chat: {
    marginRight: 15,
  },
  item_actions_btn_add_cart: {
    backgroundColor: appConfig.colors.primary,
  },
  item_actions_btn_add_cart_disabled: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  item_actions_title: {
    marginLeft: 8,
    color: '#fff',
  },

  item_content_box: {},
  item_content_item_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  item_content_item: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    textAlign: 'left',
  },
  item_content_item_right: {
    flex: 1,
  },
  item_content_item_title: {
    ...appConfig.styles.typography.secondary,
    color: '#8b8b8b',
  },
  item_content_item_value: {
    ...appConfig.styles.typography.text,
    marginLeft: 15,
    flex: 1,
  },

  item_content_text: {
    width: '100%',
    paddingTop: 20,
    paddingHorizontal: 0,
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
    height: undefined,
  },

  discountBadgeContent: {
    backgroundColor: appConfig.colors.sale,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: undefined,
  },

  paginationContainer: {
    borderRadius: 20,
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,.6)',
    paddingHorizontal: 10,
    paddingVertical: 3,
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
    marginBottom: 30,
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
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
    backgroundColor: hexToRgbA(LightenColor(appConfig.colors.primary, 20), 0.5),
  },

  productsLeftContainer: {},
  productsLeftBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
    color: '#9F9F9F',
    fontSize: 13,
    marginLeft: 8,
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
  newsWrapper: {
    paddingTop: 15,
    marginHorizontal: -15,
  },
  newsWrapperExtra: {
    marginTop: -15,
  },
  extraInfo: {
    paddingBottom: 15,
    backgroundColor: '#f5f7f8',
    paddingHorizontal: 15,
  },

  actionContainer: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingBottom: appConfig.device.bottomSpace,
    // ...elevationShadowStyle(7),
  },

  webviewCollapsedContainer: {
    height: WEBVIEW_HEIGHT_COLLAPSED,
    overflow: 'hidden',
  },
  webviewCollapsedMask: {
    width: '100%',
    height: WEBVIEW_COLLAPSED_MASK_HEIGHT,
    position: 'absolute',
    bottom: 0,
  },
  webviewContentShowMoreTitle: {
    color: appConfig.colors.primary,
    textAlign: 'center',
  },
  webviewContentShowMoreIcon: {
    marginLeft: 5,
    fontSize: 18,
    color: appConfig.colors.primary,
  },

  wholesaleContainer: {
    flexDirection: 'row',
    padding: 15,
    borderColor: '#eee',
    borderBottomWidth: 1,
    width: appConfig.device.width,
    alignItems: 'center',
  },
  wholesaleRightIcon: {
    color: '#ccc',
    fontSize: 26,
    paddingLeft: 10,
  },
  shortContentBox: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
  },
  shortContentItem: {
    ...appConfig.styles.typography.text,
    lineHeight: 24,
    fontSize: 14,
  },
});

export default withTranslation(['product', 'cart', 'common', 'opRegister'])(
  observer(Item),
);
