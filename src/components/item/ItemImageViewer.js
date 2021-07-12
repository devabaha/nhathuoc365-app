/* @flow */

import React, {Component} from 'react';
import {View, StyleSheet, TouchableHighlight, TouchableOpacity} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {Actions} from 'react-native-router-flux';
import ImageViewer from 'react-native-image-zoom-viewer';
import EventTracker from '../../helper/EventTracker';
import {saveImage} from '../../helper/image';
import ActionSheet from 'react-native-actionsheet';
import appConfig from 'app-config';
import { HIT_SLOP } from 'app-packages/tickid-chat/constants';

class ItemImageViewer extends Component {
  static defaultProps = {
    index: 0,
  };

  constructor(props) {
    super(props);

    this.imageIndex = this.props.index;
    this.OPTIONS_LIST = [
      props.t('common:saveImageLabel'),
      props.t('common:cancel'),
    ];

    this.refActionSheet = React.createRef();
  }

  eventTracker = new EventTracker();

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  handleCloseImageView = () => Actions.pop();

  handleOnSwipeDownImage = () => Actions.pop();

  handleOnLongPressImage = () => {
    if (this.refActionSheet.current) this.refActionSheet.current.show();
  };

  onChangeImageIndex = (index) => {
    this.imageIndex = index;
  };

  handleOptionPress = (index) => {
    if (index !== this.OPTIONS_LIST.length - 1) {
      saveImage(this.props.images[this.imageIndex].url);
    }
  };
  renderHeader = () => {
    return (
      <View
        style={{
          top: appConfig.device.statusBarHeight,
          flexDirection: 'row',
          position:'absolute',
          zIndex:1

        }}>
        <TouchableOpacity hitSlop={HIT_SLOP} style={{ padding: 12, flex: 1}}>
          <EntypoIcon size={20} name="chevron-thin-left" color="#fff"/>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 12}}>
          <AntDesignIcon size={20} name="download" color="#fff"/>
        </TouchableOpacity>
        <View style={{ padding: 12}}>
          <EntypoIcon size={20} name="dots-three-vertical" color="#fff"/>
        </View>
      </View>
    );
  };
  render() {
    var {images} = this.props;

    return (
      <View style={styles.container}>
        <ImageViewer
          enableSwipeDown={true}
          swipeDownThreshold={100}
          onSwipeDown={this.handleOnSwipeDownImage}
          saveToLocalByLongPress={false}
          onLongPress={this.handleOnLongPressImage}
          imageUrls={images}
          index={this.props.index}
          onChange={this.onChangeImageIndex}
          renderHeader={this.renderHeader}
        />

        <TouchableHighlight
          onPress={this.handleCloseImageView}
          style={styles.btnCloseImageView}>
          <Icon name="times-circle" size={32} color="#ffffff" />
        </TouchableHighlight>

        <ActionSheet
          ref={this.refActionSheet}
          options={this.OPTIONS_LIST}
          cancelButtonIndex={1}
          destructiveButtonIndex={1}
          onPress={this.handleOptionPress}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnCloseImageView: {
    position: 'absolute',
    bottom: 88,
    left: 0,
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withTranslation()(observer(ItemImageViewer));
