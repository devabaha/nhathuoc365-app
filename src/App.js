LogBox.ignoreAllLogs();
import React, {Component} from 'react';
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
  TextInput,
  LogBox,
} from 'react-native';
import {
  Scene,
  Router,
  Actions,
  Overlay,
  Tabs,
  Stack,
  Modal,
  Lightbox,
  Drawer as RNRFDrawer,
} from 'react-native-router-flux';
import OneSignal from 'react-native-onesignal';
import codePush, {LocalPackage} from 'react-native-code-push';
import FoodHubCartButton from './components/FoodHubCartButton';
import * as Sentry from '@sentry/react-native';
import {CloseButton} from 'app-packages/tickid-navbar';
import handleStatusBarStyle from './helper/statusBar';
import handleTabBarOnPress from './helper/handleTabBarOnPress';
import getTransitionConfig from './helper/getTransitionConfig';
import handleBackAndroid from './helper/handleBackAndroid';
import HomeContainer from './containers/Home';
import QRBarCode from './containers/QRBarCode';
import LaunchContainer from './containers/Launch';
import Notify from './components/notify/Notify';
import Orders from './components/orders/Orders';
import StoreOrders from './components/orders/StoreOrders';
import Account from './components/account/Account';
import PhoneAuth from './containers/PhoneAuth';
import OpRegister from './components/account/OpRegister';
import StoreContainer from './components/stores/Stores';
import SearchNavBarContainer from './components/stores/SearchNavBar';
import SearchStoreContainer from './components/stores/Search';
import Item from './components/item/Item';
import ItemImageViewer from './components/item/ItemImageViewer';
import Address from './components/payment/Address';
import Confirm from './components/payment/Confirm';
import PaymentMethod from './components/payment/PaymentMethod';
import CreateAddress from './components/payment/CreateAddress';
import OrdersItem from './components/orders/OrdersItem';
import NotifyItem from './components/notify/NotifyItem';
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
  Result as TransferResult,
} from './components/account/Transfer';
import PhoneCardContainer, {
  config as phoneCardConfig,
  initialize as initializePhoneCardModule,
  Contact as PhoneCardContactContainer,
  CardHistory as PhoneCardCardHistoryContainer,
  BuyCardConfirm as PhoneCardBuyCardConfirmContainer,
  BuyCardSuccess as PhoneCardBuyCardSuccessContainer,
} from 'app-packages/tickid-phone-card';
import {
  default as AmazingChat,
  ListChat,
  ListChatNavBar,
  SearchChat,
  SearchChatNavBar,
} from './components/amazingChat';
import {ServiceOrders} from './components/services';
import TabBar, {TabIcon} from './components/TabBar';
import {
  initialize as initializeRadaModule,
  Category,
  ListService,
  ServiceDetail,
  Booking as RadaBooking,
  OrderHistory,
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
  ScanScreen as VoucherScanScreenContainer,
} from './packages/tickid-voucher';
import DeviceInfo from 'react-native-device-info';
import getTickUniqueID from 'app-util/getTickUniqueID';
import {navBarConfig, whiteNavBarConfig, routerConfig} from './navBarConfig';
import {addJob} from './helper/jobsOnReset';
import ItemAttribute from './components/stores/ItemAttribute';
import PaymentMethodDetailModal from './components/payment/PaymentMethodDetailModal';
import AwesomeAlert from 'react-native-awesome-alerts';
import Schedule, {ProductSchedule} from './containers/Schedule';
import {ScheduleConfirm} from './containers/Schedule/Confirm';
import * as RNLocalize from 'react-native-localize';
import {arrayLanguages} from './i18n/constants';
import ModalPicker from './components/ModalPicker';
import ModalList from './components/ModalList';
import StoreLocation from './containers/StoreLocation/StoreLocation';
import PlacesAutoComplete from './containers/PlacesAutoComplete';
import {servicesHandler, SERVICES_TYPE} from './helper/servicesHandler';
import branch from 'react-native-branch';
import ResetPassword from './containers/ResetPassword';
import RateApp from './components/RateApp';
import AllServices from './containers/AllServices';
import CameraView from './components/CameraView/CameraView';
import {CaptureFaceID} from './containers/IView';
import GPSStoreLocation from './containers/GPSStoreLocation';
import QRPaymentInfo from './components/payment/QRPaymentInfo';
import MultiLevelCategory from './components/stores/MultiLevelCategory';
import AppCodePush from '../AppCodePush';
import ModalPopup from './components/ModalPopup';
import CountryPicker from './components/CountryPicker';
import NetworkInfo from './components/NetworkInfo';
import BaseAPI from './network/API/BaseAPI';
import DomainSelector from './containers/DomainSelector';
import PremiumInfo from './containers/PremiumInfo';
import GroupProduct from './containers/GroupProduct';
import GPSListStore from './containers/GPSListStore';
import AgencyInformationRegister from './containers/AgencyInformationRegister';
import CommissionIncomeStatement from './containers/CommissionIncomeStatement';
import ModalInput from './components/ModalInput';
import {LotteryGame} from './containers/Gamification';
import ModalConfirm from './components/ModalConfirm';
import ProductStamps from './containers/ProductStamps';
import ModalComboLocation from './components/ModalComboLocation';
import APIHandler from './network/APIHandler';
import Transaction from './components/payment/Transaction';
import {ModalComment, SocialCreatePost} from './components/Social';
import {Social, SocialNews, SocialGroup} from './containers/Social';
import ModalEditImages from './components/ModalEditImages';
import SalesReport from './containers/SalesReport';
import {
  FilterDrawer,
  ModalFilterProduct,
} from './components/stores/FilterProduct';
import Drawer from './components/Drawer';

import SVGHome from './images/home/home.svg';
import SVGNews from './images/home/news.svg';
import SVGOrders from './images/home/orders.svg';
import SVGAccount from './images/home/account.svg';
import ProgressTracking, {
  ProgressTrackingDetail,
} from './containers/ProgressTracking';
import Profile from './containers/Profile';
import EditPersonalProfile from './containers/EditProfile';
import {
  ListUserChat,
  ListUserChatNavBar,
  SearchUserChat,
  SearchUserChatNavBar,
  UserChat as AmazingUserChat,
} from './components/amazingUserChat';

import ListAddressStore from './containers/ListAddressStore';
import AirlineTicket from './containers/AirlineTicket';
import DatePicker from './containers/AirlineTicket/DatePicker';
import Place from './containers/AirlineTicket/Place';
import Customer from './containers/AirlineTicket/Customer';
import Result from './containers/AirlineTicket/Result';
import PlaceNavBar from './containers/AirlineTicket/Place/PlaceNavBar';
import Booking from './containers/Booking';
import ModalCalendar from './components/ModalCalendar';
import MainNotify from './components/notify/MainNotify';
import ModalActionSheet from './components/ModalActionSheet';
import Requests, {RequestDetail, RequestCreation} from './containers/Requests';
import ModalDateTimePicker from './components/ModalDateTimePicker';
import {ThemeProvider} from './Themes/Theme.context';
import {BASE_LIGHT_THEME} from './Themes/Theme.light';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {pop, push, reset} from 'app-helper/routing';
import {StatusBar} from './components/base';
import ModalLicense from './components/ModalLicense';
import {setAppLanguage} from './i18n/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalDeliverySchedule from './components/payment/Confirm/components/DeliveryScheduleSection/ModalDeliverySchedule';
import MixedVoucher from 'src/containers/MixedVoucher';
import {default as CustomAlert} from 'src/components/Alert';
import {AlertContextProvider} from './shared/contexts';

/**
 * Not allow font scaling
 */
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.placeholderTextColor = appConfig.colors.placeholder;
TextInput.defaultProps.underlineColorAndroid = 'transparent';
/**
 * Initializes config for Phone Card module
 */
initializePhoneCardModule({
  appName: APP_NAME_SHOW,
  private: {
    appKey: appConfig.voucherModule.appKey,
    secretKey: appConfig.voucherModule.secretKey,
  },
  device: {
    appVersion: DeviceInfo.getVersion(),
    deviceId: getTickUniqueID(),
    deviceType: DeviceInfo.getBrand(),
    os: Platform.OS,
    osVersion: DeviceInfo.getSystemVersion(),
    store: '',
  },
  rest: {
    endpoint: () => BaseAPI.apiDomain,
  },
  route: {
    push: push,
    pop: pop,
    pushToMain: () => {
      reset(appConfig.routes.primaryTabbar);
    },
  },
});

/**
 * Initializes config for Voucher module
 */
initializeVoucherModule({
  private: {
    appKey: appConfig.voucherModule.appKey,
    secretKey: appConfig.voucherModule.secretKey,
  },
  device: {
    appVersion: DeviceInfo.getVersion(),
    deviceId: getTickUniqueID(),
    deviceType: DeviceInfo.getBrand(),
    os: Platform.OS,
    osVersion: DeviceInfo.getSystemVersion(),
    store: '',
  },
  rest: {
    endpoint: () => BaseAPI.apiDomain,
  },
  route: {
    push,
    pop,
    backToMainAndOpenShop: (siteData, theme) => {
      addJob(() => {
        store.setStoreData(siteData);
        push(
          appConfig.routes.store,
          {
            title: siteData.name,
          },
          theme,
        );
      });
      reset(appConfig.routes.primaryTabbar);
    },
    pushToStoreBySiteData: (siteData, theme) => {
      store.setStoreData(siteData);
      push(
        appConfig.routes.store,
        {
          title: siteData.name,
        },
        theme,
      );
    },
  },
});

/**
 * Initializes config for Rada module
 */
initializeRadaModule({
  colors: {
    primary: appConfig.colors.primary,
  },
  private: {
    partnerAuthorization: appConfig.radaModule.partnerAuthorization,
    webhookUrl: null,
    defaultLocation: '37.33233141,-122.0312186',
    appKey: appConfig.voucherModule.appKey,
    secretKey: appConfig.voucherModule.secretKey,
  },
  device: {
    appVersion: DeviceInfo.getVersion(),
    deviceId: getTickUniqueID(),
    deviceType: DeviceInfo.getBrand(),
    os: Platform.OS,
    osVersion: DeviceInfo.getSystemVersion(),
    store: '',
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    // codePush.clearUpdates();
    if (__DEV__) {
      console.log('DEVELOPMENT');
    } else {
      this.initSentry();
      this.codePushSyncManually();
    }

    this.state = {
      header: null,
      overlayComponent: null,
      restartAllowed: true,
      progress: null,
      appLanguage: props.i18n.language,
      isOpenCodePushModal: false,
      codePushUpdateProgress: 1,
      codePushUpdatePackage: null,
      codePushLocalPackage: null,
      titleUpdateCodePushModal: '',
      descriptionUpdateCodePushModal: '',
    };

    this.tempDeepLinkData = null;
  }

  get titleUpdateCodePushModal() {
    return this.props.t('codePush.alert.hasUpdateTitle');
  }

  get descriptionUpdateCodePushModal() {
    return this.props.t('codePush.alert.hasUpdateDescription');
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (nextProps.i18n.language !== nextState.appLanguage) {
      this.setState({
        appLanguage: nextProps.i18n.language,
      });
    }

    return true;
  }

  componentDidMount() {
    this.codePushGetMetaData();
    this.handleSubscribeBranchIO();
    this.handleAddListenerOneSignal();
    // this.syncImmediate();
    // this.getUpdateMetadata();
    // RNLocalize.addEventListener('change', this.localizeListener);
  }

  componentWillUnmount() {
    store.branchIOUnsubscribe();
  }

  initSentry = async (update) => {
    let sentryOptions = {
      dsn: appConfig.sentry.dsn,
      release: ``,
    };

    const formatSentryOptions = (updateData) => {
      return {
        ...sentryOptions,
        release: `${DeviceInfo.getBundleId()}@${DeviceInfo.getVersion()}+codepush:${
          updateData.label
        }`,
        dist: updateData.label,
      };
    };

    if (update) {
      sentryOptions = formatSentryOptions(update);
    } else {
      try {
        let codePushUpdate = await AsyncStorage.getItem('codePushUpdate');
        codePushUpdate = JSON.parse(codePushUpdate);

        if (
          !!codePushUpdate &&
          codePushUpdate.appVersion === DeviceInfo.getVersion()
        ) {
          sentryOptions = formatSentryOptions(codePushUpdate);
        } else {
          sentryOptions = {
            ...sentryOptions,
            release: `${DeviceInfo.getBundleId()}@${DeviceInfo.getVersion()}+${DeviceInfo.getBuildNumber()}`,
          };
        }
      } catch (e) {
        console.log('sentry init error', e);
      }
    }

    Sentry.init(sentryOptions);
  };

  executeTempDeepLinkData = async (tempDeepLinkData = null) => {
    if (!tempDeepLinkData) {
      tempDeepLinkData = await AsyncStorage.getItem('tempDeepLinkData');
    }
    // console.log('abc', tempDeepLinkData);
    if (tempDeepLinkData) {
      try {
        AsyncStorage.removeItem('tempDeepLinkData');
        if (typeof tempDeepLinkData === 'string') {
          tempDeepLinkData = JSON.parse(tempDeepLinkData);
        }
        const {t} = this.props;

        if (
          store.isHomeLoaded ||
          tempDeepLinkData.type === SERVICES_TYPE.AFFILIATE
        ) {
          servicesHandler({...tempDeepLinkData, theme: store.theme}, t);
        } else {
          store.setTempDeepLinkData({params: tempDeepLinkData, t});
        }
      } catch (error) {
        console.log('executeTempDeepLinkData', error);
      }
    }
  };

  handleSubscribeBranchIO = () => {
    const {t} = this.props;

    const branchIOSubscribe = branch.subscribe(async ({error, params}) => {
      if (error) {
        console.error('Error from APP Branch: ' + error);
        return;
      }

      try {
        console.log('APP', params, this.props);
        let tempDeepLinkData = await AsyncStorage.getItem('tempDeepLinkData');
        if (tempDeepLinkData) {
          try {
            tempDeepLinkData = JSON.parse(tempDeepLinkData);
          } catch (error) {
            console.log('getTempDeepLinkData', error);
          }

          if (
            tempDeepLinkData &&
            (!!tempDeepLinkData['+click_timestamp']
              ? tempDeepLinkData['+click_timestamp'] ===
                params['+click_timestamp']
              : true)
          ) {
            this.executeTempDeepLinkData(tempDeepLinkData);
            return;
          }
        }
        this.tempDeepLinkData = params;

        if (params['+clicked_branch_link']) {
          if (store.isHomeLoaded || params.type === SERVICES_TYPE.AFFILIATE) {
            servicesHandler({...params, theme: store.theme}, t);
          } else {
            store.setTempDeepLinkData({params, t});
          }
        }
      } catch (err) {
        console.log('APP branchIO', err);
      }
      // params will never be null if error is null
    });

    store.branchIOSubscribe(branchIOSubscribe);
  };

  handleOpeningNotification = ({notification}) => {
    const {t} = this.props;
    const params = notification?.additionalData;
    console.log(params);
    if (!params) return;

    if (store.isHomeLoaded) {
      servicesHandler({...params, theme: store.theme}, t);
    } else {
      store.setTempDeepLinkData({params, t});
    }
  };

  localizeListener = () => {
    const selectedLanguage = RNLocalize.findBestAvailableLanguage(
      arrayLanguages,
    );
    console.log(selectedLanguage, 'rere');
    setAppLanguage(this.props.i18n, selectedLanguage);
  };

  async updateAppVersionsInfo(codePushVersion) {
    const data = {
      code_push_version: codePushVersion,
      tag_version: appConfig.tagVersion,
    };
    const response = await APIHandler.user_device(data);
  }

  codePushGetMetaData() {
    codePush.getUpdateMetadata().then((localPackage) => {
      store.setCodePushMetaData(localPackage);
      this.updateAppVersionsInfo(localPackage?.label);
    });
  }

  codePushSyncManually = () => {
    codePush.checkForUpdate(CPDK[Platform.OS]).then((update) => {
      if (!update) {
        console.log('The app is up to date!');
      } else {
        AsyncStorage.setItem('codePushUpdate', JSON.stringify(update));

        AsyncStorage.setItem(
          'tempDeepLinkData',
          JSON.stringify(this.tempDeepLinkData),
        );

        console.log('An update is available! Should we download it?');
        this.setState(
          {
            isOpenCodePushModal: true,
            codePushUpdatePackage: update,
            titleUpdateCodePushModal:
              this.props.t('update') + ' ' + update.label,
          },
          () => {
            this.codePushDownloadUpdate();
          },
        );
      }
    });
  };

  codePushDownloadDidProgress(progress) {
    this.setState({
      codePushUpdateProgress: Math.round(
        (progress.receivedBytes / progress.totalBytes) * 100,
      ),
    });
  }

  codePushDownloadUpdate() {
    if (!this.state.codePushUpdatePackage) {
      this.closeCodePushModal();
      return;
    }

    this.state.codePushUpdatePackage
      .download((progress) => this.codePushDownloadDidProgress(progress))
      .then((localPackage) => {
        this.setState(
          {
            codePushLocalPackage: localPackage,
          },
          () => {
            setTimeout(() => {
              if (this.state.codePushLocalPackage) {
                this.codePushInstallUpdate();
              }
            }, 5000);
          },
        );
      })
      .catch((err) => {
        console.log('%cdownload_update_codepush', 'color:red', err);
        Alert.alert(
          this.props.t('codePush.alert.failTitle'),
          this.props.t('codePush.alert.failDescription'),
          [
            {
              text: 'OK',
              onPress: () => this.closeCodePushModal(),
            },
          ],
        );
      });
  }

  codePushInstallUpdate = (
    codePushLocalPackage = this.state.codePushLocalPackage,
  ) => {
    if (!codePushLocalPackage) return;

    codePushLocalPackage
      .install(codePush.InstallMode.IMMEDIATE)
      .then(() => {
        codePush.notifyAppReady();
      })
      .catch((err) => {
        console.log('%cinstall_update_codepush', 'color:red', err);
        Alert.alert(
          this.props.t('codePush.alert.failTitle'),
          this.props.t('codePush.alert.failDescription'),
          [
            {
              text: 'OK',
              onPress: () => this.closeCodePushModal(),
            },
          ],
        );
      });
  };

  handleCodePushProgressComplete = () => {
    let intervalCheckingLocalPackage = null;
    intervalCheckingLocalPackage = setInterval(() => {
      if (this.state.codePushLocalPackage) {
        clearInterval(intervalCheckingLocalPackage);
        this.closeCodePushModal(() => {
          this.codePushInstallUpdate();
        });
      }
    }, 500);
  };

  closeCodePushModal = (callBack = () => {}) => {
    this.setState({isOpenCodePushModal: false}, () => callBack());
  };

  setHeader = (header) => {
    this.setState({header});
  };

  setOverlayComponent = (overlayComponent) => {
    this.setState({overlayComponent});
  };

  handleAddListenerOneSignal = () => {
    OneSignal.setAppId(appConfig.oneSignal.appKey);
    //Prompt for push on iOS
    OneSignal.promptForPushNotificationsWithUserResponse((response) => {
      console.log('Prompt response:', response);
    });

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      (notificationReceivedEvent) => {
        console.log(
          'OneSignal: notification will show in foreground:',
          notificationReceivedEvent,
        );
        let notification = notificationReceivedEvent.getNotification();
        console.log('notification: ', notification);
        const data = notification.additionalData;
        console.log('additionalData: ', data);
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
      },
    );

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler((notification) => {
      console.log('OneSignal: notification opened:', notification);
      this.handleOpeningNotification(notification);
    });

    OneSignal.addSubscriptionObserver((event) => {
      OneSignal.getDeviceState().then(this.handleAddPushToken);
    });
  };

  handleAddPushToken = async (device) => {
    if (_.isObject(device)) {
      const push_token = device.pushToken;
      const player_id = device.userId;
      try {
        await APIHandler.add_push_token({
          push_token,
          player_id,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  render() {
    return (
      <ThemeProvider initial={BASE_LIGHT_THEME}>
        <AlertContextProvider>
          <SafeAreaProvider style={{overflow: 'scroll', flex: 1}}>
            <StatusBar />
            {this.state.header}
            <NetworkInfo />
            <RootRouter
              appLanguage={this.state.appLanguage}
              t={this.props.t}
              setHeader={this.setHeader}
            />
            <Drawer />
            <CustomAlert />
            <FlashMessage icon={'auto'} />
            <AwesomeAlert
              useNativeDriver
              show={this.state.isOpenCodePushModal}
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              showCancelButton={false}
              showConfirmButton={false}
              contentContainerStyle={styles.awesomeAlertContainer}
              customView={
                <AppCodePush
                  title={
                    this.state.titleUpdateCodePushModal ||
                    this.titleUpdateCodePushModal
                  }
                  description={
                    this.state.descriptionUpdateCodePushModal ||
                    this.descriptionUpdateCodePushModal
                  }
                  progress={this.state.codePushUpdateProgress}
                  onProgressComplete={this.handleCodePushProgressComplete}
                  onPressConfirm={() => this.closeCodePushModal()}
                />
              }
            />
          </SafeAreaProvider>
        </AlertContextProvider>
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  tabBarStyle: {
    borderTopWidth: 0,
    // borderColor: '#cccccc',
    // shadowColor: 'black',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowRadius: 10,
    // shadowOpacity: 0.3,
    // elevation: 2,
    // backgroundColor: 'transparent',
    overflow: 'visible',
    height: 44 + appConfig.device.bottomSpace,
  },
  awesomeAlertContainer: {
    backgroundColor: 'transparent',
  },
  accountSceneNavBar: {
    ...whiteNavBarConfig.navigationBarStyle,
    height: 70,
    borderBottomWidth: 0.5,
  },
});

// wrap App with codepush HOC
// export default App;
export default withTranslation()(
  codePush({checkFrequency: codePush.CheckFrequency.MANUAL})(Sentry.wrap(App)),
);

class RootRouter extends Component {
  state = {
    tabVisible: {},
  };

  shouldComponentUpdate(nextProps, nextState) {
    const isTabVisbleChange = Object.keys(nextState.tabVisible).some(
      (nextKey) => {
        return Object.keys(this.state.tabVisible).some((currentKey) => {
          return (
            nextKey === currentKey &&
            nextState.tabVisible[nextKey] !== this.state.tabVisible[currentKey]
          );
        });
      },
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
    this.setState((prev) => ({
      tabVisible: {
        ...prev.tabVisible,
        ...tabVisible,
      },
    }));
  }

  setHeader(header) {
    this.props.setHeader(header);
  }

  handleStateChange = (prevState, newState, action) => {
    handleStatusBarStyle(prevState, newState, action);
  };

  render() {
    const {t} = this.props;
    return (
      <Router
        store={store}
        backAndroidHandler={handleBackAndroid}
        onStateChange={this.handleStateChange}
        {...routerConfig}>
        <Overlay key="overlay">
          <Modal key="modal" hideNavBar transitionConfig={getTransitionConfig}>
            <Lightbox key={appConfig.routes.sceneWrapper}>
              <Scene
                key="root"
                titleStyle={{alignSelf: 'center'}}
                headerLayoutPreset="center"
                hideNavBar>
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
                  tabBarComponent={TabBar}
                  // activeBackgroundColor={this.theme.color.surface}
                  // inactiveBackgroundColor={this.theme.color.surface}
                  tabBarOnPress={(props) => handleTabBarOnPress({...props, t})}
                  safeAreaInset={{bottom: 'never'}}
                  {...navBarConfig}>
                  {/* ================ HOME TAB ================ */}
                  <Stack
                    key={appConfig.routes.homeTab}
                    icon={TabIcon}
                    iconLabel={t('appTab.tab1.title')}
                    iconName="store"
                    iconSize={24}
                    iconSVG={SVGHome}>
                    <Scene
                      key={`${appConfig.routes.homeTab}_1`}
                      title={APP_NAME_SHOW}
                      component={HomeContainer}
                      hideNavBar
                    />
                  </Stack>

                  {/**
                   ************************ Tab 2 ************************
                   */}
                  {/* <Stack
                    key={appConfig.routes.newsTab}
                    icon={TabIcon}
                    iconLabel={t('appTab.tab2.title')}
                    iconName="bell"
                    iconSize={24}
                    notifyKey="new_totals"
                    iconSVG={SVGNews}>
                    <Scene
                      key={`${appConfig.routes.newsTab}_1`}
                      component={SocialNews}
                    />
                  </Stack> */}
                  <Stack
                    key={appConfig.routes.ordersTab}
                    icon={TabIcon}
                    iconLabel={t('appTab.tab4.title')}
                    iconName="cart"
                    iconSize={24}
                    notifyKey="notify_cart"
                    iconSVG={SVGOrders}>
                    <Scene
                      key={`${appConfig.routes.ordersTab}_1`}
                      title={t('screen.orders.mainTitle')}
                      component={Orders}
                      onEnter={() => {
                        store.setUpdateOrders(true);
                      }}
                      onExit={() => {
                        store.setUpdateOrders(false);
                      }}
                    />
                  </Stack>

                  {/* ================ SCAN QR TAB ================ */}
                  <Stack
                    key={appConfig.routes.scanQrCodeTab}
                    icon={TabIcon}
                    storeIcon>
                    <Scene component={() => null} />
                  </Stack>

                  {/**
                   ************************ Tab 3 ************************
                   */}
                  <Stack
                    key={appConfig.routes.mainNotify}
                    icon={TabIcon}
                    iconSize={20}
                    iconLabel={t('appTab.tab3.title')}
                    iconName="bell"
                    notifyKey="notify_list_notice">
                    <Scene
                      key={`${appConfig.routes.mainNotify}_1`}
                      title={t('appTab.tab3.title')}
                      component={MainNotify}
                      onEnter={() => {
                        store.setUpdateNotify(true);
                      }}
                      onExit={() => {
                        store.setUpdateNotify(false);
                      }}
                    />
                  </Stack>

                  {/**
                   ************************ Tab 4 ************************
                   */}
                  {/* <Stack
                    key={appConfig.routes.ordersTab}
                    icon={TabIcon}
                    iconSize={24}
                    iconLabel={t('appTab.tab4.title')}
                    iconName="cart"
                    notifyKey="notify_cart"
                    iconSVG={SVGOrders}>
                    <Scene
                      key={`${appConfig.routes.ordersTab}_1`}
                      title={t('screen.orders.mainTitle')}
                      component={Orders}
                      onEnter={() => {
                        store.setUpdateOrders(true);
                      }}
                      onExit={() => {
                        store.setUpdateOrders(false);
                      }}
                    />
                  </Stack> */}

                  {/**
                   ************************ Tab 5 ************************
                   */}
                  <Stack
                    key={appConfig.routes.accountTab}
                    icon={TabIcon}
                    iconLabel={t('appTab.tab5.title')}
                    iconName="account-circle"
                    notifyKey="notify_account"
                    headerLayoutPreset="left"
                    iconSize={24}
                    iconSVG={SVGAccount}>
                    <Scene
                      key={`${appConfig.routes.accountTab}_1`}
                      title={t('screen.account.mainTitle')}
                      component={Account}
                      {...whiteNavBarConfig}
                      navigationBarStyle={styles.accountSceneNavBar}
                      titleStyle={{
                        fontSize: 25,
                        paddingTop: 20,
                        paddingLeft: 15,
                      }}
                    />
                  </Stack>
                </Tabs>

                {/* ================ REQUESTS ================ */}
                <Stack key={appConfig.routes.requests}>
                  <Scene
                    key={`${appConfig.routes.requests}_1`}
                    component={Requests}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ REQUEST CREATION ================ */}
                <Stack key={appConfig.routes.requestCreation}>
                  <Scene
                    key={`${appConfig.routes.requestCreation}_1`}
                    component={RequestCreation}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ REQUEST DETAIL ================ */}
                <Stack key={appConfig.routes.requestDetail}>
                  <Scene
                    key={`${appConfig.routes.requestDetail}_1`}
                    component={RequestDetail}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ BOOKING ================ */}
                <Stack key={appConfig.routes.booking}>
                  <Scene
                    key={`${appConfig.routes.booking}_1`}
                    title={t('screen.booking.mainTitle')}
                    component={Booking}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ AIRLINE TICKET RESULT ================ */}
                <Stack key={appConfig.routes.airlineTicketResult}>
                  <Scene
                    key={`${appConfig.routes.airlineTicketResult}_1`}
                    component={Result}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ AIRLINE TICKET PLACE ================ */}
                <Stack key={appConfig.routes.airlineTicketPlace}>
                  <Scene
                    key={`${appConfig.routes.airlineTicketPlace}_1`}
                    component={Place}
                    {...navBarConfig}
                    navBar={PlaceNavBar}
                  />
                </Stack>

                {/* ================ AIRLINE TICKET DATEPICKER ================ */}
                <Stack key={appConfig.routes.airlineTicketDatePicker}>
                  <Scene
                    modal={true}
                    panHandlers={null}
                    title={t('screen.chooseDate.mainTitle')}
                    {...navBarConfig}
                    key={`${appConfig.routes.airlineTicketDatePicker}_1`}
                    component={DatePicker}
                    back
                  />
                </Stack>

                {/* ================ AIRLINE TICKET ================ */}
                <Stack key={appConfig.routes.airlineTicket}>
                  <Scene
                    key={`${appConfig.routes.airlineTicket}_1`}
                    component={AirlineTicket}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ PROFILE ================ */}
                <Stack key={appConfig.routes.personalProfile}>
                  <Scene
                    key={`${appConfig.routes.personalProfile}_1`}
                    component={Profile}
                    hideNavBar
                    back
                  />
                </Stack>

                {/* ================ EDIT PROFILE ================ */}
                <Stack key={appConfig.routes.editPersonalProfile}>
                  <Scene
                    key={`${appConfig.routes.editPersonalProfile}_1`}
                    component={EditPersonalProfile}
                    title={t('screen.account.editAccountTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ LIST USER CHAT ================ */}
                <Stack key={appConfig.routes.listUserChat}>
                  <Scene
                    key={`${appConfig.routes.listUserChat}_1`}
                    component={ListUserChat}
                    navBar={ListUserChatNavBar}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.searchUserChat}>
                  <Scene
                    key={`${appConfig.routes.searchUserChat}_1`}
                    component={SearchUserChat}
                    navBar={SearchUserChatNavBar}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ AMAZING USER CHAT ================ */}
                <Stack key={appConfig.routes.amazingUserChat}>
                  <Scene
                    key={`${appConfig.routes.amazingUserChat}_1`}
                    component={AmazingUserChat}
                    setHeader={this.setHeader.bind(this)}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ LIST ADDRESS STORE ================ */}
                <Stack key={appConfig.routes.listAddressStore}>
                  <Scene
                    key={`${appConfig.routes.listAddressStore}_1`}
                    {...navBarConfig}
                    title={t('screen.gpsListStore.mainTitle')}
                    component={ListAddressStore}
                    back
                  />
                </Stack>

                {/* ================ LIST PROGRESS TRACKING ================ */}
                <Stack key={appConfig.routes.listProgressTracking}>
                  <Scene
                    key={`${appConfig.routes.listProgressTracking}_1`}
                    component={ProgressTracking}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ PROGRESS ITEM ================ */}
                <Stack key={appConfig.routes.progressTrackingDetail}>
                  <Scene
                    key={`${appConfig.routes.progressTrackingDetail}_1`}
                    component={ProgressTrackingDetail}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ SOCIAL ================ */}
                <Stack key={appConfig.routes.social}>
                  <Scene
                    key={`${appConfig.routes.social}_1`}
                    component={Social}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ SOCIAL GROUPS ================ */}
                <Stack
                  headerLayoutPreset={'left'}
                  key={appConfig.routes.socialGroup}>
                  <Scene
                    key={`${appConfig.routes.socialGroup}_1`}
                    component={SocialGroup}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ SOCIAL CREATE POST ================ */}
                <Stack key={appConfig.routes.socialCreatePost}>
                  <Scene
                    key={`${appConfig.routes.socialCreatePost}_1`}
                    component={SocialCreatePost}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                {/* ================ MODAL EDIT IMAGES ================ */}
                <Stack key={appConfig.routes.modalEditImages}>
                  <Scene
                    key={`${appConfig.routes.modalEditImages}_1`}
                    component={ModalEditImages}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                {/* ================ MODAL COMMENT ================ */}
                <Stack key={appConfig.routes.modalComment}>
                  <Scene
                    key={`${appConfig.routes.modalComment}_1`}
                    component={ModalComment}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                {/* ================ PRODUCT STAMPS ================ */}
                <Stack key={appConfig.routes.productStamps}>
                  <Scene
                    key={`${appConfig.routes.productStamps}_1`}
                    component={ProductStamps}
                    title={t('screen.listProductScanned.mainTitle')}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ GAMIFICATION - LOTTERY ================ */}
                <Stack key={appConfig.routes.lotteryGame}>
                  <Scene
                    key={`${appConfig.routes.lotteryGame}_1`}
                    component={LotteryGame}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.commissionIncomeStatement}>
                  <Scene
                    key={`${appConfig.routes.commissionIncomeStatement}_1`}
                    {...navBarConfig}
                    title={t('screen.commissionIncomeStatement.mainTitle')}
                    component={CommissionIncomeStatement}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.salesReport}>
                  <Scene
                    key={`${appConfig.routes.salesReport}_1`}
                    {...navBarConfig}
                    title={t('screen.salesReport.mainTitle')}
                    component={SalesReport}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.agencyInformationRegister}>
                  <Scene
                    key={`${appConfig.routes.agencyInformationRegister}_1`}
                    {...navBarConfig}
                    component={AgencyInformationRegister}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.gpsListStore}>
                  <Scene
                    key={`${appConfig.routes.gpsListStore}_1`}
                    {...navBarConfig}
                    component={GPSListStore}
                    navBar={SearchNavBarContainer}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.groupProduct}>
                  <Scene
                    key={`${appConfig.routes.groupProduct}_1`}
                    {...navBarConfig}
                    component={GroupProduct}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.productSchedule}>
                  <Scene
                    key={`${appConfig.routes.productSchedule}_1`}
                    title={t('screen.productSchedule.mainTitle')}
                    {...navBarConfig}
                    component={ProductSchedule}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.domainSelector}>
                  <Scene
                    key={`${appConfig.routes.domainSelector}_1`}
                    component={DomainSelector}
                    hideNavBar
                  />
                </Stack>

                {/* ================ CAPTURE FACEID ================ */}
                <Stack key={appConfig.routes.captureFaceID}>
                  <Scene
                    key={`${appConfig.routes.captureFaceID}_1`}
                    // title={t("screen.news.mainTitle")}
                    component={CaptureFaceID}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ NEWS ================ */}
                <Stack key={appConfig.routes.newsTab}>
                  <Scene
                    key={`${appConfig.routes.newsTab}_1`}
                    component={SocialNews}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ ORDERS ================ */}
                <Stack key={appConfig.routes.ordersTab}>
                  <Scene
                    key={`${appConfig.routes.ordersTab}_1`}
                    title={t('screen.orders.mainTitle')}
                    component={Orders}
                    onEnter={() => {
                      store.setUpdateOrders(true);
                    }}
                    onExit={() => {
                      store.setUpdateOrders(false);
                    }}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ PREMIUM INFO ================ */}
                <Stack key={appConfig.routes.premiumInfo}>
                  <Scene
                    key={`${appConfig.routes.premiumInfo}_1`}
                    title={t('screen.premiumInfo.mainTitle')}
                    component={PremiumInfo}
                    {...whiteNavBarConfig}
                    back
                  />
                </Stack>

                {/* ================ MULTI LEVEL CATEGORY ================ */}
                <Stack key={appConfig.routes.multiLevelCategory}>
                  <Scene
                    key={`${appConfig.routes.multiLevelCategory}_1`}
                    component={MultiLevelCategory}
                    hideNavBar
                    {...navBarConfig}
                    back
                  />
                </Stack>

                {/* ================ Voucher Container ================ */}
                <Stack key={appConfig.routes.mixedVoucher}>
                  <Scene
                    key={`${appConfig.routes.mixedVoucher}_1`}
                    title={t('screen.mixedVoucher.mainTitle')}
                    component={MixedVoucher}
                    {...whiteNavBarConfig}
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
                    title="????n h??ng"
                    component={Orders}
                    onEnter={() => {
                      store.setUpdateOrders(true);
                    }}
                    onExit={() => {
                      store.setUpdateOrders(false);
                    }}
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
                    title="T??i kho???n xu"
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

                <Stack key={appConfig.routes.createAddress}>
                  <Scene
                    key={`${appConfig.routes.createAddress}_1`}
                    // title="Th??m ?????a ch???"
                    component={CreateAddress}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.phoneAuth}>
                  <Scene
                    key={`${appConfig.routes.phoneAuth}_1`}
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

                <Stack key={appConfig.routes.store}>
                  {/* <RNRFDrawer
                  key={appConfig.routes.store}
                  // hideNavBar={true}
                  drawerPosition="right"
                  drawerWidth={350}
                  hideDrawerButton={true}
                  contentComponent={(props) => <FilterDrawer {...props} />}> */}

                  <Scene
                    key={`${appConfig.routes.store}_1`}
                    component={StoreContainer}
                    {...navBarConfig}
                    back
                  />
                  {/* </RNRFDrawer> */}
                </Stack>

                <Stack key={appConfig.routes.searchStore}>
                  <Scene
                    key={`${appConfig.routes.searchStore}_1`}
                    component={SearchStoreContainer}
                    navBar={SearchNavBarContainer}
                    {...navBarConfig}
                  />
                </Stack>

                <Stack key={appConfig.routes.item}>
                  <Scene
                    key={`${appConfig.routes.item}_1`}
                    component={Item}
                    setOverlayComponent={this.props.setOverlayComponent}
                    {...navBarConfig}
                    hideNavBar
                    back
                    onEnter={() => {
                      store.setEnterItem(true);
                    }}
                    onExit={() => {
                      store.setEnterItem(false);
                    }}
                  />
                </Stack>

                <Stack key={appConfig.routes.itemImageViewer}>
                  <Scene
                    key={`${appConfig.routes.itemImageViewer}_1`}
                    direction="vertical"
                    hideNavBar
                    component={ItemImageViewer}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.rating}>
                  <Scene
                    key={`${appConfig.routes.rating}_1`}
                    title={t('screen.feedback.mainTitle')}
                    component={Rating}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.ordersDetail}>
                  <Scene
                    key={`${appConfig.routes.ordersDetail}_1`}
                    title={t('screen.ordersDetail.mainTitle')}
                    component={OrdersItem}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.notifies}>
                  <Scene
                    key={`${appConfig.routes.notifies}_1`}
                    component={SocialNews}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.notifiesVertical}>
                  <Scene
                    key={`${appConfig.routes.notifiesVertical}_1`}
                    component={Notify}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="notifies_time">
                  <Scene
                    key="notifies_time_1"
                    title="L???ch h??ng h??a"
                    component={Notify}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key="notifies_farm">
                  <Scene
                    key="notifies_farm_1"
                    title="Trang tr???i"
                    component={Notify}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.notifyDetail}>
                  <Scene
                    key={`${appConfig.routes.notifyDetail}_1`}
                    // title={t('screen.newsDetail.mainTitle')}
                    component={NotifyItem}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={`${appConfig.routes.storeOrders}`}>
                  <Scene
                    key={`${appConfig.routes.storeOrders}_1`}
                    component={StoreOrders}
                    onEnter={() => {
                      store.setUpdateOrders(true);
                    }}
                    onExit={() => {
                      store.setUpdateOrders(false);
                    }}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.webview}>
                  <Scene
                    key={`${appConfig.routes.webview}_1`}
                    component={WebView}
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

                <Stack key={appConfig.routes.vndWallet}>
                  <Scene
                    key={`${appConfig.routes.vndWallet}_1`}
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

                <Stack key={appConfig.routes.affiliate}>
                  <Scene
                    key={`${appConfig.routes.affiliate}_1`}
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
                    component={DetailHistoryPayment}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.upToPhone}>
                  <Scene
                    key={`${appConfig.routes.upToPhone}_1`}
                    // title="N???p ti???n ??i???n tho???i"
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
                  panHandlers={null}>
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

                <Stack key={appConfig.routes.listChat}>
                  <Scene
                    key={`${appConfig.routes.listChat}_1`}
                    component={ListChat}
                    navBar={ListChatNavBar}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.searchChat}>
                  <Scene
                    key={`${appConfig.routes.searchChat}_1`}
                    component={SearchChat}
                    navBar={SearchChatNavBar}
                    {...navBarConfig}
                    back
                  />
                </Stack>

                <Stack key={appConfig.routes.amazingChat}>
                  <Scene
                    key={`${appConfig.routes.amazingChat}_1`}
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
                    component={RadaBooking}
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

                <Stack key={appConfig.routes.serviceOrders}>
                  <Scene
                    key={`${appConfig.routes.serviceOrders}_1`}
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

                <Stack
                  key={appConfig.routes.rootGpsStoreLocation}
                  panHandlers={null}>
                  <Scene
                    key={`${appConfig.routes.rootGpsStoreLocation}_1`}
                    title={t('screen.gpsStoreLocation.mainTitle')}
                    component={GPSStoreLocation}
                    {...navBarConfig}
                  />
                </Stack>

                <Stack key={appConfig.routes.gpsStoreLocation}>
                  <Scene
                    key={`${appConfig.routes.gpsStoreLocation}_1`}
                    title={t('screen.gpsStoreLocation.mainTitle')}
                    component={GPSStoreLocation}
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
                    {...whiteNavBarConfig}
                    back
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

                {/* ================ QR/BAR CODE ================ */}
                <Stack key={appConfig.routes.qrBarCodeInputable}>
                  <Scene
                    key={`${appConfig.routes.qrBarCodeInputable}_1`}
                    component={QRBarCode}
                    renderBackButton={CloseButton}
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

              {/* ================ MODAL DATE TIME PICKER ================ */}
              <Stack
                key={appConfig.routes.modalDateTimePicker}
                component={ModalDateTimePicker}
              />

              {/* ================ MODAL CALENDAR ================ */}
              <Stack
                key={appConfig.routes.modalCalendar}
                component={ModalCalendar}
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

              {/* ================ MODAL POPUP ================ */}
              <Stack key={appConfig.routes.modalPopup} component={ModalPopup} />

              {/* ================ MODAL INPUT ================ */}
              <Stack key={appConfig.routes.modalInput} component={ModalInput} />

              {/* ================ MODAL CONFIRM ================ */}
              <Stack
                key={appConfig.routes.modalConfirm}
                component={ModalConfirm}
              />

              {/* ================ MODAL ACTION SHEET ================ */}
              <Stack
                key={appConfig.routes.modalActionSheet}
                component={ModalActionSheet}
              />

              {/* ================ COUNTRY PICKER ================ */}
              <Stack
                key={appConfig.routes.countryPicker}
                component={CountryPicker}
              />

              {/* ================ MODAL COMBO LOCATION ================ */}
              <Stack
                key={appConfig.routes.modalComboLocation}
                component={ModalComboLocation}
              />

              {/* ================ MODAL FILTER PRODUCT================ */}
              <Stack
                key={appConfig.routes.filterProduct}
                component={ModalFilterProduct}
              />

              {/* ================ MODAL AIRLINE TICKET CUSTOMER ================ */}
              <Stack
                key={appConfig.routes.airlineTicketCustomer}
                component={Customer}
                hideNavBar
              />

              {/* ================ MODAL LICENSE================ */}
              <Stack
                key={appConfig.routes.modalLicense}
                component={ModalLicense}
              />

              {/* ================ MODAL LICENSE================ */}
              <Stack
                key={appConfig.routes.modalDeliverySchedule}
                component={ModalDeliverySchedule}
              />
            </Lightbox>

            {/* ================ MODAL WEBVIEW ================ */}
            <Stack key={appConfig.routes.modalWebview}>
              <Scene
                key={`${appConfig.routes.modalWebview}_1`}
                component={WebView}
                {...whiteNavBarConfig}
                renderBackButton={CloseButton}
                back
              />
            </Stack>

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
                title="M?? voucher"
                component={VoucherShowBarcodeContainer}
                renderBackButton={CloseButton}
                back
              />
            </Stack>

            {/* ================ MODAL SHOW VOUCHER BARCODE ================ */}
            <Stack key={appConfig.routes.internetBanking}>
              <Scene
                key={`${appConfig.routes.internetBanking}_1`}
                // title="Th??? ATM"
                component={PaymentMethodDetailModal}
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

            {/* ================ MODAL CAMERAVIEW ================ */}
            <Stack key={appConfig.routes.modalCameraView}>
              <Scene
                key={`${appConfig.routes.modalCameraView}_1`}
                component={CameraView}
                hideNavBar
              />
            </Stack>

            {/* ================ MODAL TRANSACTION================ */}
            <Stack key={appConfig.routes.transaction} panHandlers={null}>
              <Scene
                key={`${appConfig.routes.transaction}_1`}
                component={Transaction}
                {...whiteNavBarConfig}
                hideNavBar
                back
              />
            </Stack>
          </Modal>
        </Overlay>
      </Router>
    );
  }
}

// export default RootRouter;
