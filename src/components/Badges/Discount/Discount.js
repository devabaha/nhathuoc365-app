import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import appConfig from 'app-config';

class Discount extends Component {
  static defaultProps = {
    label: '',
    left: true,
    right: false,
    tailSpace: 0,
    containerStyle: {},
    contentContainerStyle: {}
  };
  state = {};
  render() {
    const extraStyle = {
      [this.props.right ? 'right' : 'left']: -this.props.tailSpace
    };
    const tailStyle = {
      borderTopWidth: this.props.tailSpace,
      [this.props.right ? 'borderRightWidth' : 'borderLeftWidth']: this.props
        .tailSpace,
      borderRightColor: 'transparent',
      bottom: -this.props.tailSpace,
      [this.props.right ? 'right' : 'left']: 0
    };

    return (
      <View style={[styles.container, extraStyle, this.props.containerStyle]}>
        <View
          style={[styles.content_wrapper, this.props.contentContainerStyle]}
        >
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
    backgroundColor: '#efa61e',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  content: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12
  },
  tail: {
    position: 'absolute',
    backgroundColor: 'transparent',
    width: 0,
    height: 0,
    borderTopColor: LightenColor(appConfig.colors.primary, -30),
    borderLeftColor: 'transparent'
  }
});

export default Discount;
