/* @flow */

import React, {Component, useCallback, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

// library
import {TabView, TabBar} from 'react-native-tab-view';
import {Actions} from 'react-native-router-flux';
import store from 'app-store';
import {reaction} from 'mobx';
import Button from 'react-native-button';

// components
import EventTracker from 'app-helper/EventTracker';

import appConfig from 'app-config';
import NewsScene from './NewsScene';
import {APIRequest} from 'src/network/Entity';
import CategoriesSkeleton from 'src/components/stores/CategoriesSkeleton';

const MAX_TAB_ITEMS_PER_ROW = 3.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
  },

  tabBarContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    ...elevationShadowStyle(5),
  },
  tabBarLabel: {
    minWidth: '100%',
    flex: appConfig.device.isIOS ? undefined : 1,
    color: '#333',
    textAlignVertical: 'center',
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  tabBarLabelActive: {
    fontWeight: 'bold',
    color: appConfig.colors.primary,
  },
  indicatorStyle: {
    backgroundColor: appConfig.colors.primary,
    height: 2,
  },

  separator: {
    width: '100%',
    height: 2,
    backgroundColor: '#cccccc',
  },
  headerView: {
    backgroundColor: 'rgb(255,255,255)',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContentView: {
    width: Util.size.width - 70,
  },
  titleHeaderTexxt: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descHeaderTexxt: {
    fontSize: 15,
  },
  boxIconStyle: {
    backgroundColor: DEFAULT_COLOR,
    marginRight: 10,
    marginLeft: 6,
    borderRadius: 15,
  },
});

class News extends Component {
  static defaultProps = {
    indexTab: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      loading: true,
      news_type: props.news_type || '',
      // news tab state
      index: this.props.indexTab,
      routes: [],
    };

    this.updateNewsDisposer = reaction(
      () => store.refresh_news,
      () => this.getListNewsCategory(),
    );

    this.eventTracker = new EventTracker();
    this.getListNewsCategoryRequest = new APIRequest();
    this.requests = [this.getListNewsCategoryRequest];
    this.jumpTo = null;
  }

  componentDidMount() {
    setTimeout(() => {
      Actions.refresh({
        title: this.props.title || this.props.t('common:screen.news.mainTitle'),
      });
    });

    this.getListNewsCategory();

    store.getNoitify();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
    this.updateNewsDisposer();
    store.resetSocialNews();
    this.eventTracker.clearTracking();
  }

  async getListNewsCategory() {
    const {t} = this.props;
    this.getListNewsCategoryRequest.data = APIHandler.user_list_news_category();
    try {
      const response = await this.getListNewsCategoryRequest.promise();
      console.log(response);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            const routes = this.routesFormatter(response.data);
            let defaultIndex = this.props.indexTab;
            if (this.props.id) {
              defaultIndex = routes.findIndex((r) => {
                return r.id === this.props.id;
              });
            }
            this.setState({routes, index: defaultIndex});
          } else {
            flashShowMessage({
              type: 'danger',
              message: response.message || t('common:api.error.message'),
            });
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: t('common:api.error.message'),
          });
        }
      }
    } catch (err) {
      console.log('user_list_news_category', err);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    } finally {
      this.setState({loading: false});
    }
  }

  routesFormatter(listNews = []) {
    return listNews.map((news, index) => ({
      key: index,
      ...news,
    }));
  }

  handleIndexChange = (index, isTabBarPress = false) => {
    if (this.jumpTo && isTabBarPress) {
      this.jumpTo(index);
    }
    this.setState({index});
  };

  renderTabBarLabel(props) {
    const {
      route: {title, key},
    } = props;
    const focused = key === this.state.index;

    return (
      <Text
        numberOfLines={2}
        style={[styles.tabBarLabel, focused && styles.tabBarLabelActive]}>
        {title}
      </Text>
    );
  }

  renderTabBar(props) {
    if (!this.jumpTo) {
      // use this function instead of default behavior (using index) when change index of tab bar to improve FPS.
      this.jumpTo = props.jumpTo;
    }
    const numberOfTabs = this.state.routes.length;
    // max tab width is device_width / MAX_TAB_ITEMS_PER_ROW
    const tabWidth =
      numberOfTabs <= MAX_TAB_ITEMS_PER_ROW
        ? appConfig.device.width / numberOfTabs
        : appConfig.device.width / MAX_TAB_ITEMS_PER_ROW;
    return (
      <TabBar
        {...props}
        renderTabBarItem={(props) => {
          return (
            <Button
              key={props.key}
              onPress={() => this.handleIndexChange(props.route.key, true)}
              containerStyle={{
                minHeight: 48,
                width: tabWidth,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {this.renderTabBarLabel(props)}
            </Button>
          );
        }}
        indicatorStyle={styles.indicatorStyle}
        tabStyle={{width: tabWidth}}
        style={styles.tabBarContainer}
        scrollEnabled
      />
    );
  }

  renderScene({route}) {
    // auto fetching data max for 3 category (current and 2 other on the left and right)
    const isFetching =
      route.key >= this.state.index - 1 && route.key <= this.state.index + 1;

    return <NewsScene id={route.id} isFetching={isFetching} />;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading && <CategoriesSkeleton />}
        {!!this.state.routes.length && (
          <TabView
            navigationState={{
              routes: this.state.routes,
              index: this.state.index,
            }}
            renderTabBar={this.renderTabBar.bind(this)}
            renderScene={this.renderScene.bind(this)}
            onIndexChange={(index) => this.handleIndexChange(index)}
            initialLayout={{width: appConfig.device.width}}
          />
        )}
      </View>
    );
  }
}

export default withTranslation(['news', 'common'])(observer(News));
