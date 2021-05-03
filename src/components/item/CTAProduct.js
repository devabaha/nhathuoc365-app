import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';
import store from 'app-store';
import {CART_TYPES} from 'src/constants/cart';
import {PRODUCT_TYPES} from 'src/constants';

const ITEM_KEY = 'ItemKey';
const CONTINUE_ORDER_CONFIRM = 'Tiếp tục';
const CART_TYPE_REPLACE_KEYWORD = 'cart_type';
const CART_TYPE_WARNING_MESSAGE = `\r\n• Giỏ hàng đang đặt thuộc loại ${CART_TYPE_REPLACE_KEYWORD}.\r\n\r\n• Chọn ${CONTINUE_ORDER_CONFIRM} để hủy giỏ hàng đang đặt và tạo giỏ hàng mới.\r\n`;

class CTAProduct {
  productTempData = [];
  product = null;
  cartType = '';
  actionFunctionName = '';
  t = () => {};
  context = this;

  constructor(t, context) {
    this.t = t;
    this.context = context;
  }

  isServiceProduct(product = {}) {
    return product.product_type === PRODUCT_TYPES.SERVICE;
  }

  goToSchedule = (product) => {
    Actions.push(appConfig.routes.productSchedule, {
      productId: product.id,
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

  handlePressMainActionBtnProduct = (product, cartType) => {
    this.actionFunctionName = 'handlePressMainActionBtnProduct';
    switch (product.product_type) {
      case PRODUCT_TYPES.NORMAL:
        this.handleBuy(product, cartType, this._addCart);
        break;
      case PRODUCT_TYPES.SERVICE:
        this.goToSchedule(product);
        break;
      default:
        this.handleBuy(product, cartType, this._addCart);
        break;
    }
  };

  handlePressSubAction = (product, cartType) => {
    this.actionFunctionName = 'handlePressSubAction';

    if (this.isServiceProduct(product)) {
      this._likeHandler(product);
      return;
    }

    switch (cartType) {
      case CART_TYPES.DROP_SHIP:
        this.handleDropShip(product, cartType);
        break;
      default:
        this._likeHandler(product);
        break;
    }
  };

  handlePressActionBtnProduct = (product, cartType) => {
    switch (cartType) {
      case CART_TYPES.NORMAL:
        this.handlePressMainActionBtnProduct(product, cartType);
        break;
      case CART_TYPES.DROP_SHIP:
        this.handlePressSubAction(product, cartType);
        break;
      default:
        this.handlePressMainActionBtnProduct(product, cartType);
        break;
    }
  };

  submitDropShip = (product, quantity, modalKey, newPrice) => {
    this.context.setState({isSubActionLoading: true});
    this._addCart(product, quantity, modalKey, newPrice, false);
  };

  handleDropShip = (product, cartType) => {
    this.handleBuy(product, cartType, this.submitDropShip, true);
  };

  handleBuy = (product, cartType, callBack = () => {}, isDropShip = false) => {
    if (this.isActionWillAddDifferentCartType(cartType)) {
      this.product = product;
      this.cartType = cartType;
      return;
    }

    if (product.has_attr || isDropShip) {
      Actions.push(appConfig.routes.itemAttribute, {
        isDropShip,
        itemId: product.id,
        product,
        onSubmit: (...args) => {
          Actions.pop();

          callBack(product, ...args);
        },
      });
    } else {
      // if (this.isActionWillAddDifferentCartType(cartType)) {
      //   this.saveProductTempData(product, 1, '', null);
      //   return;
      // }
      callBack(product);
    }
  };

  saveProductTempData = (...args) => {
    this.productTempData = [...args];
  };

  // add item vào giỏ hàng
  _addCart = (
    item,
    quantity = 1,
    model = '',
    newPrice = null,
    buying = true,
  ) => {
    this.context.setState(
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
        try {
          const response = await APIHandler.site_cart_plus(
            store.store_id,
            item.id,
            data,
          );

          if (response && response.status == STATUS_SUCCESS) {
            if (!this.context.unmounted && response.data.attrs) {
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
              buying: false,
              isSubActionLoading: false,
            });
          }
        }
      },
    );
  };

  _likeHandler(item) {
    this.context.setState(
      {
        like_loading: true,
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
                like_loading: false,
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
          }
        } catch (e) {
          console.log(e + ' site_like');
          flashShowMessage({
            type: 'danger',
            message: this.t('common:api.error.message'),
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
        if (this.product) {
          this[this.actionFunctionName](this.product, this.cartType);
        }
      }, 500);
    });
  };

  cancelConfirmCartType = () => {
    this.productTempData = [];
    this.product = null;
    this.cartType = '';
  };
}

export default CTAProduct;
