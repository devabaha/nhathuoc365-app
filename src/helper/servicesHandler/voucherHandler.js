import { Actions } from 'react-native-router-flux';

/**
 * A group of functions to handler voucher jobs.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module servicesHandler/voucherHandler
 */

/**
 * Re-set cartData when voucher use by online way success.
 *
 * @method
 * @param {Object} cartData
 * @param {boolean} [fromDetailVoucher=false]
 */
export function handleUseVoucherOnlineSuccess(
  cartData,
  fromDetailVoucher = false
) {
  Actions.pop();
  if (fromDetailVoucher) {
    setTimeout(Actions.pop, 0);
  }
  action(() => {
    store.setCartData(cartData);
  })();
}

/**
 * Nothing to do.
 *
 * @version 1.0
 */
export function handleUseVoucherOnlineFailure() {}
