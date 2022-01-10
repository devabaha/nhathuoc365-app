import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
// configs
import appConfig from 'app-config';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import NoResult from '../NoResult';
import ChatRow from './ChatRow';
import {
  ScreenWrapper,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'src/components/base';
import Loading from '../Loading';

class List extends Component {
  static contextType = ThemeContext;

  state = {
    loading: true,
    loadingMore: false,
    refreshing: false,
    customers: [],
  };
  limit = 20;
  offset = 0;
  unmounted = false;
  isLoadMore = false;
  timeoutGetListCustomer = null;
  source = null;
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
    clearTimeout(this.timeoutGetListCustomer);
    if (this.source) {
      this.source.cancel();
    }
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
      clearTimeout(this.timeoutGetListCustomer);
      if (this.source) {
        this.source.cancel();
      }

      const [source, callable] = APIHandler.user_list_conversation(data);
      this.source = source;
      const response = await callable();

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          if (response.data) {
            let customers = [...response.data.list_conversation];

            if (customers.length !== 0) {
              if (this.isLoadMore) {
                customers = this.state.customers.concat(customers);
              }
              this.setState({customers});
            } else {
              this.isLoadMore && (this.offset -= this.limit);
            }
          }
        }
        this.startTimeoutGetCustomers();
      }
    } catch (e) {
      console.log(e + ' get_list_user_chat');
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
      appConfig.routes.amazingUserChat,
      {
        phoneNumber: item.tel,
        user: item,
        title: item.name,
        conversation_id: item.id,
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
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          ListFooterComponent={
            <>
              {this.props.footerComponent}
              {this.state.loadingMore ? (
                <View style={styles.loadingMoreContainer}>
                  <ActivityIndicator animating />
                </View>
              ) : null}
            </>
          }
          showsHorizontalScrollIndicator={false}
          data={this.state.customers || []}
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
                isSeparate={index !== this.state.customers.length - 1}
                isUnread={item.unread !== '0'}
                subTitle={item.message}
                timeAgo={item.time_ago}
                onPress={() => this.handlePressCustomer(item)}
              />
            );
          }}
          ListEmptyComponent={
            !this.state.loading &&
            !this.state.loadingMore && (
              <NoResult
                iconName="message-text-outline"
                message={this.props.t('noConversations')}
              />
            )
          }
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  loadingMoreContainer: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withTranslation('chat')(List);
