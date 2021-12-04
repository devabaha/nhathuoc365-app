import {Actions} from 'react-native-router-flux';

import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';
import {ORDER_TYPES} from 'src/constants';
import {CART_PAYMENT_STATUS, CART_PAYMENT_TYPES} from 'src/constants/cart';
import appConfig from 'app-config';
import store from 'app-store';

export const isOutOfStock = (product = {}) => {
  return (
    !Number(product.inventory) &&
    (!isConfigActive(CONFIG_KEY.ALLOW_SITE_SALE_OUT_INVENTORY_KEY) ||
      !!product.sale_in_stock) &&
    product.order_type !== ORDER_TYPES.BOOKING
  );
};

export const hasVideo = (product = {}) => {
  return !!product.video;
};

export const isUnpaid = (cartData = {}) => {
  return (
    cartData.payment_status === null ||
    cartData.payment_status === undefined ||
    cartData.payment_status === CART_PAYMENT_STATUS.UNPAID
  );
};

export const isPaid = (cartData = {}) => {
  return cartData.payment_status === CART_PAYMENT_STATUS.PAID;
};

export const canTransaction = (cartData = {}) => {
  return (
    cartData.cart_payment_type === CART_PAYMENT_TYPES.PAY && isUnpaid(cartData)
  );
};

export const goConfirm = () => {
  if (store.cart_data && store.cart_products) {
    if (store.cart_data.address_id != 0) {
      setTimeout(() =>
        Actions.push(appConfig.routes.paymentConfirm, {
          goConfirm: true,
        }),
        200
      );
    } else if (isConfigActive(CONFIG_KEY.PICK_UP_AT_THE_STORE_KEY)) {
      Actions.push(appConfig.routes.myAddress, {
        redirect: 'confirm',
        goBack: true,
        isVisibleStoreAddress: true,
      });
    } else {
      Actions.create_address({
        redirect: 'confirm',
      });
    }
  } else {
    Actions.push(appConfig.routes.ordersTab);
  }
};
