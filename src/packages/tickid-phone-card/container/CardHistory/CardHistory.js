import React, { Component, Fragment } from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  FlatList
} from 'react-native';
import { internalFetch } from '../../helper/apiFetch';
import NoResult from '../../component/NoResult';
import Loading from '@tickid/tickid-rn-loading';
import CardItem from '../CardItem';
import config from '../../config';
import EventTracker from '../../../../helper/EventTracker';

class CardHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      refreshing: false,
      isReady: false
    };
    this.eventTracker = new EventTracker();
  }

  get hasOrders() {
    return Array.isArray(this.state.orders) && this.state.orders.length > 0;
  }

  componentDidMount() {
    this.getOrders(this.props.serviceId);
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  onRefresh = () => {
    this.setState({
      refreshing: true
    });

    setTimeout(() => {
      this.getOrders(this.props.serviceId);
    }, 1000);
  };

  getOrders = serviceId => {
    internalFetch(config.rest.orders(serviceId))
      .then(response => {
        this.setState({
          orders: response.data
        });
      })
      .finally(() => {
        this.setState({
          isReady: true,
          refreshing: false
        });
      });
  };

  renderOrders = () => {
    return (
      <FlatList
        data={this.state.orders}
        keyExtractor={item => `${item.id}`}
        renderItem={this.renderOrder}
      />
    );
  };

  renderOrder = ({ item }) => {
    return (
      <Fragment>
        {/* <Text style={styles.heading}>09/2019</Text> */}

        <CardItem
          cardId={item.id}
          networkType={item.type}
          networkName={item.name}
          code={item.code}
          price={item.price_label}
          isPay={!!item.is_pay}
          isUsed={!!item.is_used}
          buyTime={item.created}
          statusView={item.status_view}
          syntaxPrepaid={item.syntax_prepaid}
          syntaxPostpaid={item.syntax_postpaid}
          cardCode={item.data && item.data.code}
          cardSeri={item.data && item.data.serial}
        />
      </Fragment>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {!this.state.isReady ? (
            <Loading loading />
          ) : this.hasOrders ? (
            this.renderOrders()
          ) : (
            <NoResult
              style={styles.noResult}
              title="Chưa có lịch sử"
              text="Chưa có hoạt động nạp tiền hoặc mua thẻ nào"
            />
          )}
          <View style={styles.bottomSpace} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  bottomSpace: {
    marginBottom: 16
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginLeft: 16,
    color: config.colors.black
  },
  noResult: {
    marginTop: config.device.height / 2 - config.device.statusBarHeight - 48
  }
});

export default CardHistory;
