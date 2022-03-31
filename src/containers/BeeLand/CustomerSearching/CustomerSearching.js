import React, { Component, PureComponent } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from '../../../components/Loading';
import NoResult from '../../../components/NoResult';
import { APIRequest } from '../../../network/Entity';
import { HeaderBeeLand } from '../components';
import CustomerRow from './CustomerRow';
import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 0,
    paddingVertical: 5,
    borderRadius: 8,
    ...elevationShadowStyle(5)
  },
  input: {
    padding: 15,
    paddingRight: 0,
    flex: 1
  },
  searchIcon: {
    paddingHorizontal: 15,
    fontSize: 18,
    color: appConfig.colors.primary
  },
  noti: {
    padding: 15
  },
  footerLoadingContainer: {
    height: 60
  },
  footerLoading: {
    height: '100%'
  },
  floatingBtnWrapper: {
    position: 'absolute',
    zIndex: 999,
    bottom: 45,
    right: 40,
    borderRadius: 30,
    backgroundColor: '#fff',
    ...elevationShadowStyle(10)
  },
  floatingBtnContainer: {
    flex: 1,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: '#888',
    overflow: 'hidden'
  },
  floatingBtnBackground: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%'
  },
  floatingBtnIcon: {
    fontSize: 30,
    color: '#fff'
  }
});

class CustomerSearching extends Component {
  state = {
    searchValue: '',
    customers: [],
    refreshing: false,
    isLoadMore: false,
    canLoadMore: false,
    loading: true
  };
  getListCustomerRequest = new APIRequest();
  requests = [this.getListCustomerRequest];
  offset = 0;
  limit = 30;

  componentDidMount() {
    this.getListCustomer();
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
  }

  async getListCustomer(isLoadMore = false) {
    const { t } = this.props;
    const data = {
      content: this.state.searchValue,
      limit: this.limit,
      offset: this.offset
    };
    try {
      this.getListCustomerRequest.data = APIHandler.user_list_customer_beeland(
        data
      );
      const response = await this.getListCustomerRequest.promise();
      console.log(response, data);
      if (response && response.status === STATUS_SUCCESS) {
        this.handleResponse(response.data.users, isLoadMore);
      } else {
        this.offset -= this.limit;
        flashShowMessage({
          type: 'danger',
          message: (response && response.message) || t('api.error.message')
        });
      }
    } catch (err) {
      this.offset -= this.limit;
      console.log('%cget_list_customer_beeland', 'color: red', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      this.setState({
        loading: false,
        refreshing: false,
        isLoadMore: false
      });
    }
  }

  handleResponse(newListCustomer, isLoadMore) {
    let customers = [];
    if (isLoadMore) {
      if (newListCustomer.length === 0) {
        this.offset -= this.limit;
      } else {
        customers = this.state.customers;
      }
    } else {
      customers = newListCustomer;
    }

    if (customers.length !== 0) {
      this.setState({
        customers,
        canLoadMore: true
      });
    } else {
      this.setState(prev => ({
        customers: isLoadMore ? prev.customers : customers,
        canLoadMore: false
      }));
    }
  }

  handleSearchCustomer() {
    this.setState({ loading: true });
    this.getListCustomer();
  }

  handleChangeText(searchValue) {
    this.setState({
      searchValue
    });
  }

  handleCustomerPress(customer) {
    Actions.push(appConfig.routes.customerProfileBeeLand, {
      title: this.props.t('screen.customerProfile.editTitle'),
      isEdit: true,
      customer,
      reloadData: () => this.onRefresh()
    });
  }

  onRefresh() {
    this.offset = 0;
    this.setState({ refreshing: true });
    this.getListCustomer();
  }

  onLoadMore() {
    if (this.state.canLoadMore && !this.state.isLoadMore) {
      this.offset += this.limit;
      this.setState({ isLoadMore: true }, () => {
        this.getListCustomer(true);
      });
    }
  }

  goToAddCustomer() {
    Actions.push(appConfig.routes.customerProfileBeeLand, {
      title: this.props.t('screen.customerProfile.mainTitle'),
      reloadData: () => this.onRefresh()
    });
  }

  renderCustomer({ item: customer, index }) {
    return (
      <CustomerRow
        name={customer.name}
        tel={customer.tel}
        onPress={() => this.handleCustomerPress(customer)}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading && <Loading center />}
        <SafeAreaView style={{ flex: 1 }}>
          <HeaderBeeLand>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên hoặc SĐT"
                value={this.state.searchValue}
                onChangeText={this.handleChangeText.bind(this)}
                returnKeyType="search"
                onSubmitEditing={this.handleSearchCustomer.bind(this)}
              />
              <TouchableOpacity onPress={this.handleSearchCustomer.bind(this)}>
                <Icon name="search" style={styles.searchIcon} />
              </TouchableOpacity>
            </View>
          </HeaderBeeLand>
          <Text style={styles.noti}>
            Có {this.state.customers.length} khách hàng
          </Text>

          <FlatList
            data={this.state.customers}
            renderItem={this.renderCustomer.bind(this)}
            style={{ flex: 1, backgroundColor: '#fff' }}
            contentContainerStyle={{ flexGrow: 1 }}
            onEndReached={this.onLoadMore.bind(this)}
            onEndReachedThreshold={0.4}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                onRefresh={this.onRefresh.bind(this)}
                refreshing={this.state.refreshing}
              />
            }
            ListEmptyComponent={
              !this.state.loading && (
                <NoResult
                  iconName="account-search"
                  message="Không có khách hàng"
                />
              )
            }
            ListFooterComponent={
              this.state.isLoadMore && (
                <View style={styles.footerLoadingContainer}>
                  <Loading style={styles.footerLoading} size="small" />
                </View>
              )
            }
          />

          <FloatingButton onPress={this.goToAddCustomer.bind(this)} />
        </SafeAreaView>
      </View>
    );
  }
}

export default withTranslation()(CustomerSearching);

class FloatingButton extends PureComponent {
  render() {
    return (
      <View style={styles.floatingBtnWrapper}>
        <View style={styles.floatingBtnContainer}>
          <LinearGradient
            colors={[
              LightenColor(appConfig.colors.primary, -20),
              appConfig.colors.primary,
              LightenColor(appConfig.colors.primary, 5)
            ]}
            locations={[0.2, 0.7, 0.9]}
            useAngle
            angle={-135}
            style={styles.floatingBtnBackground}
          />
          <TouchableOpacity activeOpacity={0.6} onPress={this.props.onPress}>
            <Icon name="plus" style={styles.floatingBtnIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
