import {
  reaction,
  observable,
  action,
  toJS,
  computed,
  extendObservable,
} from 'mobx';
import autobind from 'autobind-decorator';
import {Keyboard, Platform, Linking, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {initialize as initializeRadaModule} from '@tickid/tickid-rada';
import firebaseAnalytics from '@react-native-firebase/analytics';
import firebaseAuth from '@react-native-firebase/auth';
import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';
import equal from 'deep-equal';
import {uploadImages} from 'app-helper/image';

@autobind
class Store {
  constructor() {
    // reset cart index every store_id changed
    reaction(
      () => this.store_id,
      () => {
        this.setCartItemIndex(0);

        if (!this.store_data) {
          this._getStoreInfo();
        }
      },
    );

    reaction(
      () => this.isConnected,
      () => {
        if (this.isConnected) {
          var queue = Object.keys(this.apiQueue);
          if (queue.length > 0) {
            queue.map((key) => {
              let queueFunc = this.apiQueue[key];
              if (typeof queueFunc == 'function') {
                queueFunc();
              }
            });
          }

          this.apiQueue = {};
        }
      },
    );

    // Keyboard handler
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);

    // Notify
    this.getNotifyFlag = true;
    this.getNotifyChatFlag = true;
    this.updateNotifyFlag = true;
    this.notifyReceived = false;

    // Get notice repeat
    clearInterval(this._timeGetNotify);
    this._timeGetNotify = setInterval(() => {
      if (this.getNotifyFlag) {
        this.getNotify();
      }
    }, DELAY_UPDATE_NOTICE);

    this.logoutExceptionScene = [
      `${appConfig.routes.phoneAuth}_1`,
      `${appConfig.routes.op_register}_1`,
      appConfig.routes.launch,
    ];
  }

  async _getStoreInfo() {
    try {
      var response = await APIHandler.site_info(this.store_id);
      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          this.setStoreData(response.data);
        })();
      }
    } catch (e) {
      console.log(e + ' site_info');

      this.addApiQueue('site_info', this._getStoreInfo);
    }
  }

  getNotify = async () => {
    this.getNotifyFlag = false;
    try {
      const response = await APIHandler.user_notify();

      if (response.status === STATUS_LOGIN_FAIL) {
        const isExecuteLogout = !this.logoutExceptionScene.includes(
          Actions.currentScene,
        );

        if (isExecuteLogout) {
          try {
            const response = await APIHandler.user_logout();
            this.logOut(response?.data || {});
          } catch (error) {
            this.logOut({});
            console.log(error);
          } finally {
            flashShowMessage({
              message: response.message,
              type: 'danger',
            });
            Actions.reset(appConfig.routes.sceneWrapper);
          }
        }
      }

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          if (!this.notifyReceived) {
            this.notifyReceived = true;
            // this.newVersionChecking(response.data);
          }
          if (response.data.new_totals > 0) {
            this.setRefreshNews(this.refresh_news + 1);
          }
          const {user, account_menu, ...notifies} = response.data;
          this.initConfigRadaModule(user);
          if (!equal(user, toJS(this.user_info))) {
            this.setUserInfo(user);
          }

          if (!equal(account_menu, toJS(this.accountMenu))) {
            this.setAccountMenu(account_menu);
          }

          if (!equal(notifies, toJS(this.notify))) {
            this.setNotify(notifies);
          }
        })();
      }
    } catch (error) {
      console.log('store_get_notify', error);
    } finally {
      this.getNotifyFlag = true;
    }
  };

  @observable radaConfig = {name: '', tel: ''};
  @action initConfigRadaModule(user) {
    if (
      user &&
      (user.name || user.tel) &&
      (user.name !== this.radaConfig.name || user.tel !== this.radaConfig.tel)
    ) {
      this.radaConfig.name = user.name;
      this.radaConfig.tel = user.tel;
      initializeRadaModule({
        defaultContactName: user.name,
        defaultContactPhone: user.tel,
      });
    }
  }

  newVersionChecking(notifies) {
    const appStoreName = Platform.OS === 'ios' ? 'App Store' : 'Play Store';
    if (notifies && notifies.updating_version == 1) {
      setTimeout(
        () =>
          Alert.alert(
            `Phi??n b???n m???i ${notifies.new_version}!`,
            '???? c?? b???n c???p nh???t m???i, b???n vui l??ng c???p nh???t ???ng d???ng ????? c?? tr???i nghi???m t???t nh???t.',
            [
              {
                text: 'L??c kh??c',
              },
              {
                text: 'C???p nh???t',
                style: 'cancel',
                onPress: () =>
                  Linking.openURL(notifies.url_update).catch((error) => {
                    console.log('update_app', error);
                    Alert.alert(
                      'C?? l???i x???y ra',
                      `B???n c?? th??? truy c???p ${appStoreName} ????? th??? l???i.`,
                    );
                  }),
              },
            ],
          ),
        1000,
      );
    }
  }

  storeUnMount = {};

  runStoreUnMount() {
    Object.keys(this.storeUnMount).map((key) => {
      let unMount = this.storeUnMount[key];

      if (typeof unMount == 'function') {
        unMount();
      }
    });

    this.storeUnMount = {};
  }

  @observable selectedTab = '';

  @action setSelectedTab(name) {
    this.selectedTab = name;
  }

  @action setStoreUnMount(key, unMount) {
    this.storeUnMount[key] = unMount;
  }

  @observable keyboardTop = 0;

  @action keyboardWillShow(e) {
    if (e) {
      this.keyboardTop = e.endCoordinates.height;
    }

    Events.trigger(KEY_BOARD_SHOW);
  }

  @action keyboardWillHide(e) {
    this.keyboardTop = 0;

    Events.trigger(KEY_BOARD_HIDE);
  }

  @observable accountMenu = [];
  @action setAccountMenu(accountMenu = []) {
    this.accountMenu = accountMenu;
  }

  /*********** notify **********/
  @observable notify = {
    // new_notice: 0,
    // notify_list_notice: 0,
    // new_site_news: 0,
    // new_sys_news: 0,
    // new_totals: 0,
    // updating_version: 0,
    // new_version: "",
    // url_update: "",
    // get list values of SERVICE_TYPE to format {[value]: 0, ...}
    // ...Object.values(SERVICES_TYPE)
    //   .map((type) => ({
    //     [type]: 0,
    //   }))
    //   .reduce(function(result, item) {
    //     const key = Object.keys(item)[0];
    //     result[key] = item[key];
    //     return result;
    //   }, {}),
  };
  @observable notify_chat = {};
  @observable notify_admin_chat = {};

  @action setNotifyAdminChat(data) {
    this.notify_admin_chat = data;
  }

  @action setNotify(data) {
    if (!!data && typeof data === 'object') {
      const isNotifyUpdated = !equal(this.notify, data);

      if (isNotifyUpdated) {
        this.notify = {
          ...this.notify,
          ...data,
        };

        Events.trigger(CALLBACK_APP_UPDATING, data);
      }
    }
  }

  @action setNotifyChat(data) {
    this.notify_chat = data || {};
  }

  /*********** home begin **********/
  @observable refresh_home_change = 0;

  @action setRefreshHomeChange(data) {
    this.refresh_home_change = data;
  }

  @observable no_refresh_home_change = 0;

  @action setNoRefreshHomeChange(data) {
    this.no_refresh_home_change = data;
  }

  /*********** store begin **********/

  @observable user_info = null;
  @observable store_id = null;
  @observable store_data = null;
  @observable app_id = null;
  @observable app_data = null;
  @observable deep_link_data = null;
  @observable stores_finish = false;
  @observable selectedFilter = {};

  @action setStoresFinish(flag) {
    this.stores_finish = flag;
  }

  @action setUserInfo(data) {
    const isUserUpdated = is1LevelObjectUpdated(this.user_info, data);
    if (isUserUpdated) {
      this.user_info = data;
    }
  }

  @action setStoreId(data) {
    this.store_id = data;
  }

  @action setStoreData(data) {
    this.store_data = data;
    this.store_id = data.id;
  }

  @action setAppData(data) {
    this.app_data = data;
    this.app_id = data?.id;
  }

  @action setDeepLinkData(data) {
    this.deep_link_data = data;
  }

  @action setSelectedFilter(data = {}) {
    this.selectedFilter = data;
  }

  /*********** home begin **********/
  @observable refresh_news = 0;

  @action setRefreshNews(data) {
    this.refresh_news = data;
  }

  /*********** cart begin **********/

  @observable cart_data = null;
  @observable cart_products = null;
  @observable cart_products_confirm = null;
  @observable cart_item_index = 0;
  @observable payment_nav_show = true;
  @observable user_cart_note = '';
  noteHighlight = true;

  // backend
  @observable sale_carts = {};
  @observable cart_admin_data = null;

  @action setCartAdminData(data) {
    this.cart_admin_data = data;
  }

  @action setSaleCarts(data) {
    this.sale_carts = data;
  }

  @action setUserCartNote(data) {
    this.user_cart_note = data;
  }

  @action setPaymentNavShow(flag) {
    this.payment_nav_show = flag;
  }

  // reset cart data on display
  @action resetCartData() {
    this.cart_data = null;
    this.cart_products = null;
    this.cart_products_confirm = null;
    this.cart_item_index = 0;
    this.payment_nav_show = true;
    this.user_cart_note = '';
    this.noteHighlight = true;

    // reload home screen
    action(() => {
      this.setRefreshHomeChange(this.refresh_home_change + 1);
    })();
  }

  // set cart data on display
  @action setCartData(data) {
    if (this.cart_data == null) {
      // reload home screen
      action(() => {
        this.setRefreshHomeChange(this.refresh_home_change + 1);
      })();
    }

    this.cart_data = data;
    this.setUserCartNote(data.user_note);

    // object to array and reverse stack
    if (data && Object.keys(data.products).length > 0) {
      var cart_products = [],
        cart_products_confirm = [];
      Object.keys(data.products).map((key) => {
        let product = data.products[key];
        cart_products.push(product);
        // if (product.selected == 1) {
        //   cart_products_confirm.push(product);
        // }
      });

      // set new data
      this.cart_products = cart_products.reverse();
      this.cart_products_confirm = cart_products.reverse();
    } else {
      this.resetCartData();
    }
  }

  // set cart index
  @action setCartItemIndex(index) {
    this.cart_item_index = index;
  }

  /*********** ndt history begin **********/
  @observable ndt_history = [];

  @action updateNdtHistory(res, attrName) {
    let isExisted = false;
    this.ndt_history.forEach((n, i) => {
      n = toJS(n);
      if (n.mcc_investor_username === res.mcc_investor_username) {
        isExisted = true;
        this.ndt_history[i].data[attrName] = res.data;
      }
    });

    if (!isExisted) {
      let data = {};
      data[attrName] = res.data;
      this.ndt_history.push({
        mcc_investor_username: res.mcc_investor_username,
        data,
      });
    }
  }

  @action getNdtHistory(mcc_investor_username) {
    return toJS(
      this.ndt_history.find(
        (n) => n.mcc_investor_username === mcc_investor_username,
      ),
    );
  }

  /*********** address begin **********/
  @observable address_key_change = 0;

  @action setAddressKeyChange(data) {
    this.address_key_change = data;
  }

  /*********** orders begin **********/
  @observable orders_key_change = 0;

  @action setOrdersKeyChange(data) {
    this.orders_key_change = data;
  }

  /*********** cart fly begin **********/
  @observable cart_fly_image = null;
  @observable cart_fly_show = false;
  @observable cart_fly_position = null;

  @action setCartFlyImage(data) {
    this.cart_fly_image = data;
  }

  @action setCartFlyShow(data) {
    this.cart_fly_show = data;
  }

  @action setCartFlyPosition(data) {
    this.cart_fly_position = data;
  }

  @observable isConnected = true;
  apiQueue = {};

  @action setConnect(flag) {
    this.isConnected = flag;
  }

  addApiQueue(key, func) {
    if (typeof func == 'function' && key) {
      this.apiQueue[key] = func;
    }
  }

  //-----reset asyncStorage-----
  @action resetAsyncStorage() {
    AsyncStorage.removeItem(PASSWORD_STORAGE_KEY, (err) =>
      console.log('reset asyncStorage', err),
    );
  }

  @observable refer_code = '';

  @action setReferCode(refer_code) {
    this.refer_code = refer_code;
  }

  @observable branchIOSubscriber = null;

  @action branchIOSubscribe(branchIOSubscriber) {
    this.branchIOSubscriber = branchIOSubscriber;
  }

  @action branchIOUnsubscribe() {
    if (this.branchIOSubscriber) {
      this.branchIOSubscriber();
    }
  }

  @observable tempDeepLinkData = null;

  @action setTempDeepLinkData(tempDeepLinkData) {
    this.tempDeepLinkData = tempDeepLinkData;
  }

  @observable isHomeLoaded = false;

  @action updateHomeLoaded(isHomeLoaded) {
    this.isHomeLoaded = isHomeLoaded;
  }

  /**
   * Danh s??ch t???t/ b???t c???u h??nh theo g??i s???n ph???m.
   */
  @observable packageOptions = {};

  @action setPackageOptions(packageOptions) {
    this.packageOptions = packageOptions;
  }

  @observable codePushMetaData = null;

  @action setCodePushMetaData(codePushMetaData) {
    this.codePushMetaData = codePushMetaData;
  }

  @observable popupClickedID = '';

  /**
   * @todo Save the clicked id (date modified) of popup clicked.
   * Prevent re-show this popup in current session.
   */
  @action setPopupClickedID(popupClickedID) {
    this.popupClickedID = popupClickedID;
  }

  @observable homeStatusBar = {
    barStyle: 'light-content',
    backgroundColor: appConfig.colors.primary,
  };

  @action setHomeBarStyle(barStyle) {
    this.homeStatusBar.barStyle = barStyle;
  }

  @action setHomeBarBackgroundColor(backgroundColor) {
    this.homeStatusBar.backgroundColor = backgroundColor;
  }

  @observable analyticsUserID = '';
  @observable analyst = firebaseAnalytics();

  @action setAnalyticsUser(user) {
    this.analyticsUserID = user.id;
    this.analyst.setUserId(this.analyticsUserID);
  }

  @action removeAnalytics() {
    this.analyticsUserID = '';
    this.analyst.setUserId('');
  }

  @observable ignoreChangeDomain = false;
  @action setIgnoreChangeDomain(ignoreChangeDomain) {
    this.ignoreChangeDomain = ignoreChangeDomain;
  }

  @observable baseDomains = [];
  @action setBaseDomains(domains) {
    this.baseDomains = domains;
  }
  @action updateBaseDomain(index, domain) {
    this.baseDomains[index] = domain;
  }

  @observable isUpdateOrders = false;
  @action setUpdateOrders(isUpdateOrders) {
    this.isUpdateOrders = isUpdateOrders;
  }

  @observable isUpdateNotify = false;
  @action setUpdateNotify(isUpdateNotify) {
    this.isUpdateNotify = isUpdateNotify;
  }

  @action async logOut(userInfo) {
    this.setUserInfo(userInfo);
    this.resetCartData();
    this.setRefreshHomeChange(this.refresh_home_change + 1);
    this.setOrdersKeyChange(this.orders_key_change + 1);
    this.resetAsyncStorage();

    if (!!firebaseAuth().currentUser) {
      await firebaseAuth().signOut();
    }
  }

  @observable socialNews = observable.map(new Map());
  @action setSocialNews(socialNews = {}) {
    this.socialNews.merge(socialNews);
  }

  @action updateSocialNews(id, data = {}) {
    let temp = this.socialNews.get(id) || {};
    this.socialNews.set(id, {...temp, ...data});
  }

  @action resetSocialNews() {
    this.socialNews.replace(new Map());
  }

  @observable socialPosts = observable.map(new Map());
  @action setSocialPosts(socialPosts = {}) {
    this.socialPosts.merge(socialPosts);
  }

  @action updateSocialPost(id, data = {}) {
    let temp = this.socialPosts.get(id) || {};
    this.socialPosts.set(id, {...temp, ...data});
  }

  @action resetSocialPosts() {
    this.socialPosts.replace(new Map());
  }

  @observable socialProducts = observable.map(new Map());
  @action setSocialProducts(socialProducts = {}) {
    this.socialProducts.merge(socialProducts);
  }

  @action updateSocialProducts(id, data = {}) {
    let temp = this.socialProducts.get(id) || {};
    this.socialProducts.set(id, {...temp, ...data});
  }

  @action resetSocialProducts() {
    this.socialProducts.replace(new Map());
  }

  @observable socialPostingData = {};
  @action setSocialPostingData(data = {}) {
    this.socialPostingData = data;
  }

  @action socialCreatePost(
    data = {},
    t = () => {},
    formatPostStoreData = (data) => {
      return data;
    },
    editMode = false,
  ) {
    this.setSocialPostingData({...data, progress: 0});
    this.updateSocialPost(data.id, formatPostStoreData(data));

    const postData = async (data = {}) => {
      const postParams = {
        site_id: data.site_id,
        group_id: data.group_id,
      };
      if (data.content) {
        postParams.content = data.content;
      }
      if (!!data.images?.length) {
        postParams.images = JSON.stringify(data.images);
      }

      let socialPostingData = {...this.socialPostingData, progress: 100};

      try {
        const response = await APIHandler.social_create_post(
          postParams,
          editMode ? data.id : '',
        ).promise();

        if (response) {
          if (response.status === STATUS_SUCCESS) {
            if (response.data?.post) {
              this.updateSocialPost(
                data.id,
                formatPostStoreData(response.data.post),
              );
            }
          } else {
            flashShowMessage({
              type: 'danger',
              message: response.message || t('common:api.error.message'),
            });
            socialPostingData.error = true;
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: t('common:api.error.message'),
          });
          socialPostingData.error = true;
        }
      } catch (error) {
        console.log('create_social_post', error);
        flashShowMessage({
          type: 'danger',
          message: t('common:api.error.message'),
        });
        socialPostingData.error = true;
      } finally {
        this.setSocialPostingData(socialPostingData);
      }
    };

    if (data?.images?.length) {
      let imagesProgress = [];
      const listUploadImage = data.images.filter((image) => !!image.uri);
      const listNotUploadImage = data.images.map((image) => {
        return !image.uploadPath && !image.path ? image : undefined;
      });

      if (!listUploadImage.length) {
        postData({...data, images: data.images});
        return;
      }
      let images = Array.from({length: listUploadImage.length});
      let totalUploaded = 0;
      const requests = uploadImages(
        APIHandler.url_user_upload_image(data?.site_id),
        listUploadImage,
        (progress, image, index) => {
          imagesProgress[index] = progress * (100 / listUploadImage.length);
          this.setSocialPostingData({
            ...this.socialPostingData,
            progress: imagesProgress.reduce(
              (prev, current) => (prev || 0) + (current || 0),
              0,
            ),
          });
        },
        (response, image, index) => {
          totalUploaded++;

          images[index] = {
            name: response.data.name,
            width: image.width,
            height: image.height,
          };

          if (totalUploaded === listUploadImage.length) {
            if (images.every((image) => !!image?.name)) {
              listNotUploadImage.forEach((img, index) => {
                if (img === undefined) {
                  listNotUploadImage[index] = images.splice(0, 1)[0];
                }
              });
              postData({...data, images: listNotUploadImage});
            } else {
              this.setSocialPostingData({
                ...this.socialPostingData,
                error: true,
                progress: undefined,
              });
            }
          }
        },
        (error, image, index) => {
          requests.forEach((request) => !!request?.cancel && request.cancel());
          this.setSocialPostingData({
            ...this.socialPostingData,
            error: true,
            progress: undefined,
          });
        },
      );
    } else {
      postData(data);
    }
  }

  @observable selectedNewsId = '';
  @action setSelectedNewsId(selectedNewsId = '') {
    this.selectedNewsId = selectedNewsId;
  }

  @observable place_data = null;
  @observable place_data_static = null;

  @action setPlaceData(data) {
    this.place_data = data;
  }

  @action setPlaceDataStatic(data) {
    this.place_data_static = data;
  }

  @observable site_data = null;

  @action setSiteData(data) {
    this.site_data = data;
  }

  async getAirportData(data) {
    try {
      var response = await APIHandler.search_airport(data);
      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          if (this.place_data == null) {
            this.setPlaceDataStatic(response.data);
          }
          this.setPlaceData(response.data);
        })();
      }
    } catch (e) {
      console.warn(e);
    } finally {
    }
  }

  @computed get formattedList() {
    return this.place_data
      ?.map((v) => {
        return {title: v.title, data: v.data.slice()};
      })
      .slice();
  }

  @observable isEnterItem = false;
  @action setEnterItem(isEnterItem) {
    this.isEnterItem = isEnterItem;
  }

  @observable theme = {};
  @action setTheme(theme) {
    this.theme = theme;
  }
}

export default new Store();
