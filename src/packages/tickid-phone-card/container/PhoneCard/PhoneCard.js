import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import PrepayContainer from '../Prepay';
import PostpaidContainer from '../Postpaid';
import BuyCardContainer from '../BuyCard';
import BaseContainer from '../BaseContainer';
import config from '../../config';
import { internalFetch } from '../../helper/apiFetch';
import { normalize } from '../../helper/normalizer';

class PhoneCard extends BaseContainer {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [],
      cardServiceData: {},
      isReady: false
    };
  }

  componentDidMount() {
    this.getPhoneCardService();
  }

  getPhoneCardService = () => {
    internalFetch(config.rest.phoneCardService()).then(response => {
      const { routes, ...normalizeData } = normalize(response.data);
      this.setState({
        routes,
        cardServiceData: normalizeData
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

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'phone_prepaid':
        return (
          <PrepayContainer
            routeKey={route.key}
            {...this.state.cardServiceData}
          />
        );
      case 'phone_card':
        return (
          <BuyCardContainer
            routeKey={route.key}
            {...this.state.cardServiceData}
          />
        );
      case 'phone_postpaid':
        return (
          <PostpaidContainer
            routeKey={route.key}
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
