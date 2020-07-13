import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import appConfig from 'app-config';

class QuickPayment extends Component {
  state = {};
  render() {
    return (
      <View
        onLayout={this.props.onLayout}
        style={[styles.container, this.props.containerStyle]}
      >
        <Text>
          {this.props.prefix}
          <Text style={styles.price}>{this.props.price}</Text>
        </Text>
        <TouchableOpacity
          onPress={this.props.onPress}
          style={styles.btnContainer}
        >
          <Text style={styles.btnTitle}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa',
    marginTop: 15,
    marginBottom: -16,
    borderTopColor: '#ddd',
    borderTopWidth: 1
  },
  price: {
    color: appConfig.colors.primary,
    fontSize: 16,
    fontWeight: 'bold'
  },
  btnContainer: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 4,
    backgroundColor: appConfig.colors.primary
  },
  btnTitle: {
    color: '#fff'
  }
});

export default QuickPayment;
