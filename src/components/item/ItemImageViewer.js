/* @flow */

import React, {Component} from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import ImageViewer from 'react-native-image-zoom-viewer';
import EventTracker from '../../helper/EventTracker';

export default class ItemImageViewer extends Component {
  static defaultProps = {
    index: 0,
  };
  eventTracker = new EventTracker();

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  render() {
    var {images} = this.props;

    return (
      <View style={styles.container}>
        <ImageViewer imageUrls={images} index={this.props.index} />

        <TouchableHighlight
          onPress={() => {
            Actions.pop();
          }}
          style={{
            position: 'absolute',
            bottom: 88,
            left: 0,
            width: 60,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="times-circle" size={32} color="#ffffff" />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
