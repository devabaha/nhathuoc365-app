import iconRada from './assets/images/icon_rada.png';
import iconScan from './assets/images/icon_scan.png';
import icon30day from './assets/images/icon_30day.png';

export const IMAGE_ICON_TYPE = 'image';

export const SERVICES_LIST = [
  {
    id: 1,
    icon: iconScan,
    iconType: IMAGE_ICON_TYPE,
    title: 'Quét Mã \n QR',
    serviceType: 'scan_qc_code',
    bgrColor: '#f63d27'
  },
  {
    id: 2,
    icon: 'cellphone',
    title: 'Nạp tiền\nđiện thoại',
    serviceType: 'phone_card',
    bgrColor: '#f63d27'
  },
  {
    id: 3,
    icon: iconRada,
    iconType: IMAGE_ICON_TYPE,
    title: 'Dịch vụ\nRada',
    serviceType: 'rada',
    bgrColor: '#008cfa'
  },
  {
    id: 4,
    icon: icon30day,
    iconType: IMAGE_ICON_TYPE,
    title: 'Đặt lịch\ngiữ chỗ',
    serviceType: 'booking',
    bgrColor: '#5a64eb'
  }
];

// ffc814 0f2d7d 008cfa 5a64eb

// f63d27 ee3737 dd0e2b ff7d2a
