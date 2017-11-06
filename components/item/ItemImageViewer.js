/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import store from '../../store/Store';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class ItemImageViewer extends Component {
  render() {
    var {images} = this.props;

    return (
      <View style={styles.container}>
        <ImageViewer imageUrls={images}/>

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
            alignItems: 'center'
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
