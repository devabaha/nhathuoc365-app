import {reaction, observable, observe, computed, autorun, action} from 'mobx';
import autobind from 'autobind-decorator';

import {
  Keyboard
} from 'react-native';

@autobind
class Store {
  constructor() {

    // reset cart index every store_id changed
    reaction(() => this.store_id, () => {
      this.setCartItemIndex(0);
    });

    // Keyboard handler
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);


    // Notify
    this.getNotifyFlag = true;
    this.getNotifyChatFlag = true;
    this.updateNotifyFlag = true;

    // Get notice repeat
    clearInterval(this._timeGetNotify);
    this._timeGetNotify = setInterval(() => {
      if (this.getNotifyFlag) {
        this.getNoitify();
      }
    }, DELAY_UPDATE_NOTICE);
  }

  async getNoitify() {
    this.getNotifyFlag = false;

    try {
      var response = await APIHandler.user_notify();

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          this.setNotify(response.data);
        })();
      }
    } catch (e) {
      console.warn(e + ' user_notify');
    } finally {
      this.getNotifyFlag = true;

      // notify_chat
      if (this.updateNotifyFlag) {
        this.getNoitifyChat();
      }
    }
  }

  async getNoitifyChat() {
    this.getNotifyChatFlag = false;

    try {
      var response = await APIHandler.user_notify_chat();

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          this.setNotifyChat(response.data);
        })();
      }
    } catch (e) {
      console.warn(e + ' user_notify_chat');
    } finally {
      this.getNotifyChatFlag = true;
    }
  }

  storeUnMount = {};

  runStoreUnMount() {
    Object.keys(this.storeUnMount).map(key => {
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
    url_update: ''
  }
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

  /*********** store begin **********/

  @observable user_info = null;
  @observable store_id = null;
  @observable store_data = null;
  @observable stores_finish = false;

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
      var cart_products = [], cart_products_confirm = [];
      Object.keys(data.products).map(key => {
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


}

export default new Store();
