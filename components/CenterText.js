/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class CenterText extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={{
          fontSize: this.props.fontSize || 14,
          color: this.props.color || "#404040",
          marginTop: -NAV_HEIGHT / 2
        }}>{this.props.title || "Vui lòng nhập text"}</Text>
      </View>
    );
  }
}

CenterText.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  fontSize: PropTypes.number
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
