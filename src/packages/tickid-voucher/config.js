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
  route: {
    push: () => {},
    pop: () => {},
    backToMainAndOpenShop: () => {},
    pushToStoreBySiteData: () => {}
  },
  routes: {
    mainVoucher: 'mainVoucher',
    myVoucher: 'myVoucher',
    voucherDetail: 'voucherDetail',
    voucherSelectProvince: 'voucherSelectProvince',
    voucherScanner: 'voucherScanner',
    alreadyVoucher: 'alreadyVoucher',
    voucherEnterCodeManual: 'voucherEnterCodeManual',
    voucherShowBarcode: 'voucherShowBarcode'
  },
  rest: {
    endpoint: () => 'https://apiapp.tickid.vn',
    listCampaigns: () => '/apiVoucher/list_campaign',
    myVouchers: () => '/apiVoucher/my_voucher',
    myVouchersBySiteId: siteId => `/apiVoucher/my_voucher/${siteId}`,
    listCities: () => '/apiVoucher/list_city',
    detailCampaign: id => `/apiVoucher/detail_campaign/${id}`,
    detailVoucher: id => `/apiVoucher/detail_voucher/${id}`,
    saveCampaign: id => `/apiVoucher/save_campaign/${id}`,
    useVoucher: (id, code) => `/apiVoucher/use_voucher/${id}/${code}`,
    useVoucherOnline: (siteId, userVoucherId) =>
      `/apiSite/use_voucher/${siteId}/${userVoucherId}`,
    removeVoucherOnline: (siteId, userVoucherId) =>
      `/apiSite/remove_voucher/${siteId}/${userVoucherId}`,
    saveVoucher: code => `/apiVoucher/save_voucher/${code}`,
    buyCampaign: campaignId => `apiVoucher/buy_campaign/${campaignId}`
  },
  httpCode: {
    success: 200
  },
  colors: {
    primary: '#128C7E',
    white: '#fff',
    black: '#000',
    red: 'red'
  }
};

export default config;
