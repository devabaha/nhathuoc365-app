import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import PrepayContainer from '../Prepay';
import PostpaidContainer from '../Postpaid';
import BuyCardContainer from '../BuyCard';
import BaseContainer from '../BaseContainer';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import config from '../../config';

class PhoneCard extends BaseContainer {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'prepay', title: 'Trả trước' },
        { key: 'buycard', title: 'Mua mã thẻ' },
        { key: 'postpaid', title: 'Trả sau' }
      ]
    };
  }

  renderTabBarLabel = ({ focused, route: { title } }) => {
    return (
      <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelAvtive]}>
        {title}
      </Text>
    );
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
          renderScene={SceneMap({
            prepay: PrepayContainer,
            buycard: BuyCardContainer,
            postpaid: PostpaidContainer
          })}
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
