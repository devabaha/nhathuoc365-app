import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';
import store from 'app-store';
import {CART_TYPES} from 'src/constants/cart';
import {ORDER_TYPES} from 'src/constants';
import i18n from 'src/i18n';
import {PRODUCT_BUTTON_ACTION_LOADING_PARAM} from 'src/constants/product';
import {debounce} from 'lodash';

const ITEM_KEY = 'ItemKey';
const CONTINUE_ORDER_CONFIRM = 'Tiếp tục';
const CART_TYPE_REPLACE_KEYWORD = 'cart_type';
const CART_TYPE_WARNING_MESSAGE = `\r\n• Giỏ hàng đang đặt thuộc loại ${CART_TYPE_REPLACE_KEYWORD}.\r\n\r\n• Chọn ${CONTINUE_ORDER_CONFIRM} để hủy giỏ hàng đang đặt và tạo giỏ hàng mới.\r\n`;

class CTAProduct {
  productTempData = [];
  product = null;
  cartType = '';
  actionFunctionName = '';
  buyParams = {};
  isBuying = false;
  t = () => {};
  context = this;

  constructor(context, t) {
    this.t = t || i18n.getFixedT(undefined, ['common', 'product']);
    this.context = context;
  }

  isServiceProduct(product = {}) {
    return product.order_type === ORDER_TYPES.BOOKING;
  }

  goToBooking = (product) => {
    Actions.push(appConfig.routes.booking, {
      productId: product.id,
      siteId: product.site_id,
      attrs: product.attrs,
      models: product.models,
    });
  };

  isActionWillAddDifferentCartType = (cartType) => {
    const cartData = store.cart_data;
    if (cartData && cartData.cart_type) {
      if (cartData.cart_type !== cartType) {
        let modalTitle = CART_TYPE_WARNING_MESSAGE.replace(
          CART_TYPE_REPLACE_KEYWORD,
          cartData.cart_type_name,
        );
        // switch (cartData.cart_type) {
        //   case CART_TYPES.NORMAL:
        //     modalTitle = CART_HAS_ONLY_NORMAL_MESSAGE;
        //     break;
        //   case CART_TYPES.DROP_SHIP:
        //     modalTitle = CART_HAS_ONLY_DROP_SHIP_MESSAGE;
        //     break;
        // }

        Actions.push(appConfig.routes.modalConfirm, {
          message: modalTitle,
          type: 'warning',
          isConfirm: true,
          yesTitle: CONTINUE_ORDER_CONFIRM,
          titleStyle: {textAlign: 'left'},
          noConfirm: this.cancelConfirmCartType,
          yesConfirm: this.confirmCartType,
        });

        return true;
      }
    }

    return false;
  };

  handlePressMainActionBtnProduct = ({
    product,
    cartType,
    btnTitle,
    isOrderNow = false,
    callbackSuccess,
  }) => {
    this.actionFunctionName = 'handlePressMainActionBtnProduct';

    switch (product.order_type) {
      case ORDER_TYPES.NORMAL:
        this.handleBuy(
          product,
          cartType,
          isOrderNow,
          (params) => this._addCart({...params, callbackSuccess}),
          false,
          btnTitle,
          callbackSuccess,
        );
        break;
      case ORDER_TYPES.BOOKING:
        this.goToBooking(product);
        break;
      default:
        this.handleBuy(
          product,
          cartType,
          isOrderNow,
          (params) => this._addCart({...params, callbackSuccess}),
          false,
          btnTitle,
          callbackSuccess,
        );
        break;
    }
  };

  handlePressSubAction = ({
    product,
    cartType,
    btnTitle,
    isOrderNow = true,
    callbackSuccess,
  }) => {
    this.actionFunctionName = 'handlePressSubAction';

    if (this.isServiceProduct(product)) {
      this._likeHandler(product);
      return;
    }

    switch (cartType) {
      case CART_TYPES.DROP_SHIP:
        this.handleDropShip(
          product,
          cartType,
          btnTitle,
          isOrderNow,
          callbackSuccess,
        );
        break;
      default:
        this._likeHandler(product);
        break;
    }
  };

  /**
   * @deprecated not use anymore.
   */
  handlePressActionBtnProduct = (product, cartType, isOrderNow) => {
    switch (cartType) {
      case CART_TYPES.NORMAL:
        this.handlePressMainActionBtnProduct(product, cartType, isOrderNow);
        break;
      case CART_TYPES.DROP_SHIP:
        this.handlePressSubAction(product, cartType, isOrderNow);
        break;
      default:
        this.handlePressMainActionBtnProduct(product, cartType, isOrderNow);
        break;
    }
  };

  submitDropShip = (params) => {
    this._addCart(params);
  };

  handleDropShip = (
    product,
    cartType,
    btnTitle,
    isOrderNow = false,
    callbackSuccess = () => {},
  ) => {
    this.handleBuy(
      product,
      cartType,
      isOrderNow,
      (params) => {
        this._addCart({...params, callbackSuccess});
      },
      true,
      btnTitle,
      callbackSuccess,
    );
  };

  handleBuy = (
    product,
    cartType,
    isOrderNow,
    callBack = () => {},
    isDropShip = false,
    btnTitle,
    callbackSuccess,
  ) => {
    if (this.isActionWillAddDifferentCartType(cartType)) {
      this.product = product;
      this.cartType = cartType;
      this.buyParams = {
        product,
        cartType,
        isOrderNow,
        btnTitle,
        callbackSuccess,
      };
      return;
    }

    if (product.has_attr || isDropShip) {
      if (this.isBuying) return;

      this.isBuying = true;

      Actions.push(appConfig.routes.itemAttribute, {
        isDropShip,
        itemId: product.id,
        product,
        btnTitle: btnTitle || isOrderNow ? this.t('product:shopTitle.buy') : '',
        onSubmit: (quantity, model, newPrice) => {
          // Actions.pop();
          callBack({
            item: product,
            quantity,
            modelKey: model,
            newPrice,
            btnTitle,
            cartType,
            isOrderNow,
          });
        },
        onUnmounted: () => {
          this.isBuying = false;
        },
      });
    } else {
      // if (this.isActionWillAddDifferentCartType(cartType)) {
      //   this.saveProductTempData(product, 1, '', null);
      //   return;
      // }
      callBack({item: product, btnTitle, cartType, isOrderNow});
    }
  };

  saveProductTempData = (...args) => {
    this.productTempData = [...args];
  };

  getLoadingParam = (cartType, isOrderNow) => {
    let loadingParam = '';

    switch (cartType) {
      case CART_TYPES.NORMAL:
        if (isOrderNow) {
          loadingParam = [PRODUCT_BUTTON_ACTION_LOADING_PARAM.BUY_NOW];
        } else {
          loadingParam = [PRODUCT_BUTTON_ACTION_LOADING_PARAM.ADD_TO_CART];
        }
        break;
      case CART_TYPES.DROP_SHIP:
        loadingParam = [PRODUCT_BUTTON_ACTION_LOADING_PARAM.DROP_SHIP];
        break;
    }

    return loadingParam;
  };

  // add item vào giỏ hàng
  _addCart = ({
    item,
    quantity = 1,
    modelKey: model = '',
    newPrice = null,
    isOrderNow = false,
    cartType,

    btnTitle = '',
    callbackSuccess = () => {},
  }) => {
    const loadingParam = this.getLoadingParam(cartType, isOrderNow);

    this.context.setState(
      {
        [loadingParam]: true,
      },
      async () => {
        const data = {
          quantity,
          model,
        };
        if (newPrice) {
          data.new_price = newPrice;
        }
        try {
          const response = await APIHandler.site_cart_plus(
            store.store_id,
            item.id,
            data,
          );

          if (response && response.status == STATUS_SUCCESS) {
            if (
              !this.context.unmounted &&
              //  && response.data.attrs
              response.data.has_attr
            ) {
              Actions.push(appConfig.routes.itemAttribute, {
                itemId: item.id,
                btnTitle,
                onSubmit: (quantity, modal_key) =>
                  this._addCart({
                    item,
                    quantity,
                    modalKey: modal_key,
                    newPrice,
                    isOrderNow,
                    cartType,

                    btnTitle,
                    callbackSuccess,
                  }),
              });
            } else {
              flashShowMessage({
                message: response.message,
                type: 'success',
              });
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

            callbackSuccess && callbackSuccess();
          } else {
            flashShowMessage({
              message: response.message || this.t('common:api.error.message'),
              type: 'danger',
            });
          }
        } catch (e) {
          console.log(e + ' site_cart_plus');
          flashShowMessage({
            type: 'danger',
            message: this.t('common:api.error.message'),
          });
        } finally {
          this.productTempData = [];
          if (!this.context.unmounted) {
            this.context.setState({
              [loadingParam]: false,
            });
          }
        }
      },
    );
  };

  _likeHandler(item) {
    this.context.setState(
      {
        [PRODUCT_BUTTON_ACTION_LOADING_PARAM.LIKE]: true,
      },
      async () => {
        try {
          var response = await APIHandler.site_like(
            store.store_id,
            item.id,
            this.context.state.item_data.like_flag == 1 ? 0 : 1,
          );

          if (response && response.status == STATUS_SUCCESS) {
            var like_flag = response.data.like_flag;

            this.context.setState(
              {
                like_flag,
                [PRODUCT_BUTTON_ACTION_LOADING_PARAM.LIKE]: false,
              },
              () => {
                this.context.state.item_data.like_flag = like_flag;

                // cache in five minutes
                var {item} = this.context.state;
                var item_key = ITEM_KEY + item.id + store.user_info.id;
                storage.save({
                  key: item_key,
                  data: this.context.state.item_data,
                  expires: ITEM_CACHE,
                });
              },
            );
          } else {
            flashShowMessage({
              type: 'danger',
              message: response?.message || this.t('common:api.error.message'),
            });
          }
        } catch (e) {
          console.log(e + ' site_like');
          flashShowMessage({
            type: 'danger',
            message: this.t('common:api.error.message'),
          });
        } finally {
          this.context.setState({
            [PRODUCT_BUTTON_ACTION_LOADING_PARAM.LIKE]: false,
          });
        }
      },
    );
  }

  async _cancelCart(callBack) {
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
          message: response?.message || this.t('common:api.error.message'),
        });
      }
    } catch (e) {
      console.log(e + ' site_cart_canceling');
      flashShowMessage({
        type: 'danger',
        message: this.t('common:api.error.message'),
      });
    } finally {
      !this.context.unmounted &&
        this.context.setState({
          actionLoading: false,
        });
    }
  }

  confirmCartType = () => {
    this.context.setState({actionLoading: true});
    this._cancelCart(() => {
      // if (this.productTempData.length > 0) {
      //   this._addCart(...this.productTempData);
      // }
      setTimeout(() => {
        if (!!this.buyParams.product) {
          console.log(this.buyParams);
          this[this.actionFunctionName](this.buyParams);
        }
      }, 500);
    });
  };

  cancelConfirmCartType = () => {
    this.productTempData = [];
    this.buyParams = {};
    this.product = null;
    this.cartType = '';
  };
}

export default CTAProduct;
