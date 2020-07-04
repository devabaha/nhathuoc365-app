import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HomeCardList, {
  HomeCardItem
} from '../../../components/Home/component/HomeCardList';
import Request from './Request';
import Bill from './Bill';

class Body extends Component {
  state = {};

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

  render() {
    return (
      <View>
        {this.hasBills && (
          <HomeCardList
            data={this.props.bills}
            onShowAll={this.props.onShowAllBills}
            title={this.props.title_bills}
          >
            {({ item, index }) => (
              <Bill
                title={item.title}
                period={item.payment_period}
                price={item.price}
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
                title={item.title}
                onShowAll={this.props.onShowAllStores}
                subTitle={item.address}
                imageUrl={item.image_url}
                onPress={() => this.props.onPressStore(item)}
                last={this.props.sites.length - 1 === index}
              />
            )}
          </HomeCardList>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default Body;
