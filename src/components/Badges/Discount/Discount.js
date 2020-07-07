import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import appConfig from 'app-config';

class Discount extends Component {
  static defaultProps = {
    leftSpace: 0,
    containerStyle: {}
  };
  state = {};
  render() {
    const extraStyle = {
      left: -this.props.leftSpace
    };
    const tailStyle = {
      borderTopWidth: this.props.leftSpace,
      borderLeftWidth: this.props.leftSpace,
      bottom: -this.props.leftSpace
    };

    return (
      <View style={[styles.container, extraStyle, this.props.containerStyle]}>
        <View style={styles.content_wrapper}>
          <Text style={styles.content}>{this.props.label}</Text>
        </View>
        <View style={[styles.tail, tailStyle]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  content_wrapper: {
    backgroundColor: appConfig.colors.primary,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  content: {
    color: '#ffffff',
    fontSize: 12
  },
  tail: {
    position: 'absolute',
    backgroundColor: 'transparent',
    width: 0,
    height: 0,
    left: 0,
    borderTopColor: LightenColor(appConfig.colors.primary, -30),
    borderLeftColor: 'transparent'
  }
});

export default Discount;
