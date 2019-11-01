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
export { default } from './container/PhoneCard';
export { default as Contact } from './container/Contact';
export { default as CardHistory } from './container/CardHistory';
export { default as BuyCardConfirm } from './container/BuyCardConfirm';
export { default as BuyCardSuccess } from './container/BuyCardSuccess';

// ------------------------------ PUBLIC CONFIG ------------------------------ //
export { default as config } from './config';
