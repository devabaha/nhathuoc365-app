/* @flow */

import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  Animated,
  Text,
} from 'react-native';

//library
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import ImageViewer from 'react-native-image-zoom-viewer';
import EventTracker from '../../helper/EventTracker';
import ActionSheet from 'react-native-actionsheet';
import appConfig from 'app-config';
import {HIT_SLOP} from 'app-packages/tickid-chat/constants';
import RightButtonNavBar from '../RightButtonNavBar';
import {RIGHT_BUTTON_TYPE} from '../RightButtonNavBar/constants';

class ItemImageViewer extends Component {
  static defaultProps = {
    index: 0,
  };

  constructor(props) {
    super(props);

    this.isHeaderVisible = true;
    this.opacity = new Animated.Value(1);
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

  handleSwipeDownImage = () => Actions.pop();

  handleLongPressImage = () => {
    if (this.refActionSheet.current) this.refActionSheet.current.show();
  };

  // handleOptionPress = (index) => {
  //   if (index !== this.OPTIONS_LIST.length - 1) {
  //     saveImage(this.props.images[this.imageIndex].url);
  //   }
  // };

  handlePressLeftButton = () => {
    Actions.pop();
  };

  handlePressImage = () => {
    this.isHeaderVisible = !this.isHeaderVisible;
    Animated.timing(this.opacity, {
      toValue: this.isHeaderVisible ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  handleChangeImageIndex = (index) => {
    this.imageIndex = index;
  };

  renderHeader = (currentIndex) => {
    return (
      <Animated.View
        style={[
          styles.headerContainer,
          {opacity: this.opacity, top: appConfig.device.isIphoneX ? 30 : 0},
        ]}>
        <TouchableOpacity
          hitSlop={HIT_SLOP}
          style={styles.headerLeftButton}
          onPress={this.handlePressLeftButton}>
          <Ionicons size={26} name="ios-chevron-back" color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerMiddleContainer}>
          <Text style={styles.headerMiddleTitle}>
            {currentIndex + 1}/{this.props.images.length}
          </Text>
        </View>
        <RightButtonNavBar
          touchableOpacity
          type={RIGHT_BUTTON_TYPE.DOWNLOAD_IMAGE}
          containerStyle={styles.headerRightBtnContainer}
          imageUrl={this.props.images[this.imageIndex].url}
        />
      </Animated.View>
    );
  };

  renderIndicator = () => null;

  render() {
    var {images} = this.props;

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <ImageViewer
          index={this.props.index}
          imageUrls={images}
          saveToLocalByLongPress={false}
          renderHeader={this.renderHeader}
          renderIndicator={this.renderIndicator}
          enableSwipeDown={true}
          swipeDownThreshold={100}
          onSwipeDown={this.handleSwipeDownImage}
          onChange={this.handleChangeImageIndex}
          onClick={this.handlePressImage}
          onLongPress={this.handleLongPressImage}
        />

        {/* <ActionSheet
          ref={this.refActionSheet}
          options={this.OPTIONS_LIST}
          cancelButtonIndex={1}
          destructiveButtonIndex={1}
          onPress={this.handleOptionPress}
        /> */}
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
  headerContainer: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  headerLeftButton: {padding: 20},
  headerMiddleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerMiddleTitle: {
    color: '#fff',
    fontSize: 16,
  },
  headerRightBtnContainer: {
    paddingRight: 20,
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 20,
  },
});

export default withTranslation()(observer(ItemImageViewer));
