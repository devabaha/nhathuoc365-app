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

const HEADER_BUTTON_TYPE = {
  BACK: 0,
  DOWNLOAD_IMAGE: 1,
  MORE: 2,
};

class ItemImageViewer extends Component {
  static defaultProps = {
    index: 0,
    moreActionSheetOptions: null,
  };

  constructor(props) {
    super(props);

    this.isHeaderVisible = true;
    this.opacity = new Animated.Value(1);

    this.refActionSheet = React.createRef();
    this.refButtonDownloadImage = React.createRef();
  }

  eventTracker = new EventTracker();

  componentDidMount() {
    this.eventTracker.logCurrentView();
    StatusBar.setHidden(true);
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
    StatusBar.setHidden(false);
  }

  toggleHeaderVisibility = () => {
    this.isHeaderVisible = !this.isHeaderVisible;
    Animated.timing(this.opacity, {
      toValue: this.isHeaderVisible ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  handlePressHeaderBtn = (type) => {
    if (!this.isHeaderVisible) {
      this.toggleHeaderVisibility();
      return;
    }
    switch (type) {
      case HEADER_BUTTON_TYPE.BACK:
        this.handleBack();
        break;
      case HEADER_BUTTON_TYPE.DOWNLOAD_IMAGE:
        this.handleDownloadImage();
      case HEADER_BUTTON_TYPE.MORE:
        Actions.push(
          appConfig.routes.modalActionSheet,
          this.props.moreActionSheetOptions,
        );
        break;
      default:
        break;
    }
  };

  handleDownloadImage = () => {
    if (this.refButtonDownloadImage.current) {
      this.refButtonDownloadImage.current.handlePressDownloadImage();
    }
  };

  handleBack = () => {
    StatusBar.setHidden(false);
    Actions.pop();
  };

  handleSwipeDownImage = () => Actions.pop();

  handleLongPressImage = () => {
    if (this.refActionSheet.current) this.refActionSheet.current.show();
  };

  renderIndicator = () => null;

  renderHeader = (currentIndex) => {
    return (
      <TouchableWithoutFeedback onPress={this.toggleHeaderVisibility}>
        <Animated.View
          style={[styles.headerContainer, {opacity: this.opacity}]}>
          <SafeAreaView style={styles.headerContentContainter}>
            <View style={styles.headerContent}>
              <TouchableOpacity
                hitSlop={HIT_SLOP}
                style={styles.headerLeftButton}
                onPress={() =>
                  this.handlePressHeaderBtn(HEADER_BUTTON_TYPE.BACK)
                }>
                <Ionicons size={26} name="ios-chevron-back" color="#fff" />
              </TouchableOpacity>
              <View style={styles.headerMiddleContainer}>
                <Text style={styles.headerMiddleTitle}>
                  {currentIndex + 1}/{this.props.images.length}
                </Text>
              </View>

              <View style={[styles.headerContent, styles.headerLeftButton]}>
                <TouchableOpacity
                  onPress={() =>
                    this.handlePressHeaderBtn(HEADER_BUTTON_TYPE.DOWNLOAD_IMAGE)
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
                {!!this.props.moreActionSheetOptions && (
                  <TouchableOpacity
                    hitSlop={HIT_SLOP}
                    style={styles.headerRightBtnContainer}
                    onPress={() =>
                      this.handlePressHeaderBtn(HEADER_BUTTON_TYPE.MORE)
                    }>
                    <Ionicons
                      size={26}
                      name="ios-ellipsis-vertical"
                      color="#fff"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    var {images} = this.props;

    return (
      <View style={styles.container}>
        <ImageViewer
          style={styles.imageViewerContainer}
          index={this.props.index}
          imageUrls={images}
          saveToLocalByLongPress={false}
          renderHeader={this.renderHeader}
          renderIndicator={this.renderIndicator}
          enableSwipeDown={true}
          swipeDownThreshold={100}
          onSwipeDown={this.handleSwipeDownImage}
          onClick={this.toggleHeaderVisibility}
          onLongPress={this.handleLongPressImage}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageViewerContainer: {
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
  headerContentContainter: {
    flex: 1,
  },
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
    paddingLeft: 15,
  },
});

export default withTranslation()(observer(ItemImageViewer));
