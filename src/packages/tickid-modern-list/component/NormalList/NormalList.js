import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

class NormalList extends Component {
  state = {};

  renderItem({ item, index }) {
    const extraStyle =
      index === 0
        ? styles.first
        : index === this.props.data.length - 1
        ? styles.last
        : {};

    const extraStyleContent = index !== 0 && styles.content;

    const text = this.props.mainKey ? item[this.props.mainKey] : item;

    return (
      <TouchableHighlight
        underlayColor="#eee"
        onPress={() => this.props.onPressItem(item)}
        style={[styles.rowWrapper, styles.row, extraStyle]}
      >
        <View style={[styles.rowContent, styles.row, extraStyleContent]}>
          <Text style={styles.text}>{text}</Text>
          <Icon name="arrow-up-left" style={styles.rightIcon} />
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <FlatList
        data={this.props.data}
        renderItem={this.renderItem.bind(this)}
        scrollEnabled={this.props.scrollEnabled}
      />
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#f0f0f0'
  },
  rowWrapper: {
    paddingLeft: 15
  },
  rowContent: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 15
  },
  first: {
    borderTopWidth: 0.5
  },
  last: {
    borderBottomWidth: 0.5
  },
  content: {
    borderTopWidth: 0.2
  },
  rightIcon: {
    fontSize: 20,
    color: '#8c8c8c'
  },
  text: {
    fontWeight: '500',
    color: '#333',
    flex: 1
  }
});

export default NormalList;
