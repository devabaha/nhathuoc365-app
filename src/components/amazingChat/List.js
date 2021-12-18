import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import EventTracker from 'app-helper/EventTracker';
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// entities
import {APIRequest} from '../../network/Entity';
// custom components
import NoResult from '../NoResult';
import ChatRow from './ChatRow';
import {FlatList, RefreshControl, ScreenWrapper} from 'src/components/base';
import Loading from '../Loading';

class List extends Component {
  static contextType = ThemeContext;

  state = {
    loading: true,
    loadingMore: true,
    refreshing: false,
    customers: [],
  };
  limit = 20;
  offset = 0;
  unmounted = false;
  isLoadMore = false;
  timeoutGetListCustomer = null;

  getListCustomerAPI = new APIRequest();
  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.getListCustomer();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.getListCustomerAPI.cancel();
    clearTimeout(this.timeoutGetListCustomer);
    this.eventTracker.clearTracking();
  }

  startTimeoutGetCustomers() {
    this.timeoutGetListCustomer = setTimeout(() => {
      this.isLoadMore = false;
      this.getListCustomer({
        limit: this.offset,
        offset: 0,
      });
    }, 3000);
  }

  async getListCustomer(
    data = {
      limit: this.limit,
      offset: this.offset,
    },
    delay = 1000,
  ) {
    try {
      let site_id = store.store_data.id;
      //specify for tick/tickid
      site_id = '';

      clearTimeout(this.timeoutGetListCustomer);
      if (this.source) {
        this.source.cancel();
      }

      this.getListCustomerAPI.data = APIHandler.site_load_conversations(
        site_id,
        {
          ...data,
        },
      );

      const response = await this.getListCustomerAPI.promise();

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          if (response.data) {
            let customers = [...response.data];

            if (customers.length !== 0) {
              if (this.isLoadMore) {
                customers = this.state.customers.concat(customers);
              }
              this.setState({customers});
            } else {
              this.isLoadMore && (this.offset -= this.limit);
              flashShowMessage({
                type: 'danger',
                message: 'Không còn bản ghi nào!',
              });
            }
          }
        }
        this.startTimeoutGetCustomers();
      }
    } catch (e) {
      console.log(e + ' get_list_chat');
      store.addApiQueue('get_list_chat', this.getListCustomer.bind(this));
    } finally {
      if (!this.unmounted) {
        this.setState({
          refreshing: false,
          loading: false,
          loadingMore: false,
        });
      }
    }
  }

  _onRefresh() {
    this.offset = 0;
    this.setState({refreshing: true});
    this.isLoadMore = false;
    this.getListCustomer();
  }

  onLoadMore() {
    if (!this.isLoadMore) {
      this.offset += this.limit;
      this.isLoadMore = true;
      this.setState({loadingMore: true});
      this.getListCustomer();
    }
  }

  handlePressCustomer(item) {
    push(
      appConfig.routes.amazingChat,
      {
        site_id: item.site_id,
        user_id: item.user_id,
        phoneNumber: item.tel,
        title: item.name,
      },
      this.theme,
    );
  }

  render() {
    const customers = [...this.state.customers];
    customers.push({id: 'chat'});
    return (
      <ScreenWrapper>
        {this.state.loading && <Loading center />}
        {this.state.customers.length === 0 ? (
          !this.state.loading &&
          !this.state.loadingMore && (
            <NoResult
              iconName="message-text-outline"
              message={this.props.t('noConversations')}
            />
          )
        ) : (
          <FlatList
            safeLayout
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
            ListFooterComponent={
              this.state.loadingMore ? (
                <Loading
                  wrapperStyle={styles.loadingMoreWrapper}
                  size="small"
                />
              ) : null
            }
            showsHorizontalScrollIndicator={false}
            data={this.state.customers}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={this.onLoadMore.bind(this)}
            onEndReachedThreshold={0.4}
            renderItem={({item, index}) => {
              // console.log(item)
              return (
                <ChatRow
                  title={item.name}
                  img={item.image}
                  phone={item.tel}
                  unreadChat={
                    item.unread === '0'
                      ? ''
                      : item.unread > 8
                      ? '9+'
                      : item.unread + ''
                  }
                  isSeparate={
                    this.state.customers.length < 10 ||
                    index !== this.state.customers.length - 1
                  }
                  isUnread={item.unread !== '0'}
                  subTitle={item.message}
                  timeAgo={item.time_ago}
                  onPress={() => this.handlePressCustomer(item)}
                />
              );
            }}
          />
        )}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  loadingMoreWrapper: {
    position: undefined,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withTranslation('chat')(observer(List));
