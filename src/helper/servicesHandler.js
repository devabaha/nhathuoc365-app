import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';
import { Alert } from 'react-native';
import Communications from 'react-native-communications';
import store from 'app-store';

export const servicesHandler = service => {
  switch (service.type) {
    case SERVICES_TYPE.ACCUMULATE_POINTS:
      Actions.push(appConfig.routes.qrBarCode, {
        title: 'Mã tài khoản'
      });
      break;
    case SERVICES_TYPE.MY_VOUCHER:
      Actions.push(appConfig.routes.myVoucher, {
        title: 'Voucher của tôi',
        from: 'home'
      });
      break;
    case SERVICES_TYPE.TRANSACTION:
      Actions.vnd_wallet({
        title: store.user_info.default_wallet.name,
        wallet: store.user_info.default_wallet
      });
      break;
    case SERVICES_TYPE.STORE_ORDERS:
      Actions.push(appConfig.routes.storeOrders, {
        tel: service.tel,
        title: service.site_name,
        store_id: service.store_id
      });
      break;
    case SERVICES_TYPE.ORDERS:
      Actions.jump(appConfig.routes.ordersTab);
      break;
    case SERVICES_TYPE.QRCODE_SCAN:
      Actions.push(appConfig.routes.qrBarCode, {
        index: 1,
        title: 'Quét QR Code',
        wallet: store.user_info.default_wallet
      });
      break;
    case SERVICES_TYPE.UP_TO_PHONE:
      Actions.push(appConfig.routes.upToPhone, {
        service_type: service.type,
        service_id: service.id,
        indexTab: service.tab,
        title: service.name,
        serviceId: service.serviceId ? service.serviceId : 100
      });
      break;
    case SERVICES_TYPE.LIST_VOUCHER:
      Actions.push(appConfig.routes.mainVoucher, {
        from: 'home'
      });
      break;
    case SERVICES_TYPE.RADA_SERVICE:
      Actions.push('tickidRada', {
        service_type: service.type,
        service_id: service.id,
        title: 'Dịch vụ Rada',
        onPressItem: item => {
          this.handleCategoryPress(item);
        }
      });
      break;
    case SERVICES_TYPE._30DAY_SERVICE:
      Alert.alert(
        'Thông báo',
        'Chức năng đặt lịch giữ chỗ 30DAY tới các cửa hàng đang được phát triển.',
        [{ text: 'Đồng ý' }]
      );
      break;
    case SERVICES_TYPE.MY_ADDRESS:
      Actions.push(appConfig.routes.myAddress, {
        from_page: 'account'
      });
      break;
    case SERVICES_TYPE.NEWS:
      Actions.jump(appConfig.routes.newsTab);
      break;
    case SERVICES_TYPE.ORDERS_TAB:
      Actions.jump(appConfig.routes.ordersTab);
      break;
    case SERVICES_TYPE.CHAT_NOTI:
      Actions.amazing_chat({
        titleStyle: { width: 220 },
        phoneNumber: service.tel,
        title: service.site_name,
        site_id: service.site_id,
        user_id: service.user_id
      });
      break;
    case SERVICES_TYPE.LIST_CHAT:
      Actions.list_amazing_chat({
        titleStyle: { width: 220 }
      });
      break;
    case SERVICES_TYPE.OPEN_SHOP:
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
    case SERVICES_TYPE.CALL:
      Communications.phonecall(service.tel, true);
      break;
    case SERVICES_TYPE.NEWS_CATEGORY:
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
        title: 'Voucher của tôi',
        from: 'home',
        onUseVoucherOnlineSuccess: handleUseVoucherOnlineSuccess,
        onUseVoucherOnlineFailure: () => {}
      });
      break;
    default:
      // Alert.alert('Thông báo', 'Chức năng đặt đang được phát triển.', [
      //   { text: 'Đồng ý' }
      // ]);
      break;
  }
};

export const SERVICES_TYPE = {
  ACCUMULATE_POINTS: 'ACCUMULATE_POINTS_TYPE',
  MY_VOUCHER: 'my_voucher',
  TRANSACTION: 'TRANSACTION_TYPE',
  STORE_ORDERS: 'STORE_ORDERS_TYPE',
  ORDERS: 'ORDERS_TYPE',
  QRCODE_SCAN: 'qrscan',
  UP_TO_PHONE: 'up_to_phone',
  LIST_VOUCHER: 'list_voucher',
  RADA_SERVICE: 'rada_service',
  _30DAY_SERVICE: '30day_service',
  MY_ADDRESS: 'my_address',
  NEWS: 'news',
  ORDERS_TAB: 'orders',
  CHAT_NOTI: 'chat_noti',
  LIST_CHAT: 'list_chat',
  OPEN_SHOP: 'open_shop',
  CALL: 'call',
  NEWS_CATEGORY: 'news_category'
};
