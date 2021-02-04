import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';
import store from 'app-store';
import {CART_TYPES} from 'src/constants/cart';
import {PRODUCT_TYPES} from 'src/constants';

const ITEM_KEY = 'ItemKey';
const CONTINUE_ORDER_CONFIRM = 'Tiếp tục';
const CART_HAS_ONLY_NORMAL_MESSAGE = `• Đơn hàng của bạn đang chứa sản phẩm thông thường.\r\n\r\n• Đơn hàng chỉ có thể chứa các sản phẩm cùng loại.\r\n\r\n• Chọn ${CONTINUE_ORDER_CONFIRM} để xóa đơn hàng hiện tại và tạo đơn hàng mới cho loại sản phẩm này.`;
const CART_HAS_ONLY_DROP_SHIP_MESSAGE = `• Đơn hàng của bạn đang chứa sản phẩm giao hộ.\r\n\r\n• Đơn hàng chỉ có thể chứa các sản phẩm cùng loại.\r\n\r\n• Chọn ${CONTINUE_ORDER_CONFIRM} để xóa đơn hàng hiện tại và tạo đơn hàng mới cho loại sản phẩm này.`;

class CTAProduct {
  productTempData = [];
  t = () => {};
  context = this;

  constructor(t, context) {
    this.t = t;
    this.context = context;
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
        let modalTitle = '';
        switch (cartData.cart_type) {
          case CART_TYPES.NORMAL:
            modalTitle = CART_HAS_ONLY_NORMAL_MESSAGE;
            break;
          case CART_TYPES.DROP_SHIP:
            modalTitle = CART_HAS_ONLY_DROP_SHIP_MESSAGE;
            break;
        }

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
    this.context.setState({is_drop_ship_loading: true});
    this._addCart(product, quantity, modalKey, newPrice, false);
  };

  handleDropShip = (product, cartType) => {
    this.handleBuy(product, cartType, this.submitDropShip, true);
  };

  handleBuy = (product, cartType, callBack = () => {}, isDropShip = false) => {
    if (product.attrs || isDropShip) {
      Actions.push(appConfig.routes.itemAttribute, {
        isDropShip,
        itemId: product.id,
        product,
        onSubmit: (...args) => {
            Actions.pop();
            if (this.isActionWillAddDifferentCartType(cartType)) {
            this.saveProductTempData(product, ...args, false);
            return;
          }
          callBack(product, ...args);
        },
      });
    } else {
      if (this.isActionWillAddDifferentCartType(cartType)) {
        this.saveProductTempData(product, 1, '', null);
        return;
      }
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
              is_drop_ship_loading: false,
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
            this.context.state.like_flag == 1 ? 0 : 1,
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
      if (this.productTempData.length > 0) {
        this._addCart(...this.productTempData);
      }
    });
  };

  cancelConfirmCartType = () => {
    this.productTempData = [];
  };
}

export default CTAProduct;
