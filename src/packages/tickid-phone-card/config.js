import { Dimensions } from 'react-native';
import {
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from 'react-native-iphone-x-helper';

const config = {
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
    endpoint: () => 'https://apiapp.tickid.vn',
    phoneCardService: () => '/apiService/info/100'
  },
  route: {
    push: () => {},
    pop: () => {},
    pushToMain: () => {}
  },
  routes: {
    contact: 'tickid-phone-card-contact',
    cardHistory: 'tickid-phone-card-history',
    buyCardConfirm: 'tickid-phone-card-buy-card-confirm',
    buyCardSuccess: 'tickid-phone-card-buy-card-success'
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
