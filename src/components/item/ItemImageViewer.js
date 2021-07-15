/* @flow */

import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';

//library
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import ImageViewer from 'react-native-image-zoom-viewer';
import EventTracker from '../../helper/EventTracker';
// import ActionSheet from 'react-native-actionsheet';
import appConfig from 'app-config';
import {HIT_SLOP} from 'app-packages/tickid-chat/constants';
import RightButtonNavBar from '../RightButtonNavBar';
import {RIGHT_BUTTON_TYPE} from '../RightButtonNavBar/constants';

const HIDDEN_BUTTON_TYPE = {
  LEFT_BUTTON: 'left_button',
  DOWNLOAD_IMAGE_BUTTON: 'download_image_button',
};

class ItemImageViewer extends Component {
  static defaultProps = {
    index: 0,
  };

  constructor(props) {
    super(props);

    this.isHeaderVisible = true;
    this.opacity = new Animated.Value(1);
    this.OPTIONS_LIST = [
      props.t('common:saveImageLabel'),
      props.t('common:cancel'),
    ];

    this.refActionSheet = React.createRef();
    this.refButtonDownloadImage = React.createRef();
  }

  eventTracker = new EventTracker();

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  handlePressHiddenBtn = (type) => {
    if (!this.isHeaderVisible) return;
    switch (type) {
      case HIDDEN_BUTTON_TYPE.LEFT_BUTTON:
        this.handlePressLeftButton();
        break;
      case HIDDEN_BUTTON_TYPE.DOWNLOAD_IMAGE_BUTTON:
        this.handlePressDownloadImage();
      default:
        break;
    }
  };

  handleSwipeDownImage = () => Actions.pop();

  handleLongPressImage = () => {
    if (this.refActionSheet.current) this.refActionSheet.current.show();
    console.log(this.refButtonDownloadImage);
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

  handlePressDownloadImage = () => {
    if (this.refButtonDownloadImage.current) {
      this.refButtonDownloadImage.current.handlePressDownloadImage();
    }
  };

  renderHeader = (currentIndex) => {
    return (
      <TouchableWithoutFeedback onPress={this.handlePressImage}>
        <Animated.View
          style={[styles.headerContainer, {opacity: this.opacity}]}>
          <SafeAreaView style={styles.headerContentContainter}>
            <View style={styles.headerContent}>
              <TouchableOpacity
                hitSlop={HIT_SLOP}
                style={styles.headerLeftButton}
                onPress={() =>
                  this.handlePressHiddenBtn(HIDDEN_BUTTON_TYPE.LEFT_BUTTON)
                }>
                <Ionicons size={26} name="ios-chevron-back" color="#fff" />
              </TouchableOpacity>
              <View style={styles.headerMiddleContainer}>
                <Text style={styles.headerMiddleTitle}>
                  {currentIndex + 1}/{this.props.images.length}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  this.handlePressHiddenBtn(
                    HIDDEN_BUTTON_TYPE.DOWNLOAD_IMAGE_BUTTON,
                  )
                }>
                <View pointerEvents="none">
                  <RightButtonNavBar
                    ref={this.refButtonDownloadImage}
                    touchableOpacity
                    type={RIGHT_BUTTON_TYPE.DOWNLOAD_IMAGE}
                    containerStyle={styles.headerRightBtnContainer}
                    imageUrl={this.props.images[currentIndex].url}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  renderIndicator = () => null;

  render() {
    var {images} = this.props;

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <ImageViewer
          style={styles.imageContainer}
          index={this.props.index}
          imageUrls={images}
          saveToLocalByLongPress={false}
          renderHeader={this.renderHeader}
          renderIndicator={this.renderIndicator}
          enableSwipeDown={true}
          swipeDownThreshold={100}
          onSwipeDown={this.handleSwipeDownImage}
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
  imageContainer: {
    position: 'absolute',
    width: appConfig.device.width,
    height: appConfig.device.height,
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
    alignItems: 'center',
  },
  headerContentContainter: {flex: 1},
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeftButton: {
    padding: 20,
  },
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
