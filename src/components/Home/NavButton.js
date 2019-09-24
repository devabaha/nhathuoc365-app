/* @flow */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Ionicons';

export default class NavButton extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    label: PropTypes.string,
    icon: PropTypes.string,
    size: PropTypes.number,
    viewLayout: PropTypes.bool
  };

  static defaultProps = {
    size: 20,
    viewLayout: false
  };

  render() {
    var { onPress, label, icon, size, style, viewLayout } = this.props;

    if (viewLayout) {
      var Wrappner = View;
    } else {
      var Wrappner = TouchableHighlight;
    }

    return (
      <Wrappner
        style={[styles.container, style]}
        onPress={onPress}
        underlayColor="transparent"
      >
        <View style={styles.content}>
          <Icon name={icon} size={size} color="#ffffff" />
          {label != null && <Text style={styles.title}>{label}</Text>}
        </View>
      </Wrappner>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
    marginRight: 4
  },
  content: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center'
  },
  title: {
    fontSize: 10,
    color: '#ffffff'
  }
});
