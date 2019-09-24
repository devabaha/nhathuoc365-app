import config from './config';
import configure from './helper/configure';

/**
 * Initializes config for Voucher module
 * @param {} newConfig
 */
export const initialize = (newConfig = {}) => {
  configure(config, newConfig);
};

// ------------------------------ PUBLIC COMPONENTS ------------------------------ //
export { default as Voucher } from './container/Voucher';
export { default as MyVoucher } from './container/MyVoucher';
export { default as VoucherDetail } from './container/VoucherDetail';
export { default as SelectProvince } from './container/SelectProvince';

// ------------------------------ PUBLIC CONFIG ------------------------------ //
export { default as config } from './config';
