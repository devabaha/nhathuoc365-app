import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';
import store from '../store';

const touchedTabs = {};
let productOpening = false;

export default function handleTabBarOnPress(props) {
  // const isTouched = () => touchedTabs[props.navigation.state.key];
  switch (props.navigation.state.key) {
    case appConfig.routes.scanQrCodeTab:
      if (productOpening) return;
      productOpening = true;

      APIHandler.site_info(appConfig.defaultSiteId)
        .then(response => {
          if (response && response.status == STATUS_SUCCESS) {
            action(() => {
              store.setStoreData(response.data);
              Actions.push(appConfig.routes.store, {
                title: response.data.name
              });
            })();
          }
        })
        .finally(() => {
          productOpening = false;
        });
      break;
    default:
      props.defaultHandler();
  }

  store.setSelectedTab(props.navigation.state.key);
  touchedTabs[props.navigation.state.key] = true;
}
