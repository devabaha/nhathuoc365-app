import React, { Component } from 'react';

import './lib/Constant';
import './lib/Helper';

import { StackViewStyleInterpolator } from 'react-navigation-stack';
import appConfig from 'app-config';
import store from 'app-store';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  BackHandler,
  Linking,
  SafeAreaView
} from 'react-native';
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

import HomeContainer from './container/Home';

import Intro from './components/intro/Intro';
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
import QRBarCode from './components/Home/QRBarCode';
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

const transitionConfig = () => ({
  screenInterpolator: StackViewStyleInterpolator.forFadeFromBottomAndroid
});

const navBarConfig = {
  navigationBarStyle: {
    backgroundColor: appConfig.colors.primary
  },
  titleStyle: {
    color: appConfig.colors.white,
    alignSelf: 'center'
  },
  navBarButtonColor: appConfig.colors.white,
  backButtonTextStyle: {
    color: appConfig.colors.white
  }
};

var currentSceneName = null;
var currentSceneOnBack = null;
var backButtonPressedOnceToExit = false;

@observer
class App extends Component {
  constructor(properties) {
    super(properties);
    OneSignal.init('ea4623dc-3e0a-4390-b46d-0408a330ea63');

    OneSignal.addEventListener('received', this._onReceived);
    OneSignal.addEventListener('opened', this._onOpened);
    OneSignal.addEventListener('ids', this._onIds);
    // OneSignal.configure(); 	// triggers the ids event
    OneSignal.inFocusDisplaying(2);

    this.state = {
      loading: true,
      finish: false,
      showIntro: false
    };
  }

  componentWillMount() {
    StatusBar.setBarStyle('dark-content');
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this._onReceived);
    OneSignal.removeEventListener('opened', this._onOpened);
    OneSignal.removeEventListener('ids', this._onIds);
  }

  componentDidMount() {
    // deep link register
    DeepLinking.addScheme('macccacaapp://');
    Linking.addEventListener('url', this.handleURL);

    Linking.getInitialURL()
      .then(url => {
        if (url) {
          // do login
          this._login(() => this.handleURL({ url }));
        } else {
          // do login
          this._login();
        }
      })
      .catch(err => {
        // do login
        this._login();

        console.error('An error occurred', err);
      });
  }

  handleURL = ({ url }) => {
    if (url) {
      const route = url.replace(/.*?:\/\//g, '');
      const routeName = route.split('/')[0];
      const id = route.split('/')[1];

      switch (routeName) {
        case 'code':
          Actions.search_store({
            site_code: id
          });
          break;
        case 'store':
          this._pushGoStore(id);
          break;
        case 'item':
          const item_id = route.split('/')[2];
          this._pushGoItem(id, item_id);
          break;
        default:
      }
    }
  };

  // login khi mở app
  async _login(callback) {
    try {
      var response = await APIHandler.user_login({
        fb_access_token: ''
      });
      if (response && response.status == STATUS_SUCCESS) {
        store.setUserInfo(response.data);
        action(() => {
          this.setState(
            {
              finish: true
            },
            () => {
              Actions.primaryTabbar({
                type: ActionConst.RESET
              });
            }
          );
        })();
        StatusBar.setBarStyle('light-content');
      } else {
        Toast.show(response.message);
      }
      if (response && response.status == STATUS_FILL_INFO_USER) {
        store.setUserInfo(response.data);
        action(() => {
          this.setState(
            {
              finish: true
            },
            () => {
              Actions.op_register({
                type: ActionConst.RESET,
                title: 'Đăng ký thông tin',
                name_props: response.data.name
              });
            }
          );
        })();
        StatusBar.setBarStyle('light-content');
      }
      if (response && response.status == STATUS_UNDEFINE_USER) {
        store.setUserInfo(response.data);
        action(() => {
          this.setState(
            {
              finish: true
            },
            () => {
              Actions.login({
                type: ActionConst.RESET
              });
            }
          );
        })();
      }
    } catch (e) {
      console.warn(e + ' user_login');

      store.addApiQueue('user_login', this._login.bind(this));
    }
  }

  _onReceived(notify) {
    // console.log("Notification received: ", notify);
  }

  _onOpened(openResult) {
    var data = openResult.notification.payload.additionalData;
    if (data) {
      var { page, site_id, page_id } = data;

      if (page) {
        switch (page) {
          case 'store':
            if (page_id) {
              this._pushGoStore(page_id);
            }
            break;
          case 'new':
            if (page_id) {
              this._pushGoNews(page_id);
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

  async _pushGoStore(page_id) {
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
    } catch (e) {
      console.warn(e + ' site_info');

      store.addApiQueue('site_info', this._pushGoStore.bind(this, page_id));
    }
  }

  _goStore(response) {
    if (currentSceneName == 'stores') {
      setTimeout(() => {
        Actions.stores({
          title: response.data.name,
          type: ActionConst.REFRESH
        });
      }, 660);
    } else {
      setTimeout(() => {
        Actions.stores({
          title: response.data.name
        });
      }, 660);
    }
  }

  async _pushGoNews(page_id) {
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
    } catch (e) {
      console.warn(e + ' user_news');

      store.addApiQueue('user_news', this._pushGoNews.bind(this, page_id));
    }
  }

  async _pushGoItem(page_id, item_id) {
    try {
      var response = await APIHandler.site_info(page_id);
      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setStoreData(response.data);
          this._goStore(response);
          this._goItem(page_id, item_id);
        })();
      } else if (response && response.data) {
        Actions.search_store({
          site_code: response.data.site_code,
          onSuccess: () => {
            store.setStoreData(response.data);
            this._goStore(response);
            this._goItem(page_id, item_id);
          }
        });
      }
    } catch (e) {
      console.warn(e + ' site_info');
    }
  }

  async _goItem(page_id, item_id) {
    try {
      var response = await APIHandler.site_product(page_id, item_id);
      if (response && response.status == STATUS_SUCCESS) {
        var item = response.data;

        if (currentSceneName == 'item') {
          setTimeout(() => {
            Actions.item({
              title: item.name,
              item,
              type: ActionConst.REFRESH
            });
          }, 1200);
        } else {
          setTimeout(() => {
            Actions.item({
              title: item.name,
              item
            });
          }, 1200);
        }
      }
    } catch (e) {
      console.warn(e + ' user_news');

      store.addApiQueue('user_news', this._pushGoNews.bind(this, page_id));
    }
  }

  async _onIds(device) {
    //  console.log('Device info: ', device);
    if (_.isObject(device)) {
      var push_token = device.pushToken;
      var player_id = device.userId;

      try {
        await APIHandler.add_push_token({
          push_token,
          player_id
        });
      } catch (e) {
        console.warn(e + ' add_push_token');

        store.addApiQueue('add_push_token', this._onIds.bind(this, device));
      }
    }
  }

  _backAndroidHandler() {
    if (backButtonPressedOnceToExit) {
      BackHandler.exitApp();
    } else {
      if (
        ['_home', '_main_notify', '_orders', '_account', 'login'].indexOf(
          currentSceneName
        ) === -1
      ) {
        if (typeof currentSceneOnBack == 'function') {
          currentSceneOnBack();
        } else {
          Actions.pop();
        }
        return true;
      } else {
        backButtonPressedOnceToExit = true;
        Toast.show('Chạm lại để thoát ứng dụng', Toast.LONG);

        setTimeout(function() {
          backButtonPressedOnceToExit = false;
        }, 2000);
        return true;
      }
    }
  }

  _goMainNotify() {
    Actions._main_notify({ type: ActionConst.REFRESH });
  }

  _goQRCode() {
    Actions.qr_bar_code({ title: 'Mã tài khoản', direction: 'vertical' });
  }

  renderRounter() {
    // var { showIntro } = this.state;
    var showIntro = false;
    return (
      <Router
        backAndroidHandler={this._backAndroidHandler.bind(this)}
        store={store}
      >
        <Overlay key="overlay">
          <Modal key="modal" hideNavBar transitionConfig={transitionConfig}>
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
                  {...navBarConfig}
                >
                  {/**
                   ************************ Tab 1 ************************
                   */}
                  <Stack
                    key="myTab1"
                    icon={TabIcon}
                    iconLabel="TickID"
                    iconName="store"
                    iconSize={24}
                  >
                    <Scene
                      key="_home"
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

                  {/**
                   ************************ Tab 3 ************************
                   */}
                  <Stack
                    key="myTab3"
                    icon={TickIdScaningButton}
                    primaryColor={appConfig.colors.primary} // optional for TickIdScaningButton
                  >
                    <Scene
                      key="_main_notify"
                      title="Tin tức"
                      component={Notify}
                    />
                  </Stack>

                  {/**
                   ************************ Tab 3 ************************
                   */}
                  <Stack
                    key="myTab4"
                    icon={TabIcon}
                    iconLabel="Đơn hàng"
                    iconName="shopping-cart"
                    iconSize={24}
                  >
                    <Scene key="_orders" title="Đơn hàng" component={Orders} />
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

                <Scene
                  key="address"
                  title="Địa chỉ"
                  component={Address}
                  {...navBarConfig}
                />
                <Scene
                  key="coin_wallet"
                  title="Tài khoản xu"
                  component={CoinWallet}
                  {...navBarConfig}
                />
                <Scene
                  key="confirm"
                  title="Xác nhận"
                  component={Confirm}
                  {...navBarConfig}
                />
                <Scene
                  key="create_address"
                  title="Thêm địa chỉ"
                  component={CreateAddress}
                  {...navBarConfig}
                />
                <Scene
                  key="register"
                  title="Đăng ký"
                  component={Register}
                  {...navBarConfig}
                />
                <Scene
                  key="login"
                  hideNavBar
                  title=""
                  component={Login}
                  {...navBarConfig}
                />
                <Scene
                  key="op_login"
                  title="Đăng ký"
                  component={OpLogin}
                  {...navBarConfig}
                />
                <Scene
                  key="op_register"
                  title="Đăng ký"
                  component={OpRegister}
                  {...navBarConfig}
                />
                <Scene
                  key="forget_verify"
                  title="Lấy lại mật khẩu"
                  component={ForgetVerify}
                  {...navBarConfig}
                />
                <Scene
                  key="forget_active"
                  title="Kích hoạt tài khoản"
                  component={ForgetActive}
                  {...navBarConfig}
                />
                <Scene
                  key="new_pass"
                  title="Tạo mật khẩu mới"
                  component={NewPass}
                  {...navBarConfig}
                />
                <Scene
                  key="cart"
                  title="Giỏ hàng"
                  component={Cart}
                  {...navBarConfig}
                />
                <Scene
                  key="stores"
                  title="Cửa hàng"
                  component={Stores}
                  {...navBarConfig}
                />
                <Scene
                  key="stores_list"
                  title="Cửa hàng"
                  component={StoresList}
                  {...navBarConfig}
                />
                <Scene
                  key="search"
                  title="Tìm kiếm"
                  component={Search}
                  {...navBarConfig}
                />
                <Scene
                  key="item"
                  title="Chi tiết sản phẩm"
                  component={Item}
                  {...navBarConfig}
                />
                <Scene
                  key="item_image_viewer"
                  direction="vertical"
                  hideNavBar
                  title=""
                  component={ItemImageViewer}
                  {...navBarConfig}
                />
                <Scene
                  key="rating"
                  panHandlers={null}
                  direction="vertical"
                  hideNavBar
                  title=""
                  component={Rating}
                  {...navBarConfig}
                />
                <Scene
                  key="orders_item"
                  title="Chi tiết đơn hàng"
                  component={OrdersItem}
                  {...navBarConfig}
                />
                <Scene
                  key="view_orders_item"
                  title="Thông tin đơn hàng"
                  component={ViewOrdersItem}
                  {...navBarConfig}
                />

                <Scene
                  key="notifys"
                  title="Tin tức"
                  component={Notify}
                  {...navBarConfig}
                />
                <Scene
                  key="notifys_time"
                  title="Lịch hàng hóa"
                  component={Notify}
                  {...navBarConfig}
                />
                <Scene
                  key="notifys_farm"
                  title="Trang trại"
                  component={Notify}
                  {...navBarConfig}
                />
                <Scene
                  key="notify_item"
                  title="Chi tiết"
                  component={NotifyItem}
                  {...navBarConfig}
                />
                <Scene
                  key="search_store"
                  title="Tìm cửa hàng"
                  component={SearchStore}
                  {...navBarConfig}
                />
                <Scene
                  key="scan_qr_code"
                  title="Quét mã"
                  component={ScanQRCode}
                  {...navBarConfig}
                />
                <Scene
                  key="qr_bar_code"
                  title="Mã tài khoản"
                  component={QRBarCode}
                  {...navBarConfig}
                />
                <Scene
                  key="list_store"
                  title="Cửa hàng"
                  component={ListStore}
                  {...navBarConfig}
                />
                <Scene
                  key="add_store"
                  title="Thêm cửa hàng"
                  component={AddStore}
                  {...navBarConfig}
                />
                <Scene
                  key="store_orders"
                  title=""
                  component={StoreOrders}
                  {...navBarConfig}
                />
                <Scene key="chat" title="" component={Chat} {...navBarConfig} />
                <Scene
                  key="webview"
                  title=""
                  component={WebView}
                  {...navBarConfig}
                />
                <Scene
                  key="intro"
                  initial={showIntro}
                  hideNavBar
                  title=""
                  component={Intro}
                  {...navBarConfig}
                />
                <Scene
                  key="_add_ref"
                  title=""
                  component={AddRef}
                  {...navBarConfig}
                />
                <Scene
                  key="choose_location"
                  title=""
                  component={ChooseLocation}
                  {...navBarConfig}
                />
                <Scene
                  key="vnd_wallet"
                  title=""
                  component={VndWallet}
                  {...navBarConfig}
                />
                <Scene
                  key="pay_wallet"
                  title=""
                  component={PayWallet}
                  {...navBarConfig}
                />
                <Scene
                  key="pay_account"
                  title=""
                  component={PayAccount}
                  {...navBarConfig}
                />
                <Scene
                  key="affiliate"
                  title=""
                  component={Affiliate}
                  {...navBarConfig}
                />

                <Scene
                  key="profile_detail"
                  title="Tài khoản của tôi"
                  component={ProfileDetail}
                  {...navBarConfig}
                />

                <Scene
                  key="edit_profile"
                  title="Tài khoản của tôi"
                  component={EditProfile}
                  {...navBarConfig}
                />

                <Scene
                  key="detail_history_payment"
                  title="Tích điểm"
                  component={DetailHistoryPayment}
                  {...navBarConfig}
                />

                <Scene
                  key="phonecard"
                  title="Mua mã thẻ di động"
                  component={PhoneCard}
                  {...navBarConfig}
                />
                <Scene
                  key="phonecard_confirm"
                  title="Xác nhận"
                  component={PhoneCardConfirm}
                  {...navBarConfig}
                />
                <Scene
                  key="nap_tkc"
                  title="Nạp tiền điện thoại"
                  component={NapTKC}
                  {...navBarConfig}
                />
                <Scene
                  key="nap_tkc_confirm"
                  title="Xác nhận"
                  component={NapTKCConfirm}
                  {...navBarConfig}
                />
                <Scene
                  key="md_card"
                  title="Nạp thẻ trong ngày"
                  component={MdCard}
                  {...navBarConfig}
                />
                <Scene
                  key="md_card_confirm"
                  title="Xác nhận"
                  component={MdCardConfirm}
                  {...navBarConfig}
                />
              </Scene>
            </Lightbox>
          </Modal>
        </Overlay>
      </Router>
    );
  }

  render() {
    if (!this.state.finish) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {!store.isConnected && (
              <View style={styles.content}>
                <Text style={styles.message}>Kiểm tra kết nối internet!</Text>
              </View>
            )}

            <Indicator size="small" />
          </View>
        </SafeAreaView>
      );
    }

    if (global.isIPhoneX) {
      return (
        <SafeAreaView style={styles.safeArea}>
          {this.renderRounter()}
        </SafeAreaView>
      );
    } else {
      return this.renderRounter();
    }
  }
}

// codepush initialize
App = codePush(App);

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

export default App;
