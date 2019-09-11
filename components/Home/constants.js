import _drawerIconScanQrcode from '../../images/scan_qrcode.png';
import _drawerIconPhoneCard from '../../images/phone_card.png';
import _drawerIconRada from '../../images/icon_rada.png';
import _drawerIconPayBill from '../../images/pay_bill.png';

export const SERVICES_LIST = [
  {
    id: 1,
    iconName: _drawerIconScanQrcode,
    title: 'Quét Mã \n QR',
    service_type: 'scan_qc_code',
    service_id: 0,
    bgrColor: '#ffc814'
  },
  {
    id: 2,
    iconName: _drawerIconPhoneCard,
    title: 'Nạp tiền\nđiện thoại',
    service_type: 'phone_card',
    service_id: 1,
    bgrColor: '#0f2d7d'
  },
  {
    id: 3,
    iconName: _drawerIconRada,
    title: 'Dịch vụ\nRada',
    service_type: 'rada',
    service_id: 3,
    bgrColor: '#008cfa'
  },
  {
    id: 4,
    iconName: _drawerIconPayBill,
    title: 'Đặt lịch\ngiữ chỗ',
    service_type: 'booking',
    service_id: 3,
    bgrColor: '#5a64eb'
  }
];

// f63d27 ee3737 dd0e2b ff7d2a
