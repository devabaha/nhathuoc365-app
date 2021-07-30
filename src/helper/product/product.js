import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';
import {PRODUCT_TYPES} from 'src/constants';

export const isOutOfStock = (product) => {
  return (
    !product.inventory &&
    !isConfigActive(CONFIG_KEY.ALLOW_SITE_SALE_OUT_INVENTORY_KEY) &&
    product.product_type !== PRODUCT_TYPES.SERVICE
  );
};
