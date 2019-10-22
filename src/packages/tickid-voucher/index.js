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
export { default as ScanScreen } from './container/ScanScreen';
export { default as ShowBarcode } from './container/ShowBarcode';
export { default as VoucherDetail } from './container/VoucherDetail';
export { default as SelectProvince } from './container/SelectProvince';
export { default as AlreadyVoucher } from './container/AlreadyVoucher';
export { default as EnterCodeManual } from './container/EnterCodeManual';

// ------------------------------ PUBLIC CONFIG ------------------------------ //
export { default as config } from './config';

export { USE_ONLINE } from './constants';
