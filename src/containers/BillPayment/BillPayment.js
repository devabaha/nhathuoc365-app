import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import appConfig from 'app-config';
import Bills from './Bills';
import Receipts from './Receipts/index.js';

const BILL_SCENCE = {
  BILL: {
    key: 'bills',
    title: 'Hoá đơn'
  },
  RECEIPTS: {
    key: 'receipts',
    title: 'Phiếu thu'
  }
};

class BillPayment extends Component {
  state = {
    selectedTabIndex: 0
  };
  unmounted = false;

  get navigationState() {
    return {
      index: this.state.selectedTabIndex,
      routes: Object.keys(BILL_SCENCE).map(key => ({ ...BILL_SCENCE[key] }))
    };
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  renderTabBarLabel = ({ focused, route: { title } }) => {
    return (
      <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelActive]}>
        {title}
      </Text>
    );
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case BILL_SCENCE.BILL.key:
        return <Bills roomId={this.props.roomId} siteId={this.props.siteId} />;
      case BILL_SCENCE.RECEIPTS.key:
        return (
          <Receipts roomId={this.props.roomId} siteId={this.props.siteId} />
        );
      default:
        return null;
    }
  };

  render() {
    console.log(this.navigationState);
    return (
      <SafeAreaView style={styles.container}>
        <TabView
          navigationState={this.navigationState}
          renderTabBar={props => {
            return (
              <TabBar
                {...props}
                renderLabel={this.renderTabBarLabel}
                indicatorStyle={styles.indicatorStyle}
                style={styles.tabBarStyle}
              />
            );
          }}
          renderScene={this.renderScene}
          onIndexChange={selectedTabIndex =>
            this.setState({ selectedTabIndex })
          }
          initialLayout={{ width: appConfig.device.width }}
          style={styles.tabBarContainer}
          st
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBarStyle: {
    backgroundColor: '#fff'
  },
  tabBarLabel: {
    color: '#666',
    paddingHorizontal: 4
  },
  tabBarLabelActive: {
    fontWeight: 'bold',
    color: appConfig.colors.primary
  },
  indicatorStyle: {
    backgroundColor: appConfig.colors.primary,
    height: 3
  }
});

export default BillPayment;
