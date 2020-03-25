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
import vi_payment from './vi/payment.json';
import en_payment from './en/payment.json';
import vi_paymentMethod from './vi/paymentMethod.json';
import en_paymentMethod from './en/paymentMethod.json';
import vi_home from './vi/home.json';
import en_home from './en/home.json';
import vi_news from './vi/news.json';
import en_news from './en/news.json';
import vi_orders from './vi/orders.json';
import en_orders from './en/orders.json';
import vi_stores from './vi/stores.json';
import en_stores from './en/stores.json';
import vi_product from './vi/product.json';
import en_product from './en/product.json';
import vi_cart from './vi/cart.json';
import en_cart from './en/cart.json';
import vi_voucher from './vi/voucher.json';
import en_voucher from './en/voucher.json';
import vi_schedule from './vi/schedule.json';
import en_schedule from './en/schedule.json';

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
    payment: vi_payment,
    paymentMethod: vi_paymentMethod,
    stores: vi_stores,
    product: vi_product,
    cart: vi_cart,
    voucher: vi_voucher,
    schedule: vi_schedule
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
    payment: en_payment,
    paymentMethod: en_paymentMethod,
    stores: en_stores,
    product: en_product,
    cart: en_cart,
    voucher: en_voucher,
    schedule: en_schedule
  }
};
