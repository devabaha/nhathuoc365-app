import React, {Component} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  PlatformColor,
} from 'react-native';
import appConfig from 'app-config';

export default class Loading extends Component {
  static defaultProps = {
    color: appConfig.device.isAndroid ? PlatformColor('?attr/colorAccent') : '',
  };
  
  render() {
    return (
      <View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          },
          this.props.center ? styles.centerContainer : {},
          this.props.wrapperStyle,
        ]}>
        <View style={[styles.container, this.props.containerStyle]}>
          <ActivityIndicator
            animating={true}
            style={[
              styles.loading,
              this.props.style,
              this.props.center ? styles.center : {},
            ]}
            color={this.props.color}
            size={this.props.size || 'large'}
          />
          {this.props.message && (
            <Text style={[styles.message, this.props.textStyle]}>
              {this.props.message}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

var LOADING_WIDTH = 60;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    // height: 40,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    // position: 'absolute',
    // top: Util.size.height / 2 - LOADING_WIDTH / 2 - NAV_HEIGHT,
    // left: Util.size.width / 2 - LOADING_WIDTH / 2,
    zIndex: 999,
    // width: LOADING_WIDTH,
    // height: LOADING_WIDTH
  },
  message: {
    color: '#333',
    textAlign: 'center',
    fontSize: 12,
  },
});
