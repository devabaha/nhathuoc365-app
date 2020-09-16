import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  titleContainer: {
    padding: 15
  },
  title: {
    color: '#333',
    fontWeight: '500',
    backgroundColor: '#f0f0f0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    padding: 15
  },
  bodyContainer: {}
});

class Block extends Component {
  state = {};
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={(styles.titleContainer, this.props.titleContainerStyle)}>
          <Text style={[styles.title, this.props.titleStyle]}>
            {this.props.title}
          </Text>
        </View>
        <View style={[styles.bodyContainer, this.props.bodyContainerStyle]}>
          {this.props.children}
        </View>
      </View>
    );
  }
}

export default Block;
