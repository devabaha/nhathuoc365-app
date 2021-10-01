import React, {Component} from 'react';
import Proptypes from 'prop-types';
import {View, StyleSheet, Linking, Alert} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';

import Loading from '../Loading';
import EventTracker from '../../helper/EventTracker';

class WebView extends Component {
  static propTypes = {
    url: Proptypes.string.isRequired,
    renderAfter: Proptypes.node,
    showLoading: Proptypes.bool,
  };

  static defaultProps = {
    showLoading: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      showLoading: false,
    };
    this.eventTracker = new EventTracker();
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
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

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <RNWebView
          onLoadStart={this.onLoadStart.bind(this)}
          onLoadEnd={this.onLoadEnd.bind(this)}
          onLoad={this.onLoadEnd.bind(this)}
          source={{uri: this.props.url}}
          style={styles.webView}
          onMessage={() => {}}
          originWhitelist={['*']}
          onShouldStartLoadWithRequest={this.handleShouldStartLoadWithRequest}
        />

        {this.state.showLoading == true && <Loading center />}
        {typeof this.props.renderAfter === 'function' &&
          this.props.renderAfter()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',

    marginBottom: 0,
  },
  webView: {
    flex: 1,
  },
  loadingBox: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#ebebeb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 14,
    marginTop: 4,
    color: '#404040',
  },
});

export default withTranslation()(WebView);
