import {ANALYTICS_EVENTS_NAME, formatViewEvents} from './analytics';
import {PRODUCT_TYPES} from './product';
import appConfig from 'app-config';

const LOGIN_MODE = {
  FIREBASE: 'firebase',
  CALL: 'call',
};

const LOGIN_STEP = {
  REGISTER: 'Registering',
  GET_USER: 'User Getting',
  CONFIRM: 'Confirming',
};

export {ANALYTICS_EVENTS_NAME, formatViewEvents, LOGIN_MODE, LOGIN_STEP, PRODUCT_TYPES};

// Use with Ionicons.
export const BACK_NAV_ICON_NAME = appConfig.device.isIOS ? 'ios-chevron-back' : 'md-arrow-back';