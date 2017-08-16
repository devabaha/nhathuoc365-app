/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

export default class Indicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animating: true
    }
  }

  render() {
    if (this.props.size == "small") {
      return (
        <View style={styles.container}>
          <ActivityIndicator
                 animating={this.state.animating}
                 color={this.props.color || "#666666"}
                 size="small"
              />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.loading_box}>
          <ActivityIndicator
                 animating={this.state.animating}
                 color={this.props.color || "#ffffff"}
                 size="large"
              />
        </View>
      </View>
    );
  }
}

Indicator.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading_box: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 69,
    height: 69,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 5,
    marginTop: -NAV_HEIGHT / 2
  }
});
