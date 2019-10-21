import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';
import { MyVoucher as TickIDMyVoucher } from 'app-packages/tickid-voucher';

class MyVoucher extends TickIDMyVoucher {
  handlePressVoucher = voucher => {
    Actions.push(appConfig.routes.voucherDetail, {
      voucherId: voucher.data.id,
      title: voucher.data.title
    });
  };
  handlePressEnterVoucher = () => {
    Actions.push(appConfig.routes.voucherScanner, {
      placeholder: 'Nhập mã Voucher',
      topContentText:
        'Hướng máy ảnh của bạn về phía mã QR Code để nhận voucher',
      isFromMyVoucher: true,
      refreshMyVoucher: () => {
        this.getMyVouchers();
      }
    });
  };
}

export default MyVoucher;
