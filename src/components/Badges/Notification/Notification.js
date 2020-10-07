import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class Notification extends Component {
  state = {};
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Text style={[styles.label, this.props.labelStyle]}>
          {this.props.label}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -5,
    right: 0,
    borderRadius: 15,
    paddingHorizontal: 3,
    height: 15,
    minWidth: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  },
  label: {
    color: '#fff',
    fontSize: 10
  }
});

export default Notification;
