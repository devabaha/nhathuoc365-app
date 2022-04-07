import appConfig from 'app-config';
import store from '../store';
import {servicesHandler, SERVICES_TYPE} from './servicesHandler';

const touchedTabs = {};
let productOpening = false;

export default function handleTabBarOnPress(props) {
  const sceneKey = props.routeName || props.navigation?.state?.key;
  // const isTouched = () => touchedTabs[sceneKey];
  switch (sceneKey) {
    case appConfig.routes.scanQrCodeTab:
      if (productOpening) return;
      productOpening = true;

      const service = {
        type: SERVICES_TYPE.OPEN_SHOP,
        theme: props.theme,
        siteId: store.store_id || appConfig.defaultSiteId,
      };
      servicesHandler(service, null, () => {
        setTimeout(() => (productOpening = false), 500);
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

  store.setSelectedTab(sceneKey);
  touchedTabs[sceneKey] = true;
}
