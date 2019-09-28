import React, { Component } from 'react';
import './lib/Constant';
import './lib/Helper';

import { Provider } from 'react-redux';
import appConfig from 'app-config';
import store from 'app-store';
import reduxStore from './reduxStore';
import { StyleSheet, StatusBar, Linking, Platform } from 'react-native';
// library
import {
  Scene,
  Router,
  Actions,
  ActionConst,
  Overlay,
  Tabs,
  Stack,
  Modal,
  Lightbox
} from 'react-native-router-flux';
import DeepLinking from 'react-native-deep-linking';
import OneSignal from 'react-native-onesignal';
import codePush from 'react-native-code-push';
import TickIdScaningButton from '@tickid/tickid-scaning-button';
import { Loading as LoadingOverlay } from '@tickid/tickid-rn-loading';
import { CloseButton } from 'app-packages/tickid-navbar';
import handleStatusBarStyle from './helper/handleStatusBarStyle';
import handleTabBarOnPress from './helper/handleTabBarOnPress';
import getTransitionConfig from './helper/getTransitionConfig';
import handleBackAndroid from './helper/handleBackAndroid';
import TickIDStatusBar from 'app-packages/tickid-status-bar';

import HomeContainer from './containers/Home';
import QRBarCode from './containers/QRBarCode';
import VoucherContainer from './containers/Voucher';
import MyVoucherContainer from './containers/MyVoucher';
import VoucherDetailContainer from './containers/VoucherDetail';
import VoucherScanScreenContainer from './containers/VoucherScanScreen';
import VoucherShowBarcodeContainer from './containers/VoucherShowBarcode';
import AddStore from './components/Home/AddStore';
import AddRef from './components/Home/AddRef';
import Notify from './components/notify/Notify';
import Orders from './components/orders/Orders';
import StoreOrders from './components/orders/StoreOrders';
import Account from './components/account/Account';
import Register from './components/account/Register';
import Login from './components/account/Login';
import OpLogin from './components/account/OpLogin';
import OpRegister from './components/account/OpRegister';
import ForgetVerify from './components/account/ForgetVerify';
import ForgetActive from './components/account/ForgetActive';
import NewPass from './components/account/NewPass';
import Stores from './components/stores/Stores';
import StoresList from './components/stores/StoresList';
import Search from './components/stores/Search';
import Item from './components/item/Item';
import ItemImageViewer from './components/item/ItemImageViewer';
import Cart from './components/cart/Cart';
import Address from './components/payment/Address';
import Confirm from './components/payment/Confirm';
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
import PhoneCard from './components/services/PhoneCard';
import PhoneCardConfirm from './components/services/PhoneCardConfirm';
import NapTKC from './components/services/NapTKC';
import NapTKCConfirm from './components/services/NapTKCConfirm';
import MdCard from './components/services/MdCard';
import MdCardConfirm from './components/services/MdCardConfirm';
import TabIcon from './components/TabIcon';
import TickIDRada from '@tickid/tickid-rada';
import {
  initialize as initializeVoucherModule,
  SelectProvince as VoucherSelectProvinceContainer,
  AlreadyVoucher as AlreadyVoucherContainer,
  EnterCodeManual as VoucherEnterCodeManualContainer
} from './packages/tickid-voucher';
import { MessageBarContainer } from '@tickid/tickid-rn-message-bar';
import DeviceInfo from 'react-native-device-info';
import getTickUniqueID from 'app-util/getTickUniqueID';
import { navBarConfig, whiteNavBarConfig } from './navBarConfig';
import env from 'react-native-config';

/**
 * Initializes config for Voucher module
 */
initializeVoucherModule({
  private: {
    appKey: env.APP_KEY,
    secretKey: env.SECRET_KEY
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
  }
});

/**
 * Initializes config for Rada module
 */
const config = {
  partnerAuthorization: env.RADA_PARTNER_AUTHORIZATION,
  webhookUrl: null,
  defaultLocation: '37.33233141,-122.0312186'
};
TickIDRada.init(config);

class App extends Component {
  constructor(properties) {
    super(properties);

    this.state = {
      loading: true
    };
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.handleOpenningNotification);
    OneSignal.removeEventListener('ids', this.handleAddPushToken);
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true);

    OneSignal.init('ea4623dc-3e0a-4390-b46d-0408a330ea63');
    OneSignal.addEventListener('opened', this.handleOpenningNotification);
    OneSignal.addEventListener('ids', this.handleAddPushToken);
    OneSignal.inFocusDisplaying(2);

    // deep link register
    DeepLinking.addScheme('macccacaapp://');
    Linking.addEventListener('url', this.handleURL);

    Linking.getInitialURL()
      .then(url => {
        if (url) {
          // do login
          this.handleLogin(() => this.handleURL({ url }));
        } else {
          // do login
          this.handleLogin();
        }
      })
      .catch(err => {
        // do login
        this.handleLogin();
        console.error('An error occurred', err);
      });
  }

  // handleURL = ({ url }) => {
  //   if (url) {
  //     const route = url.replace(/.*?:\/\//g, '');
  //     const routeName = route.split('/')[0];
  //     const id = route.split('/')[1];

  //     switch (routeName) {
  //       case 'code':
  //         //
  //         break;
  //       case 'store':
  //         //
  //         break;
  //       case 'item':
  //         //
  //         break;
  //       default:
  //     }
  //   }
  // };

  /**
   * Handling login when opening the application
   */
  async handleLogin() {
    try {
      const response = await APIHandler.user_login({
        fb_access_token: ''
      });
      if (response && response.status == STATUS_SUCCESS) {
        store.setUserInfo(response.data);
        Actions.primaryTabbar({
          type: ActionConst.RESET
        });
      } else {
        Toast.show(response.message);
      }
      if (response && response.status == STATUS_FILL_INFO_USER) {
        store.setUserInfo(response.data);
        Actions.op_register({
          title: 'Đăng ký thông tin',
          name_props: response.data.name
        });
      }
      if (response && response.status == STATUS_UNDEFINE_USER) {
        store.setUserInfo(response.data);
        Actions.login();
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleOpenningNotification(openResult) {
    const data = openResult.notification.payload.additionalData;
    if (data) {
      const { page, site_id, page_id } = data;
      if (page) {
        switch (page) {
          case 'store':
            if (page_id) {
              this.goToStoreScene(page_id);
            }
            break;
          case 'new':
            if (page_id) {
              this.goToNewsScene(page_id);
            }
            break;
          case 'order':
            if (site_id && page_id) {
              Actions.orders_item({
                title: '#...',
                passProps: {
                  notice_data: {
                    site_id,
                    page_id
                  }
                }
              });
            }
            break;
        }
      }
    }
  }

  async goToStoreScene(page_id) {
    try {
      var response = await APIHandler.site_info(page_id);
      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setStoreData(response.data);

          this._goStore(response);
        })();
      } else if (response && response.data) {
        Actions.search_store({
          site_code: response.data.site_code
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async goToNewsScene(page_id) {
    try {
      var response = await APIHandler.user_news(page_id);
      if (response && response.status == STATUS_SUCCESS) {
        if (currentSceneName == 'notify_item') {
          setTimeout(() => {
            Actions.notify_item({
              title: response.data.title,
              data: response.data,
              type: ActionConst.REFRESH
            });
          }, 660);
        } else {
          setTimeout(() => {
            Actions.notify_item({
              title: response.data.title,
              data: response.data
            });
          }, 660);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

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
    return (
      <Provider store={reduxStore}>
        <Router
          store={store}
          backAndroidHandler={handleBackAndroid}
          onStateChange={(prevState, newState, action) => {
            handleStatusBarStyle(prevState, newState, action);
          }}
        >
          <Overlay key="overlay">
            <Modal
              key="modal"
              hideNavBar
              transitionConfig={getTransitionConfig}
            >
              <Lightbox key="lightbox">
                <Scene
                  key="root"
                  titleStyle={{ alignSelf: 'center' }}
                  headerLayoutPreset="center"
                  hideNavBar
                >
                  <Tabs
                    key="primaryTabbar"
                    showLabel={false}
                    tabBarStyle={styles.tabBarStyle}
                    activeBackgroundColor="white"
                    inactiveBackgroundColor="white"
                    tabBarOnPress={handleTabBarOnPress}
                    {...navBarConfig}
                  >
                    {/* ================ HOME TAB ================ */}
                    <Stack
                      key={appConfig.routes.homeTab}
                      icon={TabIcon}
                      iconLabel="TickID"
                      iconName="store"
                      iconSize={24}
                    >
                      <Scene
                        key={`${appConfig.routes.homeTab}_1`}
                        title="TickID"
                        component={HomeContainer}
                        hideNavBar
                      />
                    </Stack>

                    {/**
                     ************************ Tab 2 ************************
                     */}
                    <Stack
                      key="myTab2"
                      icon={TabIcon}
                      iconLabel="Tin tức"
                      iconName="notifications"
                      iconSize={24}
                      notifyKey="new_totals"
                    >
                      <Scene
                        key="_main_notify"
                        title="Tin tức"
                        component={Notify}
                      />
                    </Stack>

                    {/* ================ SCAN QR TAB ================ */}
                    <Stack
                      key={appConfig.routes.scanQrCodeTab}
                      icon={TickIdScaningButton}
                      primaryColor={appConfig.colors.primary} // optional for TickIdScaningButton
                    >
                      <Scene component={() => null} />
                    </Stack>

                    {/**
                     ************************ Tab 3 ************************
                     */}
                    <Stack
                      key="{appConfig.routes.ordersTab}"
                      icon={TabIcon}
                      iconLabel="Đơn hàng"
                      iconName="shopping-cart"
                      iconSize={24}
                    >
                      <Scene
                        key={`${appConfig.routes.ordersTab}_1`}
                        title="Đơn hàng"
                        component={Orders}
                      />
                    </Stack>

                    {/**
                     ************************ Tab 4 ************************
                     */}
                    <Stack
                      key="myTab5"
                      icon={TabIcon}
                      iconLabel="Tài khoản"
                      iconName="account-circle"
                      notifyKey="notify_account"
                      iconSize={24}
                    >
                      <Scene
                        hideNavBar
                        key="_account"
                        title="Tài khoản"
                        component={Account}
                      />
                    </Stack>
                  </Tabs>

                  {/* ================ MAIN VOUCHER ================ */}
                  <Stack key={appConfig.routes.mainVoucher}>
                    <Scene
                      key={`${appConfig.routes.mainVoucher}_1`}
                      title="TickID Voucher"
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
                      title="Voucher của tôi"
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

                  <Stack key="address">
                    <Scene
                      key="address_1"
                      title="Địa chỉ"
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

                  <Stack key="confirm">
                    <Scene
                      key="confirm_1"
                      title="Xác nhận"
                      component={Confirm}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="create_address">
                    <Scene
                      key="create_address_1"
                      title="Thêm địa chỉ"
                      component={CreateAddress}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="register">
                    <Scene
                      key="register_1"
                      title="Đăng ký"
                      component={Register}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="login">
                    <Scene
                      key="login_1"
                      hideNavBar
                      component={Login}
                      {...navBarConfig}
                    />
                  </Stack>

                  <Stack key="op_login">
                    <Scene
                      key="op_login_1"
                      title="Đăng ký"
                      component={OpLogin}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="op_register">
                    <Scene
                      key="op_register_1"
                      title="Đăng ký"
                      component={OpRegister}
                      {...navBarConfig}
                      back
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
                      title="Giỏ hàng"
                      component={Cart}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key={appConfig.routes.store}>
                    <Scene
                      key={`${appConfig.routes.store}_1`}
                      title="Cửa hàng"
                      component={Stores}
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

                  <Stack key="search">
                    <Scene
                      key="search_1"
                      title="Tìm kiếm"
                      component={Search}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="item">
                    <Scene
                      key="item_1"
                      title="Chi tiết sản phẩm"
                      component={Item}
                      {...navBarConfig}
                      back
                    />
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
                      panHandlers={null}
                      direction="vertical"
                      hideNavBar
                      component={Rating}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="orders_item">
                    <Scene
                      key="orders_item_1"
                      title="Chi tiết đơn hàng"
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

                  <Stack key="notifys">
                    <Scene
                      key="notifys_1"
                      title="Tin tức"
                      component={Notify}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="notifys_time">
                    <Scene
                      key="notifys_time_1"
                      title="Lịch hàng hóa"
                      component={Notify}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="notifys_farm">
                    <Scene
                      key="notifys_farm_1"
                      title="Trang trại"
                      component={Notify}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="notify_item">
                    <Scene
                      key="notify_item_1"
                      title="Chi tiết"
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
                      title="Quét mã"
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

                  <Stack key="store_orders">
                    <Scene
                      key="store_orders_1"
                      component={StoreOrders}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="chat">
                    <Scene
                      key="chat_1"
                      component={Chat}
                      {...navBarConfig}
                      back
                    />
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

                  <Stack key="pay_wallet">
                    <Scene
                      key="pay_wallet_1"
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
                      title="Tài khoản của tôi"
                      component={ProfileDetail}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="edit_profile">
                    <Scene
                      key="edit_profile_1"
                      title="Tài khoản của tôi"
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
                      title="Mua mã thẻ di động"
                      component={PhoneCard}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="phonecard_confirm">
                    <Scene
                      key="phonecard_confirm_1"
                      title="Xác nhận"
                      component={PhoneCardConfirm}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="nap_tkc">
                    <Scene
                      key="nap_tkc_1"
                      title="Nạp tiền điện thoại"
                      component={NapTKC}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="nap_tkc_confirm">
                    <Scene
                      key="nap_tkc_confirm_1"
                      title="Xác nhận"
                      component={NapTKCConfirm}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="md_card">
                    <Scene
                      key="md_card_1"
                      title="Nạp thẻ trong ngày"
                      component={MdCard}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="tickidRada">
                    <Scene
                      key="tickidRada1"
                      component={TickIDRada.Category}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="tickidRadaListService">
                    <Scene
                      key="tickidRadaListService1"
                      component={TickIDRada.ListService}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="tickidRadaServiceDetail">
                    <Scene
                      key="tickidRadaServiceDetail1"
                      component={TickIDRada.ServiceDetail}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="tickidRadaBooking">
                    <Scene
                      key="tickidRadaBooking1"
                      component={TickIDRada.Booking}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  <Stack key="md_card_confirm">
                    <Scene
                      key="md_card_confirm_1"
                      title="Xác nhận"
                      component={MdCardConfirm}
                      {...navBarConfig}
                      back
                    />
                  </Stack>

                  {/* ================ SCENE VOUCHER SCAN ================ */}
                  <Stack key={appConfig.routes.voucherScanner}>
                    <Scene
                      key={`${appConfig.routes.voucherScanner}_1`}
                      title="Quét mã QR"
                      component={VoucherScanScreenContainer}
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
            </Modal>

            <Scene component={LoadingOverlay} />
            <Scene component={TickIDStatusBar} />
            <Scene component={MessageBarContainer} />
          </Overlay>
        </Router>
      </Provider>
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
    backgroundColor: 'white',
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
export default codePush(App);
