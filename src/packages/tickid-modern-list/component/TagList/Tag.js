import React from 'react';
import { Text, StyleSheet, TouchableHighlight } from 'react-native';

const Tag = props => {
  return (
    <TouchableHighlight
      style={styles.container}
      onPress={props.onPress}
      underlayColor="#999"
    >
      <Text style={styles.text}>{props.item}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 7,
    backgroundColor: '#eee',
    borderRadius: 4,
    margin: 10
  },
  text: {
    fontSize: 14,
    color: '#404040'
  }
});

export default Tag;
