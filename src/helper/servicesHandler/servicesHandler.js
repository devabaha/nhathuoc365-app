import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';
import { Alert, Linking } from 'react-native';
import Communications from 'react-native-communications';
import store from 'app-store';

import { SERVICES_TYPE } from './types';
import {
  handleUseVoucherOnlineSuccess,
  handleUseVoucherOnlineFailure
} from './voucherHandler';
import {
  handleCategoryPress,
  handleServicePress,
  handleOrderHistoryPress
} from './radaHandler';

/**
 * A powerful handler for all app's services.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module servicesHandler
 *
 * @typedef {Object} Service - an abstract for all kind of services.
 * @property {string} type - type of a service.
 * @property {*} others - any other param(s) for specific case.
 */

/**
 *
 * @param {Service} service
 * @param {Object} t - i18n data
 * @callback callBack - a trigger when needed for specific case.
 */
export const servicesHandler = (service, t, callBack = () => {}) => {
  switch (service.type) {
    /** RADA */
    case SERVICES_TYPE.RADA_SERVICE_DETAIL:
      const radaService = {
        id: service.id,
        name: service.name
      };
      handleServicePress(radaService, t);
      break;
    case SERVICES_TYPE.RADA_LIST_SERVICE:
      const radaCategory = {
        id: service.id,
        name: service.name
      };
      handleCategoryPress(radaCategory, t);
      break;
    case SERVICES_TYPE.RADA_SERVICE:
      Actions.push('tickidRada', {
        service_type: service.type,
        service_id: service.id,
        title: t('common:screen.rada.mainTitle'),
        onPressItem: item => {
          handleCategoryPress(item, t);
        },
        onPressOrderHistory: item => {
          handleOrderHistoryPress(item, t);
        }
      });
      break;

    /** BEEHOME */
    case SERVICES_TYPE.BEEHOME_SERVICE_TYPE:
      Actions.jump(appConfig.routes.listBuilding);
      break;
    case SERVICES_TYPE.BEEHOME_BUILDING:
      Actions.push(appConfig.routes.building, {
        siteId: service.id
      });
      break;
    case SERVICES_TYPE.BEEHOME_ROOM:
      Actions.push(appConfig.routes.room, {
        roomId: service.room_id,
        siteId: service.site_id,
        title: service.title
      });
      break;
    case SERVICES_TYPE.BEEHOME_BILLS_PAYMENT:
      Actions.push(appConfig.routes.billsPaymentList, {
        site_id: service.site_id,
        room_id: service.room_id,
        rootSceneKey: service.sceneKey
      });
      break;
    case SERVICES_TYPE.BEEHOME_LIST_BILL:
      /**
       * @type {Object}
       * @property {(number|string)} siteId
       * @property {(number|string)} roomId
       * @property {number} index - tab index in list bill
       */
      const billData = {
        siteId: service.site_id,
        roomId: service.room_id,
        index: service.index // 0: list bill, 1: list receipt
      };
      Actions.push(appConfig.routes.bills, billData);
      break;
    case SERVICES_TYPE.BEEHOME_LIST_REQUEST:
      Actions.push(appConfig.routes.requests, {
        siteId: service.site_id,
        roomId: service.room_id
      });
      break;
    case SERVICES_TYPE.BEEHOME_REQUEST:
      Actions.push(appConfig.routes.requestDetail, {
        siteId: service.site_id,
        roomId: service.room_id,
        requestId: service.request_id,
        title: service.title
      });
      break;
    case SERVICES_TYPE.BEEHOME_ROOM_CHAT:
      Actions.push(appConfig.routes.amazing_chat, {
        site_id: service.site_id,
        user_id: service.user_id,
        phoneNumber: service.tel,
        title: service.site_name
      });
      break;
    case SERVICES_TYPE.BEEHOME_ROOM_USER:
      Actions.push(appConfig.routes.members, {
        siteId: service.site_id,
        roomId: service.room_id,
        ownerId: service.user_id
      });
      break;

    /** EXTERNAL LINK */
    case SERVICES_TYPE.EXTERNAL_LINK:
      Linking.openURL(service.link).catch(err => {
        console.log('open_external_link', err);
        Alert.alert(t('common:link.error.message'));
      });
      break;

    /** QRBARCODE */
    case SERVICES_TYPE.ACCUMULATE_POINTS:
      Actions.push(appConfig.routes.qrBarCode, {
        title: t('common:screen.qrBarCode.mainTitle')
      });
      break;
    case SERVICES_TYPE.QRCODE_SCAN:
      Actions.push(appConfig.routes.qrBarCode, {
        index: 1,
        title: t('common:screen.qrBarCode.scanTitle'),
        wallet: store.user_info.default_wallet
      });
      break;

    /** VOUCHER */
    case SERVICES_TYPE.LIST_VOUCHER:
      Actions.push(appConfig.routes.mainVoucher, {
        from: 'home'
      });
      break;
    case SERVICES_TYPE.MY_VOUCHER:
      Actions.push(appConfig.routes.myVoucher, {
        title: t('common:screen.myVoucher.mainTitle'),
        from: 'home'
      });
      break;
    case SERVICES_TYPE.MY_VOUCHER_DETAIL:
      store.setDeepLinkData({ id: service.id });
      Actions.push(appConfig.routes.myVoucher, {
        title: t('common:screen.myVoucher.mainTitle'),
        from: 'home',
        onUseVoucherOnlineSuccess: handleUseVoucherOnlineSuccess,
        onUseVoucherOnlineFailure: handleUseVoucherOnlineFailure
      });
      break;
    case SERVICES_TYPE.VOUCHER_DETAIL:
      store.setDeepLinkData({ id: service.id });
      Actions.push(appConfig.routes.mainVoucher, {
        from: 'deeplink'
      });
      break;

    /** TRANSACTION */
    case SERVICES_TYPE.TRANSACTION:
      Actions.vnd_wallet({
        title: store.user_info.default_wallet.name,
        wallet: store.user_info.default_wallet
      });
      break;

    /** ORDER */
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
    case SERVICES_TYPE.ORDERS_TAB:
      Actions.jump(appConfig.routes.ordersTab);
      break;
    case SERVICES_TYPE.ORDER_DETAIL:
      store.setDeepLinkData({ id: service.id });
      Actions.push(appConfig.routes.deepLinkOrdersTab);
      break;

    /** TICKID-PHONE-CARD */
    case SERVICES_TYPE.UP_TO_PHONE:
      Actions.push(appConfig.routes.upToPhone, {
        service_type: service.type,
        service_id: service.id,
        indexTab: service.tab,
        title: service.name,
        serviceId: service.serviceId ? service.serviceId : 100
      });
      break;

    /** 30DAY */
    case SERVICES_TYPE._30DAY_SERVICE:
      Alert.alert(
        'Thông báo',
        'Chức năng đặt lịch giữ chỗ 30DAY tới các cửa hàng đang được phát triển.',
        [{ text: 'Đồng ý' }]
      );
      break;

    /** ACCOUNT */
    /** Address */
    case SERVICES_TYPE.MY_ADDRESS:
      Actions.push(appConfig.routes.myAddress, {
        from_page: 'account'
      });
      break;

    /** NEWS */
    case SERVICES_TYPE.NEWS:
      Actions.jump(appConfig.routes.newsTab);
      break;
    case SERVICES_TYPE.NEWS_DETAIL:
      Actions.notify_item({
        title: service.news.title,
        data: service.news
      });
      break;
    case SERVICES_TYPE.NEWS_CATEGORY:
      Actions.push(appConfig.routes.notifies, {
        title: service.title,
        news_type: `/${service.categoryId}`
      });
      break;

    /** CHAT */
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

    /** STORE */
    case SERVICES_TYPE.OPEN_SHOP:
      APIHandler.site_info(service.siteId)
        .then(response => {
          if (response && response.status == STATUS_SUCCESS) {
            action(() => {
              store.setStoreData(response.data);
              Actions.push(appConfig.routes.store, {
                title: service.name || response.data.name,
                categoryId: service.categoryId || 0
              });
            })();
          }
        })
        .finally(callBack);
      break;

    /** COMMUNICATION */
    case SERVICES_TYPE.CALL:
      Communications.phonecall(service.tel, true);
      break;

    /** PRODUCT */
    case SERVICES_TYPE.PRODUCT_DETAIL:
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

    /** AFFILIATE */
    case SERVICES_TYPE.AFFILIATE:
      store.setReferCode(service.refer_code);
      break;
    default:
      // Alert.alert('Thông báo', 'Chức năng sắp ra mắt, hãy cùng chờ đón nhé.', [
      //   { text: 'Đồng ý' }
      // ]);
      break;
  }
};
