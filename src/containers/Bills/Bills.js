import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import appConfig from 'app-config';
import { BillsTab, ReceiptsTab } from './Tabs';
import { Actions } from 'react-native-router-flux';

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

class Bills extends Component {
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

  handlePayBill = () => {
    Actions.push(appConfig.routes.billsPaymentMethod, {
      id: this.props.siteId
    });
  };

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
        return (
          <BillsTab
            roomId={this.props.roomId}
            siteId={this.props.siteId}
            onPayBill={this.handlePayBill}
          />
        );
      case BILL_SCENCE.RECEIPTS.key:
        return (
          <ReceiptsTab roomId={this.props.roomId} siteId={this.props.siteId} />
        );
      default:
        return null;
    }
  };

  render() {
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
    textAlign: 'center',
    color: '#666'
  },
  tabBarLabelActive: {
    fontWeight: 'bold',
    marginHorizontal: '-100%',
    color: appConfig.colors.primary
  },
  indicatorStyle: {
    backgroundColor: appConfig.colors.primary,
    height: 3
  },
  tabBarContainer: {}
});

export default Bills;
