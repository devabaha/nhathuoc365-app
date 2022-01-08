import {Actions} from 'react-native-router-flux';
import {Alert, Linking} from 'react-native';
import Communications from 'react-native-communications';
import i18n from 'i18next';

import appConfig from 'app-config';
import store from 'app-store';

import {SERVICES_TYPE} from './types';
import {
  handleUseVoucherOnlineSuccess,
  handleUseVoucherOnlineFailure,
} from './voucherHandler';
import {
  handleCategoryPress,
  handleServicePress,
  handleOrderHistoryPress,
} from './radaHandler';
import {jump, push} from 'app-helper/routing';
/**
 * A powerful handler for all app's services.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module servicesHandler
 *
 * @typedef {Object} Service - an abstract for all kind of services.
 * @property {string} type - type of a service.
 * @property {any} theme - type of a service.
 */

/**
 *
 * @param {..Service} service
 * @param {Object} t - i18n data
 * @callback callBack - a trigger when needed for specific case.
 */
export const servicesHandler = (service, t = null, callBack = () => {}) => {
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
      push(
        appConfig.routes.qrBarCode,
        {
          title: t('common:screen.qrBarCode.mainTitle'),
        },
        service.theme,
      );
      break;
    case SERVICES_TYPE.QRCODE_SCAN_TYPE:
    case SERVICES_TYPE.QRCODE_SCAN:
      push(
        appConfig.routes.qrBarCode,
        {
          index: 1,
          title: t('common:screen.qrBarCode.scanTitle'),
          wallet: store.user_info.default_wallet,
        },
        service.theme,
      );
      break;

    /** VOUCHER */
    case SERVICES_TYPE.LIST_VOUCHER:
      push(
        appConfig.routes.mainVoucher,
        {
          from: service.from,
        },
        service.theme,
      );
      break;
    case SERVICES_TYPE.MY_VOUCHER_TYPE:
    case SERVICES_TYPE.MY_VOUCHER:
      push(
        appConfig.routes.myVoucher,
        {
          title: t('common:screen.myVoucher.mainTitle'),
          from: service.from,
        },
        service.theme,
      );
      break;
    case SERVICES_TYPE.MY_VOUCHER_DETAIL:
      store.setDeepLinkData({id: service.id});
      push(
        appConfig.routes.myVoucher,
        {
          title: t('common:screen.myVoucher.mainTitle'),
          from: service.from,
          onUseVoucherOnlineSuccess:
            service.onUseVoucherOnlineSuccess || handleUseVoucherOnlineSuccess,
          onUseVoucherOnlineFailure:
            service.onUseVoucherOnlineFailure || handleUseVoucherOnlineFailure,
        },
        service.theme,
      );
      break;
    case SERVICES_TYPE.VOUCHER_DETAIL:
      store.setDeepLinkData({id: service.id});
      push(
        appConfig.routes.mainVoucher,
        {
          from: service.from,
        },
        service.theme,
      );
      break;
    case SERVICES_TYPE.VOUCHER_CAMPAIGN_DETAIL:
      push(
        appConfig.routes.voucherDetail,
        {
          voucherId: service.voucherId,
          campaignId: service.campaignId,
          title: service.title,
          from: service.from,
          mode: service.mode,
        },
        service.theme,
      );
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
      push(
        appConfig.routes.storeOrders,
        {
          tel: service.tel,
          title: service.site_name,
          store_id: service.store_id,
        },
        service.theme,
      );
      break;
    case SERVICES_TYPE.ORDERS:
    case SERVICES_TYPE.ORDERS_TAB:
      push(appConfig.routes.ordersTab, {}, service.theme);
      break;
    case SERVICES_TYPE.ORDER_DETAIL:
      store.setDeepLinkData({id: service.id});
      push(appConfig.routes.deepLinkOrdersTab, {}, service.theme);
      break;

    /** TICKID-PHONE-CARD */
    case SERVICES_TYPE.UP_TO_PHONE:
      push(
        appConfig.routes.upToPhone,
        {
          service_type: service.type,
          service_id: service.id,
          indexTab: service.tab,
          title: service.name,
          serviceId: service.serviceId ? service.serviceId : 100,
        },
        service.theme,
      );
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
    case SERVICES_TYPE.CREATE_ADDRESS:
      push(
        appConfig.routes.createAddress,
        {
          from_page: service.from_page,
          edit_data: service.edit_data,
          title: service.edit_data
            ? t('common:screen.address.editTitle')
            : t('common:screen.address.createTitle'),
          addressReload: service.addressReload,
          redirect: service.redirect,
        },
        service.theme,
      );
      break;

    /** NEWS */
    case SERVICES_TYPE.NEWS:
      Actions.push(appConfig.routes.newsTab);
      break;
    case SERVICES_TYPE.NEWS_DETAIL:
      push(
        appConfig.routes.notifyDetail,
        {
          title: service.title || service.news?.title,
          data: service.news,
          newsId: service.news_id,
        },
        service.theme,
      );
      break;
    case SERVICES_TYPE.NEWS_CATEGORY:
      store.setSelectedNewsId(service.categoryId || '');
      // push(
      //   appConfig.routes.newsTab,
      //   {
      //     title: commonT('screen.news.mainTitle'),
      //     id: service.categoryId,
      //   },
      //   service.theme,
      // );
      jump(appConfig.routes.newsTab, {
        title: service.title,
        id: service.categoryId,
      });
      break;
    case SERVICES_TYPE.NEWS_CATEGORY_VERTICAL:
      push(
        appConfig.routes.notifiesVertical,
        {
          title: service.title,
          id: service.id,
        },
        service.theme,
      );
      break;

    /** CHAT */
    case SERVICES_TYPE.LIST_CHAT:
      push(appConfig.routes.listChat, {
        title: service.title || commonT('screen.listChat.mainTitle'),
        titleStyle: service.titleStyle || {width: 220},
      });
      break;
    case SERVICES_TYPE.LIST_USER_CHAT:
      Actions.push(appConfig.routes.listUserChat, {
        titleStyle: service.titleStyle || {width: 220},
        title: service.title || commonT('screen.listUserChat.mainTitle'),
      });
      break;
    case SERVICES_TYPE.CHAT_NOTI:
    case SERVICES_TYPE.CHAT:
      push(
        appConfig.routes.amazingChat,
        {
          titleStyle: service.titleStyle || {width: 220},
          phoneNumber: service.tel,
          title: service.site_name || service.title,
          site_id: service.site_id,
          user_id: service.user_id,
          fromSearchScene: service.fromSearchScene,
          setHeader: service.setHeader,
        },
        service.theme,
      );
      break;
    case SERVICES_TYPE.USER_CHAT:
      push(
        appConfig.routes.amazingUserChat,
        {
          titleStyle: service.titleStyle || {width: 220},
          phoneNumber: service.tel,
          title: service.site_name || service.title,
          site_id: service.site_id,
          user_id: service.user_id,
          fromSearchScene: service.fromSearchScene,
          conversation_id: service.conversation_id,
          setHeader: service.setHeader,
        },
        service.theme,
      );
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
              push(
                appConfig.routes.multiLevelCategory,
                {
                  title: response.data.name,
                  siteId: service.siteId,
                  categoryId: service.categoryId || 0,
                },
                service.theme,
              );
            } else {
              push(
                appConfig.routes.store,
                {
                  title: service.name || response.data.name,
                  categoryId: service.categoryId || 0,
                },
                service.theme,
              );
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
    case SERVICES_TYPE.GPS_LIST_SITE:
      push(
        appConfig.routes.gpsListStore,
        {
          type: service.type,
          placeholder: service.placeholder || commonT('home:searchingStore'),
          autoFocus: service.autoFocus,
        },
        service.theme,
      );
      break;
    case SERVICES_TYPE.SEARCH_STORE:
      push(appConfig.routes.searchStore, {
        categories: service.categories,
        category_id: service.category_id,
        category_name: service.category_name,
        autoFocus: service.autoFocus,
        categoriesCollapsed: service.categoriesCollapsed,
        qr_code: service.qr_code,
        from_item: service.from_item,
        itemRefresh: service.itemRefresh,
      });
      break;

    /** COMMUNICATION */
    case SERVICES_TYPE.CALL:
      Communications.phonecall(service.tel, true);
      break;

    /** PRODUCT */
    case SERVICES_TYPE.PRODUCT_DETAIL:
      if (service.product) {
        push(
          appConfig.routes.item,
          {
            title: service.title,
            item: service.product,
          },
          service.theme,
        );
        return;
      }
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
      push(
        appConfig.routes.store,
        {
          categoriesData: [{id: service.groupId, name: service.title}],
          title: service.title || commonT('screen.groupProduct.mainTitle'),
          type: SERVICES_TYPE.GROUP_PRODUCT,
        },
        service.theme,
      );
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
      push(appConfig.routes.serviceOrders, {}, service.theme);
      break;

    /** ALL SERVICES */
    case SERVICES_TYPE.ALL_SERVICES:
      Actions.push(appConfig.routes.allServices);
      break;

    /** PAYMENT */
    case SERVICES_TYPE.PAYMENT_METHOD:
      push(
        appConfig.routes.paymentMethod,
        {
          selectedMethod: service.selectedMethod,
          selectedPaymentMethodDetail: service.selectedPaymentMethodDetail,
          price: service.price,
          totalPrice: service.totalPrice,
          extraFee: service.extraFee,
          showPrice: service.showPrice,
          showSubmit: service.showSubmit,
          store_id: service.storeId,
          cart_id: service.cartId,
          title: service.title || commonT('screen.paymentMethod.mainTitle'),
          onUpdatePaymentMethod: service.onUpdatePaymentMethod,
          onConfirm: service.onConfirm,
        },
        service.theme,
      );
      break;

    case SERVICES_TYPE.PAYMENT_TRANSACTION:
      push(appConfig.routes.transaction, {
        siteId: service.siteId,
        cartId: service.cartId,
        onPop: service.onPop,
        title: service.title || commonT('screen.transaction.paymentTitle'),
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
      push(
        appConfig.routes.schedule,
        {
          serviceId: service.service_id,
        },
        service.theme,
      );
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
      push(appConfig.routes.commissionIncomeStatement, {}, service.theme);
      break;

    /** GAMIFICATION */
    /** Lottery */
    case SERVICES_TYPE.LOTTERY_GAME:
      push(
        appConfig.routes.lotteryGame,
        {
          title: service.news?.title || service.title,
          id: service.id,
        },
        service.theme,
      );
      break;

    /** SOCIAL */
    /** Social */
    case SERVICES_TYPE.SOCIAL:
      push(
        appConfig.routes.social,
        {
          title: service.title || commonT('screen.social.mainTitle'),
          siteId: service.id,
        },
        service.theme,
      );
      break;
    /** Social Group */
    case SERVICES_TYPE.SOCIAL_GROUP:
      push(
        appConfig.routes.socialGroup,
        {
          id: service.id,
          groupName: service.name,
        },
        service.theme,
      );
      break;
    /** Social Create Post */
    case SERVICES_TYPE.SOCIAL_CREATE_POST:
      push(
        appConfig.routes.socialCreatePost,
        {
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
        },
        service.theme,
      );
      break;

    /** PROGRESS TRACKING */
    /** LIST */
    case SERVICES_TYPE.LIST_PROGRESS_TRACKING:
      push(
        appConfig.routes.listProgressTracking,
        {
          title: service.title,
        },
        service.theme,
      );
      break;
    /** DETAIL */
    case SERVICES_TYPE.PROGRESS_TRACKING_DETAIL:
      push(
        appConfig.routes.progressTrackingDetail,
        {
          title: service.title,
          id: service.id,
        },
        service.theme,
      );
      break;

    /** PERSONAL PROFILE */
    case SERVICES_TYPE.PERSONAL_PROFILE:
      push(appConfig.routes.personalProfile, {
        isMainUser: service.isMainUser,
        userInfo: service.userInfo,
        title: service.title || service.userInfo?.name,
      });
      break;

    /** AIRLINE TICKET */
    case SERVICES_TYPE.AIRLINE_TICKET:
      push(
        appConfig.routes.airlineTicket,
        {
          title: service.title || commonT('screen.airlineTicket.mainTitle'),
        },
        service.theme,
      );
      break;

    /** AGENCY INFORMATION REGISTER */
    case SERVICES_TYPE.AGENCY_INFORMATION_REGISTER:
      push(
        appConfig.routes.agencyInformationRegister,
        {
          title:
            service.title ||
            commonT('screen.agencyInformationRegister.mainTitle'),
        },
        service.theme,
      );
      break;

    /**  REQUEST */
    /** List */
    case SERVICES_TYPE.REQUESTS:
      push(
        appConfig.routes.requests,
        {
          title: service.title || commonT('screen.requests.mainTitle'),
          siteId: service.site_id || store.store_id,
          roomId: service.room_id || service.channel_id || 0,
          objectType: service.object_type,
          objectId: service.object_id,
          object: service.object,
        },
        service.theme,
      );
      break;
    /** Create */
    case SERVICES_TYPE.CREATE_REQUEST:
      push(
        appConfig.routes.requestCreation,
        {
          siteId: service.site_id || store.store_id,
          roomId: service.room_id || service.channel_id || 0,
          request: service.request,
          objectType: service.object_type,
          objectId: service.object_id,
          object: service.object,
          onRefresh: service.onRefresh,
          title: service.title || commonT('screen.requests.creationTitle'),
        },
        service.theme,
      );
      break;
    /** Detail */
    case SERVICES_TYPE.REQUEST_DETAIL:
      push(
        appConfig.routes.requestDetail,
        {
          siteId: service.site_id,
          roomId: service.room_id,
          requestId: service.request_id,
          title: service.title || commonT('screen.requests.detailTitle'),
          callbackReload: service.callbackReload,
        },
        service.theme,
      );
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
      push(
        appConfig.routes.vndWallet,
        {
          title: service.name || wallet?.name,
          wallet,
          tabIndex: service.tabIndex,
        },
        service.theme,
      );
      break;

    /** RATING */
    case SERVICES_TYPE.RATING:
      push(
        appConfig.routes.rating,
        {
          cart_data: service.cart_data,
        },
        service.theme,
      );
      break;

    default:
      // Alert.alert('Thông báo', 'Chức năng sắp ra mắt, hãy cùng chờ đón nhé.', [
      //   { text: 'Đồng ý' }
      // ]);
      break;
  }
};
