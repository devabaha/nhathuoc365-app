import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HomeCardList, {
  HomeCardItem
} from '../../../components/Home/component/HomeCardList';
import Promotion from '../../../components/Home/component/Promotion';
import {
  servicesHandler,
  SERVICES_TYPE
} from '../../../helper/servicesHandler';

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
  get hasPromotion() {
    return this.props.promotions && this.props.promotions.length !== 0;
  }

  handleSelfRequestStore(store, callBack) {
    servicesHandler(
      { type: SERVICES_TYPE.OPEN_SHOP, siteId: store.id },
      {},
      callBack
    );
  }

  render() {
    return (
      <View>
        {this.hasRoom && (
          <HomeCardList
            data={this.props.rooms}
            title={this.props.title_rooms}
            onShowAll={null}
          >
            {({ item, index }) => (
              <HomeCardItem
                title={item.title}
                isShowSubTitle={true}
                subTitle={item.address}
                imageUrl={item.image_url}
                onPress={() => this.props.onPressRoom(item)}
                last={this.props.rooms.length - 1 === index}
              />
            )}
          </HomeCardList>
        )}

        {this.hasPromotion && (
          <Promotion
            data={this.props.promotions}
            onPress={this.props.onPressPromotion}
            containerStyle={!this.hasRoom && styles.extraStylePromotion}
          />
        )}

        {this.hasNews && (
          <HomeCardList
            data={this.props.newses}
            title={this.props.title_newses}
            onShowAll={null}
          >
            {({ item, index }) => (
              <HomeCardItem
                title={item.title}
                isShowSubTitle={true}
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
            onShowAll={null}
          >
            {({ item, index }) => (
              <HomeCardItem
                selfRequest={callBack =>
                  this.handleSelfRequestStore(item, callBack)
                }
                title={item.title}
                isShowSubTitle={true}
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
  extraStylePromotion: {
    marginTop: 15
  }
});

export default Body;
