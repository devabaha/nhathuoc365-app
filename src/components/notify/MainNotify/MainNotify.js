import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
} from 'react-native';
import {reaction} from 'mobx';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import appConfig from 'app-config';
import store from 'app-store';
import EventTracker from 'app-helper/EventTracker';
import {APIRequest} from 'src/network/Entity';

import {BUNDLE_ICON_SETS_NAME} from 'src/constants';

import SelectionList from 'src/components/SelectionList';
import NotifyItemComponent from '../NotifyItemComponent';
import NoResult from 'src/components/NoResult';
import MainNotifySkeleton from './MainNotifySkeleton';
import {servicesHandler} from 'app-helper/servicesHandler';

class MainNotify extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    this.page = 1;
    this.limit = 30;
    this.canLoadMore = 1;

    this.autoUpdateNotifyDisposer = null;
    this.autoUpdateNotifyCountDisposer = null;

    this.updateReadFlagNotifyRequest = new APIRequest();
    this.getNotifyRequest = new APIRequest();
    this.requests = [this.updateReadFlagNotifyRequest, this.getNotifyRequest];

    this.eventTracker = new EventTracker();
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
            Actions.notifies({
              news_type: '/1',
            });
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
            Actions.notifies({
              title: 'Từ ' + APP_NAME_SHOW,
              news_type: '/2',
            });
          },
          boxIconStyle: [styles.boxIconStyle],
          iconColor: '#ffffff',
        },
      ],
    });
  }

  UNSAFE_componentWillMount() {
    this._setOptionList();
  }

  componentDidMount() {
    this.getListNotice(this.page, this.limit, 1);
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
    !!this.autoUpdateNotifyDisposer && this.autoUpdateNotifyDisposer();
    !!this.autoUpdateNotifyCountDisposer &&
      this.autoUpdateNotifyCountDisposer();
    this.eventTracker.clearTracking();
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

    servicesHandler({...notify, ...service}, this.props.t, callback);
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
      !this.state.loading && (
        <NoResult
          iconBundle={BUNDLE_ICON_SETS_NAME.Ionicons}
          iconName="notifications-off"
          message="Chưa có thông báo"
        />
      )
    );
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
      <View style={styles.container}>
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
          style={[styles.profile_list_opt]}
          contentContainerStyle={styles.contentContainer}
          initialNumToRender={20}
          renderItem={this.renderNotify}
          ListEmptyComponent={this.renderListEmpty}
          ItemSeparatorComponent={this.renderNotifySeparator}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultBox: {
    width: '100%',
    height: 120,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },

  container: {
    flex: 1,
    backgroundColor: appConfig.colors.white,
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

  notice_box: {
    width: '100%',
  },

  empty_box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty_box_title: {
    fontSize: 12,
    marginTop: 8,
    color: '#404040',
  },
  empty_box_btn: {
    borderWidth: Util.pixel,
    borderColor: appConfig.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    borderRadius: 5,
    backgroundColor: appConfig.colors.primary,
  },
  empty_box_btn_title: {
    color: '#ffffff',
  },

  separator: {
    width: appConfig.device.width,
    height: appConfig.device.pixel,
    backgroundColor: appConfig.colors.border,
    left: 15,
  },

  profile_list_opt: {
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
  },

  contentContainer: {
    flexGrow: 1,
  },
});

export default withTranslation()(observer(MainNotify));
