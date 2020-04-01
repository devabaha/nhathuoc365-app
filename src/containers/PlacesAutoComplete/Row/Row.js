import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

class Row extends Component {
  state = {};

  componentDidMount() {}

  renderTitle() {
    let isReturn = false;
    let searchingText = '',
      remainText = '';
    const textSearchArr = this.props.textSearch.split('');
    const titleArr = this.props.title.split('');
    titleArr.forEach((tChar, tIndex) => {
      let isMatch = false;

      textSearchArr.forEach((tSChar, tSIndex) => {
        const condition =
          tSChar.toLowerCase() === tChar.toLowerCase() && tIndex === tSIndex;
        if (condition && !isReturn) {
          isMatch = true;
          searchingText += tChar;
        }
      });

      if (!isMatch) {
        isReturn = true;
        remainText += tChar;
      }
    });

    return (
      <Text numberOfLines={1} style={[styles.title, this.props.titleStyle]}>
        <Text style={styles.active}>{searchingText || remainText}</Text>
        {searchingText ? remainText : ''}
      </Text>
    );
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={styles.infor}>
          {this.renderTitle()}
          {!!this.props.description && (
            <Text numberOfLines={1} style={styles.description}>
              {this.props.description}
            </Text>
          )}
        </View>
        <Icon name="arrow-up-left" style={styles.icon} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  infor: {
    flex: 1
  },
  title: {
    fontSize: 16,
    color: '#242424'
  },
  active: {
    color: '#666'
  },
  description: {
    marginTop: 3,
    fontSize: 13,
    color: '#909090'
  },
  icon: {
    fontSize: 20,
    marginLeft: 15,
    color: '#666'
  }
});

export default Row;
