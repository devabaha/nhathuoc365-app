import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

function NoResult(props) {
  return (
    <View style={styles.noResultWrapper}>
      <Text style={styles.noResultTitle}>{props.title}</Text>
      <Text style={styles.noResultText}>{props.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noResultWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16
  },
  noResultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  noResultText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    marginTop: 8
  }
});

NoResult.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default NoResult;
