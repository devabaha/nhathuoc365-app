import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HomeCardList, {
  HomeCardItem
} from '../../../components/Home/component/HomeCardList';

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

  onPressRoom = room => {};

  onPressNews = news => {};

  render() {
    return (
      <View>
        {this.hasRoom && (
          <HomeCardList
            data={this.props.rooms}
            onShowAll={null}
            title={this.props.title_rooms}
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
        {this.hasNews && (
          <HomeCardList
            data={this.props.newses}
            title={this.props.title_newses}
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
          <HomeCardList data={this.props.sites} title={this.props.title_sites}>
            {({ item, index }) => (
              <HomeCardItem
                title={item.title}
                isShowSubTitle={true}
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
