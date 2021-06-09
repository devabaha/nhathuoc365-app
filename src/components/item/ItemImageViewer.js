/* @flow */

import React, {Component} from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import ImageViewer from 'react-native-image-zoom-viewer';
import EventTracker from '../../helper/EventTracker';
import {handleSaveImage} from '../../helper/image';
import ActionSheet from 'react-native-actionsheet';

export default class ItemImageViewer extends Component {
  static defaultProps = {
    index: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      imageIndex: 0,
    };
    this.OPTIONS_LIST = ['Save Image', 'Cancel'];
  }

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
        <ImageViewer
          enableSwipeDown={true}
          swipeDownThreshold={100}
          onSwipeDown={() => Actions.pop()}
          saveToLocalByLongPress={false}
          onLongPress={() => this.actionSheet.show()}
          imageUrls={images}
          index={this.props.index}
          onChange={(index) => this.setState({imageIndex: index})}
          onPress={() => {
            console.log('click');
          }}
        />

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
        <ActionSheet
          ref={(ref) => (this.actionSheet = ref)}
          options={this.OPTIONS_LIST}
          cancelButtonIndex={1}
          destructiveButtonIndex={1}
          onPress={(index) => {
            index == 0
              ? handleSaveImage(images[this.state.imageIndex].url)
              : null;
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
