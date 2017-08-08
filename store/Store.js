import {reaction, observable, observe, computed, autorun, action} from 'mobx'
import autobind from 'autobind-decorator';

@autobind
class Store {
  @observable value = '1'

  @action setValue(value) {
    this.value = value;
  }
}

export default new Store();
