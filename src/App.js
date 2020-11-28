console.disableYellowBox = true;
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
import codePush, { LocalPackage } from 'react-native-code-push';
import TickIdScaningButton from '@tickid/tickid-scaning-button';
import { CloseButton } from 'app-packages/tickid-navbar';
import handleStatusBarStyle from './helper/handleStatusBarStyle';
import handleTabBarOnPress from './helper/handleTabBarOnPress';
import getTransitionConfig from './helper/getTransitionConfig';
import handleBackAndroid from './helper/handleBackAndroid';
import HomeContainer from './containers/Home';
import CustomerCardWallet from './containers/CustomerCardWallet';
import QRBarCode from './containers/QRBarCode';
import LaunchContainer from './containers/Launch';
import AddStore from './components/Home/AddStore';
import AddRef from './components/Home/AddRef';
import Notify from './components/notify/Notify';
import Orders from './components/orders/Orders';
import StoreOrders from './components/orders/StoreOrders';
import Account from './components/account/Account';
import Register from './components/account/Register';
// import PhoneAuth from './components/account/PhoneAuth';
import PhoneAuth from './containers/PhoneAuth';
import OpRegister from './components/account/OpRegister';
import ForgetVerify from './components/account/ForgetVerify';
import ForgetActive from './components/account/ForgetActive';
import NewPass from './components/account/NewPass';
import StoreContainer from './components/stores/Stores';
import StoreContainerNavBar from './components/stores/StoreNavBar';
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
import { ServiceOrders, ServiceFeedback } from './components/services';
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
import PlacesAutoComplete from './containers/PlacesAutoComplete';
import { servicesHandler, SERVICES_TYPE } from './helper/servicesHandler';
import branch from 'react-native-branch';
import ResetPassword from './containers/ResetPassword';
import RateApp from './components/RateApp';
import Building, { ListBuilding } from './containers/Building';
import Room from './containers/Room';
import Requests, {
  RequestDetail,
  RequestCreation
} from './containers/Requests';
import Bills from './containers/Bills';
import SupplierStore from './components/stores/SupplierStore';
import {
  BillsPaymentMethod,
  BillsPaymentList,
  BillsTransferInfo
} from './containers/Bills/Payment';
import Members from './containers/Members';
import MemberModal from './containers/Members/MemberModal';
import { MultiTaskView } from './components/MultiTaskView/MultiTaskView';
import {
  CustomerSearchingBeeLand,
  ListBeeLand,
  OrderManagementBeeLand,
  ProjectBeeLand
} from './containers/BeeLand';
import { ListRoom } from './containers/Room';
import RegisterStore from './containers/RegisterStore';
import AllServices from './containers/AllServices';
import ProjectProductBeeLand from './containers/BeeLand/ProjectProductBeeLand';
import {
  ConfirmBookingBeeLand,
  CustomerInfoBeeLand,
  DepositPaymentBeeLand
} from './containers/BeeLand/Booking/';
import { ProfileBeeLand } from './containers/BeeLand/CustomerProfile';

import QRPaymentInfo from './components/payment/QRPaymentInfo';
import MultiLevelCategory from './components/stores/MultiLevelCategory';
import AppCodePush from '../AppCodePush';
import ModalPopup from './components/ModalPopup';
import CountryPicker from './components/CountryPicker';
import NetWorkInfo from './components/NetWorkInfo';
import BaseAPI from './network/API/BaseAPI';
import DomainSelector from './containers/DomainSelector';
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
  rest: {
    endpoint: () => BaseAPI.apiDomain
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
    endpoint: () => BaseAPI.apiDomain
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
  colors: {
    primary: appConfig.colors.primary
  },
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
      appLanguage: props.i18n.language,
      isOpenCodePushModal: false,
      codePushUpdateProgress: 0,
      codePushUpdatePackage: null,
      codePushLocalPackage: null,
      titleUpdateCodePushModal: 'Đã có bản cập nhật mới!',
      descriptionUpdateCodePushModal:
        'Hệ thống đang cập nhật.\r\nBạn vui lòng chờ trong giây lát...'
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (nextProps.i18n.language !== nextState.appLanguage) {
      this.setState({
        appLanguage: nextProps.i18n.language
      });
    }

    return true;
  }

  componentDidMount() {
    // codePush.clearUpdates();
    if (__DEV__) {
      console.log('DEVELOPMENT');
    } else {
      this.codePushSyncManually();
    }
    this.codePushGetMetaData();
    this.handleSubcribeBranchIO();
    this.handleAddListenerOneSignal();
    // this.syncImmediate();
    // this.getUpdateMetadata();
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
        if (params['+clicked_branch_link']) {
          if (store.isHomeLoaded || params.type === SERVICES_TYPE.AFFILIATE) {
            servicesHandler(params, t);
          } else {
            store.setTempDeepLinkData({ params, t });
          }
        }
      } catch (err) {
        console.log('APP branchIO', err);
      }
      // params will never be null if error is null
    });

    store.branchIOSubcribe(branchIOSubcribe);
  };

  handleAddListenerOpenedOneSignal = () => {
    OneSignal.addEventListener('opened', this.handleOpenningNotification);
  };

  handleRemoveListenerOpenedOneSignal = () => {
    OneSignal.removeEventListener('opened', this.handleOpenningNotification);
  };

  handleOpenningNotification = openResult => {
    const { t } = this.props;
    const params = openResult.notification.payload.additionalData;
    if (store.isHomeLoaded) {
      servicesHandler(params, t);
    } else {
      store.setTempDeepLinkData({ params, t });
    }
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
        this.setState({ descriptionUpdateCodePushModal: 'Kiểm tra cập nhât.' });
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({ descriptionUpdateCodePushModal: 'Đang tải...' });
        break;
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({
          descriptionUpdateCodePushModal: 'Chờ người dùng cho phép.'
        });
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({ descriptionUpdateCodePushModal: 'Đang cài đặt...' });
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        this.setState({
          descriptionUpdateCodePushModal: 'Cập nhật ứng dụng.',
          progress: false
        });
        break;
      case codePush.SyncStatus.UPDATE_IGNORED:
        this.setState({
          descriptionUpdateCodePushModal: 'Bỏ qua cập nhật.',
          progress: false
        });
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({
          descriptionUpdateCodePushModal:
            'Đã cài đặt\r\nMở lại ứng dụng để cập nhật',
          progress: false
        });
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({
          descriptionUpdateCodePushModal: 'Có lỗi xảy ra.',
          progress: false
        });
        break;
    }
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
        deploymentKey: CPDK[Platform.OS],
        installMode: codePush.InstallMode.IMMEDIATE,
        updateDialog: {
          optionalIgnoreButtonLabel: 'Bỏ qua',
          optionalInstallButtonLabel: 'Cập nhật',
          mandatoryContinueButtonLabel: 'Cập nhật ngay',
          mandatoryUpdateMessage:
            'Đã có bản cập nhât mới. Bạn vui lòng cập nhật để có trải nghiệm tốt nhất!',
          optionalUpdateMessage:
            'Đã có bản cập nhât mới. Bạn có muốn cài đặt không?',
          title: 'Cập nhật ứng dụng'
        }
      },
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }

  codePushGetMetaData() {
    codePush.getUpdateMetadata().then(localPackage => {
      store.setCodePushMetaData(localPackage);
    });
  }

  codePushSyncManually() {
    codePush.checkForUpdate(CPDK[Platform.OS]).then(update => {
      if (!update) {
        console.log('The app is up to date!');
      } else {
        console.log('An update is available! Should we download it?');
        this.setState(
          {
            isOpenCodePushModal: true,
            codePushUpdatePackage: update,
            titleUpdateCodePushModal: 'Cập nhật ' + update.label
          },
          () => {
            this.codePushDownloadUpdate();
          }
        );
      }
    });
  }

  codePushDownloadDidProgress(progress) {
    this.setState({
      codePushUpdateProgress: Math.round(
        (progress.receivedBytes / progress.totalBytes) * 100
      )
    });
  }

  codePushDownloadUpdate() {
    if (!this.state.codePushUpdatePackage) {
      this.closeCodePushModal();
      return;
    }

    this.state.codePushUpdatePackage
      .download(progress => this.codePushDownloadDidProgress(progress))
      .then(localPackage => {
        this.setState(
          {
            codePushLocalPackage: localPackage
          },
          () => {
            // this.codePushInstallUpdate(localPackage);
          }
        );
        // setTimeout(() => this.codePushInstallUpdate(localPackage), 1000);
        console.log(localPackage);
      })
      .catch(err => {
        console.log('%cdownload_update_codepush', 'color:red', err);
        Alert.alert(
          'Lỗi cập nhật',
          'Tải cập nhật thất bại! Bạn vui lòng thử lại sau.',
          [
            {
              text: 'OK',
              onPress: () => this.closeCodePushModal()
            }
          ]
        );
      });
  }

  codePushInstallUpdate(
    codePushLocalPackage = this.state.codePushLocalPackage
  ) {
    codePushLocalPackage
      .install(codePush.InstallMode.IMMEDIATE)
      .then(() => {
        codePush.notifyAppReady();
      })
      .catch(err => {
        console.log('%cinstall_update_codepush', 'color:red', err);
        Alert.alert(
          'Lỗi cập nhật',
          'Cài đặt cập nhật thất bại! Bạn vui lòng thử lại sau.',
          [
            {
              text: 'OK',
              onPress: () => this.closeCodePushModal()
            }
          ]
        );
      });
  }

  handleCodePushProgressComplete() {
    let intervalCheckingLocalPackage = null;
    intervalCheckingLocalPackage = setInterval(() => {
      if (this.state.codePushLocalPackage) {
        clearInterval(intervalCheckingLocalPackage);
        this.closeCodePushModal(() => {
          this.codePushInstallUpdate();
        });
      }
    }, 500);
  }

  closeCodePushModal(callBack = () => {}) {
    this.setState({ isOpenCodePushModal: false }, () => callBack());
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

  handleAddPushToken = async device => {
    if (_.isObject(device)) {
      const push_token = device.pushToken;
      const player_id = device.userId;
      try {
        await APIHandler.add_push_token({
          push_token,
          player_id
        });
        this.handleAddListenerOpenedOneSignal();
      } catch (error) {
        console.log(error);
      }
    }
  };

  render() {
    return (
      <View style={{ overflow: 'scroll', flex: 1 }}>
        {/* <MultiTaskView /> */}
        {/* <ProjectProductBeeLand /> */}
        {this.state.header}
        <NetWorkInfo />
        <RootRouter
          appLanguage={this.state.appLanguage}
          t={this.props.t}
          setHeader={this.setHeader.bind(this)}
        />
        <FlashMessage icon={'auto'} />
        {this.state.isOpenCodePushModal && (
          <AwesomeAlert
            useNativeDriver
            show={this.state.isOpenCodePushModal}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={false}
            // contentContainerStyle={{ }}
            customView={
              <AppCodePush
                title={this.state.titleUpdateCodePushModal}
                description={this.state.descriptionUpdateCodePushModal}
                btnTitle="Cập nhật ngay"
                showConfirmBtn={false}
                progress={this.state.codePushUpdateProgress}
                onProgressComplete={this.handleCodePushProgressComplete.bind(
                  this
                )}
                // onPressConfirm={this.codePushDownloadUpdate.bind(this)}
              />
            }
          />
        )}
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
export default withTranslation()(
  codePush({ checkFrequency: codePush.CheckFrequency.MANUAL })(App)
);

class RootRouter extends Component {
  state = {
    tabVisible: {
      [appConfig.routes.roomTab]: true,
      [appConfig.routes.listBeeLand]: false
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    const isTabVisbleChange = Object.keys(nextState.tabVisible).some(
      nextKey => {
        return Object.keys(this.state.tabVisible).some(currentKey => {
          return (
            nextKey === currentKey &&
            nextState.tabVisible[nextKey] !== this.state.tabVisible[currentKey]
          );
        });
      }
    );

    if (isTabVisbleChange) {
      return true;
    }

    if (nextProps.appLanguage !== this.props.appLanguage) {
      return true;
    }
    return false;
  }

  setTabVisible(tabVisible) {
    this.setState(prev => ({
      tabVisible: {
        ...prev.tabVisible,
        ...tabVisible
      }
    }));
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
                  setTabVisible={this.setTabVisible.bind(this)}
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
                  {/* ================ Tab 1 ================ */}
                  {this.state.tabVisible[appConfig.routes.roomTab] && (
                    <Stack
                      key={appConfig.routes.roomTab}
                      icon={TabIcon}
                      iconLabel={t('appTab.tab1.title')}
                      iconName="sofa"
                      iconSize={24}
                    >
                      <Scene
                        key={`${appConfig.routes.roomTab}_1`}
                        title="HomeID"
                        component={Room}
                        hideNavBar
                      />
                    </Stack>
                  )}

                  {/**
                   ************************ Tab 2 ************************
                   */}
                  {/* <Stack
                    key={appConfig.routes.newsTab}
                    icon={TabIcon}
                    iconLabel={t('appTab.tab2.title')}
                    iconName="newspaper"
                    iconSize={24}
                    notifyKey="new_totals"
                  >
                    <Scene
                      key={`${appConfig.routes.newsTab}_1`}
                      title={t('screen.news.mainTitle')}
                      component={Notify}
                    />
                  </Stack> */}
                  <Stack
                    key={appConfig.routes.homeTab}
                    icon={TabIcon}
                    iconLabel={t('appTab.tab2.title')}
                    iconName="home-assistant"
                    iconSize={24}
                    initial
                  >
                    <Scene
                      key={`${appConfig.routes.homeTab}_1`}
                      component={HomeContainer}
                      hideNavBar
                    />
                  </Stack>

                  {/* ================ SCAN QR TAB ================ */}
                  {/* <Stack
                    key={appConfig.routes.scanQrCodeTab}
                    icon={TickIdScaningButton}
                    primaryColor={appConfig.colors.primary} // optional for TickIdScaningButton
                  >
                    <Scene component={() => null} />
                  </Stack> */}

                  {/**
                   ************************ Tab 3 ************************
                   */}
                  {this.state.tabVisible[appConfig.routes.listBeeLand] && (
                    <Stack
                      key={appConfig.routes.listBeeLand}
                      icon={TabIcon}
                      iconLabel={t('appTab.tab3.title')}
                      iconName="office-building"
                      iconSize={24}
                    >
                      <Scene
                        key={`${appConfig.routes.listBeeLand}_1`}
                        title={t('screen.listBeeLand.mainTitle')}
                        component={ListBeeLand}
                      />
                    </Stack>
                  )}

                  {/**
                   ************************ Tab 4 ************************
                   */}
                  <Stack
                    key={appConfig.routes.accountTab}
                    icon={TabIcon}
                    iconLabel={t('appTab.tab5.title')}
                    iconName="account-circle"
                    notifyKey="notify_account"
                    iconSize={24}
                  >
                    <Scene
                      key={`${appConfig.routes.accountTab}_1`}
                      title={t('screen.account.mainTitle')}
                      component={Account}
                    />
                  </Stack>
                </Tabs>

                <Stack key={appConfig.routes.domainSelector}>
                  <Scene
                    key={`${appConfig.routes.domainSelector}_1`}
                    component={DomainSelector}
                    hideNavBar
                  />
                </Stack>

                {/* ================ LIST BUILDING ================ */}
                <Stack key={appConfig.routes.listBuilding}>
                  <Scene
                    key={`${appConfig.routes.listBuilding}_1`}
                    title={t('screen.listBuilding.mainTitle')}
                    component={ListBuilding}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ BUILDING ================ */}
                <Scene
                  navTransparent
                  key={appConfig.routes.building}
                  component={Building}
                  {...navBarConfig}
                  back={appConfig.device.isIOS}
                />

                {/* ================ ROOM ================ */}
                <Scene
                  navTransparent
                  key={appConfig.routes.room}
                  component={Room}
                  {...navBarConfig}
                  back={appConfig.device.isIOS}
                />

                {/* ================ BILLS ================ */}
                <Stack key={appConfig.routes.bills}>
                  <Scene
                    key={`${appConfig.routes.bills}_1`}
                    component={Bills}
                    title={t('screen.bills.mainTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ BILLS PAYMENT LIST ================ */}
                <Stack key={appConfig.routes.billsPaymentList}>
                  <Scene
                    key={`${appConfig.routes.billsPaymentList}_1`}
                    component={BillsPaymentList}
                    title={t('screen.bills.paymentListTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ BILLS PAYMENT METHOD ================ */}
                <Stack key={appConfig.routes.billsPaymentMethod}>
                  <Scene
                    key={`${appConfig.routes.billsPaymentMethod}_1`}
                    component={BillsPaymentMethod}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ REQUESTS ================ */}
                <Stack key={appConfig.routes.requests}>
                  <Scene
                    key={`${appConfig.routes.requests}_1`}
                    component={Requests}
                    title={t('screen.requests.mainTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ REQUEST CREATION ================ */}
                <Stack key={appConfig.routes.requestCreation}>
                  <Scene
                    key={`${appConfig.routes.requestCreation}_1`}
                    component={RequestCreation}
                    title={t('screen.requests.creationTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ REQUEST DETAIL ================ */}
                <Stack key={appConfig.routes.requestDetail}>
                  <Scene
                    key={`${appConfig.routes.requestDetail}_1`}
                    component={RequestDetail}
                    // title={t('screen.requests.detailTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ MEMBERS ================ */}
                <Stack key={appConfig.routes.members}>
                  <Scene
                    key={`${appConfig.routes.members}_1`}
                    component={Members}
                    title={t('screen.members.mainTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ BILLS TRANSFER INFO ================ */}
                <Stack key={appConfig.routes.transferInfo}>
                  <Scene
                    key={`${appConfig.routes.transferInfo}_1`}
                    title={t('screen.transferInfo.mainTitle')}
                    component={BillsTransferInfo}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ BEELAND PROJECT ================ */}
                <Stack key={appConfig.routes.projectBeeLand}>
                  <Scene
                    key={`${appConfig.routes.projectBeeLand}_1`}
                    component={ProjectBeeLand}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ BEELAND PROJECT PRODUCT ================ */}
                <Stack key={appConfig.routes.projectProductBeeLand}>
                  <Scene
                    key={`${appConfig.routes.projectProductBeeLand}_1`}
                    component={ProjectProductBeeLand}
                    {...navBarConfig}
                    hideNavBar
                    back
                  />
                </Stack>

                {/* ================ BEELAND CUSTOMER INFO BOOKING ================ */}
                <Stack key={appConfig.routes.customerInfoBookingBeeLand}>
                  <Scene
                    key={`${appConfig.routes.customerInfoBookingBeeLand}_1`}
                    component={CustomerInfoBeeLand}
                    title={t('screen.customerInfo.mainTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ BEELAND CONFIRM BOOKING ================ */}
                <Stack key={appConfig.routes.confirmBookingBeeLand}>
                  <Scene
                    key={`${appConfig.routes.confirmBookingBeeLand}_1`}
                    component={ConfirmBookingBeeLand}
                    title={t('screen.confirmBooking.mainTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ BEELAND CUSTOMER SEARCHING ================ */}
                <Stack key={appConfig.routes.customerSearchingBeeLand}>
                  <Scene
                    key={`${appConfig.routes.customerSearchingBeeLand}_1`}
                    component={CustomerSearchingBeeLand}
                    title={t('screen.customerSearching.mainTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ BEELAND LIST ORDER ================ */}
                <Stack key={appConfig.routes.orderManagementBeeLand}>
                  <Scene
                    key={`${appConfig.routes.orderManagementBeeLand}_1`}
                    component={OrderManagementBeeLand}
                    title={t('screen.orderManagement.mainTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ BEELAND CUSTOMER PROFILE ================ */}
                <Stack key={appConfig.routes.customerProfileBeeLand}>
                  <Scene
                    key={`${appConfig.routes.customerProfileBeeLand}_1`}
                    component={ProfileBeeLand}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ CREATE STORE ================ */}
                <Stack key={appConfig.routes.registerStore}>
                  <Scene
                    key={`${appConfig.routes.registerStore}_1`}
                    title={t('screen.registerStore.mainTitle')}
                    component={RegisterStore}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ MULTI LEVEL CATEGORY ================ */}
                <Stack key={appConfig.routes.multiLevelCategory}>
                  <Scene
                    key={`${appConfig.routes.multiLevelCategory}_1`}
                    component={MultiLevelCategory}
                    {...navBarConfig}
                    back
                  />
                </Stack>

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

                <Stack key={appConfig.routes.ordersTab}>
                  <Scene
                    key={`${appConfig.routes.ordersTab}_1`}
                    title={t('screen.orders.mainTitle')}
                    component={Orders}
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
                <Stack key={appConfig.routes.newsTab}>
                  <Scene
                    key={`${appConfig.routes.newsTab}_1`}
                    title="Tin tức"
                    component={Notify}
                    {...navBarConfig}
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

                <Stack key={appConfig.routes.phoneAuth}>
                  <Scene
                    key={`${appConfig.routes.phoneAuth}_1`}
                    hideNavBar
                    component={PhoneAuth}
                    setTabVisible={this.setTabVisible.bind(this)}
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

                <Stack key={appConfig.routes.forgetVerify}>
                  <Scene
                    key={`${appConfig.routes.forgetVerify}_1`}
                    title="Lấy lại mật khẩu"
                    component={ForgetVerify}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.forgetActive}>
                  <Scene
                    key={`${appConfig.routes.forgetActive}_1`}
                    title="Kích hoạt tài khoản"
                    component={ForgetActive}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.newPass}>
                  <Scene
                    key={`${appConfig.routes.newPass}_1`}
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

                <Scene
                  key={appConfig.routes.store}
                  component={StoreContainer}
                  navBar={null}
                />

                <Stack key={appConfig.routes.supplierStore}>
                  <Scene
                    key={`${appConfig.routes.supplierStore}_1`}
                    component={SupplierStore}
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

                <Stack key={appConfig.routes.qrPaymentInfo}>
                  <Scene
                    key={`${appConfig.routes.qrPaymentInfo}_1`}
                    component={QRPaymentInfo}
                    title={t('screen.qrPaymentInfo.mainTitle')}
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

                <Stack key={appConfig.routes.profileDetail}>
                  <Scene
                    key={`${appConfig.routes.profileDetail}_1`}
                    title={t('screen.account.myAccountTitle')}
                    component={ProfileDetail}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.editProfile}>
                  <Scene
                    key={`${appConfig.routes.editProfile}_1`}
                    title={t('screen.account.editAccountTitle')}
                    component={EditProfile}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.detailHistoryPayment}>
                  <Scene
                    key={`${appConfig.routes.detailHistoryPayment}_1`}
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
                    title="Chat với Cửa hàng"
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

                <Stack key={appConfig.routes.serviceFeedback}>
                  <Scene
                    key={`${appConfig.routes.serviceFeedback}_1`}
                    title={t('screen.feedback.mainTitle')}
                    component={ServiceFeedback}
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
                    component={ScheduleConfirm}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                {/* ================ ALL SERVICES ================ */}
                <Stack key={appConfig.routes.allServices}>
                  <Scene
                    key={`${appConfig.routes.allServices}_1`}
                    component={AllServices}
                    title={t('screen.allServices.mainTitle')}
                    {...navBarConfig}
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

              {/* ================ MODAL SEARCH PLACES ================ */}
              <Stack
                key={appConfig.routes.modalSearchPlaces}
                component={PlacesAutoComplete}
              />

              {/* ================ MODAL RATE APP ================ */}
              <Stack key={appConfig.routes.modalRateApp} component={RateApp} />

              {/* ================ MODAL MEMBER ================ */}
              <Stack
                key={appConfig.routes.memberModal}
                component={MemberModal}
              />

              {/* ================ MODAL LIST ROOM ================ */}
              <Stack key={appConfig.routes.listRoom} component={ListRoom} />

              {/* ================ MODAL POPUP ================ */}
              <Stack key={appConfig.routes.modalPopup} component={ModalPopup} />

              {/* ================ COUNTRY PICKER ================ */}
              <Stack
                key={appConfig.routes.countryPicker}
                component={CountryPicker}
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
