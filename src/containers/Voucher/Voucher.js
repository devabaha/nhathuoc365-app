import { StatusBar } from 'react-native';
import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';
import { Voucher as TickIDVoucher } from 'app-packages/tickid-voucher';

class Voucher extends TickIDVoucher {
  componentDidMount() {
    StatusBar.setBarStyle('dark-content');
  }

  componentWillUnmount() {
    StatusBar.setBarStyle('light-content');
  }

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
}

export default Voucher;
