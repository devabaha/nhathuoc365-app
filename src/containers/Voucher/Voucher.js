import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';
import { Voucher as TickIDVoucher } from 'app-packages/tickid-voucher';

class Voucher extends TickIDVoucher {
  handlePressVoucher = voucher => {
    Actions.push(appConfig.routes.voucherDetail, {
      voucher,
      title: '[Loyal Tea] Giảm 30% menu toàn bộ đồ uống'
    });
  };

  handlePressMyVoucher = () => {
    Actions.push(appConfig.routes.myVoucher, {
      title: 'Voucher của tôi'
    });
  };

  handlePressSelectProvince = ({ setProvince, provinceSelected }) => {
    Actions.push(appConfig.routes.voucherSelectProvince, {
      provinceSelected: provinceSelected,
      onSelectProvince: setProvince,
      onClose: Actions.pop
    });
  };
}

export default Voucher;
