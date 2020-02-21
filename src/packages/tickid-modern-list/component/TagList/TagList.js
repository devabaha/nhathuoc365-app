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
    flexWrap: 'wrap',
    flexDirection: 'row'
  }
});

export default TagList;
