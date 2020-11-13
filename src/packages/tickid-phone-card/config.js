import { Dimensions } from 'react-native';
import {
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from 'react-native-iphone-x-helper';

const config = {
  appName: '',
  defaultContactName: '',
  defaultContactPhone: '',
  private: {
    appKey: '',
    secretKey: ''
  },
  device: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    appVersion: '',
    deviceId: '',
    deviceType: '',
    os: '',
    osVersion: '',
    store: '',
    isIphoneX: isIphoneX(),
    statusBarHeight: getStatusBarHeight(),
    bottomSpace: getBottomSpace()
  },
  rest: {
    endpoint: () => 'https://apiapp.tickid.top', //http://localhost:8000/
    phoneCardService: () => '/apiService/info/',
    book: () => '/apiService/book',
    password: () => '/apiUser/change_pass',
    orders: serviceId => `/apiService/orders/${serviceId}`,
    changeOrder: id => `/apiService/change_order_status/${id}`
  },
  route: {
    push: () => {},
    pop: () => {},
    pushToMain: () => {}
  },
  routes: {
    contact: 'tickid_phone_card_contact',
    cardHistory: 'tickid_phone_card_history',
    buyCardConfirm: 'tickid_phone_card_buy_card_confirm',
    buyCardSuccess: 'tickid_phone_card_buy_card_success'
  },
  httpCode: {
    success: 200
  },
  colors: {
    primary: '#812384',
    white: '#fff',
    black: '#000',
    red: 'red'
  }
};

export default config;
