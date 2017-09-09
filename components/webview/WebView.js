'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  WebView
} from 'react-native';

import Loading from '../Loading';

export default class WebViewClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoading: false
    }
  }

  onLoadStart() {
    this.setState({
      showLoading: true
    });
  }

  onLoadEnd() {
    this.setState({
      showLoading: false
    });
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <WebView
          onLoadStart={this.onLoadStart.bind(this)}
          onLoadEnd={this.onLoadEnd.bind(this)}
					onLoad={this.onLoadEnd.bind(this)}
          source={{uri: this.props.url}}
          style={styles.webView}
        />

        {this.state.showLoading == true && <Loading center />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    ...MARGIN_SCREEN,
    marginBottom: 0
  },
  webView: {
    flex: 1
  },
  loadingBox: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: "#ebebeb",
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingTitle: {
    fontSize: 14,
    marginTop: 4,
    color: "#404040"
  }
});