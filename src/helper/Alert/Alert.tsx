import {AlertFn} from '@data';

class Alert {
  alert: AlertFn = () => {};

  register(alertFn: AlertFn) {
    this.alert = alertFn;
  }

  unregister() {
    this.alert = () => {};
  }
}

export default new Alert();
