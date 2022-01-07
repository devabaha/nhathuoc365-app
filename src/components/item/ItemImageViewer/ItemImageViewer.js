import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import EventTracker from 'src/helper/EventTracker';
// routing
import {pop, push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {MEDIA_TYPE} from 'src/constants';
import {HIT_SLOP} from 'app-packages/tickid-chat/constants';
import {RIGHT_BUTTON_TYPE} from 'src/components/RightButtonNavBar/constants';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import RightButtonNavBar from 'src/components/RightButtonNavBar';
import Carousel from 'src/components/Carousel';
import ItemImage from './ItemImage';
import {
  BaseButton,
  Container,
  IconButton,
  ScreenWrapper,
  Typography,
} from 'src/components/base';

const HEADER_BUTTON_TYPE = {
  BACK: 0,
  DOWNLOAD_IMAGE: 1,
  MORE: 2,
};

class ItemImageViewer extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    index: 0,
    moreActionSheetOptions: null,
    scrollEnabled: true,
  };

  state = {
    currentIndex: this.props.index,
    scrollEnabled: true,
  };

  isHeaderVisible = true;
  opacity = new Animated.Value(1);

  refActionSheet = React.createRef();
  refButtonDownloadImage = React.createRef();

  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

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
        break;
      case HEADER_BUTTON_TYPE.MORE:
        push(
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
    pop();
  };

  handleChange = (index) => {
    this.setState({currentIndex: index});
  };

  handleSwipeDownImage = () => pop();

  handleLongPressImage = () => {
    if (this.refActionSheet.current) this.refActionSheet.current.show();
  };

  renderIndicator = () => null;

  renderHeader = (currentIndex = this.state.currentIndex) => {
    return (
      <TouchableWithoutFeedback onPress={this.toggleHeaderVisibility}>
        <ScreenWrapper
          safeTopLayout
          animated
          noBackground
          style={[
            styles.headerContainer,
            this.headerContainerStyle,
            {opacity: this.opacity},
          ]}>
          <Container noBackground style={styles.headerContentContainer}>
            <View style={styles.headerContent}>
              <IconButton
                bundle={BundleIconSetName.IONICONS}
                name="ios-chevron-back"
                hitSlop={HIT_SLOP}
                iconStyle={[this.headerMainStyle, styles.icon]}
                style={styles.headerLeftButton}
                onPress={() =>
                  this.handlePressHeaderBtn(HEADER_BUTTON_TYPE.BACK)
                }
              />
              <View style={styles.headerMiddleContainer}>
                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={this.headerMainStyle}>
                  {currentIndex + 1}/{this.props.images.length}
                </Typography>
              </View>

              <View style={[styles.headerContent, styles.headerLeftButton]}>
                {this.props.images[currentIndex]?.type ===
                MEDIA_TYPE.YOUTUBE_VIDEO ? null : (
                  <BaseButton
                    onPress={() =>
                      this.handlePressHeaderBtn(
                        HEADER_BUTTON_TYPE.DOWNLOAD_IMAGE,
                      )
                    }>
                    <View pointerEvents="none">
                      <RightButtonNavBar
                        ref={this.refButtonDownloadImage}
                        type={RIGHT_BUTTON_TYPE.DOWNLOAD_IMAGE}
                        containerStyle={styles.headerRightBtnContainer}
                        imageUrl={this.props.images[currentIndex].url}
                      />
                    </View>
                  </BaseButton>
                )}
                {!!this.props.moreActionSheetOptions && (
                  <IconButton
                    bundle={BundleIconSetName.IONICONS}
                    name="ios-ellipsis-vertical"
                    hitSlop={HIT_SLOP}
                    iconStyle={[this.headerMainStyle, styles.icon]}
                    style={styles.headerRightBtnContainer}
                    onPress={() =>
                      this.handlePressHeaderBtn(HEADER_BUTTON_TYPE.MORE)
                    }
                  />
                )}
              </View>
            </View>
          </Container>
        </ScreenWrapper>
      </TouchableWithoutFeedback>
    );
  };

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

  get carouselWrapperStyle() {
    return {backgroundColor: this.theme.color.black};
  }

  get headerMainStyle() {
    return {
      color: this.theme.color.white,
    };
  }

  get headerContainerStyle() {
    return {
      backgroundColor: this.theme.color.overlay60,
    };
  }

  render() {
    var {images} = this.props;
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <Carousel
          firstItem={this.props.index}
          wrapperStyle={this.carouselWrapperStyle}
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
  headerMiddleTitle: {},
  headerRightBtnContainer: {
    paddingLeft: 15,
  },

  icon: {
    fontSize: 26,
  },
});

export default withTranslation()(observer(ItemImageViewer));
