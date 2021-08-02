import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {reaction} from 'mobx';
import appConfig from 'app-config';
import store from '../../store/Store';
import SelectionList from '../SelectionList';
import {Actions} from 'react-native-router-flux';
import NotifyItemComponent from './NotifyItemComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import EventTracker from '../../helper/EventTracker';

class MainNotify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      navigators: null,
      loading: true,
      notice_data: null,
      refreshing: false,
      finish: false,
      scrollTop: 0,
    };

    reaction(
      () => store.notify,
      () => {
        this._setOptionList();
      },
    );
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
    this._getData();

    store.is_stay_main_notify = true;

    store.parentTab = '_main_notify';
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  componentWillReceiveProps() {
    store.parentTab = '_main_notify';

    if (this.state.finish && store.is_stay_main_notify) {
      if (this.state.scrollTop == 0) {
        this._scrollOverTopAndReload();
      } else {
        this._scrollToTop(0);
      }
    }
    if (!store.is_stay_main_notify) {
      this._getData();
    }

    store.is_stay_main_notify = true;
  }

  _scrollToTop(top = 0) {
    if (this.refs_main_notify) {
      this.refs_main_notify.scrollTo({x: 0, y: top, animated: true});

      clearTimeout(this._scrollTimer);
      this._scrollTimer = setTimeout(() => {
        this.setState({
          scrollTop: top,
        });
      }, 500);
    }
  }

  _scrollOverTopAndReload() {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this._scrollToTop(-60);

        this._getData(1000);
      },
    );
  }

  async _getData(delay) {
    try {
      var response = await APIHandler.user_notice();

      if (response && response.status == STATUS_SUCCESS) {
        this.setState({
          loading: false,
          user_notice: response.data,
          refreshing: false,
          finish: true,
        });

        this._scrollToTop(0);
      }
    } catch (e) {
      console.log(e + ' user_notice');
      flashShowMessage({
        type: 'danger',
        message: this.props.t('api.error.message'),
      });
    } finally {
      store.getNotify();
      this.setState({
        loading: false,
        refreshing: false,
      });
    }
  }

  _onRefresh() {
    this.setState(
      {
        refreshing: true,
      },
      this._getData.bind(this, 1000),
    );
  }

  render() {
    var {user_notice, loading} = this.state;

    return (
      <View style={styles.container}>
        {loading && <Indicator />}
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
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          data={user_notice || []}
          style={[styles.profile_list_opt]}
          contentContainerStyle={styles.contentContainer}
          renderItem={({item, index}) => {
            return <NotifyItemComponent item={item} t={this.props.t} />;
          }}
          ListEmptyComponent={
            !loading && (
              <View style={styles.empty_box}>
                <Icon
                  name="shopping-basket"
                  size={32}
                  color={hexToRgbA(DEFAULT_COLOR, 0.6)}
                />
                <Text style={styles.empty_box_title}>Chưa có đơn hàng nào</Text>

                <TouchableHighlight
                  onPress={() => {
                    Actions.jump(appConfig.routes.homeTab);
                  }}
                  underlayColor="transparent">
                  <View style={styles.empty_box_btn}>
                    <Text style={styles.empty_box_btn_title}>Mua sắm ngay</Text>
                  </View>
                </TouchableHighlight>
              </View>
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          keyExtractor={(item) => item.id}
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
  },
  boxIconStyle: {
    backgroundColor: DEFAULT_COLOR,
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
    borderColor: DEFAULT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    borderRadius: 5,
    backgroundColor: DEFAULT_COLOR,
  },
  empty_box_btn_title: {
    color: '#ffffff',
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: '#dddddd',
  },

  profile_list_opt: {
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
  },

  contentContainer: {
    flexGrow: 1,
  },
});

export default withTranslation('common')(observer(MainNotify));
