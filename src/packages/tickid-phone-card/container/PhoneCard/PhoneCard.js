import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import PrepayContainer from '../Prepay';
import BuyCardContainer from '../BuyCard';
import BaseContainer from '../BaseContainer';
import config from '../../config';
import { internalFetch } from '../../helper/apiFetch';
import { normalize } from '../../helper/normalizer';
import Loading from '@tickid/tickid-rn-loading';

class PhoneCard extends BaseContainer {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [],
      cardServiceData: {},
      isReady: false,
      refreshing: false
    };
  }

  componentDidMount() {
    this.getPhoneCardServices();
  }

  getPhoneCardServices = () => {
    internalFetch(config.rest.phoneCardService())
      .then(response => {
        const { routes, ...normalizeData } = normalize(response.data);
        this.setState({
          routes,
          cardServiceData: normalizeData
        });
      })
      .finally(() => {
        this.setState({
          isReady: true,
          refreshing: false
        });
      });
  };

  renderTabBarLabel = ({ focused, route: { title } }) => {
    return (
      <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelAvtive]}>
        {title}
      </Text>
    );
  };

  handleRefresh = () => {
    this.setState({
      refreshing: true
    });

    setTimeout(this.getPhoneCardServices, 1000);
  };

  renderScene = ({ route }) => {
    switch (route.keyView) {
      case 'phone_paid':
        return (
          <PrepayContainer
            prefix="trước"
            routeKey={route.key}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            {...this.state.cardServiceData}
          />
        );
      case 'phone_card':
        return (
          <BuyCardContainer
            routeKey={route.key}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            {...this.state.cardServiceData}
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.isReady ? (
          <TabView
            navigationState={this.state}
            renderTabBar={props => (
              <TabBar
                {...props}
                renderLabel={this.renderTabBarLabel}
                indicatorStyle={styles.indicatorStyle}
                style={styles.tabBarStyle}
              />
            )}
            renderScene={this.renderScene}
            onIndexChange={index => this.setState({ index })}
            initialLayout={{ width: config.device.width }}
            style={styles.tabBarContainer}
          />
        ) : (
          <Loading loading />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBarStyle: {
    backgroundColor: config.colors.white
  },
  tabBarLabel: {
    color: '#666',
    paddingHorizontal: 4
  },
  tabBarLabelAvtive: {
    fontWeight: 'bold',
    color: config.colors.primary
  },
  indicatorStyle: {
    backgroundColor: config.colors.primary,
    height: 3
  },
  tabBarContainer: {
    backgroundColor: '#fff'
  }
});

export default PhoneCard;
