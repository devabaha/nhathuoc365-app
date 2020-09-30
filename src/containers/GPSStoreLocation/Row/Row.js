import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderColor: '#ccc'
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15
  },
  title: {
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  sub: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '300'
  },
  mainContent: {
    flex: 1,
    marginRight: 15
  }
});

class Row extends Component {
  state = {};
  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <Image style={styles.image} source={{ uri: this.props.image }} />
        <View style={styles.mainContent}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Text style={styles.sub}>{this.props.address}</Text>
          {!!this.props.distance && (
            <Text style={styles.sub}>{this.props.distance}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

export default Row;
