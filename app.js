'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  PanResponder,
  BackHandler,
  Alert,
  Linking
} from 'react-native';

// disable font scaling
Text.defaultProps.allowFontScaling=false;

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

// store
import Store from './store/Store';

// import components
// screen
import Intro from './components/intro/Intro';
import AddStore from './components/home/AddStore';
import Home from './components/home/Home';
import HomeNavBar from './components/home/HomeNavBar';
import Notifys from './components/notify/Notifys';
import MainNotify from './components/notify/MainNotify';
import Orders from './components/orders/Orders';
import StoreOrders from './components/orders/StoreOrders';
import Account from './components/account/Account';
import Register from './components/account/Register';
import Login from './components/account/Login';
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
import NotifyItem from './components/notify/NotifyItem';
import SearchStore from './components/home/SearchStore';
import ListStore from './components/home/ListStore';
import ScanQRCode from './components/home/ScanQRCode';
import Chat from './components/chat/Chat';
import WebView from './components/webview/WebView';
import ListProduct from './components/sale/ListProduct';
import EditListProduct from './components/sale/EditListProduct';
import Rating from './components/rating/Rating';
import Error from './components/Error';

// Backend
import Dashboard from './components/dashboard/Dashboard';
import SaleStores from './components/sale/SaleStores';
import SaleMenu from './components/sale/SaleMenu';
import Sale from './components/sale/Sale';
import Order from './components/sale/Order';
import UserInfo from './components/sale/UserInfo';
import SaleChat from './components/sale/SaleChat';
import Products from './components/sale/Products/Products';
import CreateProduct from './components/sale/Products/CreateProduct';
import EditProduct from './components/sale/Products/EditProduct';

// others
import TabIcon from './components/TabIcon';
import navBar from './components/NavBar';
import CustomNavBar from './components/sale/CustomNavBar';
import CustomNavBar2 from './components/sale/CustomNavBar2';

// navigator bar
const custommerNav = {
  navBar,
  sceneStyle: {
    backgroundColor: "#f3f3f3"
  }
}

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
  }
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
export default class App extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      finish: false,
      showIntro: false
    }
  }

  componentWillMount() {
    // load
    // storage.load({
    //   key: STORAGE_INTRO_KEY,
    //   autoSync: true,
    //   syncInBackground: true,
    //   syncParams: {
    //     extraFetchOptions: {
    //     },
    //     someFlag: true,
    //   },
    // }).then(data => {
    //   this._endLoad(false);
    //
    //   // StatusBar
    //   if (isIOS) {
    //     StatusBar.setBarStyle('light-content');
    //   }
    // }).catch(err => {
    //   this._endLoad(true);
    //
    //   // StatusBar
    //   if (isIOS) {
    //     StatusBar.setBarStyle('dark-content');
    //   }
    // });

    StatusBar.setBarStyle('dark-content');
  }

  _endLoad(showIntro) {
    layoutAnimation();

    this.setState({
      loading: false,
      showIntro
    });
  }

  componentDidMount() {
    OneSignal.addEventListener('received', this._onReceived.bind(this));
    OneSignal.addEventListener('opened', this._onOpened.bind(this));
    // OneSignal.addEventListener('registered', this._onRegistered.bind(this));
    OneSignal.addEventListener('ids', this._onIds.bind(this));

    // deep link register
    DeepLinking.addScheme('myfoodapp://');
    Linking.addEventListener('url', this.handleURL);

    var url = Linking.getInitialURL().then((url) => {
      if (url) {
        // do login
        this._login(() => this.handleURL({url}));
      } else {
        // do login
        this._login();
      }
    }).catch(err => {
      // do login
      this._login();

      console.error('An error occurred', err);
    });
  }

  handleURL = ({url}) => {
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
  }

  // login khi mở app
  async _login(callback) {
    try {
      var response = await APIHandler.user_login({
        fb_access_token: ''
      });

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          Store.setUserInfo(response.data);
          this.setState({
            finish: true
          }, () => {
            setTimeout(() => {
              if (typeof callback == 'function') {
                callback();
              }
            }, 660);
          });
        })();

        StatusBar.setBarStyle('light-content');
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
    // console.log('Message: ', openResult.notification.payload.body);
    // console.log('Data: ', openResult.notification.payload.additionalData);
    // console.log('isActive: ', openResult.notification.isAppInFocus);
    // console.log('openResult: ', openResult);

    var data = openResult.notification.payload.additionalData;
    if (data) {
      var {page, site_id, page_id} = data;

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
      if ([
        '_home',
        '_main_notify',
        '_orders',
        '_account'
      ].indexOf(currentSceneName) === -1) {
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
    Actions._main_notify({type: ActionConst.REFRESH});
  }

  render() {
    if (!this.state.finish) {
      return(
        <View style={styles.container}>
          {!Store.isConnected && (
            <View style={styles.content}>
              <Text style={styles.message}>Kiểm tra kết nối internet!</Text>
            </View>
          )}

          <Indicator size="small" />
        </View>
      );
    }

    // var { showIntro } = this.state;
    var showIntro = false;

    return(
      <Router
        backAndroidHandler={this._backAndroidHandler.bind(this)}
        createReducer={reducerCreate}
        store={Store}>

        <Scene key="modal" component={Modal} >
          <Scene key="root">

            <Scene key="myTabBar" tabs={true} tabBarStyle={styles.tabBarStyle} pressOpacity={1}>

              {/**
              ************************ Tab 1 ************************
              */}
              <Scene
                key="myTab1"
                icon={TabIcon}
                iconTitle="My Food"
                iconName="store"
                size={24}
                onPress={()=> {
                  Actions._home({type: ActionConst.REFRESH});
                }}
               >
                  <Scene key="_home" title="My Food" component={Home} {...custommerNav} navBar={HomeNavBar} />
              </Scene>

              {/**
              ************************ Tab 2 ************************
              */}
              <Scene
                key="myTab2"
                icon={TabIcon}
                iconTitle="Thông báo"
                iconName="notifications"
                size={24}
                notify="new_totals"
                onPress={this._goMainNotify}
               >
                  <Scene key="_main_notify" title="Thông báo" component={MainNotify} {...custommerNav} />
              </Scene>

              {/**
              ************************ Tab 3 ************************
              */}
              <Scene
                key="myTab3"
                icon={TabIcon}
                iconTitle="Đơn hàng"
                iconName="shopping-cart"
                size={24}
                onPress={()=> {
                  Actions._orders({type: ActionConst.REFRESH});
                }}
               >
                  <Scene key="_orders" title="Đơn hàng" component={Orders} {...custommerNav} />
              </Scene>

              {/**
              ************************ Tab 4 ************************
              */}
              <Scene
                key="myTab4"
                icon={TabIcon}
                iconTitle="Tài khoản"
                iconName="account-circle"
                notify="updating_version"
                size={24}
                onPress={()=> {
                  Actions._account({type: ActionConst.REFRESH});
                }}
               >
                  <Scene hideNavBar key="_account" title="Tài khoản" component={Account} {...custommerNav} />
              </Scene>
            </Scene>

            <Scene key="address" title="Địa chỉ" component={Address} {...custommerNav} />
            <Scene key="confirm" title="Xác nhận" component={Confirm} {...custommerNav} />
            <Scene key="create_address" title="Thêm địa chỉ" component={CreateAddress} {...custommerNav} />
            <Scene key="register" title="Đăng ký" component={Register} {...custommerNav} />
            <Scene key="login" title="Đăng nhập" component={Login} {...custommerNav} />
            <Scene key="forget_verify" title="Lấy lại mật khẩu" component={ForgetVerify} {...custommerNav} />
            <Scene key="forget_active" title="Kích hoạt tài khoản" component={ForgetActive} {...custommerNav} />
            <Scene key="new_pass" title="Tạo mật khẩu mới" component={NewPass} {...custommerNav} />
            <Scene key="cart" title="Giỏ hàng" component={Cart} {...custommerNav} />
            <Scene key="stores" title="Cửa hàng" component={Stores} {...custommerNav} />
            <Scene key="stores_list" title="Cửa hàng" component={StoresList} {...custommerNav} />
            <Scene key="search" title="Tìm kiếm" component={Search} {...custommerNav} />
            <Scene key="item" title="Chi tiết sản phẩm" component={Item} {...custommerNav} />
            <Scene key="item_image_viewer" direction="vertical" hideNavBar title="" component={ItemImageViewer} {...custommerNav} />
            <Scene key="rating" panHandlers={null} direction="vertical" hideNavBar title="" component={Rating} {...custommerNav} />
            <Scene key="orders_item" title="Chi tiết đơn hàng" component={OrdersItem} {...custommerNav} />
            <Scene key="notifys" title="Tin tức" component={Notifys} {...custommerNav} />
            <Scene key="notify_item" title="Chi tiết" component={NotifyItem} {...custommerNav} />
            <Scene key="search_store" title="Tìm cửa hàng" component={SearchStore} {...custommerNav} />
            <Scene key="scan_qr_code" title="Quét mã" component={ScanQRCode} {...custommerNav} />
            <Scene key="list_store" title="Cửa hàng" component={ListStore} {...custommerNav} />
            <Scene key="add_store" title="Thêm cửa hàng" component={AddStore} {...custommerNav} />
            <Scene key="store_orders" title="" component={StoreOrders} {...custommerNav} />
            <Scene key="chat" title="" component={Chat} {...custommerNav} />
            <Scene key="webview" title="" component={WebView} {...custommerNav} />
            <Scene key="intro" initial={showIntro} hideNavBar title="" component={Intro} {...custommerNav} />

            {/* Backend */}
            <Scene key="dashboard" navigationBarStyle={{backgroundColor: HEADER_ADMIN_BGR}} title="Danh sách cửa hàng" component={Dashboard} {...custommerNav} />
            <Scene key="sale_menu" navigationBarStyle={{backgroundColor: HEADER_ADMIN_BGR}} title="Bảng điều khiển" component={SaleMenu} {...custommerNav} />
            <Scene key="sale_stores" navigationBarStyle={{backgroundColor: HEADER_ADMIN_BGR}} title="Cửa hàng" component={SaleStores} {...custommerNav} />
            <Scene key="sale" title="" navigationBarStyle={{backgroundColor: HEADER_ADMIN_BGR}} component={Sale} {...custommerNav} />
            <Scene key="order" title="" navigationBarStyle={{backgroundColor: HEADER_ADMIN_BGR}} component={Order} navBar={CustomNavBar} />
            <Scene key="sale_user_info" title="" navigationBarStyle={{backgroundColor: HEADER_ADMIN_BGR}} component={UserInfo} navBar={CustomNavBar} />
            <Scene key="sale_chat" title="" navigationBarStyle={{backgroundColor: HEADER_ADMIN_BGR}} component={SaleChat} navBar={CustomNavBar} />
            <Scene key="list_product" title="" navigationBarStyle={{backgroundColor: HEADER_ADMIN_BGR}} component={ListProduct} navBar={CustomNavBar2} />
            <Scene key="edit_list_product" title="" navigationBarStyle={{backgroundColor: HEADER_ADMIN_BGR}} component={EditListProduct} navBar={CustomNavBar2} />
            <Scene key="products" title="" navigationBarStyle={{backgroundColor: HEADER_ADMIN_BGR}} component={Products} {...custommerNav} />
            <Scene key="create_product" title="" navigationBarStyle={{backgroundColor: HEADER_ADMIN_BGR}} component={CreateProduct} {...custommerNav} />
            <Scene key="edit_product" title="" navigationBarStyle={{backgroundColor: HEADER_ADMIN_BGR}} component={EditProduct} {...custommerNav} />

          </Scene>
          <Scene key="error" component={Error}/>
        </Scene>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  tabBarStyle: {
    borderTopWidth : Util.pixel,
    borderColor    : '#cccccc',
    backgroundColor: 'white',
    opacity        : 1
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
  }
});
