/* @flow */

import React, {Component, useCallback, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

// library
import {TabView, TabBar} from 'react-native-tab-view';
import {Actions} from 'react-native-router-flux';
import store from 'app-store';
import {reaction} from 'mobx';
// import Button from 'react-native-button';

// components
import EventTracker from 'app-helper/EventTracker';

import appConfig from 'app-config';
import NewsScene from './NewsScene';
import {APIRequest} from 'src/network/Entity';
import CategoriesSkeleton from 'src/components/stores/CategoriesSkeleton';
import NoResult from 'src/components/NoResult';
import {
  getTheme,
  ThemeContext,
  updateNavbarTheme,
} from 'src/Themes/Theme.context';
import ScreenWrapper from 'src/components/base/ScreenWrapper';
import {
  AppFilledTonalButton,
  BaseButton,
  FilledTonalButton,
} from 'src/components/base/Button';
import {Container, Typography, TypographyType} from 'src/components/base';
import {mergeStyles} from 'src/Themes/helper';
import {BASE_DARK_THEME_ID} from 'src/Themes/Theme.dark';

const MAX_TAB_ITEMS_PER_ROW = 3.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
  },

  tabBarContainer: {
    // backgroundColor: '#fff',
    paddingHorizontal: 0,
    ...elevationShadowStyle(5),
  },
  tabBarLabel: {
    // minWidth: '100%',
    flex: appConfig.device.isIOS ? undefined : 1,
    // color: '#333',
    textAlignVertical: 'center',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tabBarLabelActive: {
    fontWeight: 'bold',
    // color: appConfig.colors.primary,
  },
  indicatorStyle: {
    // backgroundColor: appConfig.colors.primary,
    height: 2,
  },
});

class News extends Component {
  static contextType = ThemeContext;

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

    this.updateSelectedTabIndex = reaction(
      () => store.selectedNewsId,
      (id) => this.updateSelectedTabIndexById(id),
    );

    this.eventTracker = new EventTracker();
    this.getListNewsCategoryRequest = new APIRequest();
    this.requests = [this.getListNewsCategoryRequest];
    this.jumpTo = null;

    this.updateNavBarDisposer = () => {};
  }

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    setTimeout(() => {
      Actions.refresh({
        title: this.props.title || this.props.t('common:screen.news.mainTitle'),
      });
    });

    this.getListNewsCategory();
    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );

    store.getNotify();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
    this.updateNewsDisposer();
    this.updateSelectedTabIndex();
    this.updateNavBarDisposer();
    store.resetSocialNews();
    this.eventTracker.clearTracking();
  }

  updateSelectedTabIndexById = (id) => {
    if (!this.state.routes?.length) return;

    const tabIndex = this.state.routes.findIndex((r) => {
      return r.id === id;
    });

    if (tabIndex !== -1) {
      this.setState({index: tabIndex});
    }

    store.setSelectedNewsId();
  };

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
            const selectedId = store.selectedNewsId || this.props.id;
            if (selectedId) {
              defaultIndex = routes.findIndex((r) => {
                return r.id === selectedId;
              });
            }
            this.setState({routes, index: defaultIndex});

            store.setSelectedNewsId();
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

  getLabelStyle = (focused) => {
    return [
      styles.tabBarLabel,
      focused
        ? [styles.tabBarLabelActive, {color: this.theme.color.primary}]
        : {color: this.theme.color.onSurface},
    ];
  };

  renderTabBarLabel(title, focused) {
    return (
      <Typography
        type={TypographyType.LABEL_MEDIUM}
        numberOfLines={2}
        style={this.getLabelStyle(focused)}>
        {title}
      </Typography>
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
          const {
            route: {title, key},
          } = props;
          const focused = key === this.state.index;

          return (
            <BaseButton
              key={key}
              onPress={() => this.handleIndexChange(key, true)}
              style={[
                {
                  minHeight: 48,
                  width: tabWidth,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                focused && {backgroundColor: this.theme.color.surfaceHighlight},
              ]}>
              {this.renderTabBarLabel(title, focused)}
            </BaseButton>
          );
        }}
        indicatorContainerStyle={{zIndex: 1}}
        indicatorStyle={[
          {
            backgroundColor: this.theme.color.primary,
            height: this.theme.id === BASE_DARK_THEME_ID ? 0 : 2,
          },
        ]}
        tabStyle={{width: tabWidth}}
        style={[
          styles.tabBarContainer,
          {backgroundColor: this.theme.color.surface},
        ]}
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
      <ScreenWrapper style={styles.container}>
        {this.state.loading && <CategoriesSkeleton />}
        {!!this.state.routes.length ? (
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
        ) : (
          !this.state.loading && (
            <NoResult iconName="bell-off" message="Chưa có tin tức" />
          )
        )}
      </ScreenWrapper>
    );
  }
}

export default withTranslation(['news', 'common'])(observer(News));
