import React, {Component} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';

import appConfig from 'app-config';
import {openLink} from 'app-helper';

const ACTION_TYPE = {
  GET_INNER_TEXT: 'webview_get_inner_text',
  CLICK_LINK: 'native_click_link',
};

const CUSTOM_STYLE = `
  body {
    padding-left: 15px;
    padding-right: 15px;
  }
  * {
    font-family: 'arial';
  }
  body {
    padding-left: 15px;
    padding-right: 15px;
  },
  a {
    // pointer-events:none;
    // text-decoration: none !important;
    // color: ${appConfig.colors.primary} !important;
  }
  p, li, span {
    font-size: 14px;
    line-height: 24px
  }
  img {
    max-width: 100% !important;
    height: auto !important;
  }
`;

const CUSTOM_SCRIPT = `
  const userAgent = window.navigator.userAgent.toLowerCase(),
      safari = /safari/.test(userAgent),
      ios = /iphone|ipod|ipad/.test(userAgent);
      
  const root = ios ? window : document;

  root.addEventListener("message", function (event) {
    const data = JSON.parse(event.data);
    switch(data.type) {
      case 'webview_get_inner_text':
        const text = getTextOnly();
        postMessage(text, data.type);
        break;
    }
  });

  function postMessage(data, type){
    const message = JSON.stringify({nativeEvent: {data: {message: data, type}}});
    window.ReactNativeWebView.postMessage(message);
  };

  window.open = function (url, windowName, windowFeatures) {
      if(url){
        postMessage(url, 'native_click_link');
      }
  };
  document.onclick = function (e) {
    e = e ||  window.event;
    let element = e.target || e.srcElement;
    element = element.closest('a');

    if (element) {
      postMessage(element.href, 'native_click_link');
      return false;
    }
  };

  function getTextOnly(){
    return document.body.innerText;
  }

//   let preventScroll = false;

// function onFullScreenChange() {
// 	let inFullScreen = Boolean(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
// 	if(inFullScreen) {
// 		preventScroll = true;
// 		setTimeout(() => {
// 			preventScroll = false;
// 		}, 100);
// 	}
// }

// document.addEventListener('fullscreenchange', onFullScreenChange)
// document.addEventListener('mozfullscreenchange', onFullScreenChange)
// document.addEventListener('msfullscreenchange', onFullScreenChange)
// document.addEventListener('webkitfullscreenchange', onFullScreenChange)
// let y = 0;
// window.addEventListener("scroll", () => {
//         if(preventScroll && window.scrollY === 0) {
// 	        window.scrollTo(0, y);
// 	        return;
//         }
//         y = window.scrollY;
// });
`;

const styles = StyleSheet.create({
  container: {
  },
  webview: {
    width: '100%',
  },
});

class CustomAutoHeightWebview extends Component {
  static defaultProps = {
    zoomable: false,
    scrollEnabled: false,
    refWebview: () => {},
  };

  refWebview = React.createRef();

  getInnerText() {
    this.sendMessage('', ACTION_TYPE.GET_INNER_TEXT);
  }

  sendMessage = (message, type = '') => {
    if (this.refWebview.current) {
      this.refWebview.current.postMessage(JSON.stringify({message, type}));
    }
  };

  handleMessage = (e) => {
    let data = e?.nativeEvent?.data;
    if (data) {
      data = JSON.parse(data)?.nativeEvent?.data;

      if (data?.type) {
        switch (data.type) {
          case ACTION_TYPE.GET_INNER_TEXT:
            if (data?.message) {
              if (this.props.onGetInnerText) {
                this.props.onGetInnerText(data.message);
              }
            }
            break;
          case ACTION_TYPE.CLICK_LINK:
            if (data?.message) {
              // Linking.canOpenURL(data.message)
              //   .then((supported) => {
              //     if (supported) {
              openLink(data.message);
              // }
              // })
              // .catch((err) => {
              //   // console.log(err);
              // });
            }
            break;
        }
      }
    }
  };

  handleRefWebview = (inst) => {
    this.refWebview.current = inst;
    this.props.refWebview(inst);
  };

  render() {
    return (
      <View
        style={[styles.container, this.props.containerStyle]}
        onLayout={this.props.onLayout}>
        <AutoHeightWebView
          ref={this.handleRefWebview}
          onShouldStartLoadWithRequest={(result) => {
            return true;
          }}
          style={[styles.webview, this.props.contentStyle]}
          onSizeUpdated={this.props.onSizeUpdated}
          source={{
            html: `${this.props.content}`,
          }}
          zoomable={this.props.zoomable}
          scrollEnabled={this.props.scrollEnabled}
          viewportContent={'width=device-width, user-scalable=no'}
          javaScriptEnabled
          onMessage={this.handleMessage}
          customScript={CUSTOM_SCRIPT}
          customStyle={CUSTOM_STYLE + this.props.customStyle}
        />
      </View>
    );
  }
}

export default CustomAutoHeightWebview;
