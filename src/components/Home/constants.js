import appConfig from 'app-config';
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
    title: 'Tick Voucher',
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

export const SCAN_QR_CODE_TYPE = 'qrscan';
export const TOP_UP_PHONE_TYPE = 'up_to_phone';
export const VOUCHER_SERVICE_TYPE = 'list_voucher';
export const MY_VOUCHER_SERVICE_TYPE = 'my_voucher';
export const RADA_SERVICE_TYPE = 'rada_service';
export const BOOKING_30DAY_TYPE = '30day_service';
export const NEWS_SERVICE_TYPE = 'news';
export const ORDERS_SERVICE_TYPE = 'orders';
export const MY_ADDRESS_SERVICE_TYPE = 'my_address';

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
    icon: 'ticket-percent',
    title: 'Voucher\nGiảm giá',
    type: VOUCHER_SERVICE_TYPE,
    bgrColor: '#f63d27'
  },
  {
    id: 3,
    icon: 'ticket',
    title: 'Voucher\ncủa tôi',
    type: MY_VOUCHER_SERVICE_TYPE,
    bgrColor: '#f63d27'
  },
  {
    id: 4,
    icon: iconRada,
    iconType: IMAGE_ICON_TYPE,
    title: 'Dịch vụ\nRada',
    type: RADA_SERVICE_TYPE,
    bgrColor: '#008cfa'
  },
  {
    id: 5,
    icon: icon30day,
    iconType: IMAGE_ICON_TYPE,
    title: 'Đặt lịch\ngiữ chỗ',
    type: BOOKING_30DAY_TYPE,
    bgrColor: '#5a64eb'
  },
  {
    id: 6,
    icon: 'map-marker',
    title: 'Địa chỉ\ncủa tôi',
    type: MY_ADDRESS_SERVICE_TYPE,
    bgrColor: '#688efb'
  },
  {
    id: 7,
    icon: 'cellphone-text',
    title: 'Mua thẻ\nđiện thoại',
    type: TOP_UP_PHONE_TYPE,
    bgrColor: '#4267b2'
  },
  {
    id: 8,
    icon: 'newspaper',
    title: 'Tin tức',
    type: NEWS_SERVICE_TYPE,
    bgrColor: '#fcb309'
  },
  {
    id: 9,
    icon: 'cart',
    title: 'Đơn hàng',
    type: ORDERS_SERVICE_TYPE,
    bgrColor: appConfig.colors.primary
  }
];
