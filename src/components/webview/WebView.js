import React, {Component} from 'react';
import {StyleSheet, Linking, Alert} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {WebView as RNWebView} from 'react-native-webview';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import {Container} from 'src/components/base';
import Loading from '../Loading';

class WebView extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    url: PropTypes.string.isRequired,
    renderAfter: PropTypes.node,
    showLoading: PropTypes.bool,
  };

  static defaultProps = {
    showLoading: true,
  };

  state = {
    showLoading: false,
  };
  eventTracker = new EventTracker();
  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
    this.updateNavBarDisposer();
  }

  handleShouldStartLoadWithRequest = (request) => {
    if (!request.url.startsWith('http') && /\w+:\/\//.test(request.url)) {
      Linking.openURL(request.url).catch((error) => {
        console.log('webview_linking_open_url', error);
        Alert.alert(this.props.t('cantOpenLink'));
      });
      return false;
    }

    return true;
  };

  onLoadStart() {
    this.props.showLoading &&
      this.setState({
        showLoading: true,
      });
  }

  onLoadEnd() {
    this.props.showLoading &&
      this.setState({
        showLoading: false,
      });
  }

  get webviewStyle() {
    return {backgroundColor: this.theme.color.background};
  }

  render() {
    return (
      <Container style={[styles.container, this.props.style]}>
        <RNWebView
          onLoadStart={this.onLoadStart.bind(this)}
          onLoadEnd={this.onLoadEnd.bind(this)}
          onLoad={this.onLoadEnd.bind(this)}
          source={{uri: this.props.url}}
          style={[styles.webView, this.webviewStyle]}
          onMessage={() => {}}
          originWhitelist={['*']}
          onShouldStartLoadWithRequest={this.handleShouldStartLoadWithRequest}
        />

        {this.state.showLoading == true && <Loading center />}
        {typeof this.props.renderAfter === 'function' &&
          this.props.renderAfter()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 0,
  },
  webView: {
    flex: 1,
  },
});

export default withTranslation()(WebView);
