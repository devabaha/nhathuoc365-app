'use strict';

import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default class Loading extends Component {
  render() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}
      >
        <ActivityIndicator
          animating={true}
          style={[
            styles.loading,
            this.props.style,
            this.props.center ? styles.center : {}
          ]}
          size="large"
        />
      </View>
    );
  }
}

var LOADING_WIDTH = 60;
const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    height: 40
  },
  center: {
    position: 'absolute',
    top: Util.size.height / 2 - LOADING_WIDTH / 2 - NAV_HEIGHT,
    left: Util.size.width / 2 - LOADING_WIDTH / 2,
    zIndex: 999,
    width: LOADING_WIDTH,
    height: LOADING_WIDTH
  }
});
