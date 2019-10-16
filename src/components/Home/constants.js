import iconWallet from './assets/images/icon_wallet.png';
import iconVoucher from './assets/images/icon_voucher.png';
import iconTransaction from './assets/images/icon_transaction.png';

/**
 * PRIMARY ACTIONS CONST
 */
export const ACCUMULATE_POINTS_TYPE = 'ACCUMULATE_POINTS_TYPE';
export const MY_VOUCHER_TYPE = 'MY_VOUCHER_TYPE';
export const TRANSACTION_TYPE = 'TRANSACTION_TYPE';

export const PRIMARY_ACTIONS = [
  {
    title: 'Tích điểm',
    icon: iconWallet,
    iconOriginSize: {
      width: 142,
      height: 136
    },
    type: ACCUMULATE_POINTS_TYPE
  },
  {
    title: 'Voucher của tôi',
    icon: iconVoucher,
    iconOriginSize: {
      width: 152,
      height: 136
    },
    type: MY_VOUCHER_TYPE
  },
  {
    title: 'Giao dịch',
    icon: iconTransaction,
    iconOriginSize: {
      width: 118,
      height: 136
    },
    type: TRANSACTION_TYPE
  }
];

/**
 * SERVICES CONST
 */
export const IMAGE_ICON_TYPE = 'image';
