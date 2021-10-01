import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';
import {ORDER_TYPES} from 'src/constants';
import {CART_PAYMENT_STATUS, CART_PAYMENT_TYPES} from 'src/constants/cart';

export const isOutOfStock = (product = {}) => {
  return (
    (!Number(product.inventory) &&
      !isConfigActive(CONFIG_KEY.ALLOW_SITE_SALE_OUT_INVENTORY_KEY)) ||
    (!!product.sale_in_stock && product.order_type !== ORDER_TYPES.BOOKING)
  );
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
