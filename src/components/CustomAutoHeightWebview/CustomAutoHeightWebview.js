import React, {Component} from 'react';
import {Linking, StyleSheet} from 'react-native';
// 3-party libs
import AutoHeightWebView from 'react-native-autoheight-webview';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {openLink} from 'app-helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Container} from 'src/components/base';

const ACTION_TYPE = {
  GET_INNER_TEXT: 'webview_get_inner_text',
  CLICK_LINK: 'native_click_link',
};

const getCustomStyle = (theme) => {
  return `
  body {
    padding-left: 15px;
    padding-right: 15px;
    color: ${theme.typography[TypographyType.LABEL_LARGE].color}
  }
  // * {
  //   font-family: 'arial';
  // }
  a {
    // pointer-events:none;
    // text-decoration: none !important;
    color: ${theme.color.primaryHighlight}!important
  }
  p, li, span {
    // font-size: ${theme.typography[TypographyType.LABEL_LARGE].fontSize}px;
    // line-height: 24px;
    // color: ${theme.typography[TypographyType.LABEL_LARGE].color}
  }
  // img {
  //   max-width: 100% !important;
  //   height: auto !important;
  // }
`;
};

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
  container: {},
  webview: {
    width: '100%',
  },
});

class CustomAutoHeightWebview extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    zoomable: false,
    scrollEnabled: false,
    refWebview: () => {},
  };

  refWebview = React.createRef();

  get theme() {
    return getTheme(this);
  }

  get customStyle() {
    const style = getCustomStyle(this.theme) + this.props.customStyle || '';

    return style;
  }

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
      <Container
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
          customStyle={this.customStyle}
          allowsFullscreenVideo={true}
        />
      </Container>
    );
  }
}

export default CustomAutoHeightWebview;
