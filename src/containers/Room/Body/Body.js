import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import HomeCardList, {
  HomeCardItem
} from '../../../components/Home/component/HomeCardList';
import Request from './Request';
import Bill from './Bill';
import appConfig from 'app-config';
import { servicesHandler } from '../../../helper/servicesHandler';

class Body extends Component {
  state = {};

  get totalBillPrice() {
    return '480.000đ';
  }

  get hasRoom() {
    return this.props.rooms && this.props.rooms.length !== 0;
  }
  get hasNews() {
    return this.props.newses && this.props.newses.length !== 0;
  }
  get hasSite() {
    return this.props.sites && this.props.sites.length !== 0;
  }
  get hasBills() {
    return this.props.bills && this.props.bills.length !== 0;
  }
  get hasRequests() {
    return this.props.requests && this.props.requests.length !== 0;
  }

  handleSelfRequestStore(store, callBack) {
    servicesHandler({ type: 'open_shop', siteId: store.id }, {}, callBack);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.hasBills && (
          <HomeCardList
            data={this.props.bills}
            onShowAll={this.props.onShowAllBills}
            title={this.props.title_bills}
            extraComponent={
              <View style={styles.billPaymentFooter}>
                <Text>
                  Tổng tiền:{' '}
                  <Text style={styles.billTotal}>{this.totalBillPrice}</Text>
                </Text>
                <TouchableOpacity
                  onPress={this.props.onPayBill}
                  style={styles.billPaymentBtn}
                >
                  <Text style={styles.billPaymentBtnTitle}>Thanh toán</Text>
                </TouchableOpacity>
              </View>
            }
          >
            {({ item, index }) => (
              <Bill
                title={item.title}
                period={item.payment_period}
                price={item.price_view}
                onPress={() => this.props.onPressBill(item)}
                last={this.props.bills.length - 1 === index}
              />
            )}
          </HomeCardList>
        )}

        {this.hasRequests && (
          <HomeCardList
            data={this.props.requests}
            onShowAll={this.props.onShowAllRequests}
            title={this.props.title_requests}
          >
            {({ item, index }) => (
              <Request
                title={item.title}
                subTitle={item.content}
                description={item.created}
                onPress={() => this.props.onPressRequest(item)}
                last={this.props.requests.length - 1 === index}
              />
            )}
          </HomeCardList>
        )}

        {this.hasRoom && (
          <HomeCardList data={this.props.rooms} title={this.props.title_rooms}>
            {({ item, index }) => (
              <HomeCardItem
                title={item.title}
                subTitle={item.address}
                imageUrl={item.image_url}
                onPress={() => this.props.onPressRoom(item)}
                last={this.props.rooms.length - 1 === index}
              />
            )}
          </HomeCardList>
        )}
        {this.hasNews && (
          <HomeCardList
            data={this.props.newses}
            title={this.props.title_newses}
            onShowAll={this.props.onShowAllNewses}
          >
            {({ item, index }) => (
              <HomeCardItem
                title={item.title}
                subTitle={item.address}
                imageUrl={item.image_url}
                onPress={() => this.props.onPressNews(item)}
                last={this.props.newses.length - 1 === index}
              />
            )}
          </HomeCardList>
        )}
        {this.hasSite && (
          <HomeCardList data={this.props.sites} title={this.props.title_sites}>
            {({ item, index }) => (
              <HomeCardItem
                selfRequest={callBack =>
                  this.handleSelfRequestStore(item, callBack)
                }
                title={item.title}
                onShowAll={this.props.onShowAllStores}
                subTitle={item.address}
                imageUrl={item.image_url}
                last={this.props.sites.length - 1 === index}
              />
            )}
          </HomeCardList>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee'
  },
  billPaymentFooter: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  billTotal: {
    color: appConfig.colors.primary,
    fontSize: 16,
    fontWeight: '500'
  },
  billPaymentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 4,
    backgroundColor: appConfig.colors.primary
  },
  billPaymentBtnTitle: {
    color: '#fff'
  }
});

export default Body;
