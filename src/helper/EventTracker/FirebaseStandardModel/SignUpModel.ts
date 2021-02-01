import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';

class SignUpModel {
  signUpInfo: FirebaseAnalyticsTypes.SignUpEventParameters = {
      method: ''
  };

  constructor(signUpInfo: FirebaseAnalyticsTypes.SignUpEventParameters) {
    this.signUpInfo = {
      ...this.signUpInfo,
      ...signUpInfo,
    };
  }

  get eventName(){
    return 'sign_up'
  }

  logEvent() {
    return store.analyst.logSignUp(this.signUpInfo);
  }
}

export default SignUpModel;
