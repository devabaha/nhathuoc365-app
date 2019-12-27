import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, FlatList, StyleSheet } from 'react-native';

class ListProducts extends Component {
  static propTypes = {
    data: PropTypes.array,
    title: PropTypes.string
  };

  static defaultProps = {
    data: [],
    title: ''
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headingWrapper}>
          <Text style={styles.heading}>{this.props.title}</Text>
        </View>
        <FlatList
          horizontal
          data={this.props.data}
          keyExtractor={item => `${item.id}`}
          showsHorizontalScrollIndicator={false}
          renderItem={this.props.children}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 8,
    paddingBottom: 18
  },
  headingWrapper: {
    marginTop: 16,
    marginBottom: 12
  },
  heading: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    marginLeft: 16
  }
});

export default ListProducts;
