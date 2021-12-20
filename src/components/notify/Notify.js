import React, {Component} from 'react';
import {StyleSheet} from 'react-native';

// 3-party libs
import {reaction} from 'mobx';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import {FlatList, RefreshControl, ScreenWrapper} from 'src/components/base';
import NewItemComponent from './NewItemComponent';
import Indicator from 'src/components/Indicator';
import CenterText from '../CenterText';

class Notify extends Component {
  static contextType = ThemeContext;

  state = {
    data: null,
    refreshing: false,
    loading: true,
    news_type: this.props.news_type || '',
    navigators: this._setOptionList(),
  };

  refreshNewsDisposer = reaction(
    () => store.refresh_news,
    () => this._getData(),
  );
  eventTracker = new EventTracker();

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  _setOptionList() {
    return [
      // {
      //   key: "0",
      //   label: "Tin tức",
      //   desc: "Thông tin FoodHub",
      //   icon: "calendar",
      //   notify: "new_calendar_news",
      //   onPress: () => {
      //     Actions.notifies_time({
      //       isNotifyTime: true,
      //       news_type: "/47"
      //     });
      //   },
      //   boxIconStyle: [styles.boxIconStyle, {
      //     backgroundColor: "#fa7f50"
      //   }],
      //   iconColor: "#ffffff"
      // },
      // {
      //   key: "1",
      //   label: "Chương trình khuyến mại",
      //   desc: "Khách hàng thân thiết",
      //   icon: "lemon-o",
      //   notify: "new_farm_news",
      //   onPress: () => {
      //     Actions.notifies_farm({
      //       isNotifyTime: true,
      //       news_type: "/46"
      //     });
      //   },
      //   boxIconStyle: [styles.boxIconStyle],
      //   iconColor: "#ffffff"
      // }
    ];
  }

  componentDidMount() {
    setTimeout(() => {
      refresh({
        title: this.props.title || this.props.t('common:screen.news.mainTitle'),
      });
    });
    this._getData();

    store.getNotify();
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();

    this.refreshNewsDisposer();
    this.updateNavBarDisposer();
  }

  async _getData(delay) {
    const {t} = this.props;
    try {
      var response = await APIHandler.user_news_list(
        this.state.news_type,
        this.props.id,
      );
      if (response && response.status == STATUS_SUCCESS) {
        if (store.deep_link_data) {
          const news = response.data.find(
            (newsItem) => newsItem.id === store.deep_link_data.id,
          );
          if (news) {
            push(
              appConfig.routes.notifyDetail,
              {
                title: news.title,
                data: news,
              },
              this.theme,
            );
          } else {
            flashShowMessage({
              type: 'danger',
              message: t('getNews.error.message'),
            });
          }
        }
        setTimeout(() => {
          this.setState({
            data: response.data,
            refreshing: false,
            loading: false,
          });
        }, delay || 0);
      }
    } catch (e) {
      console.log(e + ' user_news_list');
    } finally {
      store.setDeepLinkData(null);
    }
  }

  renderItem = ({item, index}) => {
    return <NewItemComponent item={item} />;
  };

  _onRefresh() {
    this.setState({refreshing: true});

    this._getData(1000);
  }

  render() {
    const {t} = this.props;

    return (
      <ScreenWrapper style={styles.container}>
        {this.state.loading && <Indicator />}
        <FlatList
          safeLayout
          style={styles.flatListContainer}
          data={this.state.data || []}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            !this.state.loading && <CenterText title={t('noNews')} />
          }
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
  },
  boxIconStyle: {
    backgroundColor: DEFAULT_COLOR,
    marginRight: 10,
    marginLeft: 6,
    borderRadius: 15,
  },
  flatListContainer: {
    marginTop: 2,
  },
});

export default withTranslation(['news', 'common'])(observer(Notify));
