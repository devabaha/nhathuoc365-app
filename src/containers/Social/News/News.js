import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import {TabView, TabBar} from 'react-native-tab-view';
import {reaction} from 'mobx';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// routing
import {refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BASE_DARK_THEME_ID} from 'src/Themes/Theme.dark';
import {TypographyType} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import NewsScene from './NewsScene';
import CategoriesSkeleton from 'src/components/stores/CategoriesSkeleton';
import NoResult from 'src/components/NoResult';
import {BaseButton, Typography, ScreenWrapper} from 'src/components/base';

const MAX_TAB_ITEMS_PER_ROW = 3.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
  },

  tabBarContainer: {
    paddingHorizontal: 0,
  },
  tabBarLabel: {
    flex: appConfig.device.isIOS ? undefined : 1,
    textAlignVertical: 'center',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tabBarLabelActive: {
    fontWeight: 'bold',
  },
  indicatorStyle: {
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
      refresh({
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

    const tabBarContainerStyle = mergeStyles(styles.tabBarContainer, {
      backgroundColor: this.theme.color.surface,
      shadowColor: this.theme.color.shadow,
      ...this.theme.layout.shadow,
    });

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
                focused && {
                  backgroundColor:
                    this.theme.id === BASE_DARK_THEME_ID
                      ? this.theme.color.surfaceHighlight
                      : this.theme.color.surface,
                },
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
        style={tabBarContainerStyle}
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
            <NoResult iconName="bell-off" message={this.props.t('noNews')} />
          )
        )}
      </ScreenWrapper>
    );
  }
}

export default withTranslation(['news', 'common'])(observer(News));
