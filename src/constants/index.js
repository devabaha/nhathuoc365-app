import { ANALYTICS_EVENTS_NAME, formatViewEvents } from './analytics';

const LOGIN_MODE = {
  FIREBASE: 'firebase',
  CALL: 'call'
};

const LOGIN_STEP = {
  REGISTER: 'Registering',
  GET_USER: 'User Getting',
  CONFIRM: 'Confirming'
};

export { ANALYTICS_EVENTS_NAME, formatViewEvents, LOGIN_MODE, LOGIN_STEP };
