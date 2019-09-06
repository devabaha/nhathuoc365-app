import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  BackHandler,
  Linking,
  SafeAreaView
} from 'react-native';

// constant, helper
import './lib/Constant';
import './lib/Helper';

// library
import {
  Scene,
  Router,
  Modal,
  Reducer,
  Actions,
  ActionConst
} from 'react-native-router-flux';
import DeepLinking from 'react-native-deep-linking';
import OneSignal from 'react-native-onesignal';
import codePush from 'react-native-code-push';
import TickIdScaningButton from 'app-packages/tickid-scaning-button';

// store
import Store from 'app-store';

import HomeContainer from './container/Home';

import Intro from './components/intro/Intro';
import AddStore from './components/Home/AddStore';
import AddRef from './components/Home/AddRef';
import Notifys from './components/notify/Notifys';
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
import Error from './components/Error';
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

// others
import TabIcon from './components/TabIcon';
import navBar from './components/NavBar';
// navigator bar
const custommerNav = {
  navBar,
  sceneStyle: {
    backgroundColor: '#f3f3f3'
  }
};

var currentSceneName = null;
var currentSceneOnBack = null;
var backButtonPressedOnceToExit = false;

var _oldName = '';
const reducerCreate = params => {
  const defaultReducer = Reducer(params);
  return (state, action) => {
    if (action.type == 'back') {
      Store.runStoreUnMount();
    }

    // get next state
    var nextState = defaultReducer(state, action);

    // get current scene key
    currentSceneName = getCurrentName(nextState);
    currentTabHandler(currentSceneName);

    if (currentSceneName && _oldName != currentSceneName) {
      _oldName = currentSceneName;

      GoogleAnalytic(currentSceneName);
    }

    // get current scene onback function
    currentSceneOnBack = getCurrentOnBack(nextState);
    return nextState;
  };
};

function currentTabHandler(key) {
  if (key != '_home') {
    Store.is_stay_home = false;
  }
  if (key != '_main_notify') {
    Store.is_stay_main_notify = false;
  }
  if (key != '_orders') {
    Store.is_stay_orders = false;
  }
  if (key != '_account') {
    Store.is_stay_account = false;
  }
}

function getCurrentName(obj) {
  const { index, children, name } = obj;
  if (index !== undefined) {
    if (children) {
      return getCurrentName(children[index]);
    }
  }
  return name;
}

function getCurrentOnBack(obj) {
  const { index, children, onBack } = obj;
  if (index !== undefined) {
    if (children) {
      return getCurrentOnBack(children[index]);
    }
  }
  return onBack;
}

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
        Store.setUserInfo(response.data);
        action(() => {
          this.setState(
            {
              finish: true
            },
            () => {
              Actions.myTabBar({
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
        Store.setUserInfo(response.data);
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
        Store.setUserInfo(response.data);
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

      Store.addApiQueue('user_login', this._login.bind(this));
    }
  }

  async _getData() {
    try {
      var response = await APIHandler.user_sites();

      if (response && response.status == STATUS_SUCCESS) {
        this.setState({
          stores_data: response.data
        });
      }
    } catch (e) {
      console.warn(e + ' user_sites');

      Store.addApiQueue('user_sites', this._getData.bind(this));
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
          Store.setStoreData(response.data);

          this._goStore(response);
        })();
      } else if (response && response.data) {
        Actions.search_store({
          site_code: response.data.site_code
        });
      }
    } catch (e) {
      console.warn(e + ' site_info');

      Store.addApiQueue('site_info', this._pushGoStore.bind(this, page_id));
    } finally {
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

      Store.addApiQueue('user_news', this._pushGoNews.bind(this, page_id));
    } finally {
    }
  }

  async _pushGoItem(page_id, item_id) {
    try {
      var response = await APIHandler.site_info(page_id);
      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          Store.setStoreData(response.data);
          this._goStore(response);
          this._goItem(page_id, item_id);
        })();
      } else if (response && response.data) {
        Actions.search_store({
          site_code: response.data.site_code,
          onSuccess: () => {
            Store.setStoreData(response.data);
            this._goStore(response);
            this._goItem(page_id, item_id);
          }
        });
      }
    } catch (e) {
      console.warn(e + ' site_info');
    } finally {
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

      Store.addApiQueue('user_news', this._pushGoNews.bind(this, page_id));
    } finally {
    }
  }

  _onRegistered(notifData) {
    // console.log("Device had been registered for push notifys!", notifData);
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

        Store.addApiQueue('add_push_token', this._onIds.bind(this, device));
      } finally {
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
        createReducer={reducerCreate}
        store={Store}
      >
        <Scene key="modal" component={Modal}>
          <Scene key="root">
            <Scene
              key="myTabBar"
              tabs={true}
              tabBarStyle={styles.tabBarStyle}
              pressOpacity={1}
            >
              {/**
               ************************ Tab 1 ************************
               */}
              <Scene
                key="myTab1"
                icon={TabIcon}
                iconTitle="TickID"
                iconName="store"
                iconSize={24}
                onPress={() => {
                  Actions._home({ type: ActionConst.REFRESH });
                }}
              >
                <Scene
                  key="_home"
                  title="TickID"
                  component={HomeContainer}
                  hideNavBar
                  {...custommerNav}
                />
              </Scene>

              {/**
               ************************ Tab 2 ************************
               */}
              <Scene
                key="myTab2"
                icon={TabIcon}
                iconTitle="Tin tức"
                iconName="notifications"
                iconSize={24}
                notifyKey="new_totals"
                onPress={this._goMainNotify}
              >
                <Scene
                  key="_main_notify"
                  title="Tin tức"
                  component={Notifys}
                  {...custommerNav}
                />
              </Scene>

              {/**
               ************************ Tab 3 ************************
               */}
              <Scene
                key="myTab3"
                icon={TickIdScaningButton}
                onPress={this._goQRCode.bind(this, this.state.store_data)}
              >
                <Scene
                  key="_main_notify"
                  title="Tin tức"
                  component={Notifys}
                  {...custommerNav}
                />
              </Scene>

              {/**
               ************************ Tab 3 ************************
               */}
              <Scene
                key="myTab4"
                icon={TabIcon}
                iconTitle="Đơn hàng"
                iconName="shopping-cart"
                iconSize={24}
                onPress={() => {
                  Actions._orders({ type: ActionConst.REFRESH });
                }}
              >
                <Scene
                  key="_orders"
                  title="Đơn hàng"
                  component={Orders}
                  {...custommerNav}
                />
              </Scene>

              {/**
               ************************ Tab 4 ************************
               */}
              <Scene
                key="myTab5"
                icon={TabIcon}
                iconTitle="Tài khoản"
                iconName="account-circle"
                notifyKey="notify_account"
                iconSize={24}
                onPress={() => {
                  Actions._account({ type: ActionConst.REFRESH });
                }}
              >
                <Scene
                  hideNavBar
                  key="_account"
                  title="Tài khoản"
                  component={Account}
                  {...custommerNav}
                />
              </Scene>
            </Scene>

            <Scene
              key="address"
              title="Địa chỉ"
              component={Address}
              {...custommerNav}
            />
            <Scene
              key="coin_wallet"
              title="Tài khoản xu"
              component={CoinWallet}
              {...custommerNav}
            />
            <Scene
              key="confirm"
              title="Xác nhận"
              component={Confirm}
              {...custommerNav}
            />
            <Scene
              key="create_address"
              title="Thêm địa chỉ"
              component={CreateAddress}
              {...custommerNav}
            />
            <Scene
              key="register"
              title="Đăng ký"
              component={Register}
              {...custommerNav}
            />
            <Scene
              key="login"
              hideNavBar
              title=""
              component={Login}
              {...custommerNav}
            />
            <Scene
              key="op_login"
              title="Đăng ký"
              component={OpLogin}
              {...custommerNav}
            />
            <Scene
              key="op_register"
              title="Đăng ký"
              component={OpRegister}
              {...custommerNav}
            />
            <Scene
              key="forget_verify"
              title="Lấy lại mật khẩu"
              component={ForgetVerify}
              {...custommerNav}
            />
            <Scene
              key="forget_active"
              title="Kích hoạt tài khoản"
              component={ForgetActive}
              {...custommerNav}
            />
            <Scene
              key="new_pass"
              title="Tạo mật khẩu mới"
              component={NewPass}
              {...custommerNav}
            />
            <Scene
              key="cart"
              title="Giỏ hàng"
              component={Cart}
              {...custommerNav}
            />
            <Scene
              key="stores"
              title="Cửa hàng"
              component={Stores}
              {...custommerNav}
            />
            <Scene
              key="stores_list"
              title="Cửa hàng"
              component={StoresList}
              {...custommerNav}
            />
            <Scene
              key="search"
              title="Tìm kiếm"
              component={Search}
              {...custommerNav}
            />
            <Scene
              key="item"
              title="Chi tiết sản phẩm"
              component={Item}
              {...custommerNav}
            />
            <Scene
              key="item_image_viewer"
              direction="vertical"
              hideNavBar
              title=""
              component={ItemImageViewer}
              {...custommerNav}
            />
            <Scene
              key="rating"
              panHandlers={null}
              direction="vertical"
              hideNavBar
              title=""
              component={Rating}
              {...custommerNav}
            />
            <Scene
              key="orders_item"
              title="Chi tiết đơn hàng"
              component={OrdersItem}
              {...custommerNav}
            />
            <Scene
              key="view_orders_item"
              title="Thông tin đơn hàng"
              component={ViewOrdersItem}
              {...custommerNav}
            />

            <Scene
              key="notifys"
              title="Tin tức"
              component={Notifys}
              {...custommerNav}
            />
            <Scene
              key="notifys_time"
              title="Lịch hàng hóa"
              component={Notifys}
              {...custommerNav}
            />
            <Scene
              key="notifys_farm"
              title="Trang trại"
              component={Notifys}
              {...custommerNav}
            />
            <Scene
              key="notify_item"
              title="Chi tiết"
              component={NotifyItem}
              {...custommerNav}
            />
            <Scene
              key="search_store"
              title="Tìm cửa hàng"
              component={SearchStore}
              {...custommerNav}
            />
            <Scene
              key="scan_qr_code"
              title="Quét mã"
              component={ScanQRCode}
              {...custommerNav}
            />
            <Scene
              key="qr_bar_code"
              title="Mã tài khoản"
              component={QRBarCode}
              {...custommerNav}
            />
            <Scene
              key="list_store"
              title="Cửa hàng"
              component={ListStore}
              {...custommerNav}
            />
            <Scene
              key="add_store"
              title="Thêm cửa hàng"
              component={AddStore}
              {...custommerNav}
            />
            <Scene
              key="store_orders"
              title=""
              component={StoreOrders}
              {...custommerNav}
            />
            <Scene key="chat" title="" component={Chat} {...custommerNav} />
            <Scene
              key="webview"
              title=""
              component={WebView}
              {...custommerNav}
            />
            <Scene
              key="intro"
              initial={showIntro}
              hideNavBar
              title=""
              component={Intro}
              {...custommerNav}
            />
            <Scene
              key="_add_ref"
              title=""
              component={AddRef}
              {...custommerNav}
            />
            <Scene
              key="choose_location"
              title=""
              component={ChooseLocation}
              {...custommerNav}
            />
            <Scene
              key="vnd_wallet"
              title=""
              component={VndWallet}
              {...custommerNav}
            />
            <Scene
              key="pay_wallet"
              title=""
              component={PayWallet}
              {...custommerNav}
            />
            <Scene
              key="pay_account"
              title=""
              component={PayAccount}
              {...custommerNav}
            />
            <Scene
              key="affiliate"
              title=""
              component={Affiliate}
              {...custommerNav}
            />

            <Scene
              key="profile_detail"
              title="Tài khoản của tôi"
              component={ProfileDetail}
              {...custommerNav}
            />

            <Scene
              key="edit_profile"
              title="Tài khoản của tôi"
              component={EditProfile}
              {...custommerNav}
            />

            <Scene
              key="detail_history_payment"
              title="Tích điểm"
              component={DetailHistoryPayment}
              {...custommerNav}
            />

            <Scene
              key="phonecard"
              title="Mua mã thẻ di động"
              component={PhoneCard}
              {...custommerNav}
            />
            <Scene
              key="phonecard_confirm"
              title="Xác nhận"
              component={PhoneCardConfirm}
              {...custommerNav}
            />
            <Scene
              key="nap_tkc"
              title="Nạp tiền điện thoại"
              component={NapTKC}
              {...custommerNav}
            />
            <Scene
              key="nap_tkc_confirm"
              title="Xác nhận"
              component={NapTKCConfirm}
              {...custommerNav}
            />
            <Scene
              key="md_card"
              title="Nạp thẻ trong ngày"
              component={MdCard}
              {...custommerNav}
            />
            <Scene
              key="md_card_confirm"
              title="Xác nhận"
              component={MdCardConfirm}
              {...custommerNav}
            />
          </Scene>
          <Scene key="error" component={Error} />
        </Scene>
      </Router>
    );
  }

  render() {
    if (!this.state.finish) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {!Store.isConnected && (
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
    backgroundColor: DEFAULT_COLOR
  }
});

export default App;
