import React, { Component, PureComponent } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewPropTypes,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Text,
  SafeAreaView
} from 'react-native';
import { GiftedChat, Send, Message, Day } from 'react-native-gifted-chat';
import ImageGallery from '../ImageGallery';
import {
  ImageMessageChat,
  CustomComposer,
  ImageUploading
} from '../../component';
import PropTypes from 'prop-types';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { willUpdateState, logger } from '../../helper';

const tickidChatLogger = logger('tickidChat');
const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');
const DURATION_SHOW_GALLERY = 300;
const SCROLL_OFFSET_TOP = 100;
const BOTTOM_OFFFSET_GALLERY = HEIGHT - HEIGHT / 1.5;
const BTN_IMAGE_WIDTH = 35;
const ANIMATED_TYPE_COMPOSER_BTN = Easing.in;
const defaultListener = () => {};
class TickidChat extends Component {
  static propTypes = {
    setHeader: PropTypes.func,
    expandedGallery: PropTypes.func,
    collapsedGallery: PropTypes.func,
    onSendText: PropTypes.func,
    onSendImage: PropTypes.func,
    refGiftedChat: PropTypes.func,
    refListMessages: PropTypes.func,
    onUploadedImage: PropTypes.func,
    onScrollOffsetTop: PropTypes.func,
    containerStyle: ViewPropTypes.style,
    durationShowGallery: PropTypes.number,
    bottomOffsetGallery: PropTypes.number,
    scrollOffsetTop: PropTypes.number,
    animatedTypeComposerBtn: PropTypes.any,
    uploadURL: PropTypes.string,
    messages: PropTypes.array,
    giftedChatProps: PropTypes.any,
    defaultStatusBarColor: PropTypes.string
  };

  static defaultProps = {
    setHeader: defaultListener,
    expandedGallery: defaultListener,
    collapsedGallery: defaultListener,
    onSendText: defaultListener,
    onSendImage: defaultListener,
    onUploadedImage: defaultListener,
    refListMessages: defaultListener,
    onScrollOffsetTop: defaultListener,
    refGiftedChat: defaultListener,
    containerStyle: {},
    durationShowGallery: DURATION_SHOW_GALLERY,
    bottomOffsetGallery: BOTTOM_OFFFSET_GALLERY,
    animatedTypeComposerBtn: ANIMATED_TYPE_COMPOSER_BTN,
    scrollOffsetTop: SCROLL_OFFSET_TOP,
    uploadURL: '',
    messages: []
  };

  state = {
    showImageGallery: false,
    editable: false,
    showImageBtn: true,
    showSendBtn: false,
    showBackBtn: false,
    selectedImages: [],
    uploadImages: [],
    text: '',
    animatedBtnImageValue: new Animated.Value(BTN_IMAGE_WIDTH),
    animatedBtnSendValue: new Animated.Value(0),
    animatedBtnBackValue: new Animated.Value(0),
    paddingTop: 0
  };

  refImageGallery = React.createRef();
  refInput = React.createRef();
  unmounted = false;
  test = 0;

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      if (nextState.showImageBtn !== this.state.showImageBtn) {
        Animated.parallel([
          Animated.spring(this.state.animatedBtnImageValue, {
            toValue: nextState.showImageBtn ? BTN_IMAGE_WIDTH : 0,
            // easing: nextProps.animatedTypeComposerBtn,
            duration: nextProps.durationShowGallery,
            useNativeDriver: true
          }),
          Animated.spring(this.state.animatedBtnSendValue, {
            toValue: nextState.showImageBtn ? 0 : BTN_IMAGE_WIDTH,
            // easing: nextProps.animatedTypeComposerBtn,
            duration: nextProps.durationShowGallery,
            useNativeDriver: true
          })
        ]).start();
      }

      return true;
    }

    if (
      nextProps.messages !== this.props.messages ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.durationShowGallery !== this.props.durationShowGallery ||
      nextProps.bottomOffsetGallery !== this.props.bottomOffsetGallery ||
      nextProps.animatedTypeComposerBtn !==
        this.props.animatedTypeComposerBtn ||
      nextProps.uploadURL !== this.props.uploadURL ||
      nextProps.giftedChatProps !== this.props.giftedChatProps ||
      nextProps.defaultStatusBarColor !== this.props.defaultStatusBarColor
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.props.refGiftedChat(GiftedChat);
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  clearSelectedPhotos() {
    if (this.refImageGallery.current) {
      this.refImageGallery.current.clearSelectedPhotos();
    }
  }

  animateBtnBack(toValue) {
    return Animated.spring(this.state.animatedBtnBackValue, {
      toValue,
      duration: this.props.durationShowGallery,
      useNativeDriver: true
    });
  }

  handleFocus() {
    this.setState({
      showImageGallery: this.refInput ? false : true,
      editable: this.refInput ? true : false
    });

    if (this.refInput) {
      setTimeout(() => {
        if (this.refInput && !this.unmounted) {
          this.refInput.focus();
        }
      }, this.props.durationShowGallery);
    }
  }

  handleBlur() {
    // this.collapseComposer();
  }

  handleBackPress() {
    this.clearSelectedPhotos();

    this.setState({
      showBackBtn: false,
      showImageBtn: true,
      showSendBtn: false,
      selectedImages: [],
      uploadImages: []
    });
  }

  handlePressGallery() {
    Keyboard.dismiss();
    if (this.refInput) {
      this.refInput.blur();
    }
    setTimeout(() => {
      willUpdateState(this.unmounted, () => {
        const state = { ...this.state };
        if (!state.showImageGallery && state.selectedImages.length !== 0) {
          state.showImageBtn = false;
          state.showBackBtn = true;
          state.showSendBtn = true;
          this.animateBtnBack(1).start();
        }
        state.showImageGallery = !state.showImageGallery;
        state.editable = false;
        this.setState({ ...state });
      });
    }, this.props.durationShowGallery / 2);
  }

  onTyping(e) {
    this.setState({
      showImageBtn: e.nativeEvent.text === '',
      text: e.nativeEvent.text
    });
  }

  handleToggleImage(selectedImages) {
    let state = { ...this.state };
    if (selectedImages.length === 1 && this.state.selectedImages.length === 0) {
      state.showImageBtn = false;
      state.showBackBtn = true;
      this.animateBtnBack(1).start();
    } else if (
      selectedImages.length === 0 &&
      this.state.selectedImages.length === 1
    ) {
      state.showBackBtn = false;
      state.showImageBtn = true;
      this.animateBtnBack(0).start();
    }

    state.selectedImages = selectedImages;
    this.setState(state);
  }

  handleSendImage(images = null) {
    const state = { ...this.state };
    if (!images) {
      images = [...state.selectedImages];
    } else {
      state.selectedImages = [];
    }

    // state.uploadImages = images;
    state.showBackBtn = false;
    state.showImageBtn = true;

    this.clearSelectedPhotos();
    this.handlePressGallery();
    this.setState({ ...state });
  }

  handleSendText() {
    this.props.onSendText(this.state.text);
    this.setState({
      text: '',
      showImageBtn: true,
      showSendBtn: false
    });
  }

  handleSendMessage() {
    if (this.state.editable) {
      this.handleSendText();
    } else if (this.state.selectedImages.length !== 0) {
      this.handleSendImage();
    }
  }

  handleExpandedGallery() {
    this.props.expandedGallery();
    this.setState({ expandedGallery: true });
  }

  handleCollapsedGallery() {
    this.props.collapsedGallery();
    this.setState({ expandedGallery: false });
  }

  onListViewPress = e => {
    this.collapseComposer();
  };

  collapseComposer() {
    if (this.refInput) {
      this.refInput.blur();
    }

    this.setState({
      editable: this.state.text ? true : false,
      showBackBtn: false,
      showImageBtn: this.state.text ? false : true,
      showSendBtn: this.state.text ? true : false,
      showImageGallery: false
    });
  }

  onContentOffsetChanged = distanceFromTop => {
    if (distanceFromTop < this.props.scrollOffsetTop) {
      this.props.onScrollOffsetTop();
    }
  };

  renderComposer() {
    return (
      <CustomComposer
        showInput={
          this.state.selectedImages.length === 0 || !this.state.showBackBtn
        }
        onFocusInput={this.handleFocus.bind(this)}
        refInput={inst => (this.refInput = inst)}
        editable={this.state.editable}
        onTyping={this.onTyping.bind(this)}
        onBlurInput={this.handleBlur.bind(this)}
        animatedBtnBackValue={this.state.animatedBtnBackValue}
        onBackPress={this.handleBackPress.bind(this)}
        btnWidth={BTN_IMAGE_WIDTH}
        placeholder="Nhập nội dung chat..."
        value={this.state.text}
      />
    );
  }

  renderFooter() {
    return this.state.uploadImages.length !== 0 ? (
      <View style={styles.footerStyle}>
        {this.state.uploadImages.map(image => (
          <ImageUploading
            key={image.id}
            image={image}
            uploadURL={this.props.uploadURL}
            onUploadedSuccess={response => {
              this.props.onUploadedImage(response);
              let uploadImages = [...this.state.uploadImages];
              uploadImages.splice(
                uploadImages.findIndex(img => img.id === image.id),
                1
              );
              this.setState({ uploadImages });
            }}
            onUploadedFail={err => {
              console.log(err);
            }}
          />
        ))}
      </View>
    ) : null;
  }

  renderSend(props) {
    const dimensions = {
      height: '100%',
      width: BTN_IMAGE_WIDTH
    };
    return (
      <View style={styles.sendWrapper}>
        <Send {...props}>
          <TouchableOpacity onPress={this.handleSendMessage.bind(this)}>
            <Animated.View
              pointerEvents={this.state.showImageBtn ? 'auto' : 'none'}
              style={[
                styles.center,
                {
                  ...dimensions,
                  opacity: this.state.animatedBtnSendValue.interpolate({
                    inputRange: [0, BTN_IMAGE_WIDTH],
                    outputRange: [0, 1]
                  }),
                  transform: [
                    {
                      scale: this.state.animatedBtnSendValue.interpolate({
                        inputRange: [0, BTN_IMAGE_WIDTH],
                        outputRange: [0, 1]
                      })
                    }
                  ]
                }
              ]}
            >
              <IconFontAwesome size={20} name="paper-plane" color={'blue'} />
            </Animated.View>
          </TouchableOpacity>
        </Send>

        <Animated.View
          pointerEvents={this.state.showImageBtn ? 'auto' : 'none'}
          style={[
            styles.center,
            {
              ...dimensions,
              position: 'absolute',
              opacity: this.state.animatedBtnImageValue.interpolate({
                inputRange: [0, BTN_IMAGE_WIDTH],
                outputRange: [0, 1]
              }),
              transform: [
                {
                  scale: this.state.animatedBtnImageValue.interpolate({
                    inputRange: [0, BTN_IMAGE_WIDTH],
                    outputRange: [2, 1]
                  })
                }
              ]
            }
          ]}
        >
          <TouchableOpacity
            onPress={this.handlePressGallery.bind(this)}
            style={styles.fullCenter}
          >
            <IconFontAwesome size={25} name="image" color={'blue'} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  renderMessageImage(props) {
    return <ImageMessageChat lowQualityUri={props.currentMessage.image} />;
  }

  renderMessage(props) {
    let style = {};
    if (
      this.props.messages.length !== 0 &&
      props.currentMessage._id ===
        this.props.messages[this.props.messages.length - 1]._id
    ) {
      style = styles.messageStyle;
    }

    return (
      <TouchableWithoutFeedback onPress={this.onListViewPress.bind(this)}>
        <View style={{ ...style }}>
          <Message {...props} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderScrollBottomComponent() {
    return <IconAntDesign name="arrowdown" color="#404040" size={20} />;
  }

  renderDay(props) {
    return (
      <View style={styles.dayStyle}>
        <Day {...props} />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={[styles.container, this.props.containerStyle]}>
        <TouchableWithoutFeedback
          style={styles.touchWrapper}
          onPress={this.onListViewPress.bind(this)}
        >
          <Animated.View
            style={[
              styles.flex,
              {
                paddingTop: this.refGestureWrapper
                  ? this.refGestureWrapper.animatedShowUpFake
                  : 0,
                transform: [
                  {
                    translateY: this.refGestureWrapper
                      ? this.refGestureWrapper.animatedShowUpValue.interpolate({
                          inputRange: [0, BOTTOM_OFFFSET_GALLERY],
                          outputRange: [0, -BOTTOM_OFFFSET_GALLERY]
                        })
                      : 0
                  }
                ]
              }
            ]}
          >
            <GiftedChat
              renderDay={this.renderDay.bind(this)}
              renderMessage={this.renderMessage.bind(this)}
              renderMessageImage={this.renderMessageImage.bind(this)}
              renderSend={this.renderSend.bind(this)}
              renderComposer={this.renderComposer.bind(this)}
              renderChatFooter={this.renderFooter.bind(this)}
              keyboardShouldPersistTaps={'never'}
              messages={this.props.messages}
              onSend={this.handleSendMessage.bind(this)}
              alwaysShowSend={true}
              listViewProps={{
                contentContainerStyle: styles.giftedChatContainer,
                style: styles.flex
              }}
              scrollToBottom
              scrollToBottomComponent={this.renderScrollBottomComponent.bind(
                this
              )}
              {...this.props.giftedChatProps}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
        <ImageGallery
          ref={this.refImageGallery}
          refGestureWrapper={inst => (this.refGestureWrapper = inst)}
          setHeader={this.props.setHeader}
          visible={this.state.showImageGallery}
          defaultStatusBarColor={this.props.defaultStatusBarColor}
          baseViewHeight={BOTTOM_OFFFSET_GALLERY}
          durattionShowGallery={DURATION_SHOW_GALLERY}
          onExpandedBodyContent={this.handleExpandedGallery.bind(this)}
          onCollapsedBodyContent={this.props.collapsedGallery}
          onSendImage={this.handleSendImage.bind(this)}
          onToggleImage={this.handleToggleImage.bind(this)}
          btnCloseAlbum={BTN_CLOSE_ALBUM}
          iconToggleAlbum={ICON_TOGGLE_ALBUM}
          iconSelectedAlbum={ICON_SELECTED_ALBUM}
          iconSendImage={ICON_SEND_IMAGE}
          iconCameraPicker={ICON_CAMERA_PICKER}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sendWrapper: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginRight: 5
  },
  dayStyle: {
    marginTop: 10
  },
  messageStyle: {
    marginBottom: 10
  },
  footerStyle: {
    width: WIDTH,
    height: 100,
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  giftedChatContainer: {
    paddingBottom: 15,
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  touchWrapper: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT
  },
  fullCenter: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  captureText: {
    color: 'black',
    marginTop: 15
  }
});

export default TickidChat;

const CenterIcon = props => {
  const iconComponent =
    props.iconType === 'IconAntDesign' ? (
      <IconAntDesign {...props} />
    ) : (
      <IconFontAwesome {...props} />
    );

  return <View style={styles.center}>{iconComponent}</View>;
};

//-----
const ICON_CAMERA_PICKER = (
  <View style={styles.fullCenter}>
    <CenterIcon name="camera" size={28} color="black" />
    <Text style={styles.captureText}>Chụp ảnh</Text>
  </View>
);
const ICON_SEND_IMAGE = (
  <CenterIcon name="paper-plane" size={20} color="blue" />
);
const ICON_SELECTED_ALBUM = <CenterIcon name="check" size={20} color="blue" />;
const ICON_TOGGLE_ALBUM = (
  <CenterIcon iconType="IconAntDesign" name="down" size={18} color="white" />
);
const BTN_CLOSE_ALBUM = (
  <CenterIcon iconType="IconAntDesign" name="close" size={18} color="white" />
);
//-----
