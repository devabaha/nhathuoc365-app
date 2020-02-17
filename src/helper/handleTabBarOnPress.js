import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';
import store from 'app-store';

const touchedTabs = {};
const handleTabBarOnPress = props => {
  // const isTouched = () => touchedTabs[props.navigation.state.key];
  switch (props.navigation.state.key) {
    case appConfig.routes.scanQrCodeTab:
      Actions.push(appConfig.routes.qrBarCode, {
        title: 'Mã tài khoản'
      });
      break;
    default:
      props.defaultHandler();
  }

  store.setSelectedTab(props.navigation.state.key);
  touchedTabs[props.navigation.state.key] = true;
};

export default handleTabBarOnPress;
