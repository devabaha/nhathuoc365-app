import {reaction, observable, observe, computed, autorun, action} from 'mobx';
import autobind from 'autobind-decorator';

@autobind
class Store {
  constructor() {

    // reset cart index every store_id changed
    reaction(() => this.store_id, () => {
      this.setCartItemIndex(0);
    });

  }

  /*********** store begin **********/

  @observable user_info = null;
  @observable store_id = null;

  @action setUserInfo(data) {
    this.user_info = data;
  }

  @action setStoreId(data) {
    this.store_id = data;
  }




  /*********** cart begin **********/

  @observable cart_data = null;
  @observable cart_products = null;
  @observable cart_item_index = 0;
  cart_empty = true;

  // reset cart data on display
  @action resetCartData() {
    this.cart_data = null;
    this.cart_products = null;
    this.cart_item_index = 0;
    this.cart_empty = true;

    layoutAnimation();
  }

  // set cart data on display
  @action setCartData(data) {
    this.cart_data = data;

    // object to array and reverse stack
    var keys_data = Object.keys(data.products);
    if (data && keys_data.length > 0) {
      var cart_products = [];
      keys_data.map(key => {
        cart_products.push(data.products[key]);
      });

      this.cart_products = cart_products.reverse();
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
}

export default new Store();
