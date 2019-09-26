const config = {
  private: {
    appKey: 'tickidkey',
    secretKey: '0011tickidkey001122private'
  },
  device: {
    appVersion: '',
    deviceId: '',
    deviceType: '',
    os: '',
    osVersion: '',
    store: ''
  },
  rest: {
    endpoint: () => 'https://apiapp.tickid.vn',
    listCampaigns: () => '/apiUser/list_campaign',
    myVouchers: () => '/apiUser/my_voucher',
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
