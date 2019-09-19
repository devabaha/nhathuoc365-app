import iconRada from './assets/images/icon_rada.png';
import iconScan from './assets/images/icon_scan.png';
import icon30day from './assets/images/icon_30day.png';
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

export const SCAN_QR_CODE_TYPE = 'SCAN_QR_CODE_TYPE';
export const TOP_UP_PHONE_TYPE = 'TOP_UP_PHONE_TYPE';
export const RADA_SERVICE_TYPE = 'RADA_SERVICE_TYPE';
export const BOOKING_30DAY_TYPE = 'BOOKING_30DAY_TYPE';

export const SERVICES_LIST = [
  {
    id: 1,
    icon: iconScan,
    iconType: IMAGE_ICON_TYPE,
    title: 'Quét Mã \n QR',
    type: SCAN_QR_CODE_TYPE,
    bgrColor: '#f63d27'
  },
  {
    id: 2,
    icon: 'cellphone',
    title: 'Nạp tiền\nđiện thoại',
    type: TOP_UP_PHONE_TYPE,
    bgrColor: '#f63d27'
  },
  {
    id: 3,
    icon: iconRada,
    iconType: IMAGE_ICON_TYPE,
    title: 'Dịch vụ\nRada',
    type: RADA_SERVICE_TYPE,
    bgrColor: '#008cfa'
  },
  {
    id: 4,
    icon: icon30day,
    iconType: IMAGE_ICON_TYPE,
    title: 'Đặt lịch\ngiữ chỗ',
    type: BOOKING_30DAY_TYPE,
    bgrColor: '#5a64eb'
  }
];
