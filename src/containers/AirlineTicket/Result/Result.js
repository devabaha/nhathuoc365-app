import React, { Component } from 'react';
import Proptypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Loading from '../../../components/Loading';
import WebView from 'react-native-webview'

export default class Result extends Component {
  static propTypes = {
      url: Proptypes.string.isRequired,
      jsCode: Proptypes.string
  }

  static defaultProps = {
    jsCode: ''
  }

  constructor(props) {
    super(props);

    this.state = {
      showLoading: false,
      url: props.url,
      jsCode: props.jsCode
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

  _onNavigationStateChange(webViewState) {
    var {url} = webViewState;
    var existGet = stristr(url, '?');
    var existViewApp = stristr(url, 'view=app');

    if (!existViewApp) {
      this.setState({
        url: url + (existGet ? '&' : '?') + 'view=app'
      });
    }
  }

  render() {
    var {url, jsCode} = this.state;

    return (
      
      <View style={[styles.container, this.props.style]}>
        <WebView
          injectedJavaScript={jsCode}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          onLoadStart={this.onLoadStart.bind(this)}
          onLoadEnd={this.onLoadEnd.bind(this)}
					onLoad={this.onLoadEnd.bind(this)}
          source={{uri: url}}
          style={styles.webView}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
  },
});
