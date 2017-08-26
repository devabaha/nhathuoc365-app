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

// store
import Store from './store/Store';

// import components
// screen
import Home from './components/home/Home';
import Notification from './components/notification/Notification';
import Orders from './components/orders/Orders';
import StoreOrders from './components/orders/StoreOrders';
import Account from './components/account/Account';
import Stores from './components/stores/Stores';
import Search from './components/stores/Search';
import Item from './components/item/Item';
import Cart from './components/cart/Cart';
import Payment from './components/payment/Payment';
import CreateAddress from './components/payment/CreateAddress';
import OrdersItem from './components/orders/OrdersItem';
import NotifyItem from './components/notification/NotifyItem';
import SearchStore from './components/home/SearchStore';
import ListStore from './components/home/ListStore';
import Chat from './components/chat/Chat';

// others
import TabIcon from './components/TabIcon';
import navBar from './components/NavBar';

// navigator bar
const custommerNav = {
  navBar,
  sceneStyle: {
    backgroundColor: "#f3f3f3"
  },
  direction: "fade"
}

// StatusBar
if (isIOS) {
  StatusBar.setBarStyle('light-content');
  // StatusBar.setNetworkActivityIndicatorVisible(true);
}

const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        // console.log("ACTION:", action);
        return defaultReducer(state, action);
    }
};

export default class App extends React.Component {
  componentDidMount() {

  }

  render() {
    return(
      <Router createReducer={reducerCreate} store={Store}>
        <Scene key="modal" component={Modal} >
          <Scene key="root">

            <Scene key="myTabBar" tabs={true} tabBarStyle={styles.tabBarStyle} pressOpacity={1}>

              {/**
              ************************ Tab 1 ************************
              */}
              <Scene
                key="myTab1"
                icon={TabIcon}
                iconTitle="My food"
                iconName="home"
                size={20}
                onPress={()=> {
                  Actions._home({type: ActionConst.REFRESH});
                }}
               >
                  <Scene key="_home" title="CỬA HÀNG" component={Home} {...custommerNav} />
              </Scene>

              {/**
              ************************ Tab 2 ************************
              */}
              <Scene
                key="myTab2"
                icon={TabIcon}
                iconTitle="Tin tức"
                iconName="newspaper-o"
                size={17}
                onPress={()=> {
                  Actions._notification({type: ActionConst.REFRESH});
                }}
               >
                  <Scene key="_notification" title="TIN TỨC" component={Notification} {...custommerNav} />
              </Scene>

              {/**
              ************************ Tab 3 ************************
              */}
              <Scene
                key="myTab3"
                icon={TabIcon}
                iconTitle="Đơn hàng"
                iconName="shopping-cart"
                size={20}
                onPress={()=> {
                  Actions._orders({type: ActionConst.REFRESH});
                }}
               >
                  <Scene key="_orders" title="DANH SÁCH ĐƠN HÀNG" component={Orders} {...custommerNav} />
              </Scene>

              {/**
              ************************ Tab 4 ************************
              */}
              <Scene
                key="myTab4"
                icon={TabIcon}
                iconTitle="Tài khoản"
                iconName="user"
                size={20}
                onPress={()=> {
                  Actions._account({type: ActionConst.REFRESH});
                }}
               >
                  <Scene hideNavBar key="_account" title="Tài khoản" component={Account} {...custommerNav} />
              </Scene>
            </Scene>

            <Scene initial={0} key="payment" title="ĐỊA CHỈ NHẬN HÀNG" component={Payment} {...custommerNav} />
            <Scene initial={0} key="createAddress" title="THÊM ĐỊA CHỈ" component={CreateAddress} {...custommerNav} />
            <Scene initial={0} key="cart" title="GIỎ HÀNG CỦA BẠN" component={Cart} {...custommerNav} />
            <Scene initial={0} key="stores" title="CỬA HÀNG" component={Stores} {...custommerNav} />
            <Scene initial={0} key="search" title="TÌM KIẾM" component={Search} {...custommerNav} />
            <Scene initial={0} key="item" title="THÔNG TIN SẢN PHẨM" component={Item} {...custommerNav} />
            <Scene initial={0} key="orders_item" title="CHI TIẾT ĐƠN HÀNG" component={OrdersItem} {...custommerNav} />
            <Scene initial={0} key="notify_item" title="CHI TIẾT" component={NotifyItem} {...custommerNav} />
            <Scene initial={0} key="search_store" title="TÌM CỬA HÀNG" component={SearchStore} {...custommerNav} />
            <Scene initial={0} key="list_store" title="DANH SÁCH CỬA HÀNG" component={ListStore} {...custommerNav} />
            <Scene initial={0} key="store_orders" title="" component={StoreOrders} {...custommerNav} />
            <Scene initial={0} key="chat" title="CHAT" component={Chat} {...custommerNav} />

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
