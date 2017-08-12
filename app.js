'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  StatusBar
} from 'react-native';

// constant, helper
import './lib/Constant';
import './lib/Helper';

// library
import {
  Scene,
  Router,
  Reducer,
  Actions,
  ActionConst
} from 'react-native-router-flux';

// store
import Store from './store/Store';

// import components
import Launch from './components/launch/Launch';
import Home from './components/home/Home';
import Notification from './components/notification/Notification';
import Orders from './components/orders/Orders';
import Account from './components/account/Account';
import Stores from './components/stores/Stores';
import Item from './components/item/Item';
import Cart from './components/cart/Cart';
import Payment from './components/payment/Payment';
import CreateAddress from './components/payment/CreateAddress';

import TabIcon from './components/TabIcon';
import navBar from './components/NavBar';

// navigator bar
const custommerNav = {
  navBar,
  sceneStyle: {
    backgroundColor: "#f3f3f3"
  }
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
                <Scene key="_home" title="Cửa hàng của bạn" component={Home} {...custommerNav} />
            </Scene>

            {/**
            ************************ Tab 2 ************************
            */}
            <Scene
              key="myTab2"
              icon={TabIcon}
              iconTitle="Thông báo"
              iconName="bell"
              size={20}
              onPress={()=> {
                Actions._notification({type: ActionConst.REFRESH});
              }}
             >
                <Scene key="_notification" title="Thông báo" component={Notification} {...custommerNav} />
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
                <Scene key="_orders" title="Đơn hàng" component={Orders} {...custommerNav} />
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
                <Scene key="_account" title="Tài khoản" component={Account} {...custommerNav} />
            </Scene>
          </Scene>

          <Scene key="payment" title="ĐỊA CHỈ NHẬN HÀNG" component={Payment} {...custommerNav} />
          <Scene initial={0} key="createAddress" title="THÊM ĐỊA CHỈ MỚI" component={CreateAddress} {...custommerNav} />
          <Scene initial={0} key="cart" title="GIỎ HÀNG CỦA BẠN" component={Cart} {...custommerNav} />
          <Scene key="stores" title="Cửa hàng" component={Stores} {...custommerNav} />
          <Scene initial={0} key="item" title="THÔNG TIN SẢN PHẨM" component={Item} {...custommerNav} />

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
