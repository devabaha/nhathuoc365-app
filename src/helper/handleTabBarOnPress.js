import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';
import store from '../store';
import { servicesHandler, SERVICES_TYPE } from './servicesHandler';

const touchedTabs = {};
let productOpening = false;

function handleTabBarOnPress(props) {
  // const isTouched = () => touchedTabs[props.navigation.state.key];
  switch (props.navigation.state.key) {
    case appConfig.routes.scanQrCodeTab:
      if (productOpening) return;
      productOpening = true;

      const service = {
        type: SERVICES_TYPE.OPEN_SHOP,
        siteId: store.store_id || appConfig.defaultSiteId
      };
      servicesHandler(service, null, () => {
        productOpening = false;
      });

      // APIHandler.site_info(store.store_id || appConfig.defaultSiteId)
      //   .then(response => {
      //     if (response && response.status == STATUS_SUCCESS) {
      //       action(() => {
      //         store.setStoreData(response.data);
      //         Actions.push(appConfig.routes.store, {
      //           title: response.data.name
      //         });
      //       })();
      //     }
      //   })
      //   .finally(() => {
      //     productOpening = false;
      //   });
      break;
    default:
      props.defaultHandler();
  }

  store.setSelectedTab(props.navigation.state.key);
  touchedTabs[props.navigation.state.key] = true;
};

export default handleTabBarOnPress;
