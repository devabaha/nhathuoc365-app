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
import {Scene, Router, Reducer} from 'react-native-router-flux';

// store
import Store from './store/Store';

// import components
import Launch from './components/launch/Launch';
import TabIcon from './components/TabIcon';

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

          <Scene key="myTabBar" hideNavBar tabs={true} tabBarStyle={styles.tabBarStyle}>

            <Scene
              key="myTab"
              title="My Tab 1"
              icon={TabIcon}
              iconTitle="Thông báo"
              iconName="public"
              size={23}
              onPress={()=> {
                Actions.myTab_1({type: ActionConst.REFRESH});
              }}
             >
                <Scene key="myTab_1" component={Launch} />
            </Scene>

            <Scene
              key="myTab2"
              title="My Tab 2"
              icon={TabIcon}
              iconTitle="Thông báo"
              iconName="public"
              size={23}
              onPress={()=> {
                Actions.myTab_2({type: ActionConst.REFRESH});
              }}
             >
                <Scene key="myTab_1" component={Launch} />
            </Scene>

            <Scene
              key="myTab3"
              title="My Tab 3"
              icon={TabIcon}
              iconTitle="Thông báo"
              iconName="public"
              size={23}
              onPress={()=> {
                Actions.myTab_3({type: ActionConst.REFRESH});
              }}
             >
                <Scene key="myTab_1" component={Launch} />
            </Scene>

            <Scene
              key="myTab4"
              title="My Tab 4"
              icon={TabIcon}
              iconTitle="Thông báo"
              iconName="public"
              size={23}
              onPress={()=> {
                Actions.myTab_4({type: ActionConst.REFRESH});
              }}
             >
                <Scene key="myTab_1" component={Launch} />
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
