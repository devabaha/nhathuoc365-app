import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';

const touchedTabs = {};
export default function handleTabBarOnPress(props) {
  // const isTouched = () => touchedTabs[props.navigation.state.key];
  switch (props.navigation.state.key) {
    case appConfig.routes.scanQrCodeTab:
      Actions.push(appConfig.routes.qrBarCode, {
        title: props.t('screen.qrBarCode.mainTitle')
      });
      break;
    default:
      props.defaultHandler();
  }

  touchedTabs[props.navigation.state.key] = true;
}
