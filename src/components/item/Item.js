import React, {Component} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
// 3-party libs
import Clipboard from '@react-native-community/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import Shimmer from 'react-native-shimmer';
import {isEmpty} from 'lodash';
import {reaction} from 'mobx';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {shareImages} from 'app-helper/share';
import {isOutOfStock} from 'app-helper/product';
import {
  calculateLikeCountFriendly,
  getSocialCommentsCount,
  getSocialLikeCount,
  getSocialLikeFlag,
  handleSocialActionBarPress,
} from 'app-helper/social';
import {servicesHandler} from 'app-helper/servicesHandler';
import {hexToRgba} from 'app-helper';
import {getTheme} from 'src/Themes/Theme.context';
import {isConfigActive} from 'src/helper/configKeyHandler';
// routing
import {pop, push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {
  ButtonRoundedType,
  TypographyType,
  BundleIconSetName,
} from 'src/components/base';
import {SERVICES_TYPE} from 'app-helper/servicesHandler';
import {
  ACCESSORY_TYPE,
  SOCIAL_BUTTON_TYPES,
  SOCIAL_DATA_TYPES,
} from 'src/constants/social';
import {CONFIG_KEY} from 'src/helper/configKeyHandler';
import {CART_TYPES} from 'src/constants/cart';
import {MEDIA_TYPE, ORDER_TYPES} from '../../constants';
// entities
import {APIRequest} from 'src/network/Entity';
import CTAProduct from './CTAProduct';
import EventTracker from 'app-helper/EventTracker';
// images
import SVGPhotoBroken from '../../images/photo_broken.svg';
// custom components
import ModalWholesale from './ModalWholesale';
import MediaCarousel from './MediaCarousel';
import ListProducts from '../Home/component/ListProducts';
import CartFooter from '../cart/CartFooter';
import PopupConfirm from '../PopupConfirm';
import {
  AppFilledButton,
  AppOutlinedButton,
  Typography,
  Icon,
  ScrollView,
  ScreenWrapper,
  RefreshControl,
  Container,
  BaseButton,
  TextButton,
} from 'src/components/base';
import ActionContainer from '../Social/ActionContainer';
import CustomAutoHeightWebview from '../CustomAutoHeightWebview';
import HomeCardList, {HomeCardItem} from '../Home/component/HomeCardList';
import NoResult from '../NoResult';
import Header from './Header';
import {DiscountBadge} from '../Badges';
import Button from 'src/components/Button';
import Loading from '../Loading';
// skeleton
import SkeletonLoading from '../SkeletonLoading';

const ITEM_KEY = 'ItemKey';
const WEBVIEW_HEIGHT_COLLAPSED = 300;
const MIN_WEBVIEW_HEIGHT_TO_COLLAPSE = WEBVIEW_HEIGHT_COLLAPSED * 1.5;
const WEBVIEW_COLLAPSED_MASK_HEIGHT = WEBVIEW_HEIGHT_COLLAPSED / 4;

class Item extends Component {
  static contextType = ThemeContext;

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
      preparePostForSaleDataLoading: false,
      like_flag: 0,
      scrollY: 0,

      webviewContentHeight: undefined,
      isWebviewContentCollapsed: undefined,
      selectedIndex: 0,

      canPlayVideo: false,
    };

    this.refPlayer = React.createRef();

    this.animatedScrollY = new Animated.Value(0);
    this.unmounted = false;
    this.eventTracker = new EventTracker();
    this.refPopupConfirmCartType = React.createRef();
    this.refWebview = React.createRef();
    this.refModalWholesale = React.createRef();
    this.productTempData = [];
    this.disposerIsEnterItem = () => {};

    this.CTAProduct = new CTAProduct(props.t, this);
    this.getWarehouseRequest = new APIRequest();
    this.updateWarehouseRequest = new APIRequest();
    this.requests = [this.getWarehouseRequest, this.updateWarehouseRequest];

    this.webviewContentShowMoreTitleTypoProps = {
      type: TypographyType.LABEL_MEDIUM_PRIMARY,
    };
  }

  get theme() {
    return getTheme(this);
  }

  get product() {
    return this.state.item_data || this.state.item || {};
  }

  get isLiked() {
    return this.state.like_flag == 1;
  }

  get subActionColor() {
    return this.isDisabledSubBtnAction
      ? this.subActionDisabledColor
      : isConfigActive(CONFIG_KEY.OPEN_SITE_DROP_SHIPPING_KEY) &&
        !this.isServiceProduct(this.product)
      ? this.subActionActiveColor
      : this.isLiked
      ? this.subActionActiveColor
      : this.subActionActiveColor;
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
    this.disposerIsEnterItem = reaction(
      () => store.isEnterItem,
      this.checkEnterItemListener,
    );
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
    this.disposerIsEnterItem();
    cancelRequests(this.requests);
  }

  checkEnterItemListener = (isEnterItem) => {
    this.setState({canPlayVideo: isEnterItem});
  };

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
      pop();
    } else {
      push(
        appConfig.routes.store,
        {
          title: store.store_data.name,
        },
        this.theme,
      );
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
    this._getDataFromServer(delay);
  }

  async _getDataFromServer(delay) {
    var {item} = this.state;
    var item_key = ITEM_KEY + item.id + store.user_info.id;

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
          like_loading: false,
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

  _onRefresh() {
    if (this.props.preventUpdate) {
      return null;
    }
    this.setState({refreshing: true});

    this._getDataFromServer(1000);
  }

  handlePressMainActionBtnProduct = (product, cartType) => {
    this.CTAProduct.handlePressMainActionBtnProduct(product, cartType);
  };

  handlePressSubAction = (product, cartType) => {
    this.CTAProduct.handlePressSubAction(product, cartType);
  };

  handlePressWarehouse = () => {
    // push(appConfig.routes.modalList, {
    //   heading: this.props.t('opRegister:modal.warehouse.title'),
    //   data: this.state.listWarehouse,
    //   selectedItem: {id: store?.user_info?.store_id},
    //   onPressItem: this.onSelectWarehouse,
    //   onCloseModal: pop,
    //   modalStyle: {
    //     height: null,
    //     maxHeight: '80%',
    //   },
    //   ListEmptyComponent: (
    //     <NoResult iconName="warehouse" message={this.props.t('noStoreFound')} />
    //   ),
    // });
    servicesHandler({
      type: SERVICES_TYPE.GPS_LIST_STORE,
      selectedStore: {id: store?.user_info?.store_id},
      placeholder: this.props.t('gpsStore:searchSalePointPlaceholder'),
      onPress: (store) => {
        this.onSelectWarehouse(store);
        pop();
      },
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

  onSelectWarehouse = (warehouse) => {
    this.setState({loading: true});
    this.updateWarehouse(warehouse);
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
    servicesHandler({
      type: SERVICES_TYPE.PRODUCT_DETAIL,
      title: product.name,
      product,
    });
  };

  handleItemNews = (item) => () => {
    servicesHandler({
      type: SERVICES_TYPE.NEWS_DETAIL,
      theme: this.theme,
      title: item.title,
      data: item,
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

  handlePressScannedProduct = () => {
    push(appConfig.routes.productStamps, {}, this.theme);
  };

  renderProductSwiper(product) {
    const images = product?.img || [];

    return (
      <Container style={{zIndex: 999}}>
        <SkeletonLoading
          style={[
            styles.noImageContainer,
            this.skeletonLoadingProductSwiperContainerStyle,
          ]}
          loading={this.state.loading}
          height={appConfig.device.width}>
          {!images.length ? (
            <View
              style={[
                styles.noImageContainer,
                styles.swiper_no_image,
                this.skeletonLoadingProductSwiperContainerStyle,
              ]}>
              <SVGPhotoBroken
                width="80"
                height="80"
                fill={this.theme.color.primary}
              />
            </View>
          ) : (
            <MediaCarousel
              height={appConfig.device.width}
              data={this.state.images}
              canPlayVideo={this.state.canPlayVideo}
            />
          )}
        </SkeletonLoading>
      </Container>
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

  renderMainActionBtnIcon(product, titleStyle) {
    return this.state.buying ? (
      <Indicator size="small" color="#ffffff" />
    ) : this.isServiceProduct(product) ? (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name="calendar-plus-o"
        style={[styles.item_actions_btn_icon, titleStyle]}
      />
    ) : (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name="cart-plus"
        style={[styles.item_actions_btn_icon, titleStyle]}
      />
    );
  }

  renderSubActionBtnIcon(product, titleStyle) {
    return this.state.like_loading || this.state.isSubActionLoading ? (
      <Indicator size="small" />
    ) : isConfigActive(CONFIG_KEY.OPEN_SITE_DROP_SHIPPING_KEY) &&
      !this.isServiceProduct(product) ? (
      <Icon
        bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
        name="truck-fast"
        size={24}
        style={titleStyle}
      />
    ) : (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name={this.state.like_flag == 1 ? 'heart' : 'heart-o'}
        size={20}
        style={titleStyle}
      />
    );
  }

  renderPostForSaleBtnContent = (titleStyle, buttonStyle) => {
    return (
      <>
        <View>
          <Typography
            type={TypographyType.LABEL_SMALL}
            style={[styles.postForSaleTitle, titleStyle]}>
            {this.props.t('shopTitle.postForSale')}
          </Typography>
        </View>
        <Container
          style={[
            styles.postForSaleIconContainer,
            this.state.preparePostForSaleDataLoading &&
              styles.postForSaleIconContainerLoading,
          ]}>
          {this.state.preparePostForSaleDataLoading ? (
            <Loading size="small" />
          ) : (
            <Icon
              bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
              name="share"
              style={[styles.postForSaleIcon, titleStyle]}
            />
          )}
        </Container>
      </>
    );
  };

  renderPostForSaleBtn(product) {
    return (
      (!!product?.img?.length || !!product.content) && (
        <Container center>
          <AppOutlinedButton
            hitSlop={HIT_SLOP}
            disabled={this.state.preparePostForSaleDataLoading}
            onPress={() => this.handlePostForSale(product)}
            style={[
              styles.postForSaleContainer,
              this.state.preparePostForSaleDataLoading &&
                styles.postForSaleContainerLoading,
            ]}
            rounded={ButtonRoundedType.SMALL}
            renderTitleComponent={this.renderPostForSaleBtnContent}
          />
        </Container>
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
      <View style={[styles.wholesaleContainer, this.borderStyle]}>
        <View style={[styles.item_content_item, styles.item_content_item_left]}>
          <Typography type={TypographyType.LABEL_MEDIUM_SECONDARY}>
            {t('wholesale.title')}
          </Typography>
        </View>

        <BaseButton
          onPress={this.handleWholesalePress}
          style={[styles.item_content_item, styles.item_content_item_right]}>
          <Typography
            type={TypographyType.LABEL_MEDIUM}
            style={styles.item_content_item_value}>
            {wholesaleValue}
          </Typography>
          <Icon
            bundle={BundleIconSetName.FONT_AWESOME}
            name="angle-right"
            neutral
            style={styles.wholesaleRightIcon}
          />
        </BaseButton>
      </View>
    );
  };

  renderBtnProductStamps = () => {
    return (
      !!this.props.showBtnProductStamps && (
        <Button
          containerStyle={[
            styles.btnProductStampsContainer,
            this.btnProductStampsContainerStyle,
          ]}
          btnContainerStyle={styles.btnProductStampsContentContainer}
          onPress={this.handlePressScannedProduct}>
          <Shimmer opacity={1} animationOpacity={0.3} pauseDuration={3000}>
            <Typography
              type={TypographyType.LABEL_LARGE_PRIMARY}
              style={styles.btnProductStampsTitle}>
              {this.props.t('productStamp:viewScannedProduct')}
            </Typography>
          </Shimmer>
        </Button>
      )
    );
  };

  renderNoticeMessage(product) {
    return product?.notice?.message ? (
      <View
        style={[
          styles.noticeContainer,
          {
            backgroundColor:
              product?.notice?.bgColor || this.theme.color.persistPrimary,
          },
        ]}>
        <Typography
          type={TypographyType.LABEL_SEMI_LARGE}
          style={[styles.noticeMessage, this.noticeMessageStyle]}>
          {product.notice.message}
        </Typography>
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
            <Typography
              type={TypographyType.LABEL_MEDIUM_SECONDARY}
              style={styles.item_content_item_title}>
              {info.name}
            </Typography>
          </View>

          <View
            style={[styles.item_content_item, styles.item_content_item_right]}>
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={styles.item_content_item_value}>
              {info.info}
            </Typography>
          </View>
        </View>
      );
    });
  }

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
        <TextButton
          typoProps={this.webviewContentShowMoreTitleTypoProps}
          style={styles.webviewContentShowMoreContainer}
          onPress={this.toggleCollapseWebviewContent}
          renderIconRight={(titleStyle) => {
            return (
              <Icon
                bundle={BundleIconSetName.FONT_AWESOME}
                name={
                  this.state.isWebviewContentCollapsed
                    ? 'angle-down'
                    : 'angle-up'
                }
                style={[titleStyle, styles.webviewContentShowMoreIcon]}
              />
            );
          }}>
          {this.state.isWebviewContentCollapsed
            ? this.props.t('common:showMore')
            : this.props.t('common:showLess')}
        </TextButton>
      )
    );
  };

  renderMainActionBtn = (item, titleStyle, buttonStyle, fontStyle) => {
    const {t} = this.props;

    return (
      <Container noBackground row style={styles.item_actions_btn}>
        <Container
          noBackground
          center
          style={styles.item_actions_btn_icon_container}>
          {this.renderMainActionBtnIcon(item, fontStyle)}
        </Container>
        <Typography
          type={TypographyType.LABEL_MEDIUM}
          numberOfLines={1}
          style={[styles.item_actions_title, fontStyle]}>
          {this.isServiceProduct(item)
            ? t('shopTitle.book')
            : this.isDisabledBuyingProduct
            ? t('shopTitle.outOfStock')
            : t('shopTitle.buy')}
        </Typography>
      </Container>
    );
  };

  renderSubActionBtn = (item, titleStyle, buttonStyle, fontStyle) => {
    const {t} = this.props;

    return (
      <Container row centerVertical>
        <View style={styles.item_actions_btn_icon_container}>
          {this.renderSubActionBtnIcon(item, fontStyle)}
        </View>
        <Typography
          type={TypographyType.LABEL_MEDIUM}
          numberOfLines={1}
          style={[styles.item_actions_title, fontStyle]}>
          {!this.isServiceProduct(item) &&
          isConfigActive(CONFIG_KEY.OPEN_SITE_DROP_SHIPPING_KEY)
            ? t('shopTitle.dropShip')
            : this.isLiked
            ? t('liked')
            : t('like')}
        </Typography>
      </Container>
    );
  };

  get subActionActiveColor() {
    return this.theme.color.primaryHighlight;
  }

  get subActionDisabledColor() {
    return this.theme.color.disabled;
  }

  get skeletonLoadingProductSwiperContainerStyle() {
    return {
      backgroundColor: hexToRgba(
        LightenColor(this.theme.color.primary, 20),
        0.5,
      ),
    };
  }

  get commissionTextStyle() {
    return {
      color: this.theme.color.cherry,
    };
  }

  get borderStyle() {
    return {
      borderColor: this.theme.color.border,
      borderBottomWidth: this.theme.layout.borderWidth,
    };
  }

  get blockStyle() {
    return [styles.block, this.borderStyle];
  }

  get btnProductStampsContainerStyle() {
    return {
      backgroundColor: this.theme.color.contentBackgroundWeak,
    };
  }

  get noticeMessageStyle() {
    return {
      color: this.theme.color.onPersistPrimary,
    };
  }

  get shortContentBoxStyle() {
    return {
      backgroundColor: this.theme.color.contentBackgroundWeak,
    };
  }

  get webviewCollapseColor() {
    return [hexToRgba(this.theme.color.surface, 0.3), this.theme.color.surface];
  }

  render() {
    const item = this.state.item_data || this.state.item;
    const productWithSocialDataFormat = item?.object
      ? this.getProductWithSocialFormat(item)
      : {};
    const {t} = this.props;
    const unitName = item.unit_name && item.unit_name_view;
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
      <ScreenWrapper>
        <Header
          title={this.props.title}
          animatedValue={this.animatedScrollY}
          item={item}
          onPressWarehouse={this.handlePressWarehouse}
        />

        {(this.state.loading || this.state.actionLoading) && <Loading center />}

        <ScrollView
          animated
          safeLayout={!store.cart_data}
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
          <Container>
            {this.renderProductSwiper(item)}

            <View style={[this.blockStyle, styles.item_heading_box]}>
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
                    <Typography
                      type={TypographyType.DESCRIPTION_SEMI_MEDIUM}
                      style={styles.productsLeftText}>
                      {t('productsLeft', {quantity: item.inventory})}
                    </Typography>
                  </View>
                )}
              </View>
              <Typography
                type={TypographyType.LABEL_HUGE}
                style={styles.item_heading_title}>
                {item.name}
              </Typography>

              {!!item.commission_value && (
                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={[styles.commissionText, this.commissionTextStyle]}>
                  {item.commission_value_view}
                </Typography>
              )}

              <View style={styles.item_heading_price_box}>
                <Container flex>
                  {item.discount_percent > 0 && (
                    <Typography
                      type={TypographyType.LABEL_LARGE_SECONDARY}
                      style={[
                        styles.item_heading_safe_off_value,
                        styles.slashText,
                      ]}>
                      {item.discount_view}
                    </Typography>
                  )}
                  <Typography
                    type={TypographyType.LABEL_HUGE_PRIMARY}
                    style={styles.item_heading_price}>
                    {item.price_view}
                    {!!unitName && (
                      <Typography
                        type={TypographyType.DESCRIPTION_MEDIUM}
                        style={styles.item_heading_safe_off_value}>
                        / {unitName}
                      </Typography>
                    )}
                  </Typography>
                </Container>

                {isConfigActive(CONFIG_KEY.ENABLE_POST_FOR_SALE_KEY) &&
                  this.renderPostForSaleBtn(item)}
              </View>

              <View style={styles.item_actions_box}>
                <AppOutlinedButton
                  disabled={this.isDisabledSubBtnAction}
                  onPress={() =>
                    this.handlePressSubAction(
                      item,
                      isConfigActive(CONFIG_KEY.OPEN_SITE_DROP_SHIPPING_KEY)
                        ? CART_TYPES.DROP_SHIP
                        : '',
                    )
                  }
                  style={[
                    styles.item_actions_btn,
                    styles.item_actions_btn_chat,
                  ]}
                  renderTitleComponent={(titleStyle, buttonStyle, fontStyle) =>
                    this.renderSubActionBtn(
                      item,
                      titleStyle,
                      buttonStyle,
                      fontStyle,
                    )
                  }
                />

                <AppFilledButton
                  disabled={this.isDisabledBuyingProduct}
                  onPress={() =>
                    this.handlePressMainActionBtnProduct(
                      item,
                      CART_TYPES.NORMAL,
                    )
                  }
                  renderTitleComponent={(titleStyle, buttonStyle, fontStyle) =>
                    this.renderMainActionBtn(
                      item,
                      titleStyle,
                      buttonStyle,
                      fontStyle,
                    )
                  }
                />
              </View>
            </View>

            {item != null && !this.state.loading && (
              <>
                {this.renderWholesaleInfo(item)}

                <View style={this.blockStyle}>
                  {this.renderBtnProductStamps()}
                  {this.renderNoticeMessage(item)}
                  <View style={styles.item_content_box}>
                    {this.renderDetailInfo(item)}
                  </View>
                </View>
              </>
            )}

            {!!item.object && (
              <ActionContainer
                style={this.borderStyle}
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
                    this.theme,
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
                    this.theme,
                  )
                }
              />
            )}

            {!!item?.short_content && (
              <View
                style={[
                  this.blockStyle,
                  styles.item_content_text,
                  styles.shortContentBox,
                  this.shortContentBoxStyle,
                ]}>
                <Typography
                  yype={TypographyType.LABEL_MEDIUM}
                  style={styles.shortContentItem}>
                  {item.short_content}
                </Typography>
              </View>
            )}

            {!!item?.content && (
              <>
                <View style={[this.blockStyle, styles.item_content_text]}>
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
                      colors={this.webviewCollapseColor}
                      locations={[0.2, 0.8]}
                    />
                  )}
                </View>
                {this.renderWebviewContentCollapseBtn()}
              </>
            )}
          </Container>

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
                    title={t('relatedNews')}>
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
        </ScrollView>

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
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  block: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },

  swiper_no_image: {
    height: appConfig.device.height / 2 - 70,
    resizeMode: 'contain',
  },

  item_heading_box: {
    width: '100%',
    marginTop: 10,
  },
  boxDiscount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item_heading_title: {
    marginTop: 10,
    marginBottom: 15,
  },
  commissionText: {
    marginBottom: 10,
  },
  item_heading_price_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_heading_safe_off_value: {
    marginBottom: 10,
  },
  item_heading_price: {},
  item_actions_box: {
    flexDirection: 'row',
    marginTop: 15,
    overflow: 'hidden',
  },
  item_actions_btn: {
    height: 40,
    width: (appConfig.device.width - 45) / 2,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  postForSaleContainer: {
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
    minWidth: 30,
    minHeight: 20,
    padding: 2,
    top: appConfig.device.isIOS ? -9 : -9,
    top: '-150%',
    transform: [{rotate: '-30deg'}],
  },
  postForSaleIconContainerLoading: {
    transform: [{rotate: '0deg'}],
  },
  postForSaleIcon: {
    fontSize: 20,
  },
  postForSaleTitle: {
    fontWeight: '400',
  },

  item_actions_btn_icon_container: {
    height: '100%',
    minWidth: 24,
  },
  item_actions_btn_icon: {
    fontSize: 20,
  },
  item_actions_btn_chat: {
    marginRight: 15,
  },
  item_actions_title: {
    marginLeft: 8,
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
  item_content_item_title: {},
  item_content_item_value: {
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
  },
  goToStoreTxt: {
    fontSize: 14,
    letterSpacing: 1,
  },
  discountBadge: {
    height: undefined,
  },

  discountBadgeContent: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: undefined,
  },

  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
    backgroundColor: hexToRgba(LightenColor(appConfig.colors.primary, 20), 0.5),
  },

  productsLeftContainer: {},
  productsLeftText: {
    marginLeft: 8,
  },
  noticeContainer: {
    padding: 15,
    marginHorizontal: -15,
  },
  noticeMessage: {
    textAlign: 'center',
    fontWeight: '500',
  },

  btnProductStampsContainer: {
    marginHorizontal: -15,
    width: appConfig.device.width,
  },
  btnProductStampsContentContainer: {
    paddingVertical: 5,
    backgroundColor: 'transparent',
  },
  btnProductStampsTitle: {
    fontWeight: 'bold',
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
    paddingHorizontal: 15,
  },

  actionContainer: {},

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
  webviewContentShowMoreContainer: {
    padding: 15,
  },
  webviewContentShowMoreIcon: {
    marginLeft: 5,
    fontSize: 18,
  },

  wholesaleContainer: {
    flexDirection: 'row',
    padding: 15,
    width: appConfig.device.width,
    alignItems: 'center',
  },
  wholesaleRightIcon: {
    fontSize: 26,
    paddingLeft: 10,
  },
  shortContentBox: {
    paddingHorizontal: 15,
  },
  shortContentItem: {
    lineHeight: 24,
    fontSize: 14,
  },
  slashText: {
    textDecorationLine: 'line-through',
  },
});

export default withTranslation([
  'product',
  'productStamp',
  'cart',
  'common',
  'opRegister',
  'gpsStore',
])(observer(Item));
