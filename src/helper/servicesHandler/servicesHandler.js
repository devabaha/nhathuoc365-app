import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';
import {Alert, Linking} from 'react-native';
import Communications from 'react-native-communications';
import store from 'app-store';

import {SERVICES_TYPE} from './types';
import {GPS_TYPE} from 'src/constants'
import {
  handleUseVoucherOnlineSuccess,
  handleUseVoucherOnlineFailure,
} from './voucherHandler';
import {
  handleCategoryPress,
  handleServicePress,
  handleOrderHistoryPress,
} from './radaHandler';
import i18n from 'src/i18n';

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
  if (!service || !service.type) return;
  const commonT = i18n.getFixedT(undefined, 'common');
  if (!t) {
    t = commonT;
  }

  switch (service.type) {
    /** RADA */
    case SERVICES_TYPE.RADA_SERVICE_DETAIL:
      const radaService = {
        id: service.id,
        name: service.name,
      };
      handleServicePress(radaService, t);
      break;
    case SERVICES_TYPE.RADA_LIST_SERVICE:
      const radaCategory = {
        id: service.id,
        name: service.name,
      };
      handleCategoryPress(radaCategory, t);
      break;
    case SERVICES_TYPE.RADA_SERVICE:
      Actions.push('tickidRada', {
        service_type: service.type,
        service_id: service.id,
        title: t('common:screen.rada.mainTitle'),
        onPressItem: (item) => {
          handleCategoryPress(item, t);
        },
        onPressOrderHistory: (item) => {
          handleOrderHistoryPress(item, t);
        },
      });
      break;

    /** EXTERNAL LINK */
    case SERVICES_TYPE.EXTERNAL_LINK:
      Linking.openURL(service.link).catch((err) => {
        console.log('open_external_link', err);
        Alert.alert(t('common:link.error.message'));
      });
      break;
    case SERVICES_TYPE.WEBVIEW:
      Actions.push(appConfig.routes.webview, {
        title: service.title,
        url: service.url,
      });
      break;

    /** QRBARCODE */
    case SERVICES_TYPE.ACCUMULATE_POINTS:
      Actions.push(appConfig.routes.qrBarCode, {
        title: t('common:screen.qrBarCode.mainTitle'),
      });
      break;
    case SERVICES_TYPE.QRCODE_SCAN_TYPE:
    case SERVICES_TYPE.QRCODE_SCAN:
      Actions.push(appConfig.routes.qrBarCode, {
        index: 1,
        title: t('common:screen.qrBarCode.scanTitle'),
        wallet: store.user_info.default_wallet,
      });
      break;

    /** VOUCHER */
    case SERVICES_TYPE.LIST_VOUCHER:
      Actions.push(appConfig.routes.mainVoucher, {
        from: 'home',
      });
      break;
    case SERVICES_TYPE.MY_VOUCHER_TYPE:
    case SERVICES_TYPE.MY_VOUCHER:
      Actions.push(appConfig.routes.myVoucher, {
        title: t('common:screen.myVoucher.mainTitle'),
        from: 'home',
      });
      break;
    case SERVICES_TYPE.MY_VOUCHER_DETAIL:
      store.setDeepLinkData({id: service.id});
      Actions.push(appConfig.routes.myVoucher, {
        title: t('common:screen.myVoucher.mainTitle'),
        from: 'home',
        onUseVoucherOnlineSuccess: handleUseVoucherOnlineSuccess,
        onUseVoucherOnlineFailure: handleUseVoucherOnlineFailure,
      });
      break;
    case SERVICES_TYPE.VOUCHER_DETAIL:
      store.setDeepLinkData({id: service.id});
      Actions.push(appConfig.routes.mainVoucher, {
        from: 'deeplink',
      });
      break;
    case SERVICES_TYPE.VOUCHER_CAMPAIGN_DETAIL:
      Actions.push(appConfig.routes.voucherDetail, {
        voucherId: service.voucherId,
        campaignId: service.campaignId,
        title: service.name,
      });
      break;

    /** TRANSACTION */
    case SERVICES_TYPE.TRANSACTION:
      Actions.vnd_wallet({
        title: store.user_info.default_wallet.name,
        wallet: store.user_info.default_wallet,
      });
      break;

    /** ORDER */
    case SERVICES_TYPE.STORE_ORDERS:
      Actions.push(appConfig.routes.storeOrders, {
        tel: service.tel,
        title: service.site_name,
        store_id: service.store_id,
      });
      break;
    case SERVICES_TYPE.ORDERS:
    case SERVICES_TYPE.ORDERS_TAB:
      Actions.push(appConfig.routes.ordersTab);
      break;
    case SERVICES_TYPE.ORDER_DETAIL:
      store.setDeepLinkData({id: service.id});
      Actions.push(appConfig.routes.deepLinkOrdersTab);
      break;

    /** TICKID-PHONE-CARD */
    case SERVICES_TYPE.UP_TO_PHONE:
      Actions.push(appConfig.routes.upToPhone, {
        service_type: service.type,
        service_id: service.id,
        indexTab: service.tab,
        title: service.name,
        serviceId: service.serviceId ? service.serviceId : 100,
      });
      break;

    /** 30DAY */
    case SERVICES_TYPE._30DAY_SERVICE:
      Alert.alert(
        'Thông báo',
        'Chức năng đặt lịch giữ chỗ 30DAY tới các cửa hàng đang được phát triển.',
        [{text: 'Đồng ý'}],
      );
      break;

    /** ACCOUNT */
    /** Address */
    case SERVICES_TYPE.MY_ADDRESS:
      Actions.push(appConfig.routes.myAddress, {
        from_page: 'account',
      });
      break;

    /** NEWS */
    case SERVICES_TYPE.NEWS:
      Actions.push(appConfig.routes.newsTab);
      break;
    case SERVICES_TYPE.NEWS_DETAIL:
      Actions.notify_item({
        title: service.title || service.news?.title,
        data: service.news,
        newsId: service.news_id,
      });
      break;
    case SERVICES_TYPE.NEWS_CATEGORY:
      store.setSelectedNewsId(service.categoryId || '');
      // Actions.push(appConfig.routes.notifies, {
      //   title: service.title,
      //   id: service.categoryId,
      // });
      Actions.jump(appConfig.routes.newsTab, {
        title: service.title,
        id: service.categoryId,
      });
      break;
    case SERVICES_TYPE.NEWS_CATEGORY_VERTICAL:
      Actions.push(appConfig.routes.notifiesVertical, {
        title: service.title,
        id: service.id,
      });
      break;

    /** CHAT */
    case SERVICES_TYPE.CHAT_NOTI:
      Actions.amazing_chat({
        titleStyle: {width: 220},
        phoneNumber: service.tel,
        title: service.site_name,
        site_id: service.site_id,
        user_id: service.user_id,
      });
      break;
    case SERVICES_TYPE.LIST_CHAT:
      Actions.push(appConfig.routes.listChat, {
        titleStyle: {width: 220},
      });
      break;
    case SERVICES_TYPE.LIST_USER_CHAT:
      Actions.push(appConfig.routes.listUserChat, {
        titleStyle: {width: 220},
      });
      break;

    /** STORE */
    case SERVICES_TYPE.OPEN_SHOP:
      if (service.callback) {
        service.callback();
      }

      return APIHandler.site_info(service.siteId)
        .then((response) => {
          if (response && response.status == STATUS_SUCCESS) {
            store.setStoreData(response.data);
            if (
              response.data.config_menu_categories &&
              service.categoryId === undefined
            ) {
              Actions.push(appConfig.routes.multiLevelCategory, {
                title: response.data.name,
                siteId: service.siteId,
                categoryId: service.categoryId || 0,
              });
            } else {
              Actions.push(appConfig.routes.store, {
                title: service.name || response.data.name,
                categoryId: service.categoryId || 0,
              });
            }
          } else {
            throw Error(
              response ? response.message : t('common:api.error.message'),
            );
          }
        })
        .catch((err) => {
          console.log('open_shop', err);
          flashShowMessage({
            type: 'danger',
            message: err.message || t('common:api.error.message'),
          });
        })
        .finally(callBack);
      break;
    case SERVICES_TYPE.GPS_LIST_STORE:
      Actions.push(appConfig.routes.gpsListStore, {
        title: service.title || commonT('screen.gpsListStore.mainTitle'),
        type: GPS_TYPE.GPS_STORE,
      });
      break;
    case SERVICES_TYPE.GPS_LIST_SITE:
      Actions.push(appConfig.routes.gpsListStore, {
        title: service.title || commonT('screen.gpsListStore.mainTitle'),
        type: GPS_TYPE.GPS_SITE,
      });
      break;

    /** COMMUNICATION */
    case SERVICES_TYPE.CALL:
      Communications.phonecall(service.tel, true);
      break;

    /** PRODUCT */
    case SERVICES_TYPE.PRODUCT_DETAIL:
      if (service.callback) {
        service.callback();
      }
      APIHandler.site_product(service.siteId, service.productId)
        .then((response) => {
          if (response && response.status == STATUS_SUCCESS) {
            const item = response.data;
            if (item) {
              Actions.item({
                title: item.name,
                item,
              });
            }
          } else {
            throw Error(
              response ? response.message : t('common:api.error.message'),
            );
          }
        })
        .catch((e) => {
          console.log(e + ' deep_link_site_product');
          flashShowMessage({
            type: 'danger',
            message: e.message || t('common:api.error.message'),
          });
        })
        .finally(callBack);
      break;
    case SERVICES_TYPE.GROUP_PRODUCT:
      Actions.push(appConfig.routes.store, {
        categoriesData: [{id: service.groupId, name: service.title}],
        title: service.title,
        type: SERVICES_TYPE.GROUP_PRODUCT,
      });
      break;
    case SERVICES_TYPE.PRODUCT_STAMPS:
      Actions.push(appConfig.routes.productStamps);
      break;

    /** AFFILIATE */
    case SERVICES_TYPE.AFFILIATE:
      store.setReferCode(service.refer_code);
      break;

    /** SERVICE ORDERS */
    case SERVICES_TYPE.SERVICE_ORDERS:
      Actions.push(appConfig.routes.serviceOrders);
      break;

    /** ALL SERVICES */
    case SERVICES_TYPE.ALL_SERVICES:
      Actions.push(appConfig.routes.allServices);
      break;

    /** PAYMENT */
    case SERVICES_TYPE.PAYMENT_METHOD:
      const selectedMethod =
        service.default_payment_method_id !== undefined
          ? {
              id: service.default_payment_method_id,
              type: service.default_payment_method_type,
            }
          : null;
      Actions.push(appConfig.routes.paymentMethod, {
        selectedMethod: selectedMethod,
        price: service.total_before_view,
        totalPrice: service.total_selected,
        extraFee: service.item_fee,
        showPrice: service.showPrice,
        showSubmit: service.showSubmit,
        onUpdatePaymentMethod: (data) => callBack(false, data),
        store_id: service.storeId,
        cart_id: service.cartId,
        title: service.title,
      });
      break;

    /** POPUP */
    case SERVICES_TYPE.POP_UP:
      setTimeout(
        () =>
          Actions.push(appConfig.routes.modalPopup, {
            image: service.image,
            onPressImage: () => {
              callBack && callBack();
              Actions.pop();
              servicesHandler(service.data, t);
            },
          }),
        service.delay,
      );
      break;

    /** SCHEDULE BOOKING */
    case SERVICES_TYPE.SCHEDULE_BOOKING:
      Actions.push(appConfig.routes.schedule, {
        serviceId: service.service_id,
      });
      break;

    /** PREMIUMS */
    case SERVICES_TYPE.PREMIUM_INFO:
      if (Actions.currentScene === `${appConfig.routes.premiumInfo}_1`) {
        Actions.jump(appConfig.routes.accountTab);
      }
      Actions.push(appConfig.routes.premiumInfo);
      break;

    /** COMMISSION */
    case SERVICES_TYPE.COMMISSION_INCOME_STATEMENT:
      Actions.push(appConfig.routes.commissionIncomeStatement);
      break;

    /** GAMIFICATION */
    /** Lottery */
    case SERVICES_TYPE.LOTTERY_GAME:
      console.log(service);
      Actions.push(appConfig.routes.lotteryGame, {
        title: service.news?.title || service.title,
        id: service.id,
      });
      break;

    /** SOCIAL */
    /** Social */
    case SERVICES_TYPE.SOCIAL:
      Actions.push(appConfig.routes.social, {
        title: service.title,
        siteId: service.id,
      });
      break;
    /** Social Group */
    case SERVICES_TYPE.SOCIAL_GROUP:
      Actions.push(appConfig.routes.socialGroup, {
        id: service.id,
        groupName: service.name,
      });
      break;
    /** Social Create Post */
    case SERVICES_TYPE.SOCIAL_CREATE_POST:
      Actions.push(appConfig.routes.socialCreatePost, {
        title: service.title || t('screen.createPost.mainTitle'),
        group: service.group,
        groupId: service.group_id,
        editMode: service.editMode,
        postId: service.post_id,
        siteId: service.site_id || store?.store_data?.id,
        avatar: service.avatar || store?.user_info?.img,
        contentText: service.content,
        images: service.images,
        isOpenImagePicker: service.isOpenImagePicker,
      });
      break;

    /** PROGRESS TRACKING */
    /** LIST */
    case SERVICES_TYPE.LIST_PROGRESS_TRACKING:
      Actions.push(appConfig.routes.listProgressTracking, {
        title: service.title,
      });
      break;
    /** DETAIL */
    case SERVICES_TYPE.PROGRESS_TRACKING_DETAIL:
      Actions.push(appConfig.routes.progressTrackingDetail, {
        title: service.title,
        id: service.id,
      });
      break;

    /** PERSONAL PROFILE */
    case SERVICES_TYPE.PERSONAL_PROFILE:
      Actions.push(appConfig.routes.personalProfile, {
        isMainUser: service.isMainUser,
        userInfo: service.userInfo,
        title: service.title || service.userInfo?.name,
      });
      break;

    /** AIRLINE TICKET */
    case SERVICES_TYPE.AIRLINE_TICKET:
      Actions.push(appConfig.routes.airlineTicket);
      break;

    /** AGENCY INFORMATION REGISTER */
    case SERVICES_TYPE.AGENCY_INFORMATION_REGISTER:
      Actions.push(appConfig.routes.agencyInformationRegister, {
        title:
          service.title ||
          commonT('screen.agencyInformationRegister.mainTitle'),
      });
      break;

    /**  REQUEST */
    /** List */
    case SERVICES_TYPE.REQUESTS:
      Actions.push(appConfig.routes.requests, {
        title: service.title,
        siteId: service.site_id || store.store_id,
        roomId: service.room_id || service.channel_id || 0,
        objectType: service.object_type,
        objectId: service.object_id,
        object: service.object,
      });
      break;
    /** Create */
    case SERVICES_TYPE.CREATE_REQUEST:
      Actions.push(appConfig.routes.requestCreation, {
        siteId: service.site_id || store.store_id,
        roomId: service.room_id || service.channel_id || 0,
        request: service.request,
        objectType: service.object_type,
        objectId: service.object_id,
        object: service.object,
        onRefresh: service.onRefresh,
      });
      break;
    /** Detail */
    case SERVICES_TYPE.REQUEST_DETAIL:
      Actions.push(appConfig.routes.requestDetail, {
        siteId: service.site_id,
        roomId: service.room_id,
        requestId: service.request_id,
        title: service.title,
        callbackReload: service.callbackReload,
      });
      break;

    /** WALLET */
    case SERVICES_TYPE.WALLET:
      const wallet = service.zone_code
        ? store.user_info?.all_wallets?.length
          ? store.user_info.all_wallets.find(
              (wallet) => wallet.zone_code === service.zone_code,
            )
          : store.user_info?.default_wallet
        : store.user_info?.default_wallet;
      console.log(wallet, service);
      Actions.push(appConfig.routes.vndWallet, {
        title: service.name || wallet?.name,
        wallet,
        tabIndex: service.tabIndex,
      });
      break;
    case SERVICES_TYPE.LIST_SITE:
      Actions.push(appConfig.routes.customerCardWallet, {
        title: service.title || commonT('screen.listSite.mainTitle'),
      });
      break;

    default:
      // Alert.alert('Thông báo', 'Chức năng sắp ra mắt, hãy cùng chờ đón nhé.', [
      //   { text: 'Đồng ý' }
      // ]);
      break;
  }
};
