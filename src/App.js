import React, { Component } from 'react';
import './lib/Constant';
import './lib/Helper';
import appConfig from './config';
import store from 'app-store';
import {
  StyleSheet,
  Platform,
  View,
  Alert,
  Text,
  TextInput
} from 'react-native';
import {
  Scene,
  Router,
  Actions,
  Overlay,
  Tabs,
  Stack,
  Modal,
  Lightbox
} from 'react-native-router-flux';
import firebaseConfig from 'react-native-firebase';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';
import OneSignal from 'react-native-onesignal';
import FoodHubCartButton from './components/FoodHubCartButton';
import FlashMessage from 'react-native-flash-message';
import codePush, { LocalPackage } from 'react-native-code-push';
import { CloseButton } from 'app-packages/tickid-navbar';
import handleStatusBarStyle from './helper/handleStatusBarStyle';
import handleTabBarOnPress from './helper/handleTabBarOnPress';
import getTransitionConfig from './helper/getTransitionConfig';
import handleBackAndroid from './helper/handleBackAndroid';
import HomeContainer from './containers/Home';
import QRBarCode from './containers/QRBarCode';
import LaunchContainer from './containers/Launch';
import AddStore from './components/Home/AddStore';
import AddRef from './components/Home/AddRef';
import Notify from './components/notify/Notify';
import Orders from './components/orders/Orders';
import StoreOrders from './components/orders/StoreOrders';
import Account from './components/account/Account';
import Register from './components/account/Register';
import PhoneAuth from './components/account/PhoneAuth';
import OpRegister from './components/account/OpRegister';
import ForgetVerify from './components/account/ForgetVerify';
import ForgetActive from './components/account/ForgetActive';
import NewPass from './components/account/NewPass';
import StoreContainer from './components/stores/Stores';
import SearchNavBarContainer from './components/stores/SearchNavBar';
import StoresList from './components/stores/StoresList';
import SearchStoreContainer from './components/stores/Search';
import Item from './components/item/Item';
import ItemImageViewer from './components/item/ItemImageViewer';
import Cart from './components/cart/Cart';
import Address from './components/payment/Address';
import Confirm from './components/payment/Confirm';
import PaymentMethod from './components/payment/PaymentMethod';
import CreateAddress from './components/payment/CreateAddress';
import OrdersItem from './components/orders/OrdersItem';
import ViewOrdersItem from './components/orders/ViewOrdersItem';
import NotifyItem from './components/notify/NotifyItem';
import SearchStore from './components/Home/SearchStore';
import ListStore from './components/Home/ListStore';
import ScanQRCode from './components/Home/ScanQRCode';
import Chat from './components/chat/Chat';
import WebView from './components/webview/WebView';
import Rating from './components/rating/Rating';
import ChooseLocation from './components/Home/ChooseLocation';
import CoinWallet from './components/account/CoinWallet';
import VndWallet from './components/account/VndWallet/VndWallet';
import PayWallet from './components/account/PayWallet';
import PayAccount from './components/account/PayAccount';
import Affiliate from './components/account/Affiliate/Affiliate';
import ProfileDetail from './components/account/ProfileDetail';
import EditProfile from './components/account/EditProfile';
import DetailHistoryPayment from './components/account/DetailHistoryPayment';
import Transfer, {
  Payment as TransferPayment,
  Confirm as TransferConfirm,
  Result as TransferResult
} from './components/account/Transfer';
import PhoneCardContainer, {
  config as phoneCardConfig,
  initialize as initializePhoneCardModule,
  Contact as PhoneCardContactContainer,
  CardHistory as PhoneCardCardHistoryContainer,
  BuyCardConfirm as PhoneCardBuyCardConfirmContainer,
  BuyCardSuccess as PhoneCardBuyCardSuccessContainer
} from 'app-packages/tickid-phone-card';
import {
  default as AmazingChat,
  ListChat,
  ListChatNavBar,
  SearchChat,
  SearchChatNavBar
} from './components/amazingChat';
import MdCardConfirm from './components/services/MdCardConfirm';
import { default as ServiceOrders } from './components/services/Orders';
import TabIcon from './components/TabIcon';
import {
  initialize as initializeRadaModule,
  Category,
  ListService,
  ServiceDetail,
  Booking,
  OrderHistory
} from '@tickid/tickid-rada';
import {
  initialize as initializeVoucherModule,
  SelectProvince as VoucherSelectProvinceContainer,
  AlreadyVoucher as AlreadyVoucherContainer,
  EnterCodeManual as VoucherEnterCodeManualContainer,
  ShowBarcode as VoucherShowBarcodeContainer,
  MyVoucher as MyVoucherContainer,
  Voucher as VoucherContainer,
  VoucherDetail as VoucherDetailContainer,
  ScanScreen as VoucherScanScreenContainer
} from './packages/tickid-voucher';
import DeviceInfo from 'react-native-device-info';
import getTickUniqueID from 'app-util/getTickUniqueID';
import { navBarConfig, whiteNavBarConfig } from './navBarConfig';
import { addJob } from './helper/jobsOnReset';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import ItemAttribute from './components/stores/ItemAttribute';
import InternetBankingModal from './components/payment/InternetBankingModal';
import AwesomeAlert from 'react-native-awesome-alerts';
import Schedule from './containers/Schedule';
import { ScheduleConfirm } from './containers/Schedule/Confirm';
import * as RNLocalize from 'react-native-localize';
import { arrayLanguages } from './i18n/constants';
import ModalPicker from './components/ModalPicker';
import ModalList from './components/ModalList';
import StoreLocation from './containers/StoreLocation/StoreLocation';
import PlacesAutoComplete from './containers/PlacesAutoComplete';
import { servicesHandler } from './helper/servicesHandler';
import branch from 'react-native-branch';
import ResetPassword from './containers/ResetPassword';

/**
 * Not allow font scaling
 */
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.placeholderTextColor = appConfig.colors.placeholder;
/**
 * Initializes config for Phone Card module
 */
initializePhoneCardModule({
  appName: APP_NAME_SHOW,
  private: {
    appKey: appConfig.voucherModule.appKey,
    secretKey: appConfig.voucherModule.secretKey
  },
  device: {
    appVersion: DeviceInfo.getVersion(),
    deviceId: getTickUniqueID(),
    deviceType: DeviceInfo.getBrand(),
    os: Platform.OS,
    osVersion: DeviceInfo.getSystemVersion(),
    store: ''
  },
  route: {
    push: Actions.push,
    pop: Actions.pop,
    pushToMain: () => {
      Actions.reset(appConfig.routes.primaryTabbar);
    }
  }
});

/**
 * Initializes config for Voucher module
 */
initializeVoucherModule({
  private: {
    appKey: appConfig.voucherModule.appKey,
    secretKey: appConfig.voucherModule.secretKey
  },
  device: {
    appVersion: DeviceInfo.getVersion(),
    deviceId: getTickUniqueID(),
    deviceType: DeviceInfo.getBrand(),
    os: Platform.OS,
    osVersion: DeviceInfo.getSystemVersion(),
    store: ''
  },
  rest: {
    endpoint: () => MY_FOOD_API
  },
  route: {
    push: Actions.push,
    pop: Actions.pop,
    backToMainAndOpenShop: siteData => {
      addJob(() => {
        action(() => {
          store.setStoreData(siteData);
          Actions.push(appConfig.routes.store, {
            title: siteData.name
          });
        })();
      });
      Actions.reset(appConfig.routes.primaryTabbar);
    },
    pushToStoreBySiteData: siteData => {
      action(() => {
        store.setStoreData(siteData);
        Actions.push(appConfig.routes.store, {
          title: siteData.name
        });
      })();
    }
  }
});

/**
 * Initializes config for Rada module
 */
initializeRadaModule({
  private: {
    partnerAuthorization: appConfig.radaModule.partnerAuthorization,
    webhookUrl: null,
    defaultLocation: '37.33233141,-122.0312186',
    appKey: appConfig.voucherModule.appKey,
    secretKey: appConfig.voucherModule.secretKey
  },
  device: {
    appVersion: DeviceInfo.getVersion(),
    deviceId: getTickUniqueID(),
    deviceType: DeviceInfo.getBrand(),
    os: Platform.OS,
    osVersion: DeviceInfo.getSystemVersion(),
    store: ''
  }
});

const preloadImages = [require('./images/logo-640x410.jpg')];
const uris = preloadImages.map(image => ({
  uri: Image.resolveAssetSource(image).uri
}));

FastImage.preload(uris);
//-----react-native-exception-handler------
const errorHandler = (error, isFatal) => {
  if (isFatal) {
    const messageLog = `Error: ${isFatal ? 'Fatal:' : ''} ${
      error.name
    } ${JSON.stringify(error.message)}`;
    Alert.alert('Thông báo', `Tác vụ chưa được thực hiện. Vui lòng thử lại!`, [
      {
        text: 'Đồng ý'
      }
    ]);
    console.log(error, isFatal);
    firebaseConfig.crashlytics().log(messageLog);
    firebaseConfig.crashlytics().recordError(101, messageLog);
  } else {
    console.log(error); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler((error, isFatal) => {
  errorHandler(error, isFatal);
}, true);

setNativeExceptionHandler(exceptionString => {
  console.log(error);
  const messageLog = `Error native: ${exceptionString}`;
  firebaseConfig.crashlytics().log(messageLog);
  firebaseConfig.crashlytics().recordError(102, messageLog);
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      header: null,
      restartAllowed: true,
      progress: null,
      appLanguage: props.i18n.language
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.i18n.language !== nextState.appLanguage) {
      this.setState({
        appLanguage: nextProps.i18n.language
      });
    }

    return true;
  }

  componentDidMount() {
    this.handleSubcribeBranchIO();
    this.handleAddListenerOneSignal();
    this.syncImmediate();
    this.toggleAllowRestart();
    this.getUpdateMetadata();
    // RNLocalize.addEventListener('change', this.localizeListener);
  }

  componentWillUnmount() {
    this.handleRemoveListenerOneSignal();
    store.branchIOUnsubcribe();
  }

  handleSubcribeBranchIO = () => {
    const { t } = this.props;
    const branchIOSubcribe = branch.subscribe(({ error, params }) => {
      if (error) {
        console.error('Error from APP Branch: ' + error);
        return;
      }

      try {
        console.log('APP', params, this.props);
        if (params['+clicked_branch_link'] && params['+match_guaranteed']) {
          if (store.isHomeLoaded) {
            servicesHandler(params, t);
          } else {
            if (params.type === 'affiliate') {
              servicesHandler(params, t);
            } else {
              store.setTempBranchIOSubcribeData({ params, t });
            }
          }
        }
      } catch (err) {
        console.log('APP branchIO', err);
      }
      // params will never be null if error is null
    });

    store.branchIOSubcribe(branchIOSubcribe);
  };

  localizeListener = () => {
    const selectedLanguage = RNLocalize.findBestAvailableLanguage(
      arrayLanguages
    );
    console.log(selectedLanguage, 'rere');
    setAppLanguage(this.props.i18n, selectedLanguage);
  };

  codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({ syncMessage: 'Kiểm tra cập nhât.' });
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({ syncMessage: 'Đang tải...' });
        break;
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({ syncMessage: 'Chờ người dùng cho phép.' });
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({ syncMessage: 'Đang cài đặt...' });
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        this.setState({ syncMessage: 'Cập nhật ứng dụng.', progress: false });
        break;
      case codePush.SyncStatus.UPDATE_IGNORED:
        this.setState({ syncMessage: 'Bỏ qua cập nhật.', progress: false });
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({
          syncMessage: 'Đã cài đặt\r\nMở lại ứng dụng để cập nhật',
          progress: false
        });
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({ syncMessage: 'Có lỗi xảy ra.', progress: false });
        break;
    }
  }

  codePushDownloadDidProgress(progress) {
    this.setState({ progress });
  }

  toggleAllowRestart() {
    this.state.restartAllowed
      ? codePush.disallowRestart()
      : codePush.allowRestart();

    this.setState({ restartAllowed: !this.state.restartAllowed });
  }

  getUpdateMetadata() {
    codePush.getUpdateMetadata(codePush.UpdateState.RUNNING).then(
      metadata => {
        this.setState({
          syncMessage: metadata ? JSON.stringify(metadata) : '...',
          progress: false
        });
      },
      error => {
        this.setState({ syncMessage: 'Lỗi: ' + error, progress: false });
      }
    );
  }

  /** Update is downloaded silently, and applied on restart (recommended) */
  sync() {
    codePush.sync(
      {},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }

  /** Update pops a confirmation dialog, and then immediately reboots the app */
  syncImmediate() {
    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
        updateDialog: {
          optionalIgnoreButtonLabel: 'Bỏ qua',
          optionalInstallButtonLabel: 'Cập nhật',
          optionalUpdateMessage:
            'Đã có bản cập nhât mới. Bạn có muốn cài đặt không?',
          title: 'Cập nhật ứng dụng'
        }
      },
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }

  setHeader(header) {
    this.setState({ header });
  }

  handleAddListenerOneSignal = () => {
    OneSignal.init(appConfig.oneSignal.appKey);
    OneSignal.addEventListener('ids', this.handleAddPushToken);
    OneSignal.inFocusDisplaying(2);
  };

  handleRemoveListenerOneSignal = () => {
    OneSignal.removeEventListener('ids', this.handleAddPushToken);
  };

  async handleAddPushToken(device) {
    if (_.isObject(device)) {
      const push_token = device.pushToken;
      const player_id = device.userId;

      try {
        await APIHandler.add_push_token({
          push_token,
          player_id
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    let loadingPercent;
    let title;

    if (this.state.progress) {
      loadingPercent = Math.round(
        (this.state.progress.receivedBytes / this.state.progress.totalBytes) *
          100
      );
      title = `${this.state.syncMessage} ${
        loadingPercent < 100 ? loadingPercent + '%' : ''
      }`;
    }

    return (
      <View style={{ overflow: 'scroll', flex: 1 }}>
        {this.state.header}
        <RootRouter
          appLanguage={this.state.appLanguage}
          t={this.props.t}
          setHeader={this.setHeader.bind(this)}
        />
        <FlashMessage icon={'auto'} />
        <AwesomeAlert
          show={
            this.state.progress &&
            this.state.progress.receivedBytes > 0 &&
            loadingPercent > 0 &&
            loadingPercent < 100
          }
          showProgress={true}
          title={title}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  tabBarStyle: {
    borderTopWidth: Util.pixel,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    opacity: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 10,
    shadowOpacity: 0.3,
    elevation: 2
  },
  content: {
    width: Util.size.width,
    height: 28,
    backgroundColor: '#FFD2D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isIOS ? 20 : 0
  },
  message: {
    color: '#D8000C',
    fontSize: 14
  },
  safeArea: {
    flex: 1,
    backgroundColor: appConfig.colors.primary
  }
});

// wrap App with codepush HOC
export default withTranslation()(codePush(App));

class RootRouter extends Component {
  state = {};

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.appLanguage !== this.props.appLanguage) {
      return true;
    }
    return false;
  }

  setHeader(header) {
    this.props.setHeader(header);
  }

  render() {
    const { t } = this.props;
    return (
      <Router
        store={store}
        backAndroidHandler={handleBackAndroid}
        onStateChange={(prevState, newState, action) => {
          handleStatusBarStyle(prevState, newState, action);
        }}
      >
        <Overlay key="overlay">
          <Modal key="modal" hideNavBar transitionConfig={getTransitionConfig}>
            <Lightbox key={appConfig.routes.sceneWrapper}>
              <Scene
                key="root"
                titleStyle={{ alignSelf: 'center' }}
                headerLayoutPreset="center"
                hideNavBar
              >
                <Scene
                  appLanguage={this.props.appLanguage}
                  key={appConfig.routes.launch}
                  component={LaunchContainer}
                  initial
                />
                <Tabs
                  showLabel={false}
                  key={appConfig.routes.primaryTabbar}
                  tabBarStyle={styles.tabBarStyle}
                  activeBackgroundColor="#ffffff"
                  inactiveBackgroundColor="#ffffff"
                  tabBarOnPress={props => handleTabBarOnPress({ ...props, t })}
                  {...navBarConfig}
                >
                  {/* ================ HOME TAB ================ */}
                  <Stack
                    key={appConfig.routes.homeTab}
                    icon={TabIcon}
                    iconLabel={t('appTab.tab1.title')}
                    iconName="store"
                    iconSize={24}
                  >
                    <Scene
                      key={`${appConfig.routes.homeTab}_1`}
                      title="FoodHub"
                      component={HomeContainer}
                      hideNavBar
                    />
                  </Stack>

                  {/**
                   ************************ Tab 2 ************************
                   */}
                  <Stack
                    key={appConfig.routes.newsTab}
                    icon={TabIcon}
                    iconLabel={t('appTab.tab2.title')}
                    iconName="notifications"
                    iconSize={24}
                    notifyKey="new_totals"
                  >
                    <Scene
                      key={`${appConfig.routes.newsTab}_1`}
                      title={t('screen.news.mainTitle')}
                      component={Notify}
                    />
                  </Stack>

                  {/* ================ SCAN QR TAB ================ */}
                  <Stack
                    key={appConfig.routes.scanQrCodeTab}
                    icon={FoodHubCartButton}
                    primaryColor={appConfig.colors.primary}
                  >
                    <Scene component={() => null} />
                  </Stack>

                  {/**
                   ************************ Tab 3 ************************
                   */}
                  <Stack
                    key={appConfig.routes.ordersTab}
                    icon={TabIcon}
                    iconSize={24}
                    iconLabel={t('appTab.tab4.title')}
                    iconName="shopping-cart"
                    notifyKey="notify_cart"
                  >
                    <Scene
                      key={`${appConfig.routes.ordersTab}_1`}
                      title={t('screen.orders.mainTitle')}
                      component={Orders}
                    />
                  </Stack>

                  {/**
                   ************************ Tab 4 ************************
                   */}
                  <Stack
                    key="myTab5"
                    icon={TabIcon}
                    iconLabel={t('appTab.tab5.title')}
                    iconName="account-circle"
                    notifyKey="notify_account"
                    iconSize={24}
                  >
                    <Scene
                      key="_account"
                      title={t('screen.account.mainTitle')}
                      component={Account}
                    />
                  </Stack>
                </Tabs>

                {/* ================ MAIN VOUCHER ================ */}
                <Stack key={appConfig.routes.mainVoucher}>
                  <Scene
                    key={`${appConfig.routes.mainVoucher}_1`}
                    title={t('screen.voucher.mainTitle')}
                    component={VoucherContainer}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ VOUCHER DETAIL ================ */}
                <Stack key={appConfig.routes.voucherDetail}>
                  <Scene
                    key={`${appConfig.routes.voucherDetail}_1`}
                    component={VoucherDetailContainer}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                {/* ================ MY VOUCHER ================ */}
                <Stack key={appConfig.routes.myVoucher}>
                  <Scene
                    key={`${appConfig.routes.myVoucher}_1`}
                    title={t('screen.myVoucher.mainTitle')}
                    component={MyVoucherContainer}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                {/* ================ VOUCHER DETAIL ================ */}
                <Stack key={appConfig.routes.voucherDetail}>
                  <Scene
                    key={`${appConfig.routes.voucherDetail}_1`}
                    component={VoucherDetailContainer}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                {/* ================ DEEP LINK FOR TABS ================ */}

                <Stack key={appConfig.routes.deepLinkOrdersTab}>
                  <Scene
                    key={`${appConfig.routes.deepLinkOrdersTab}_1`}
                    title="Đơn hàng"
                    component={Orders}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.deepLinkNewsTab}>
                  <Scene
                    key={`${appConfig.routes.deepLinkNewsTab}_1`}
                    title={t('screen.news.mainTitle')}
                    component={Notify}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ END DEEP LINK ================ */}

                <Stack key={appConfig.routes.myAddress}>
                  <Scene
                    key={`${appConfig.routes.myAddress}_1`}
                    title={t('screen.address.mainTitle')}
                    component={Address}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="coin_wallet">
                  <Scene
                    key="coin_wallet_1"
                    title="Tài khoản xu"
                    component={CoinWallet}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.paymentConfirm}>
                  <Scene
                    key={`${appConfig.routes.paymentConfirm}_1`}
                    title={t('screen.ordersDetail.confirmTitle')}
                    component={Confirm}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.paymentMethod}>
                  <Scene
                    key={`${appConfig.routes.paymentMethod}_1`}
                    title={t('screen.paymentMethod.mainTitle')}
                    component={PaymentMethod}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="create_address">
                  <Scene
                    key="create_address_1"
                    // title="Thêm địa chỉ"
                    component={CreateAddress}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="register">
                  <Scene
                    key="register_1"
                    title={t('screen.register.mainTitle')}
                    component={Register}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="phone_auth">
                  <Scene
                    key="phone_auth_1"
                    hideNavBar
                    component={PhoneAuth}
                    {...navBarConfig}
                  />
                </Stack>

                <Stack key={appConfig.routes.op_register}>
                  <Scene
                    key={`${appConfig.routes.op_register}_1`}
                    title={t('screen.opRegister.mainTitle')}
                    component={OpRegister}
                    {...navBarConfig}
                  />
                </Stack>

                <Stack key="forget_verify">
                  <Scene
                    key="forget_verify_1"
                    title="Lấy lại mật khẩu"
                    component={ForgetVerify}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="forget_active">
                  <Scene
                    key="forget_active_1"
                    title="Kích hoạt tài khoản"
                    component={ForgetActive}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="new_pass">
                  <Scene
                    key="new_pass_1"
                    title="Tạo mật khẩu mới"
                    component={NewPass}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="cart">
                  <Scene
                    key="cart_1"
                    title={t('screen.cart.mainTitle')}
                    component={Cart}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.store}>
                  <Scene
                    key={`${appConfig.routes.store}_1`}
                    component={StoreContainer}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="stores_list">
                  <Scene
                    key="stores_list_1"
                    title="Cửa hàng"
                    component={StoresList}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.searchStore}>
                  <Scene
                    key={`${appConfig.routes.searchStore}_1`}
                    title="Tìm kiếm"
                    component={SearchStoreContainer}
                    navBar={SearchNavBarContainer}
                    {...navBarConfig}
                  />
                </Stack>

                <Stack key="item">
                  <Scene key="item_1" component={Item} {...navBarConfig} back />
                </Stack>

                <Stack key="item_image_viewer">
                  <Scene
                    key="item_image_viewer_1"
                    direction="vertical"
                    hideNavBar
                    component={ItemImageViewer}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="rating">
                  <Scene
                    key="rating_1"
                    title={t('screen.feedback.mainTitle')}
                    component={Rating}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="orders_item">
                  <Scene
                    key="orders_item_1"
                    title={t('screen.ordersDetail.mainTitle')}
                    component={OrdersItem}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="view_orders_item">
                  <Scene
                    key="view_orders_item_1"
                    title="Thông tin đơn hàng"
                    component={ViewOrdersItem}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.notifies}>
                  <Scene
                    key={`${appConfig.routes.notifies}_1`}
                    title={t('screen.news.mainTitle')}
                    component={Notify}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="notifies_time">
                  <Scene
                    key="notifies_time_1"
                    title="Lịch hàng hóa"
                    component={Notify}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="notifies_farm">
                  <Scene
                    key="notifies_farm_1"
                    title="Trang trại"
                    component={Notify}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="notify_item">
                  <Scene
                    key="notify_item_1"
                    title={t('screen.newsDetail.mainTitle')}
                    component={NotifyItem}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="search_store">
                  <Scene
                    key="search_store_1"
                    title="Tìm cửa hàng"
                    component={SearchStore}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.scanQrCode}>
                  <Scene
                    key={`${appConfig.routes.scanQrCode}_1`}
                    title={t('screen.qrBarCode.scanTitle')}
                    component={ScanQRCode}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="list_store">
                  <Scene
                    key="list_store_1"
                    title="Cửa hàng"
                    component={ListStore}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="add_store">
                  <Scene
                    key="add_store_1"
                    title="Thêm cửa hàng"
                    component={AddStore}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={`${appConfig.routes.storeOrders}`}>
                  <Scene
                    key={`${appConfig.routes.storeOrders}_1`}
                    component={StoreOrders}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="chat">
                  <Scene key="chat_1" component={Chat} {...navBarConfig} back />
                </Stack>

                <Stack key="webview">
                  <Scene
                    key="webview_1"
                    component={WebView}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="_add_ref">
                  <Scene
                    key="_add_ref_1"
                    component={AddRef}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="choose_location">
                  <Scene
                    key="choose_location_1"
                    component={ChooseLocation}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="vnd_wallet">
                  <Scene
                    key="vnd_wallet_1"
                    component={VndWallet}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.transfer}>
                  <Scene
                    key={`${appConfig.routes.transfer}_1`}
                    component={Transfer}
                    title={t('screen.transfer.mainTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.transferPayment}>
                  <Scene
                    key={`${appConfig.routes.transferPayment}_1`}
                    component={TransferPayment}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.transferConfirm}>
                  <Scene
                    key={`${appConfig.routes.transferConfirm}_1`}
                    component={TransferConfirm}
                    title={t('screen.securePayment.mainTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.payWallet}>
                  <Scene
                    key={`${appConfig.routes.payWallet}_1`}
                    component={PayWallet}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="pay_account">
                  <Scene
                    key="pay_account_1"
                    component={PayAccount}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="affiliate">
                  <Scene
                    key="affiliate_1"
                    component={Affiliate}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="profile_detail">
                  <Scene
                    key="profile_detail_1"
                    title={t('screen.account.myAccountTitle')}
                    component={ProfileDetail}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="edit_profile">
                  <Scene
                    key="edit_profile_1"
                    title={t('screen.account.editAccountTitle')}
                    component={EditProfile}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="detail_history_payment">
                  <Scene
                    key="detail_history_payment_1"
                    title="Tích điểm"
                    component={DetailHistoryPayment}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.upToPhone}>
                  <Scene
                    key={`${appConfig.routes.upToPhone}_1`}
                    // title="Nạp tiền điện thoại"
                    component={PhoneCardContainer}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={phoneCardConfig.routes.contact}>
                  <Scene
                    key={`${phoneCardConfig.routes.contact}_1`}
                    title={t('screen.contact.mainTitle')}
                    component={PhoneCardContactContainer}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack
                  key={phoneCardConfig.routes.buyCardSuccess}
                  panHandlers={null}
                >
                  <Scene
                    key={`${phoneCardConfig.routes.buyCardSuccess}_1`}
                    component={PhoneCardBuyCardSuccessContainer}
                    hideNavBar
                  />
                </Stack>

                <Stack key={phoneCardConfig.routes.cardHistory}>
                  <Scene
                    key={`${phoneCardConfig.routes.cardHistory}_1`}
                    component={PhoneCardCardHistoryContainer}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="list_amazing_chat">
                  <Scene
                    hideNavBar={false}
                    key="list_amazing_chat_1"
                    title="Danh sách Chat"
                    component={ListChat}
                    navBar={ListChatNavBar}
                    {...navBarConfig}
                    back
                  />
                  <Scene
                    hideNavBar={false}
                    key="search_chat"
                    component={SearchChat}
                    navBar={SearchChatNavBar}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="amazing_chat">
                  <Scene
                    key="amazing_chat_1"
                    hideNavBar={false}
                    component={AmazingChat}
                    setHeader={this.setHeader.bind(this)}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={phoneCardConfig.routes.buyCardConfirm}>
                  <Scene
                    key={`${phoneCardConfig.routes.buyCardConfirm}_1`}
                    title={t('screen.securePayment.mainTitle')}
                    component={PhoneCardBuyCardConfirmContainer}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.tickidRada}>
                  <Scene
                    key="tickidRada1"
                    component={Category}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.tickidRadaListService}>
                  <Scene
                    key="tickidRadaListService1"
                    component={ListService}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.tickidRadaServiceDetail}>
                  <Scene
                    key="tickidRadaServiceDetail1"
                    component={ServiceDetail}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.tickidRadaBooking}>
                  <Scene
                    key="tickidRadaBooking1"
                    component={Booking}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.tickidRadaOrderHistory}>
                  <Scene
                    key="tickidRadaOrderHistory1"
                    component={OrderHistory}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                <Stack key="md_card_confirm">
                  <Scene
                    key="md_card_confirm_1"
                    title={t('screen.ordersDetail.confirmTitle')}
                    component={MdCardConfirm}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.serviceOrders}>
                  <Scene
                    key={`${appConfig.routes.serviceOrders}_1`}
                    title="Đơn dịch vụ"
                    component={ServiceOrders}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.storeLocation}>
                  <Scene
                    key={`${appConfig.routes.storeLocation}_1`}
                    title={t('screen.storeLocation.mainTitle')}
                    component={StoreLocation}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.resetPassword}>
                  <Scene
                    key={`${appConfig.routes.resetPassword}_1`}
                    title={t('screen.resetPassword.mainTitle')}
                    component={ResetPassword}
                    hideNavBar
                  />
                </Stack>

                {/* ================ SCENE VOUCHER SCAN ================ */}
                <Stack key={appConfig.routes.voucherScanner}>
                  <Scene
                    key={`${appConfig.routes.voucherScanner}_1`}
                    title={t('screen.qrBarCode.scanTitle')}
                    component={VoucherScanScreenContainer}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                {/* ================ SCENE SCHEDULE ================ */}
                <Stack key={appConfig.routes.schedule}>
                  <Scene
                    key={`${appConfig.routes.schedule}_1`}
                    title={t('screen.schedule.mainTitle')}
                    component={Schedule}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                {/* ================ SCENE SCHEDULE CONFIRM ================ */}
                <Stack key={appConfig.routes.scheduleConfirm}>
                  <Scene
                    key={`${appConfig.routes.scheduleConfirm}_1`}
                    title={t('screen.scheduleConfirm.mainTitle')}
                    component={ScheduleConfirm}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>
              </Scene>

              {/* ================ LIGHT BOX SELECT PROVINCE ================ */}
              <Stack
                key={appConfig.routes.voucherSelectProvince}
                component={VoucherSelectProvinceContainer}
              />

              {/* ================ LIGHT BOX ALREADY VOUCHER ================ */}
              <Stack
                key={appConfig.routes.alreadyVoucher}
                component={AlreadyVoucherContainer}
              />

              {/* ================ LIGHT BOX ENTER CODE MANUAL ================ */}
              <Stack
                key={appConfig.routes.voucherEnterCodeManual}
                component={VoucherEnterCodeManualContainer}
              />

              {/* ================ LIGHT BOX SHOW PRODUCT's OPTIONS ================ */}
              <Stack
                key={appConfig.routes.itemAttribute}
                component={ItemAttribute}
              />

              {/* ================ MODAL PICKER ================ */}
              <Stack
                key={appConfig.routes.modalPicker}
                component={ModalPicker}
              />

              {/* ================ MODAL LIST ================ */}
              <Stack key={appConfig.routes.modalList} component={ModalList} />

              {/* ================ MODAL LIST ================ */}
              <Stack
                key={appConfig.routes.modalSearchPlaces}
                component={PlacesAutoComplete}
              />
            </Lightbox>

            {/* ================ MODAL SHOW QR/BAR CODE ================ */}
            <Stack key={appConfig.routes.qrBarCode}>
              <Scene
                key={`${appConfig.routes.qrBarCode}_1`}
                component={QRBarCode}
                renderBackButton={CloseButton}
                back
              />
            </Stack>

            {/* ================ MODAL SHOW VOUCHER BARCODE ================ */}
            <Stack key={appConfig.routes.voucherShowBarcode}>
              <Scene
                key={`${appConfig.routes.voucherShowBarcode}_1`}
                title="Mã voucher"
                component={VoucherShowBarcodeContainer}
                renderBackButton={CloseButton}
                back
              />
            </Stack>

            {/* ================ MODAL SHOW VOUCHER BARCODE ================ */}
            <Stack key={appConfig.routes.internetBanking}>
              <Scene
                key={`${appConfig.routes.internetBanking}_1`}
                title="Thẻ ATM"
                component={InternetBankingModal}
                renderBackButton={() => <CloseButton color="#fff" />}
                {...navBarConfig}
                back
              />
            </Stack>

            {/* ================ MODAL TRANSFER RESULT ================ */}
            <Stack key={appConfig.routes.transferResult} panHandlers={null}>
              <Scene
                key={`${appConfig.routes.transferResult}_1`}
                component={TransferResult}
                hideNavBar
              />
            </Stack>
          </Modal>
        </Overlay>
      </Router>
    );
  }
}

// export default RootRouter;
