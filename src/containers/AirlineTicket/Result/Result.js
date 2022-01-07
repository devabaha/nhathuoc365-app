import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import Proptypes from 'prop-types';

// 3-party libs
import WebView from 'react-native-webview';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import {ScreenWrapper} from 'src/components/base';

export default class Result extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    url: Proptypes.string.isRequired,
    jsCode: Proptypes.string,
  };

  static defaultProps = {
    jsCode: '',
  };

  state = {
    showLoading: false,
    url: this.props.url,
    jsCode: this.props.jsCode,
  };
  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.updateNavBarDisposer();
  }

  onLoadStart() {
    this.setState({
      showLoading: true,
    });
  }

  onLoadEnd() {
    this.setState({
      showLoading: false,
    });
  }

  _onNavigationStateChange(webViewState) {
    var {url} = webViewState;
    var existGet = stristr(url, '?');
    var existViewApp = stristr(url, 'view=app');

    if (!existViewApp) {
      this.setState({
        url: url + (existGet ? '&' : '?') + 'view=app',
      });
    }
  }

  get webViewStyle() {
    return mergeStyles(styles.webView, {
      backgroundColor: this.theme.color.background,
    });
  }

  render() {
    var {url, jsCode} = this.state;

    return (
      <ScreenWrapper style={[styles.container, this.props.style]}>
        <WebView
          injectedJavaScript={jsCode}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          onLoadStart={this.onLoadStart.bind(this)}
          onLoadEnd={this.onLoadEnd.bind(this)}
          onLoad={this.onLoadEnd.bind(this)}
          source={{uri: url}}
          style={this.webViewStyle}
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});
