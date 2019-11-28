import firebase from 'react-native-firebase';

export default class EventTracker {
  static analytics = firebase.analytics();

  static setUserId(id) {
    this.analytics.setUserId(String(id));
  }

  static removeUserId() {
    this.analytics.setUserId('');
  }

  static logEvent(event, params = {}) {
    if (event) {
      // if (!__DEV__) {
      try {
        this.analytics.logEvent(event, params);
      } catch (error) {
        console.warn(`analytics_${event}_fails`);
      }

      // }
    }
  }
}
