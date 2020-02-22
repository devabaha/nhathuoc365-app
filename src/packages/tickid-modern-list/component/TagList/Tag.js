import React from 'react';
import { Text, StyleSheet, TouchableHighlight } from 'react-native';

const Tag = props => {
  const activeStyle = props.active
    ? props.activeStyle
      ? props.activeStyle
      : styles.active
    : {};

  const activeTextStyle = props.active
    ? props.activeTextStyle
      ? props.activeTextStyle
      : styles.textActive
    : {};

  return (
    <TouchableHighlight
      style={[styles.container, activeStyle]}
      onPress={props.onPress}
      underlayColor="#999"
    >
      <Text style={[styles.text, activeTextStyle]}>{props.item}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#eee',
    borderRadius: 4,
    margin: 5
  },
  text: {
    fontSize: 14,
    color: '#404040'
  },
  active: {
    backgroundColor: '#46a6cc'
  },
  textActive: {
    color: '#fff'
  }
});

export default Tag;
