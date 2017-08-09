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
}

const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        console.log("ACTION:", action);
        return defaultReducer(state, action);
    }
};

export default class App extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      Store.setValue('2');
    }, 3000);
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
              iconName="globe"
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

        </Scene>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  tabBarStyle: {
    borderTopWidth : .5,
    borderColor    : '#b7b7b7',
    backgroundColor: 'white',
    opacity        : 1
  }
});
