'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  PanResponder
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
  },
  direction: "horizontal"
}

// StatusBar
if (isIOS) {
  StatusBar.setBarStyle('light-content');
}

const reducerCreate = params => {
  const defaultReducer = Reducer(params);
  return (state, action) => {
    GoogleAnalytic(action.key);

    if (action.type == 'back') {
      Store.runStoreUnMount();
    }
    if (action.key && action.key != '_home') {
      Store.is_stay_home = false;
    }
    if (action.key && action.key != '_main_notify') {
      Store.is_stay_main_notify = false;
    }
    if (action.key && action.key != '_orders') {
      Store.is_stay_orders = false;
    }
    if (action.key && action.key != '_account') {
      Store.is_stay_account = false;
    }
    return defaultReducer(state, action);
  }
};

export default class App extends Component {
  componentWillMount() {
    OneSignal.addEventListener('received', this._onReceived);
    OneSignal.addEventListener('opened', this._onOpened);
    OneSignal.addEventListener('registered', this._onRegistered);
    OneSignal.addEventListener('ids', this._onIds);
  }

  _onReceived(notify) {
    console.log("Notification received: ", notify);
  }

  _onOpened(openResult) {
    console.log('Message: ', openResult.notify.payload.body);
    console.log('Data: ', openResult.notify.payload.additionalData);
    console.log('isActive: ', openResult.notify.isAppInFocus);
    console.log('openResult: ', openResult);

    var data = openResult.notify.payload.additionalData;
    if (data) {
      // clear timer
      Store.runStoreUnMount();

      var {page, id} = data;

      // go home screen
      Actions.myTabBar({
        type: ActionConst.RESET
      });

      // reload home screen
      action(() => {
        Store.setRefreshHomeChange(Store.refresh_home_change + 1);
      })();

      if (page) {
        setTimeout(async () => {


          switch (page) {
            case 'store':
              try {
                var response = await APIHandler.site_info(id);
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
              break;
            case 'item':

              break;
            case 'payment':

              break;
            case 'orders':

              break;
          }


        }, 1000);
      }
    }

  }

  _onRegistered(notifData) {
    console.log("Device had been registered for push notifys!", notifData);
  }

  async _onIds(device) {
	   console.log('Device info: ', device);
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
    if (typeof Store.replaceBack == 'function') {
      Store.replaceBack();
      Store.replaceBack = null;
    } else {
      if (typeof Store.pushBack == 'function') {
        Store.pushBack();
        Store.pushBack = null;
      }

      Actions.pop();
    }

    return true;
  }

  render() {
    return(
      <Router
        onExitApp={() => true}
        backAndroidHandler={this._backAndroidHandler}
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
                  <Scene key="_home" title="MYFOOD" component={Home} {...custommerNav} />
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
                onPress={()=> {
                  Actions._main_notify({type: ActionConst.REFRESH});
                }}
               >
                  <Scene initial={0} key="_main_notify" title="THÔNG BÁO" component={MainNotify} {...custommerNav} />
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
                size={24}
                onPress={()=> {
                  Actions._account({type: ActionConst.REFRESH});
                }}
               >
                  <Scene hideNavBar key="_account" title="TÀI KHOẢN" component={Account} {...custommerNav} />
              </Scene>
            </Scene>

            <Scene initial={0} key="address" title="ĐỊA CHỈ" component={Address} {...custommerNav} />
            <Scene initial={0} key="confirm" title="XÁC NHẬN" component={Confirm} {...custommerNav} />
            <Scene initial={0} key="create_address" title="THÊM ĐỊA CHỈ" component={CreateAddress} {...custommerNav} />
            <Scene initial={0} key="register" title="ĐĂNG KÝ" component={Register} {...custommerNav} />
            <Scene initial={0} key="login" title="ĐĂNG NHẬP" component={Login} {...custommerNav} />
            <Scene initial={0} key="cart" title="GIỎ HÀNG" component={Cart} {...custommerNav} />
            <Scene initial={0} key="stores" title="CỬA HÀNG" component={Stores} {...custommerNav} />
            <Scene initial={0} key="stores_list" title="CỬA HÀNG" component={StoresList} {...custommerNav} />
            <Scene initial={0} key="search" title="TÌM KIẾM" component={Search} {...custommerNav} />
            <Scene initial={0} key="item" title="CHI TIẾT" component={Item} {...custommerNav} />
            <Scene initial={0} key="orders_item" title="CHI TIẾT" component={OrdersItem} {...custommerNav} />
            <Scene initial={0} key="notifys" title="KHUYẾN MÃI" component={Notifys} {...custommerNav} />
            <Scene initial={0} key="notify_item" title="CHI TIẾT" component={NotifyItem} {...custommerNav} />
            <Scene initial={0} key="search_store" title="TÌM CỬA HÀNG" component={SearchStore} {...custommerNav} />
            <Scene initial={0} key="scan_qr_code" title="QUÉT MÃ CH" component={ScanQRCode} {...custommerNav} />
            <Scene initial={0} key="list_store" title="CỬA HÀNG" component={ListStore} {...custommerNav} />
            <Scene initial={0} key="store_orders" title="" component={StoreOrders} {...custommerNav} />
            <Scene initial={0} key="chat" title="" component={Chat} {...custommerNav} />
            <Scene initial={0} key="webview" title="" component={WebView} {...custommerNav} />

          </Scene>

        </Scene>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  tabBarStyle: {
    borderTopWidth : Util.pixel,
    borderColor    : '#cccccc',
    backgroundColor: 'white',
    opacity        : 1
  }
});
