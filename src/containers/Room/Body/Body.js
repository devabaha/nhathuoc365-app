import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import HomeCardList, {
  HomeCardItem,
} from '../../../components/Home/component/HomeCardList';
import {Request} from '../../Requests';
import {Bill, QuickPayment} from '../../Bills';
import {servicesHandler, SERVICES_TYPE} from '../../../helper/servicesHandler';

class Body extends Component {
  state = {};

  get totalBillPrice() {
    return vndCurrencyFormat(
      this.props.bills.reduce(
        (prev, next) => (prev.price || prev) + next.price,
        0,
      ),
    );
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
    servicesHandler(
      {type: SERVICES_TYPE.OPEN_SHOP, siteId: store.id},
      {},
      callBack,
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.hasBills && (
          <HomeCardList
            data={this.props.bills}
            onShowAll={this.props.onShowAllBills}
            title={this.props.title_bills}
            containerStyle={styles.homeCardContainer}
            contentContainerStyle={styles.homeCardContent}
            extraComponent={
              <QuickPayment
                prefix={'Tổng tiền:   '}
                price={this.totalBillPrice}
                onPress={this.props.onPayBill}
              />
            }>
            {({item, index}) => (
              <Bill
                disabled
                containerStyle={styles.bill}
                status={item.status}
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
            containerStyle={styles.homeCardContainer}
            contentContainerStyle={styles.homeCardContent}>
            {({item, index}) => (
              <Request
                title={item.title}
                subTitle={item.content}
                description={item.created}
                status={item.status}
                adminName={item.admin_name}
                bgColor={item.color}
                textColor={item.textColor}
                type={item.request_type}
                noti={item.unread}
                onPress={() => this.props.onPressRequest(item)}
                last={this.props.requests.length - 1 === index}
                wrapperStyle={{marginVertical: 0}}
              />
            )}
          </HomeCardList>
        )}

        {this.hasRoom && (
          <HomeCardList
            data={this.props.rooms}
            title={this.props.title_rooms}
            containerStyle={styles.homeCardContainer}>
            {({item, index}) => (
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
            containerStyle={styles.homeCardContainer}
            onShowAll={null}
            // onShowAll={this.props.onShowAllNewses}
          >
            {({item, index}) => (
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
          <HomeCardList
            data={this.props.sites}
            title={this.props.title_sites}
            containerStyle={styles.homeCardContainer}
            onShowAll={null}
            // onShowAll={this.props.onShowAllStores}
          >
            {({item, index}) => (
              <HomeCardItem
                selfRequest={(callBack) =>
                  this.handleSelfRequestStore(item, callBack)
                }
                title={item.title}
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
    backgroundColor: '#eee',
  },
  bill: {
    width: 205,
  },
  homeCardContainer: {
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 10
  },
  homeCardContent: {
    paddingHorizontal: 0,
  },
});

export default Body;
