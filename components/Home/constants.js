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
    service_id: 0
  },
  {
    id: 2,
    iconName: _drawerIconPhoneCard,
    title: 'Nạp tiền\nđiện thoại',
    service_type: 'phone_card',
    service_id: 1
  },
  {
    id: 3,
    iconName: _drawerIconRada,
    title: 'Dịch vụ\nRada',
    service_type: 'rada',
    service_id: 3
  },
  {
    id: 4,
    iconName: _drawerIconPayBill,
    title: 'Đặt lịch\ngiữ chỗ',
    service_type: 'booking',
    service_id: 3
  }
];
