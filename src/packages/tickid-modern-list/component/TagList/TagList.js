import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Tag from './Tag';

class TagList extends Component {
  state = {};

  renderItem() {
    return this.props.data.map((item, index) => {
      const text = this.props.mainKey ? item[this.props.mainKey] : item;

      return (
        <Tag
          active={item.active}
          activeStyle={this.props.activeStyle}
          activeTextStyle={this.props.activeTextStyle}
          key={index}
          item={text}
          onPress={() => this.props.onPressItem(item)}
        />
      );
    });
  }

  render() {
    return (
      <ScrollView
        scrollEnabled={this.props.scrollEnabled}
        scrollEventThrottle={16}
        contentContainerStyle={styles.contentContainerStyle}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      >
        {this.renderItem()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexWrap: 'wrap',
    flexDirection: 'row'
  }
});

export default TagList;
