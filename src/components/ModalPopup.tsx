import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  Image,
  GestureResponderEvent,
  Easing,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {pop} from 'app-helper/routing';
//context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {BaseButton, IconButton} from 'src/components/base';

const IMAGE_WIDTH_CONTAINER = appConfig.device.width * 0.8;
const IMAGE_HEIGHT_CONTAINER = appConfig.device.height * 0.6;

const CLOSE_ICON_DIMENSION = 60;

const MARGIN_TOP_CLOSE_BTN = CLOSE_ICON_DIMENSION * 0.8;
const MARGIN_LEFT_CLOSE_BTN = CLOSE_ICON_DIMENSION * 0.5;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 99999,
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'absolute',
    width: CLOSE_ICON_DIMENSION,
    height: CLOSE_ICON_DIMENSION,
    zIndex: 9,
    alignItems: 'flex-start',
  },
  iconContainer: {
    // borderRadius: 15,
    // padding: 10,
  },
  icon: {
    fontSize: 36,
  },
  imageContainer: {
    width: IMAGE_WIDTH_CONTAINER,
    height: IMAGE_HEIGHT_CONTAINER,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  maskPressing: {
    position: 'absolute',
    zIndex: 999,
    // backgroundColor: 'red'
  },
});

export interface ModalPopupProps {
  onPressImage: (e: GestureResponderEvent) => void;
  onClose: () => void;
  image: string;
}

class ModalPopup extends PureComponent<ModalPopupProps> {
  static contextType = ThemeContext;

  state = {
    closeBtnPosition: {
      left: '-100%',
      top: '-100%',
    },
    imgRealDimension: {
      width: undefined,
      height: undefined,
    },
  };
  refPopupContainer = React.createRef<any>();
  refPopup = React.createRef<any>();
  animatedBackgroundValue = new Animated.Value(0);
  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    Animated.timing(this.animatedBackgroundValue, {
      toValue: 1,
      duration: 200,
      easing: Easing.quad,
      useNativeDriver: true,
    }).start();

    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  handleCloseForeground() {
    if (this.state.imgRealDimension.width !== undefined) {
      this.handleClose();
    }
  }

  handleClose() {
    this.props.onClose ? this.props.onClose() : pop();
  }

  /**
   * @todo update close btn position by
   * real image dimension (even image in resizeMode `contained`)
   *
   * @description try to pretend resizing image to get actual image size shown on screen
   * to calculate the most accuracy the position of close btn
   * above top-corner right of actual image shown on screen.
   *
   * @param offsetX origin container offsetX
   * @param offsetY origin container offsetY
   */
  updateCloseBtnPosition(offsetX, offsetY) {
    if (this.props.image) {
      // get actual size of image
      Image.getSize(
        this.props.image,
        (width, height) => {
          /**
           * suppose close icon will appear at position
           * left: image width, top: image height
           */
          let left = width;
          let top = height;

          /**
           * img dimension that shown on screen.
           */
          let shownScreenImgWidth = width;
          let shownScreenImgHeight = height;

          /**
           * Get ratio of width & height of image dimension with origin container dimension
           */
          let ratioWidth = IMAGE_WIDTH_CONTAINER / width;
          let ratioHeight = IMAGE_HEIGHT_CONTAINER / height;

          if (
            width > IMAGE_WIDTH_CONTAINER ||
            height > IMAGE_HEIGHT_CONTAINER
          ) {
            ratioWidth = 1 / ratioWidth;
            ratioHeight = 1 / ratioHeight;
            /**
             * If container width smaller than image width
             * resize image by width dimension.
             * so
             * left: origin container width,
             * top: image height resized by width dimension
             */
            if (IMAGE_WIDTH_CONTAINER < width) {
              left = IMAGE_WIDTH_CONTAINER;
              top = height / ratioWidth;
            }

            /**
             * After resized by width dimension,
             * if height still larger than origin container
             * resize image by height dimension.
             * so
             * left: image width resized by height dimension
             * top: origin container height
             */
            if (IMAGE_HEIGHT_CONTAINER < top) {
              left = width / ratioHeight;
              top = IMAGE_HEIGHT_CONTAINER;
            }

            shownScreenImgWidth = left;
            shownScreenImgHeight = top;

            /**
             * adding offsetX of origin container
             * including a half of difference of origin container width with left.
             *
             * re-set top value by offsetY with a half of
             * difference of origin container height with top.
             */
            left += (IMAGE_WIDTH_CONTAINER - left) / 2 + offsetX;
            top = (IMAGE_HEIGHT_CONTAINER - top) / 2 + offsetY;
          } else {
            /**
             * if width, height of real img smaller than container
             * shown screen width img will full fill the container
             * (because current style is width: '100%)
             * and height will resize by width resize ratio.
             */
            width = IMAGE_WIDTH_CONTAINER;
            height *= ratioWidth;

            shownScreenImgWidth = width;
            shownScreenImgHeight = height;

            /**
             * Sum of image width with offsetX and a half of
             * difference of origin container width with image width.
             *
             * re-set top value by offsetY with a half of
             * difference of origin container height with image height.
             */
            left = width + (IMAGE_WIDTH_CONTAINER - width) / 2 + offsetX;
            top = (IMAGE_HEIGHT_CONTAINER - height) / 2 + offsetY;
          }

          top -= MARGIN_TOP_CLOSE_BTN;
          left -= MARGIN_LEFT_CLOSE_BTN;

          this.setState({
            imgRealDimension: {
              width: shownScreenImgWidth,
              height: shownScreenImgHeight,
            },
            closeBtnPosition: {
              left,
              top,
            },
          });
        },
        (err) => {
          this.handleClose();
          console.log('%cload_image_popup', 'color:red', err);
          //@ts-ignore
          flashShowMessage({
            type: 'danger',
            message: 'Lỗi tải ảnh!',
          });
        },
      );
    }
  }

  handleImageLayout(e) {
    if (this.refPopup.current) {
      this.refPopup.current.measure((a, b, width, height, px, py) => {
        this.updateCloseBtnPosition(px, py);
      });
    }
  }

  /**
   * @todo Create a press-able mask that overlaying on exactly
   * position of real image shown on screen.
   */
  renderMaskPressing() {
    return (
      <BaseButton
        useTouchableHighlight
        style={[styles.maskPressing, this.state.imgRealDimension]}
        onPress={this.props.onPressImage}>
        <View style={{flex: 1}} />
      </BaseButton>
    );
  }

  get backgroundStyle() {
    return mergeStyles(styles.background, {
      backgroundColor: this.theme.color.overlay60,
    });
  }

  get iconStyle() {
    return mergeStyles(styles.icon, {color: this.theme.color.onOverlay});
  }

  render() {
    const animatedBackgroundStyle = {
      opacity: this.animatedBackgroundValue,
    };

    const animatedImageStyle = {
      opacity: this.animatedBackgroundValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateY: this.animatedBackgroundValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-20, 0],
          }),
        },
      ],
    };

    return (
      <TouchableWithoutFeedback onPress={this.handleCloseForeground.bind(this)}>
        <View style={styles.container}>
          <Animated.View
            style={[this.backgroundStyle, animatedBackgroundStyle]}
          />
          <View style={[styles.iconWrapper, this.state.closeBtnPosition]}>
            <IconButton
              style={styles.iconContainer}
              iconStyle={this.iconStyle}
              bundle={BundleIconSetName.ANT_DESIGN}
              name="close"
              onPress={this.handleClose.bind(this)}
            />
          </View>

          <Animated.View
            style={[styles.imageContainer, animatedImageStyle]}
            onLayout={this.handleImageLayout.bind(this)}>
            <Image
              ref={this.refPopup}
              source={{uri: this.props.image}}
              style={styles.image}
            />
          </Animated.View>

          {this.renderMaskPressing()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default ModalPopup;
