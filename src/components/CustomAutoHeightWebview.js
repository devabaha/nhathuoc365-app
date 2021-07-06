import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

import appConfig from 'app-config';

import AutoHeightWebView from 'react-native-autoheight-webview';

const styles = StyleSheet.create({
  webview: {
    width: appConfig.device.width - 30,
  },
});

class CustomAutoHeightWebview extends Component {
  static defaultProps = {
    zoomable: false,
    scrollEnabled: false,
  };

  render() {
    return (
      <View style={this.props.containerStyle}>
        <AutoHeightWebView
          onShouldStartLoadWithRequest={(result) => {
            return true;
          }}
          style={[styles.webview, this.props.contentStyle]}
          // onHeightUpdated={(height) => this.setState({height})}
          source={{html: this.props.content}}
          zoomable={this.props.zoomable}
          scrollEnabled={this.props.scrollEnabled}
          viewportContent={'width=device-width, user-scalable=no'}
          customStyle={`
          * {
            font-family: 'arial';
          }
          a {
            pointer-events:none;
            text-decoration: none !important;
            color: #404040 !important;
          }
          p {
            font-size: 14px;
            line-height: 24px
          }
          img {
            max-width: 100% !important;
            height: auto !important;
          }`+ this.props.customStyle}
        />
      </View>
    );
  }
}

export default CustomAutoHeightWebview;
