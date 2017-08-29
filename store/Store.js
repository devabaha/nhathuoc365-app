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

    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  @observable keyboardTop = 0;

  @action keyboardWillShow(e) {
    if (e) {
      this.keyboardTop = e.endCoordinates.height;
    }
  }

  @action keyboardWillHide(e) {
    this.keyboardTop = 0;
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
  cart_empty = true;

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
    this.cart_empty = true;
    this.payment_nav_show = true;
    this.user_cart_note = '';

    // refresh home screen
    this.refresh_home_change++;

    layoutAnimation();
  }

  // set cart data on display
  @action setCartData(data) {
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

      // refresh home screen
      this.refresh_home_change++;

      if (this.cart_empty) {
        layoutAnimation();
      }
      this.cart_empty = false;
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
