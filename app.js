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
  Alert
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
import OneSignal from 'react-native-onesignal';

import {
  Analytics,
  Hits as GAHits,
  Experiment as GAExperiment
} from 'react-native-google-analytics';

// store
import Store from './store/Store';

// import components
// screen
import Intro from './components/intro/Intro';
import AddStore from './components/home/AddStore';
import Home from './components/home/Home';
import Notifys from './components/notify/Notifys';
import MainNotify from './components/notify/MainNotify';
import Orders from './components/orders/Orders';
import StoreOrders from './components/orders/StoreOrders';
import Account from './components/account/Account';
import Register from './components/account/Register';
import Login from './components/account/Login';
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

// others
import TabIcon from './components/TabIcon';
import navBar from './components/NavBar';

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

const reducerCreate = params => {
  const defaultReducer = Reducer(params);
  return (state, action) => {
    GoogleAnalytic(action.key);

    if (action.type == 'back') {
      Store.runStoreUnMount();
    }

    // get next state
    var nextState = defaultReducer(state, action);

    // get current scene key
    currentSceneName = getCurrentName(nextState);
    currentTabHandler(currentSceneName);

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
    storage.load({
      key: STORAGE_INTRO_KEY,
      autoSync: true,
      syncInBackground: true,
      syncParams: {
        extraFetchOptions: {
        },
        someFlag: true,
      },
    }).then(data => {
      this._endLoad(false);

      // StatusBar
      if (isIOS) {
        StatusBar.setBarStyle('light-content');
      }
    }).catch(err => {
      this._endLoad(true);

      // StatusBar
      if (isIOS) {
        StatusBar.setBarStyle('dark-content');
      }
    });
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
    OneSignal.addEventListener('registered', this._onRegistered.bind(this));
    OneSignal.addEventListener('ids', this._onIds.bind(this));

    this._login();
  }

  // login khi mở app
  async _login() {
    try {
      var response = await APIHandler.user_login({
        fb_access_token: ''
      });

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          Store.setUserInfo(response.data);
        })();

        this.setState({
          finish: true
        });
      }
    } catch (e) {
      console.warn(e + ' user_login');

      return Alert.alert(
        'Thông báo',
        'Kết nối mạng bị lỗi',
        [
          {text: 'Thử lại', onPress: this._login.bind(this)},
        ],
        { cancelable: false }
      );
    }
  }

  _onReceived(notify) {
    // console.log("Notification received: ", notify);
  }

  _onOpened(openResult) {
    // console.log('Message: ', openResult.notify.payload.body);
    // console.log('Data: ', openResult.notify.payload.additionalData);
    // console.log('isActive: ', openResult.notify.isAppInFocus);
    // console.log('openResult: ', openResult);

    // var data = openResult.notify.payload.additionalData;
    // if (data) {
    //   var {page, page_id} = data;
    //
    //   if (page) {
    //     // clear timer
    //     Store.runStoreUnMount();
    //
    //     // go home screen
    //     Actions.myTabBar({
    //       type: ActionConst.RESET
    //     });
    //
    //     // reload home screen
    //     action(() => {
    //       Store.setRefreshHomeChange(Store.refresh_home_change + 1);
    //     })();
    //
    //     setTimeout(() => {
    //
    //       switch (page) {
    //         case 'store':
    //           if (page_id) {
    //             this._pushGoStore(page_id);
    //           }
    //           break;
    //         case '_main_notify':
    //           this._goMainNotify();
    //           break;
    //         case 'payment':
    //
    //           break;
    //         case 'orders':
    //
    //           break;
    //       }
    //
    //     }, 1000);
    //   }
    // }
  }

  async _pushGoStore(page_id) {
    try {
      var response = await APIHandler.site_info(page_id);
      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          Store.setStoreData(response.data);

          Actions.stores({
            title: response.data.name
          });
        })();
      }
    } catch (e) {
      console.warn(e);
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
          console.warn(e);
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
    if (this.state.loading || this.state.finish == false) {
      return(
        <View style={styles.container}>
          <Indicator size="small" />
        </View>
      );
    }

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
                iconTitle="MyFood"
                iconName="store"
                size={24}
                onPress={()=> {
                  Actions._home({type: ActionConst.REFRESH});
                }}
               >
                  <Scene key="_home" title="MY FOOD" component={Home} {...custommerNav} />
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
                  <Scene key="_main_notify" title="THÔNG BÁO" component={MainNotify} {...custommerNav} />
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
                  <Scene key="_orders" title="ĐƠN HÀNG" component={Orders} {...custommerNav} />
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
                  <Scene hideNavBar key="_account" title="TÀI KHOẢN" component={Account} {...custommerNav} />
              </Scene>
            </Scene>

            <Scene key="address" title="ĐỊA CHỈ" component={Address} {...custommerNav} />
            <Scene key="confirm" title="XÁC NHẬN" component={Confirm} {...custommerNav} />
            <Scene key="create_address" title="THÊM ĐỊA CHỈ" component={CreateAddress} {...custommerNav} />
            <Scene key="register" title="ĐĂNG KÝ" component={Register} {...custommerNav} />
            <Scene key="login" title="ĐĂNG NHẬP" component={Login} {...custommerNav} />
            <Scene key="cart" title="GIỎ HÀNG" component={Cart} {...custommerNav} />
            <Scene key="stores" panHandlers={null} title="CỬA HÀNG" component={Stores} {...custommerNav} />
            <Scene key="stores_list" title="CỬA HÀNG" component={StoresList} {...custommerNav} />
            <Scene key="search" title="TÌM KIẾM" component={Search} {...custommerNav} />
            <Scene key="item" title="CHI TIẾT" component={Item} {...custommerNav} />
            <Scene key="item_image_viewer" direction="vertical" hideNavBar title="" component={ItemImageViewer} {...custommerNav} />
            <Scene key="orders_item" title="CHI TIẾT" component={OrdersItem} {...custommerNav} />
            <Scene key="notifys" title="KHUYẾN MÃI" component={Notifys} {...custommerNav} />
            <Scene key="notify_item" title="CHI TIẾT" component={NotifyItem} {...custommerNav} />
            <Scene key="search_store" title="TÌM CỬA HÀNG" component={SearchStore} {...custommerNav} />
            <Scene key="scan_qr_code" title="QUÉT MÃ CH" component={ScanQRCode} {...custommerNav} />
            <Scene key="list_store" title="CỬA HÀNG" component={ListStore} {...custommerNav} />
            <Scene key="add_store" title="THÊM CỬA HÀNG" component={AddStore} {...custommerNav} />
            <Scene key="store_orders" title="" component={StoreOrders} {...custommerNav} />
            <Scene key="chat" title="" component={Chat} {...custommerNav} />
            <Scene key="webview" title="" component={WebView} {...custommerNav} />
            <Scene initial={this.state.showIntro} key="intro" hideNavBar title="" component={Intro} {...custommerNav} />

          </Scene>

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
  }
});
