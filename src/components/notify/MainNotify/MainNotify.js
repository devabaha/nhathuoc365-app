import React, {Component} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
// 3-party libs
import {reaction} from 'mobx';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {servicesHandler} from 'app-helper/servicesHandler';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
//constants
import {BundleIconSetName} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import NotifyItemComponent from '../NotifyItemComponent';
import NoResult from 'src/components/NoResult';
import {FlatList, ScreenWrapper, RefreshControl} from 'src/components/base';
import Indicator from 'src/components/Indicator';
// skeleton
import MainNotifySkeleton from './MainNotifySkeleton';

class MainNotify extends Component {
  static contextType = ThemeContext;

  state = {
    navigators: null,
    listNotice: [],
    loading: true,
    refreshing: false,
    isLoadingMore: false,
  };

  // reaction(
  //   () => store.notify,
  //   () => {
  //     this._setOptionList();
  //   },
  // );
  page = 1;
  limit = 30;
  canLoadMore = 1;

  autoUpdateNotifyDisposer = null;
  autoUpdateNotifyCountDisposer = null;

  updateReadFlagNotifyRequest = new APIRequest();
  getNotifyRequest = new APIRequest();
  requests = [this.updateReadFlagNotifyRequest, this.getNotifyRequest];

  eventTracker = new EventTracker();
  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  _setOptionList() {
    this.setState({
      navigators: [
        {
          key: 0,
          label: 'Tin tức',
          desc: 'Tin tức mới nhất từ các cửa hàng',
          icon: 'bookmark',
          notify: 'new_site_news',
          onPress: () => {
            push(
              appConfig.routes.notifies,
              {
                news_type: '/1',
              },
              this.theme,
            );
          },
          boxIconStyle: [
            styles.boxIconStyle,
            {
              backgroundColor: '#fa7f50',
            },
          ],
          iconColor: '#ffffff',
        },
        {
          key: 1,
          label: 'Từ ' + APP_NAME_SHOW,
          desc: 'Thông báo từ ' + APP_NAME_SHOW,
          icon: 'lemon-o',
          notify: 'new_sys_news',
          onPress: () => {
            push(
              appConfig.routes.notifies,
              {
                title: 'Từ ' + APP_NAME_SHOW,
                news_type: '/2',
              },
              this.theme,
            );
          },
          boxIconStyle: [styles.boxIconStyle],
          iconColor: '#ffffff',
        },
      ],
    });
  }

  UNSAFE_componentWillMount() {
    // this._setOptionList();
  }

  componentDidMount() {
    this.getListNotice(this.page, this.limit, 1);
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
    !!this.autoUpdateNotifyDisposer && this.autoUpdateNotifyDisposer();
    !!this.autoUpdateNotifyCountDisposer &&
      this.autoUpdateNotifyCountDisposer();
    this.eventTracker.clearTracking();
    this.updateNavBarDisposer();
  }

  async getListNotice(
    page = this.page,
    limit = this.limit,
    isUpdateNotifyCount = 0,
  ) {
    appConfig.device.isIOS &&
      StatusBar.setNetworkActivityIndicatorVisible(true);

    const data = {page, limit, open_tab: isUpdateNotifyCount};

    this.getNotifyRequest.data = APIHandler.user_notice(data);

    try {
      const response = await this.getNotifyRequest.promise();
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          this.canLoadMore = response.data.load_more;
          this.setState((prevState) => ({
            listNotice:
              page > 1
                ? prevState.listNotice.concat(response.data.list || [])
                : response.data.list || [],
          }));
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || this.props.t('api.error.message'),
          });
        }
      }
    } catch (e) {
      console.log(e + ' user_notice');
      flashShowMessage({
        type: 'danger',
        message: this.props.t('api.error.message'),
      });
    } finally {
      if (isUpdateNotifyCount) {
        store.notify.notify_list_notice = 0;
      }

      this.forceUpdateNotify();

      store.setUpdateNotify(false);
      appConfig.device.isIOS &&
        StatusBar.setNetworkActivityIndicatorVisible(false);

      this.setState({
        loading: false,
        refreshing: false,
        isLoadingMore: false,
      });
    }
  }

  updateNotifyReadFlag = async (notify) => {
    this.updateReadFlagNotifyRequest.data = APIHandler.user_read_notice(
      notify.notice_id,
    );
    try {
      const response = await this.updateReadFlagNotifyRequest.promise();
    } catch (error) {
      console.log('user_read_notice' + error);
    }
  };

  forceUpdateNotify() {
    if (!this.autoUpdateNotifyDisposer) {
      this.autoUpdateNotifyDisposer = reaction(
        () => store.notify?.notify_list_notice,
        (totalNotify) => {
          if (!!totalNotify && !this.state.refreshing) {
            this.getListNotice(1, this.limit * this.page);
          }
        },
      );
    }

    if (!this.autoUpdateNotifyCountDisposer) {
      this.autoUpdateNotifyCountDisposer = reaction(
        () => store.isUpdateNotify,
        (isUpdateNotify) => {
          if (
            isUpdateNotify &&
            !!store.notify?.notify_list_notice &&
            !this.state.refreshing
          ) {
            this.page = 1;
            this.getListNotice(this.page, this.limit, 1);
          }
        },
      );
    }
  }

  handlePressNotify = (notify, service, callback) => {
    if (!notify.open_flag) {
      this.updateNotifyReadFlag(notify);
    }

    servicesHandler(
      {...notify, ...service, theme: this.theme},
      this.props.t,
      callback,
    );
  };

  handleLoadMore = () => {
    if (this.canLoadMore && !this.state.isLoadingMore) {
      this.setState({isLoadingMore: true});
      this.page++;
      this.getListNotice();
    }
  };

  handleRefresh = () => {
    this.getNotifyRequest.cancel();

    this.page = 1;
    this.setState({refreshing: true});
    this.getListNotice();
  };

  renderListEmpty = () => {
    return (
      // !this.state.loading && (
      <NoResult
        iconBundle={BundleIconSetName.IONICONS}
        iconName="notifications-off"
        message={this.props.t('common:noNotification')}
      />
    );
    // );
  };

  renderNotify = ({item: notify}) => {
    return (
      <NotifyItemComponent
        isRead={!!notify.open_flag}
        image={notify.image_url}
        // title={notify.title}
        shopName={notify.shop_name}
        created={notify.created}
        content={notify.content}
        onPress={(service, callback) =>
          this.handlePressNotify(notify, service, callback)
        }
      />
    );
  };

  renderNotifySeparator = () => {
    return <View style={styles.separator} />;
  };

  renderFooter = () => {
    return (
      this.state.isLoadingMore && (
        <MainNotifySkeleton useList={false} length={2} />
      )
    );
  };

  render() {
    return this.state.loading ? (
      <MainNotifySkeleton />
    ) : (
      <ScreenWrapper>
        {this.state.loading && <Indicator />}
        {/* <ScrollView
          onScroll={event => {
            this.setState({
              scrollTop: event.nativeEvent.contentOffset.y
            });
          }}
          ref={ref => (this.refs_main_notify = ref)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        > */}
        {/* {this.state.navigators != null && (
            <SelectionList data={this.state.navigators} />
          )} */}

        {/* <View style={styles.boxTop} />

          <View style={styles.headding_box}>
            <Text style={styles.headding_title}>THÔNG BÁO ĐƠN HÀNG</Text>
          </View> */}

        <FlatList
          ref={(ref) => (this.refs_main_notify = ref)}
          data={this.state.listNotice || []}
          initialNumToRender={20}
          renderItem={this.renderNotify}
          ListEmptyComponent={this.renderListEmpty}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
          keyExtractor={(item) => String(item.notice_id)}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={this.renderFooter}
        />
        {/* </ScrollView> */}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },

  boxIconStyle: {
    backgroundColor: appConfig.colors.primary,
    marginRight: 10,
    marginLeft: 6,
    borderRadius: 15,
  },
  boxTop: {
    width: '100%',
    height: 4,
  },
  headding_box: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  headding_title: {
    color: '#404040',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});

export default withTranslation()(observer(MainNotify));
