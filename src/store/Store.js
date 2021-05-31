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
        this.getNoitify();
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

  getNoitify = async () => {
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
            this.newVersionChecking(response.data);
          }
          if (response.data.new_totals > 0) {
            this.setRefreshNews(this.refresh_news + 1);
          }
          const {user, ...notifies} = response.data;
          this.initConfigRadaModule(user);
          if (!equal(user, this.user_info)) {
            this.setUserInfo(user);
          }

          if (!equal(notifies, this.notify)) {
            this.setNotify(notifies);
          }
        })();
      }
    } catch (error) {
      console.log(error);
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
            `Phiên bản mới ${notifies.new_version}!`,
            'Đã có bản cập nhật mới, bạn vui lòng cập nhật ứng dụng để có trải nghiệm tốt nhất.',
            [
              {
                text: 'Lúc khác',
              },
              {
                text: 'Cập nhật',
                style: 'cancel',
                onPress: () =>
                  Linking.openURL(notifies.url_update).catch((error) => {
                    console.log('update_app', error);
                    Alert.alert(
                      'Có lỗi xảy ra',
                      `Bạn có thể truy cập ${appStoreName} để thử lại.`,
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

  /*********** notify **********/
  @observable notify = {
    new_notice: 0,
    new_site_news: 0,
    new_sys_news: 0,
    new_totals: 0,
    updating_version: 0,
    new_version: '',
    url_update: '',
  };
  @observable notify_chat = {};
  @observable notify_admin_chat = {};

  @action setNotifyAdminChat(data) {
    this.notify_admin_chat = data;
  }

  @action setNotify(data) {
    this.notify = data || {};
    Events.trigger(CALLBACK_APP_UPDATING, data);
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
    this.user_info = data;
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
    this.app_id = data.id;
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

  @observable apiDomain = '';
  @action setBaseAPIDomain(apiDomain) {
    this.apiDomain = apiDomain;
  }

  @observable isUpdateOrders = false;
  @action setUpdateOrders(isUpdateOrders) {
    this.isUpdateOrders = isUpdateOrders;
  }

  @action logOut(userInfo) {
    this.setUserInfo(userInfo);
    this.resetCartData();
    this.setRefreshHomeChange(this.refresh_home_change + 1);
    this.setOrdersKeyChange(this.orders_key_change + 1);
    this.resetAsyncStorage();

    const isFirebaseSignedIn = !!firebaseAuth().currentUser;
    if (isFirebaseSignedIn) {
      firebaseAuth().signOut();
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
}

export default new Store();
