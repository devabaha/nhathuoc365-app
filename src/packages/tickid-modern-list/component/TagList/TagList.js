import React, {Component} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import Tag from './Tag';

class TagList extends Component {
  state = {};

  renderItem() {
    return this.props.data.map((item, index) => {
      const text = this.props.mainKey ? item[this.props.mainKey] : item;

      return this.props.renderItem ? (
        this.props.renderItem(item, index)
      ) : (
        <Tag
          active={item.active}
          activeStyle={this.props.activeStyle}
          activeTextStyle={this.props.activeTextStyle}
          disabled={item.disabled}
          disabledStyle={this.props.disabledStyle}
          disabledTextStyle={this.props.disabledTextStyle}
          key={index}
          item={text}
          onPress={() => this.props.onPressItem(item)}
        />
      );
    });
  }

  renderContent() {
    return this.props.data.length === 0 && this.props.listEmptyComponent
      ? this.props.listEmptyComponent
      : this.renderItem();
  }

  renderScrollView() {
    return (
      <ScrollView
        scrollEnabled={this.props.scrollEnabled}
        scrollEventThrottle={16}
        contentContainerStyle={styles.contentContainerStyle}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always">
        {this.renderContent()}
      </ScrollView>
    );
  }

  renderNonList() {
    return (
      <View style={styles.contentContainerStyle}>{this.renderContent()}</View>
    );
  }

  renderList() {
    if (this.props.scrollEnabled) {
      return this.renderScrollView();
    } else {
      return this.renderNonList();
    }
  }

  render() {
    return this.renderList();
  }
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});

export default TagList;
