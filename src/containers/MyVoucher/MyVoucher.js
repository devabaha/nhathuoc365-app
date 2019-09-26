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
}

export default MyVoucher;
