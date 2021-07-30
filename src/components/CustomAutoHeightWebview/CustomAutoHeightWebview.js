import React, {Component} from 'react';
import {Linking, StyleSheet, View} from 'react-native';

import appConfig from 'app-config';

import AutoHeightWebView from 'react-native-autoheight-webview';
import {Actions} from 'react-native-router-flux';

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

  handleMessage = (e) => {
    let message = e?.nativeEvent?.data;
    if (message) {
      message = JSON.parse(message);
      const url = message?.nativeEvent?.data;

      if (url) {
        Linking.canOpenURL(url)
          .then((supported) => {
            if (supported) {
              Linking.openURL(url);
              // Actions.push(appConfig.routes.modalWebview, {
              //   url,
              // });
            }
          })
          .catch((err) => {
            // console.log(err);
          });
      }
    }
  };

  render() {
    return (
      <View style={this.props.containerStyle}>
        <AutoHeightWebView
          ref={this.props.refWebview}
          onShouldStartLoadWithRequest={(result) => {
            return true;
          }}
          style={[styles.webview, this.props.contentStyle]}
          // onHeightUpdated={(height) => this.setState({height})}
          source={{
            html: `<div id="webview"> ${this.props.content} </div>`,
          }}
          zoomable={this.props.zoomable}
          scrollEnabled={this.props.scrollEnabled}
          viewportContent={'width=device-width, user-scalable=no'}
          javaScriptEnabled
          onMessage={this.handleMessage}
          customScript="
          window.open = function (url, windowName, windowFeatures) {
              if(url){
                window.ReactNativeWebView.postMessage(JSON.stringify({nativeEvent: {data:url}}));
              }
          };
          document.onclick = function (e) {
            e = e ||  window.event;
            let element = e.target || e.srcElement;
            element = element.closest('a');

            if (element) {
              window.ReactNativeWebView.postMessage(JSON.stringify({nativeEvent: {data:element.href}}));
              return false;
            }
          };
          "
          customStyle={
            `
          * {
            font-family: 'arial';
          }
          a {
            // pointer-events:none;
            // text-decoration: none !important;
            // color: ${appConfig.colors.primary} !important;
          }
          p {
            font-size: 14px;
            line-height: 24px
          }
          img {
            max-width: 100% !important;
            height: auto !important;
          }` + this.props.customStyle
          }
        />
      </View>
    );
  }
}

export default CustomAutoHeightWebview;
