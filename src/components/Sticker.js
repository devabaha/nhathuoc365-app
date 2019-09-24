/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Sticker extends Component {
  render() {
    if (this.props.active) {
      if (this.props.component) {
        return this.props.component;
      } else {
        return (
          <View style={styles.container}>
            <Icon
              name={this.props.icon || 'check-circle'}
              size={32}
              color="#dddddd"
            />
            <Text style={styles.sticker_title}>{this.props.message}</Text>
          </View>
        );
      }
    } else {
      return null;
    }
  }
}

Sticker.propTypes = {
  message: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  component: PropTypes.any
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '69%',
    minHeight: 100,
    backgroundColor: 'rgba(0,0,0,0.8)',
    left: Util.size.width / 2 - Util.size.width * 0.345,
    top: Util.size.height / 2 - 60 - NAV_HEIGHT,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sticker_title: {
    color: '#dddddd',
    marginTop: 8,
    fontWeight: '600',
    fontSize: 14
  }
});
