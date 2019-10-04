import store from 'app-store';
import RNAccountKit, { Color } from 'react-native-facebook-account-kit';

const defaultListener = () => {};

export const runFbAccountKit = ({
  onSuccess = defaultListener,
  onFailure = defaultListener
}) => {
  RNAccountKit.configure({
    responseType: 'token',
    titleType: 'login',
    initialAuthState: '',
    initialPhoneCountryPrefix: '+84',
    facebookNotificationsEnabled: true,
    countryBlacklist: [],
    defaultCountry: 'VN',
    theme: {
      titleColor: Color.hex('#fff')
    },
    viewControllerMode: 'show',
    getACallEnabled: true,
    setEnableInitialSmsButton: false
  });

  // Shows the Facebook Account Kit view for login via SMS
  RNAccountKit.loginWithPhone().then(token => {
    verifyFbAccountKitToken(token)
      .then(onSuccess)
      .catch(onFailure);
  });
};

export const verifyFbAccountKitToken = token => {
  return new Promise(async (resolve, reject) => {
    if (!token) reject();
    try {
      const response = await APIHandler.login_fbak_verify(token);
      if (response && response.status == STATUS_SUCCESS) {
        showMessage({
          message: response.message,
          type: 'success'
        });

        action(() => {
          store.setUserInfo(response.data);
          store.resetCartData();
          store.setRefreshHomeChange(store.refresh_home_change + 1);
        })();

        resolve(response);
      } else if (response) {
        showMessage({
          message: response.message,
          type: 'danger'
        });
        reject(response);
      }
    } catch (error) {
      reject(error);
      console.log(error);
      store.addApiQueue('verifyFbAccountKitToken', verifyFbAccountKitToken);
    }
  });
};
