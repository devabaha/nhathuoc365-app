import {reaction, observable, observe, computed, autorun, action} from 'mobx';
import autobind from 'autobind-decorator';

@autobind
class Store {
  @observable user_info = null;
  @observable store_id = null;

  @action setUserInfo(data) {
    this.user_info = data;
  }

  @action setStoreId(data) {
    this.store_id = data;
  }
}

export default new Store();
