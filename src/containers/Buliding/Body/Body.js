import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class Body extends Component {
  state = {};
  render() {
    return (
      <View>
        <HomeCardList
          data={this.props.rooms}
          onShowAll={null}
          title={this.props.title_rooms || 'Căn hộ của tôi'}
        >
          {({ item, index }) => (
            <HomeCardItem
              title={item.title}
              isShowSubTitle={true}
              subTitle={item.address}
              imageUrl={item.image_url}
              onPress={() => this.props.onPressSiteItem(item)}
              last={this.props.sites.length - 1 === index}
            />
          )}
        </HomeCardList>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default Body;
