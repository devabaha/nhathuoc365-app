import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';
import { defaultMethod } from '../helper/currency';

class LoginModel {
    loginInfo: FirebaseAnalyticsTypes.LoginEventParameters = {
        method: defaultMethod()
  };

  constructor(loginInfo?: FirebaseAnalyticsTypes.LoginEventParameters) {
    this.loginInfo = {
        ...this.loginInfo,
        ...loginInfo
    };
  }

  get eventName() {
      return 'login';
  }

  logEvent() {
    return store.analyst.logLogin(this.loginInfo);
  }
}

export default LoginModel;
