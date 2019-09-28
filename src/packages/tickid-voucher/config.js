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
    listCampaigns: () => '/apiUser/list_campaign',
    myVouchers: () => '/apiUser/my_voucher',
    listCities: () => '/apiUser/list_city',
    detailCampaign: id => `/apiUser/detail_campaign/${id}`,
    detailVoucher: id => `/apiUser/detail_voucher/${id}`,
    saveCampaign: id => `/apiUser/save_campaign/${id}`,
    useVoucher: (id, code) => `/apiUser/use_voucher/${id}/${code}`
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
