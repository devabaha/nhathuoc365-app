import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';
import {ORDER_TYPES} from 'src/constants';
import { CART_PAYMENT_STATUS } from 'src/constants/cart';

export const isOutOfStock = (product = {}) => {
  return (
    !product.inventory &&
    !isConfigActive(CONFIG_KEY.ALLOW_SITE_SALE_OUT_INVENTORY_KEY) &&
    product.order_type !== ORDER_TYPES.BOOKING
  );
};

export const isUnpaid = (cartData = {}) => {
  return (
    cartData.payment_status === null ||
    cartData.payment_status === undefined ||
    cartData.payment_status === CART_PAYMENT_STATUS.UNPAID
  );
};
