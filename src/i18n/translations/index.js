import { languages } from '../constants';

import vi_common from './vi/common.json';
import en_common from './en/common.json';
import vi_account from './vi/account.json';
import en_account from './en/account.json';
import vi_affiliate from './vi/affiliate.json';
import en_affiliate from './en/affiliate.json';
import vi_phoneAuth from './vi/phoneAuth.json';
import en_phoneAuth from './en/phoneAuth.json';
import vi_editProfile from './vi/editProfile.json';
import en_editProfile from './en/editProfile.json';
import vi_profileDetail from './vi/profileDetail.json';
import en_profileDetail from './en/profileDetail.json';
import vi_address from './vi/address.json';
import en_address from './en/address.json';
import vi_createAddress from './vi/createAddress.json';
import en_createAddress from './en/createAddress.json';
import vi_vndWallet from './vi/vndWallet.json';
import en_vndWallet from './en/vndWallet.json';
import vi_qrBarCode from './vi/qrBarCode.json';
import en_qrBarCode from './en/qrBarCode.json';
import vi_transfer from './vi/transfer.json';
import en_transfer from './en/transfer.json';
import vi_payment from './en/payment.json';
import en_payment from './en/payment.json';
import vi_home from './vi/home.json';
import en_home from './en/home.json';
import vi_news from './en/news.json';
import en_news from './en/news.json';
import vi_orders from './en/orders.json';
import en_orders from './en/orders.json';

export default {
  [languages.vi.value]: {
    common: vi_common,
    home: vi_home,
    news: vi_news,
    orders: vi_orders,
    account: vi_account,
    affiliate: vi_affiliate,
    phoneAuth: vi_phoneAuth,
    editProfile: vi_editProfile,
    profileDetail: vi_profileDetail,
    address: vi_address,
    createAddress: vi_createAddress,
    vndWallet: vi_vndWallet,
    qrBarCode: vi_qrBarCode,
    transfer: vi_transfer,
    payment: vi_payment
  },
  [languages.en.value]: {
    common: en_common,
    home: en_home,
    news: en_news,
    orders: en_orders,
    account: en_account,
    affiliate: en_affiliate,
    phoneAuth: en_phoneAuth,
    editProfile: en_editProfile,
    profileDetail: en_profileDetail,
    address: en_address,
    createAddress: en_createAddress,
    vndWallet: en_vndWallet,
    qrBarCode: en_qrBarCode,
    transfer: en_transfer,
    payment: en_payment
  }
};
