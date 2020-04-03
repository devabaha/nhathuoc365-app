import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';
import { Alert } from 'react-native';
import Communications from 'react-native-communications';
import store from 'app-store';

export const servicesHandler = (service, t) => {
  switch (service.type) {
    case 'ACCUMULATE_POINTS_TYPE':
      Actions.push(appConfig.routes.qrBarCode, {
        title: t('common:screen.qrBarCode.mainTitle')
      });
      break;
    case 'MY_VOUCHER_TYPE':
    case 'my_voucher':
      Actions.push(appConfig.routes.myVoucher, {
        title: t('common:screen.myVoucher.mainTitle'),
        from: 'home'
      });
      break;
    case 'TRANSACTION_TYPE':
      Actions.vnd_wallet({
        title: store.user_info.default_wallet.name,
        wallet: store.user_info.default_wallet
      });
      break;
    case 'STORE_ORDERS_TYPE':
      Actions.push(appConfig.routes.storeOrders, {
        tel: service.tel,
        title: service.site_name,
        store_id: service.store_id
      });
      break;
    case 'ORDERS_TYPE':
      Actions.jump(appConfig.routes.ordersTab);
      break;
    case 'QRCODE_SCAN_TYPE':
    case 'qrscan':
      Actions.push(appConfig.routes.qrBarCode, {
        index: 1,
        title: t('common:screen.qrBarCode.scanTitle'),
        wallet: store.user_info.default_wallet
      });
      break;
    case 'up_to_phone':
      Actions.push(appConfig.routes.upToPhone, {
        service_type: service.type,
        service_id: service.id,
        indexTab: service.tab,
        title: service.name,
        serviceId: service.serviceId ? service.serviceId : 100
      });
      break;
    case 'list_voucher':
      Actions.push(appConfig.routes.mainVoucher, {
        from: 'home'
      });
      break;
    case '30day_service':
      Alert.alert(
        'Thông báo',
        'Chức năng đặt lịch giữ chỗ 30DAY tới các cửa hàng đang được phát triển.',
        [{ text: 'Đồng ý' }]
      );
      break;
    case 'my_address':
      Actions.push(appConfig.routes.myAddress, {
        from_page: 'account'
      });
      break;
    case 'news':
      Actions.jump(appConfig.routes.newsTab);
      break;
    case 'orders':
      Actions.jump(appConfig.routes.ordersTab);
      break;
    case 'chat_noti':
      Actions.amazing_chat({
        titleStyle: { width: 220 },
        phoneNumber: service.tel,
        title: service.site_name,
        site_id: service.site_id,
        user_id: service.user_id
      });
      break;
    case 'list_chat':
      Actions.list_amazing_chat({
        titleStyle: { width: 220 }
      });
      break;
    case 'open_shop':
      APIHandler.site_info(service.siteId).then(response => {
        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setStoreData(response.data);
            Actions.push(appConfig.routes.store, {
              title: service.name || response.data.name,
              categoryId: service.categoryId || 0
            });
          })();
        }
      });
      break;
    case 'call':
      Communications.phonecall(service.tel, true);
      break;
    case 'news_category':
      Actions.push(appConfig.routes.notifies, {
        title: service.title,
        news_type: `/${service.categoryId}`
      });
      break;

    //---- detail ----
    case 'order_detail':
      store.setDeepLinkData({ id: service.id });
      Actions.push(appConfig.routes.deepLinkOrdersTab);
      break;
    case 'voucher_detail':
      store.setDeepLinkData({ id: service.id });
      Actions.push(appConfig.routes.mainVoucher, {
        from: 'deeplink'
      });
      break;
    case 'news_detail':
      store.setDeepLinkData({ id: service.id });
      Actions.push(appConfig.routes.deepLinkNewsTab);
      break;
    case 'product_detail':
      APIHandler.site_info(service.siteId).then(response => {
        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setDeepLinkData({ id: service.productId });
            store.setStoreData(response.data);
            Actions.push(appConfig.routes.store, {
              title: service.name || response.data.name,
              goCategory: service.categoryId || 0
            });
          })();
        }
      });
      break;
    case 'my_voucher_detail':
      store.setDeepLinkData({ id: service.id });
      Actions.push(appConfig.routes.myVoucher, {
        title: t('common:screen.myVoucher.mainTitle'),
        from: 'home',
        onUseVoucherOnlineSuccess: handleUseVoucherOnlineSuccess,
        onUseVoucherOnlineFailure: () => {}
      });
      break;
    case 'affiliate':
      store.setReferCode(service.refer_code);
      break;
    default:
      // Alert.alert('Thông báo', 'Chức năng đặt đang được phát triển.', [
      //   { text: 'Đồng ý' }
      // ]);
      break;
  }
};

handleUseVoucherOnlineSuccess = (cartData, fromDetailVoucher = false) => {
  Actions.pop();
  if (fromDetailVoucher) {
    setTimeout(Actions.pop, 0);
  }
  action(() => {
    store.setCartData(cartData);
  })();
};
