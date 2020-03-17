import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translateVI from './translations/vi/common.json';
import translateEN from './translations/en/common.json';
import vi_account from './translations/vi/account.json';
import en_account from './translations/en/account.json';
import vi_affiliate from './translations/vi/affiliate.json';
import en_affiliate from './translations/en/affiliate.json';
import vi_phoneAuth from './translations/vi/phoneAuth.json';
import en_phoneAuth from './translations/en/phoneAuth.json';
import vi_editProfile from './translations/vi/editProfile.json';
import en_editProfile from './translations/en/editProfile.json';
import vi_profileDetail from './translations/vi/profileDetail.json';
import en_profileDetail from './translations/en/profileDetail.json';
import vi_address from './translations/vi/address.json';
import en_address from './translations/en/address.json';
import vi_createAddress from './translations/vi/createAddress.json';
import en_createAddress from './translations/en/createAddress.json';
import vi_vndWallet from './translations/vi/vndWallet.json';
import en_vndWallet from './translations/en/vndWallet.json';
import vi_qrBarCode from './translations/vi/qrBarCode.json';
import en_qrBarCode from './translations/en/qrBarCode.json';
import vi_transfer from './translations/vi/transfer.json';
import en_transfer from './translations/en/transfer.json';
import vi_payment from './translations/en/payment.json';
import en_payment from './translations/en/payment.json';

i18n.use(initReactI18next).init(
  {
    lng: 'en',
    fallbackLng: 'vi',
    debug: true,

    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    resources: {
      vi: {
        common: translateVI,
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
      en: {
        common: translateEN,
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
    },
    ns: ['common'],
    defaultNS: 'common'
  },
  () => {
    console.log('from init', i18n.language);
  }
);

export default i18n;
