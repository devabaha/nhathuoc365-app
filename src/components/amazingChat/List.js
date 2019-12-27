import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import store from '../../store/Store';
import Indicator from '../Indicator';
import NoResult from '../NoResult';
import ChatRow from './ChatRow';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';
import Icon from 'react-native-vector-icons/Ionicons';
import { setStater } from '../../packages/tickid-chat/helper';

@observer
class List extends Component {
  state = {
    loading: false,
    refreshing: false,
    customers: []
  };
  limit = 20;
  offset = 0;
  unmounted = false;
  isLoadMore = false;
  timeoutGetListCustomer = null;
  source = null;

  componentDidMount() {
    setTimeout(() => {
      Actions.refresh({
        right: () => (
          <TouchableOpacity onPress={this.handleSearch.bind(this)}>
            <View style={styles.iconWrapper}>
              <Icon
                name="ios-search"
                style={[
                  styles.icon,
                  {
                    color: '#fff',
                    fontSize: 26
                  }
                ]}
              />
            </View>
          </TouchableOpacity>
        )
      });
    });
    this.setState({
      loading: true
    });

    this.getListCustomer();
  }

  componentWillUnmount() {
    this.unmounted = true;
    clearTimeout(this.timeoutGetListCustomer);
    if (this.source) {
      this.source.cancel();
    }
  }

  handleSearch() {
    Actions.search_chat();
  }

  startTimeoutGetCustomers() {
    this.timeoutGetListCustomer = setTimeout(() => {
      this.isLoadMore = false;
      this.getListCustomer({
        limit: this.offset,
        offset: 0
      });
    }, 3000);
  }

  async getListCustomer(
    data = {
      limit: this.limit,
      offset: this.offset
    },
    delay = 1000
  ) {
    try {
      let site_id = store.store_data.id;
      //specify for tick/tickid
      site_id = '';

      clearTimeout(this.timeoutGetListCustomer);
      if (this.source) {
        this.source.cancel();
      }

      const [source, callable] = APIHandler.site_load_conversations(site_id, {
        ...data
      });
      this.source = source;
      const response = await callable();

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          if (response.data) {
            let customers = [...response.data];

            if (customers.length !== 0) {
              if (this.isLoadMore) {
                customers = this.state.customers.concat(customers);
              }
              this.setState({ customers });
            } else {
              this.isLoadMore && (this.offset -= this.limit);
              Toast.show('Không còn bản ghi nào!');
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
          refreshing: false
        });
        setTimeout(
          () =>
            setStater(this, this.unmounted, {
              loading: false
            }),
          1000
        );
      }
    }
  }

  _onRefresh() {
    this.offset = 0;
    this.setState({ refreshing: true });
    this.isLoadMore = false;
    this.getListCustomer();
  }

  onLoadMore() {
    if (!this.isLoadMore) {
      this.offset += this.limit;
      this.isLoadMore = true;
      this.setState({ loading: true });
      this.getListCustomer();
    }
  }

  handlePressCustomer(item) {
    Actions.amazing_chat({
      site_id: item.site_id,
      user_id: item.user_id,
      phoneNumber: item.tel,
      title: item.name
    });
  }

  render() {
    const customers = [...this.state.customers];
    customers.push({ id: 'chat' });
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.customers.length === 0 ? (
          !!!this.state.loading && (
            <NoResult
              iconName="message-text-outline"
              message="Bạn chưa có lịch sử chat"
            />
          )
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
            ListFooterComponent={
              this.state.loading ? (
                <View
                  style={{
                    height: 45,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ActivityIndicator animating />
                </View>
              ) : null
            }
            style={styles.list}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={this.state.customers}
            keyExtractor={item => item.id.toString()}
            onEndReached={this.onLoadMore.bind(this)}
            onEndReachedThreshold={0.4}
            renderItem={({ item, index }) => {
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    width: Util.size.width,
    flexGrow: 1
  },
  container: {
    flex: 1,
    paddingBottom: 15,
    backgroundColor: BGR_SCREEN_COLOR
  },
  loadingWrapper: {
    position: 'absolute',
    width: '100%',
    height: appConfig.device.isAndroid ? '100%' : appConfig.device.height
  },
  button: {
    marginTop: 20,
    marginBottom: 30,
    height: 40,
    backgroundColor: DEFAULT_COLOR,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    minWidth: 150,
    maxWidth: 220,
    width: Util.size.width * 0.5
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold'
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 15
  }
});

export default List;
