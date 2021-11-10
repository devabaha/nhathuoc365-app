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
import ImageZoom from 'react-native-image-pan-zoom';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import ImageViewer from 'react-native-image-zoom-viewer';
import EventTracker from 'src/helper/EventTracker';
// import ActionSheet from 'react-native-actionsheet';
import appConfig from 'app-config';
import {HIT_SLOP} from 'app-packages/tickid-chat/constants';
import RightButtonNavBar from 'src/components/RightButtonNavBar';
import {RIGHT_BUTTON_TYPE} from 'src/components/RightButtonNavBar/constants';
import Image from 'src/components/Image';
import Video from 'src/components/Video';
import Carousel from 'src/components/Carousel';
import {MEDIA_TYPE} from 'src/constants';
import ItemImage from './ItemImage';

const HEADER_BUTTON_TYPE = {
  BACK: 0,
  DOWNLOAD_IMAGE: 1,
  MORE: 2,
};

class ItemImageViewer extends Component {
  static defaultProps = {
    index: 0,
    moreActionSheetOptions: null,
    scrollEnabled: true,
    onBack: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      currentIndex: this.props.index,
      scrollEnabled: true,
    };

    this.refActionSheet = React.createRef();
    this.refButtonDownloadImage = React.createRef();
    this.refCarousel = React.createRef();

    this.isHeaderVisible = true;
    this.opacity = new Animated.Value(1);
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

  handleChangeVideoControlsVisible = (isVisible) => {
    this.toggleHeaderVisibility(isVisible);
  };

  toggleHeaderVisibility = (isVisible = !this.isHeaderVisible) => {
    this.isHeaderVisible = isVisible;
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
        break;
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
    this.props.onBack();
    Actions.pop();
  };

  handleChange = (index) => {
    this.setState({currentIndex: index});
  };

  handleSwipeDownImage = () => this.handleBack();

  handleLongPressImage = () => {
    if (this.refActionSheet.current) this.refActionSheet.current.show();
  };

  renderIndicator = () => null;

  renderHeader = (currentIndex = this.state.currentIndex) => {
    return (
      <TouchableWithoutFeedback onPress={this.toggleHeaderVisibility}>
        <Animated.View
          style={[styles.headerContainer, {opacity: this.opacity}]}>
          <SafeAreaView style={styles.headerContentContainer}>
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
                {this.props.images[currentIndex]?.type ===
                MEDIA_TYPE.YOUTUBE_VIDEO ? null : (
                  <TouchableOpacity
                    onPress={() =>
                      this.handlePressHeaderBtn(
                        HEADER_BUTTON_TYPE.DOWNLOAD_IMAGE,
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
                )}
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

  // renderImage = (imageProps) => {
  //     <Image source={imageProps.source} />
  // };

  scaleValue = 1;
  allowListScroll = (e) => {
    if (e.nativeEvent.touches.length <= 1 && this.scaleValue <= 1) {
      !this.state.scrollEnabled && this.setState({scrollEnabled: true});
    } else {
      this.state.scrollEnabled && this.setState({scrollEnabled: false});
    }
  };

  handleMove = ({scale}) => {
    this.scaleValue = scale;
  };

  updateContent = () => {};

  renderImage = ({item: image, index}) => {
    return (
      <View
        onTouchEnd={this.allowListScroll}
        onTouchStart={this.allowListScroll}>
        <ItemImage
          url={image?.url}
          index={index}
          type={image?.type}
          selectedIndex={this.state.currentIndex}
          onPress={this.toggleHeaderVisibility}
          onMove={this.handleMove}
          onRotateFullscreen={this.updateContent}
          onChangeVideoControlsVisible={this.handleChangeVideoControlsVisible}
        />
        {/* <ImageZoom
          ref={(inst) => (this.refImage = inst)}
          // onSwipeDown={Actions.pop}
          // enableSwipeDown
          // swipeDownThreshold={100}
          onStartShouldSetPanResponder={this.handleStartShouldSetPanResponder}
          onMove={this.handleMove}
          onClick={this.toggleHeaderVisibility}
          cropHeight={appConfig.device.height}
          cropWidth={appConfig.device.width}
          imageHeight={appConfig.device.height}
          imageWidth={appConfig.device.width}>
          {image?.type === MEDIA_TYPE.YOUTUBE_VIDEO ? (
            <Video
              type="youtube"
              videoId={image?.url}
              containerStyle={{
                width: appConfig.device.width,
                height: appConfig.device.height,
                justifyContent: 'center',
              }}
              autoAdjustLayout
              height={appConfig.device.height}
              youtubeIframeProps={{
                play: index === this.state.currentIndex,
              }}
            />
          ) : (
            <Image source={{uri: image.url}} resizeMode="contain" />
          )}
        </ImageZoom> */}
      </View>
    );
  };

  renderPagination = () => {
    return null;
  };

  render() {
    var {images} = this.props;
    return (
      <View style={styles.container}>
        {/* <ImageViewer
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
          renderImage={this.renderImage}
          onChange={this.handleChange}
          failImageSource={{
            width: appConfig.device.width,
            height: appConfig.device.height,
          }}
        /> */}
        {this.renderHeader()}
        <Carousel
          refCarousel={(inst) => (this.refCarousel.current = inst)}
          firstItem={this.props.index}
          wrapperStyle={{backgroundColor: '#000'}}
          data={images}
          renderItem={this.renderImage}
          onChangeIndex={this.handleChange}
          extraData={this.state.currentIndex}
          scrollEnabled={this.state.scrollEnabled}
          renderPagination={this.renderPagination}
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
  headerContentContainer: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeftButton: {
    padding: 20,
  },
  headerMiddleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: -1,
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
