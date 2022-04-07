import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class Inset extends Component {
  static defaultProps = {
    containerStyle: {},
    labelStyle: {},
    label: ''
  };
  state = {};
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Text numberOfLines={1} style={[styles.label, this.props.labelStyle]}>
          {this.props.label}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    zIndex: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: hexToRgba('#fefefe', 0.8),
    paddingHorizontal: 5,
    paddingVertical: 1
  },
  label: {
    color: '#555',
    fontSize: 11,
    textAlign: 'center'
  }
});

export default Inset;
