import React, { Component } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewPropTypes,
  TouchableOpacity,
  Animated,
  Easing,
  Keyboard,
  SafeAreaView,
  Text
} from 'react-native';
import {
  GiftedChat,
  Message,
  Day,
  Bubble,
  Time
} from 'react-native-gifted-chat';
import { ImageMessageChat, CustomComposer } from '../../component';
import PropTypes from 'prop-types';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import { setStater } from '../../helper';
import {
  WIDTH,
  HEIGHT,
  HIT_SLOP,
  config,
  COMPONENT_TYPE,
  BOTTOM_OFFSET_GALLERY,
  DURATION_SHOW_GALLERY,
  BOTTOM_SPACE_IPHONE_X,
  WINDOW_HEIGHT,
  HEADER_HEIGHT,
  ANDROID_EXTRA_DIMENSIONS_HEIGHT,
  ANDROID_STATUS_BAR_HEIGHT
} from '../../constants';
import MasterToolBar from '../MasterToolBar';

const SCROLL_OFFSET_TOP = 100;
const BTN_IMAGE_WIDTH = 35;
const ANIMATED_TYPE_COMPOSER_BTN = Easing.in;
const MAX_PIN = 9;
const defaultListener = () => {};
class TickidChat extends Component {
  static propTypes = {
    setHeader: PropTypes.func,
    expandedGallery: PropTypes.func,
    expandingGallery: PropTypes.func,
    collapsedGallery: PropTypes.func,
    collapsingGallery: PropTypes.func,
    onSendText: PropTypes.func,
    onSendImage: PropTypes.func,
    onPinPress: PropTypes.func,
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
    pinList: PropTypes.array,
    pinNotify: PropTypes.number,
    pinListNotify: PropTypes.object,
    giftedChatProps: PropTypes.any,
    defaultStatusBarColor: PropTypes.string,
    extraData: PropTypes.any
  };

  static defaultProps = {
    setHeader: defaultListener,
    expandedGallery: defaultListener,
    expandingGallery: defaultListener,
    collapsedGallery: defaultListener,
    collapsingGallery: defaultListener,
    onSendText: defaultListener,
    onSendImage: defaultListener,
    onPinPress: defaultListener,
    onUploadedImage: defaultListener,
    refListMessages: defaultListener,
    onScrollOffsetTop: defaultListener,
    refGiftedChat: defaultListener,
    containerStyle: {},
    durationShowGallery: DURATION_SHOW_GALLERY,
    bottomOffsetGallery: BOTTOM_OFFSET_GALLERY,
    animatedTypeComposerBtn: ANIMATED_TYPE_COMPOSER_BTN,
    scrollOffsetTop: SCROLL_OFFSET_TOP,
    uploadURL: '',
    messages: [],
    pinList: [],
    pinNotify: 0,
    pinListNotify: {},
    extraData: null
  };

  state = {
    showToolBar: false,
    editable: false,
    showSendBtn: false,
    showBackBtn: false,
    selectedImages: [],
    uploadImages: [],
    text: '',
    animatedBtnSendValue: new Animated.Value(0),
    animatedBtnBackValue: new Animated.Value(0),
    animatedNotification: new Animated.Value(0),
    animatedChatView: new Animated.Value(0),
    keyboardInformation: {
      height: this.props.bottomOffsetGallery,
      duration: this.props.durationShowGallery
    },
    selectedType: COMPONENT_TYPE._NONE,
    chatViewMarginTop: 0
  };

  refMasterToolBar = React.createRef();
  refImageGallery = React.createRef();
  refGestureWrapper = React.createRef();
  refInput = React.createRef();
  unmounted = false;
  animatedShowUpValue = 0;
  pinListProps = {
    pinList: this.props.pinList,
    pinListNotify: this.props.pinListNotify,
    itemsPerRow: 4,
    onPinPress: this.props.onPinPress
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.pinNotify !== this.props.pinNotify) {
      if (nextProps.pinNotify > 0) {
        this.state.animatedNotification.setValue(
          this.props.pinNotify === 0 ? 0 : 0.7
        );
      }
      const isHidden = this.props.pinNotify > 0 && nextProps.pinNotify === 0;
      Animated.spring(this.state.animatedNotification, {
        toValue: isHidden ? 0 : 1,
        useNativeDriver: true,
        friction: 5,
        overshootClamping: isHidden
      }).start();
    }

    if (nextState.showSendBtn !== this.state.showSendBtn) {
      Animated.spring(this.state.animatedBtnSendValue, {
        toValue: !nextState.showSendBtn ? 0 : BTN_IMAGE_WIDTH,
        duration: this.state.keyboardInformation.duration,
        useNativeDriver: true
      }).start();
    }

    this.pinListProps.pinList = nextProps.pinList;
    this.pinListProps.pinListNotify = nextProps.pinListNotify;
    this.pinListProps.itemsPerRow = nextProps.itemsPerRow;

    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.messages.length !== this.props.messages.length ||
      nextProps.pinList !== this.props.pinList ||
      nextProps.pinNotify !== this.props.pinNotify ||
      nextProps.pinListNotify !== this.props.pinListNotify ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.durationShowGallery !== this.props.durationShowGallery ||
      nextProps.bottomOffsetGallery !== this.props.bottomOffsetGallery ||
      nextProps.animatedTypeComposerBtn !==
        this.props.animatedTypeComposerBtn ||
      nextProps.uploadURL !== this.props.uploadURL ||
      nextProps.giftedChatProps !== this.props.giftedChatProps ||
      nextProps.defaultStatusBarColor !== this.props.defaultStatusBarColor ||
      nextProps.extraData !== this.props.extraData
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.props.refGiftedChat(GiftedChat);
    //merge with masterToolBar
    if (this.refMasterToolBar.current) {
      const refsImageGallery = this.refMasterToolBar.current.getComponentRef(
        COMPONENT_TYPE.GALLERY.id
      );

      this.refGestureWrapper = refsImageGallery.refGesture;
      this.refImageGallery = refsImageGallery.refGallery;
    }
    //end merge

    this.keyboardListener = Keyboard.addListener('keyboardDidShow', e =>
      this.handleShowKeyboard(e)
    );
    if (this.refGestureWrapper.current) {
      this.refGestureWrapper.current.animatedShowUpFake.addListener(
        this.animatedShowUpListener
      );
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.keyboardListener.remove();
    if (this.refGestureWrapper.current) {
      this.refGestureWrapper.current.animatedShowUpFake.removeListener(
        this.animatedShowUpListener
      );
    }
  }

  animatedShowUpListener = ({ value }) => {
    if (
      value === this.state.keyboardInformation.height &&
      this.state.chatViewMarginTop !== this.state.keyboardInformation.height
    ) {
      this.setState({
        chatViewMarginTop: this.state.keyboardInformation.height
      });
    }

    if (
      value < this.state.keyboardInformation.height &&
      this.state.chatViewMarginTop !== 0
    ) {
      this.setState({
        chatViewMarginTop: 0
      });
    }

    this.animatedShowUpValue = value;
  };

  handleShowKeyboard = e => {
    let isUpdate = false;
    const state = { ...this.state };
    if (
      e.endCoordinates.height &&
      e.endCoordinates.height !== this.state.keyboardInformation.height
    ) {
      state.keyboardInformation.height =
        e.endCoordinates.height -
        BOTTOM_SPACE_IPHONE_X +
        (ANDROID_EXTRA_DIMENSIONS_HEIGHT !== 0 ? ANDROID_STATUS_BAR_HEIGHT : 0);

      isUpdate = true;
    }

    if (e.duration && e.duration !== this.state.keyboardInformation.duration) {
      state.keyboardInformation.duration = e.duration;
      isUpdate = true;
    }

    if (isUpdate) {
      this.setState(state);
    }
  };

  clearSelectedPhotos() {
    if (this.refImageGallery.current) {
      this.refImageGallery.current.clearSelectedPhotos();
    }
  }

  animateBtnBack(toValue) {
    return Animated.spring(this.state.animatedBtnBackValue, {
      toValue,
      duration: this.state.keyboardInformation.duration,
      useNativeDriver: true
    });
  }

  handleFocus = (didShow = false) => {
    if (this.refInput.current) {
      this.refInput.current.focus();
    }
    if (didShow) {
      setTimeout(() =>
        setStater(this, this.unmounted, {
          editable: true,
          showToolBar: true,
          selectedType: COMPONENT_TYPE._NONE
        })
      );
    }
  };

  handleBlur = () => {
    if (this.refInput.current) {
      this.refInput.current.blur();
    }
  };

  handleBackPress = () => {
    this.clearSelectedPhotos();

    this.setState({
      showBackBtn: false,
      showSendBtn: false,
      selectedImages: [],
      uploadImages: []
    });
  };

  handlePressGallery = (state = this.state) => {
    if (!state.showToolBar && state.selectedImages.length !== 0) {
      this.animateBtnBack(1).start();
      state.showBackBtn = true;
      state.showSendBtn = true;
    }
  };

  handlePressPin = (state = this.state) => {
    if (state.showBackBtn) {
      this.animateBtnBack(0).start();
    }
  };

  handlePressComposerButton = componentType => {
    const state = { ...this.state };
    state.editable = false;

    switch (componentType.id) {
      case COMPONENT_TYPE.GALLERY.id:
        Keyboard.dismiss();
        this.handlePressGallery(state);
        break;
      case COMPONENT_TYPE.PIN.id:
        Keyboard.dismiss();
        this.handlePressPin(state);
        break;
    }

    if (state.selectedType === componentType) {
      state.selectedType = COMPONENT_TYPE._NONE;
      state.showToolBar = false;
    } else {
      state.selectedType = componentType;
      state.showToolBar = true;
    }

    this.setState(state);
  };

  onTyping = e => {
    this.setState({
      showSendBtn: e.nativeEvent.text !== '',
      text: e.nativeEvent.text
    });
  };

  handleToggleImage = selectedImages => {
    let state = { ...this.state };
    if (selectedImages.length === 1 && this.state.selectedImages.length === 0) {
      state.showSendBtn = true;
      state.showBackBtn = true;
      this.animateBtnBack(1).start();
    } else if (
      selectedImages.length === 0 &&
      this.state.selectedImages.length === 1
    ) {
      state.showBackBtn = false;
      state.showSendBtn = false;
      this.animateBtnBack(0).start();
    }

    state.selectedImages = selectedImages;
    this.setState(state);
  };

  handleSendImage = images => {
    const state = { ...this.state };
    if (!Array.isArray(images)) {
      images = [...state.selectedImages];
    }
    if (images.length !== 0) {
      this.clearSelectedPhotos();
    }
    state.selectedImages = [];

    // state.uploadImages = images;
    state.showBackBtn = false;
    state.showSendBtn = false;

    // this.handlePressGallery();
    this.setState(state);
    this.props.onSendImage(images);
  };

  handleSendText() {
    if (this.state.text) {
      this.props.onSendText(this.state.text);
      this.setState({
        text: '',
        showSendBtn: false
      });
    }
  }

  handleSendMessage = () => {
    if (this.state.editable) {
      this.handleSendText();
    } else if (this.state.selectedImages.length !== 0) {
      this.handleSendImage();
    }
  };

  handleExpandedGallery = () => {
    this.props.expandedGallery();
  };

  handleCollapsingGallery = () => {
    this.props.collapsingGallery();
  };

  handleCollapsedGallery = () => {
    this.setState({ selectedType: COMPONENT_TYPE._NONE });
  };

  onListViewPress = e => {
    if (
      this.state.selectedType !== COMPONENT_TYPE._NONE ||
      this.state.editable
    ) {
      this.collapseComposer();
    }
  };

  collapseComposer() {
    this.setState(
      {
        editable: !!this.state.text,
        showBackBtn: false,
        showSendBtn: !!this.state.text,
        showToolBar: false,
        selectedType: COMPONENT_TYPE._NONE
      },
      () => {
        setTimeout(() => this.handleBlur(), 100);
      }
    );
  }

  renderComposer = () => {
    return (
      <CustomComposer
        showInput={
          this.state.selectedImages.length === 0 || !this.state.showBackBtn
        }
        onFocusInput={this.handleFocus}
        refInput={this.refInput}
        editable={this.state.editable}
        onTyping={this.onTyping}
        animatedBtnBackValue={this.state.animatedBtnBackValue}
        onBackPress={this.handleBackPress}
        btnWidth={BTN_IMAGE_WIDTH}
        placeholder="Nhập nội dung chat..."
        value={this.state.text}
      />
    );
  };

  renderInputToolbar = props => {
    return (
      <View style={styles.inputToolbar}>
        {this.renderComposer()}
        {this.renderSend()}
      </View>
    );
  };

  // renderFooter() {
  //   return this.state.uploadImages.length !== 0 ? (
  //     <View style={styles.footerStyle}>
  //       {this.state.uploadImages.map(image => (
  //         <ImageUploading
  //           key={image.id}
  //           image={image}
  //           uploadURL={this.props.uploadURL}
  //           onUploadedSuccess={response => {
  //             this.props.onUploadedImage(response);
  //             let uploadImages = [...this.state.uploadImages];
  //             uploadImages.splice(
  //               uploadImages.findIndex(img => img.id === image.id),
  //               1
  //             );
  //             this.setState({ uploadImages });
  //           }}
  //           onUploadedFail={err => {
  //             console.log(err);
  //           }}
  //         />
  //       ))}
  //     </View>
  //   ) : null;
  // }

  renderSend = props => {
    return (
      <View style={styles.sendWrapper}>
        <TouchableOpacity hitSlop={HIT_SLOP} onPress={this.handleSendMessage}>
          <Animated.View
            pointerEvents={this.state.showSendBtn ? 'auto' : 'none'}
            style={[
              styles.center,
              styles.sendBtn,
              {
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
            <IconFontAwesome
              size={20}
              name="paper-plane"
              color={config.focusColor}
            />
          </Animated.View>
        </TouchableOpacity>

        <View
          pointerEvents={!this.state.showSendBtn ? 'auto' : 'none'}
          style={{
            position: 'absolute',
            flexDirection: 'row'
          }}
        >
          <Animated.View
            style={[
              styles.center,
              styles.sendBtn,
              {
                opacity: this.state.animatedBtnSendValue.interpolate({
                  inputRange: [0, BTN_IMAGE_WIDTH],
                  outputRange: [1, 0]
                }),
                transform: [
                  {
                    scale: this.state.animatedBtnSendValue.interpolate({
                      inputRange: [0, BTN_IMAGE_WIDTH],
                      outputRange: [1, 2]
                    })
                  }
                ]
              }
            ]}
          >
            <TouchableOpacity
              onPress={() => this.handlePressComposerButton(COMPONENT_TYPE.PIN)}
              hitSlop={HIT_SLOP}
              style={[styles.fullCenter, { flex: 1 }]}
            >
              <IconAntDesign
                size={23}
                name="paperclip"
                color={
                  this.state.selectedType === COMPONENT_TYPE.PIN
                    ? config.focusColor
                    : config.blurColor
                }
              />
              <Animated.View
                style={[
                  styles.badge,
                  {
                    opacity: this.state.animatedNotification.interpolate({
                      inputRange: [0, 0.1, 1],
                      outputRange: [0, 1, 1]
                    }),
                    transform: [{ scale: this.state.animatedNotification }]
                  }
                ]}
              >
                <Text style={styles.badgeText}>
                  {this.props.pinNotify > MAX_PIN
                    ? `${MAX_PIN}+`
                    : this.props.pinNotify}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              styles.center,
              styles.sendBtn,
              {
                opacity: this.state.animatedBtnSendValue.interpolate({
                  inputRange: [0, BTN_IMAGE_WIDTH],
                  outputRange: [1, 0]
                }),
                transform: [
                  {
                    scale: this.state.animatedBtnSendValue.interpolate({
                      inputRange: [0, BTN_IMAGE_WIDTH],
                      outputRange: [1, 2]
                    })
                  }
                ]
              }
            ]}
          >
            <TouchableOpacity
              hitSlop={HIT_SLOP}
              onPress={() =>
                this.handlePressComposerButton(COMPONENT_TYPE.GALLERY)
              }
              style={[styles.fullCenter]}
            >
              <IconAntDesign
                size={25}
                name="picture"
                color={
                  this.state.selectedType === COMPONENT_TYPE.GALLERY
                    ? config.focusColor
                    : config.blurColor
                }
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  };

  renderMessageImage = props => {
    return (
      <ImageMessageChat
        containerStyle={{ borderWidth: 1, borderColor: '#d9d9d9' }}
        uploadURL={this.props.uploadURL}
        isUploadData={props.currentMessage.isUploadData}
        image={props.currentMessage.rawImage}
        lowQualityUri={props.currentMessage.image}
        onUploadedSuccess={(response, isReUp) => {
          if (!isReUp) {
            this.props.onUploadedImage(response);
          }
        }}
        onUploadedFail={err => {
          console.log(err);
        }}
      />
    );
  };

  renderMessage = props => {
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
  };

  renderBubble = props => {
    const isImage = !!props.currentMessage.image;
    const bgColor_left = isImage ? 'transparent' : '#e5e5ea';
    const bgColor_right = isImage ? 'transparent' : '#198bfe';
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: { backgroundColor: bgColor_left },
          right: { backgroundColor: bgColor_right }
        }}
      />
    );
  };

  renderTime = props => {
    const isImage = !!props.currentMessage.image;
    const color_left = '#aaa';
    const color_right = isImage ? '#aaa' : '#fff';
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: color_left
          },
          right: {
            color: color_right
          }
        }}
      />
    );
  };

  renderScrollBottomComponent = () => {
    return <IconAntDesign name="arrowdown" color="#404040" size={20} />;
  };

  renderDay = props => {
    return (
      <View style={styles.dayStyle}>
        <Day {...props} />
      </View>
    );
  };

  render() {
    console.log('@_@ renderTickidChat', this.state.keyboardInformation.height);
    const extraChatViewStyle = {
      marginTop: this.state.chatViewMarginTop
    };

    return (
      <SafeAreaView style={[styles.container, this.props.containerStyle]}>
        <TouchableWithoutFeedback
          style={styles.touchWrapper}
          onPress={this.onListViewPress}
        >
          <Animated.View
            style={[
              styles.flex,
              styles.animatedChatView,
              {
                transform: [
                  {
                    translateY: this.refGestureWrapper.current
                      ? this.refGestureWrapper.current.animatedShowUpFake.interpolate(
                          {
                            inputRange: [
                              0,
                              this.state.keyboardInformation.height
                            ],
                            outputRange: [
                              0,
                              -this.state.keyboardInformation.height
                            ]
                          }
                        )
                      : 0
                  }
                ]
              }
            ]}
          >
            <GiftedChat
              renderDay={this.renderDay}
              renderMessage={this.renderMessage}
              renderMessageImage={this.renderMessageImage}
              // renderSend={this.renderSend}
              // renderComposer={this.renderComposer}
              renderInputToolbar={this.renderInputToolbar}
              renderBubble={this.renderBubble}
              renderTime={this.renderTime}
              // renderChatFooter={this.renderFooter.bind(this)}
              keyboardShouldPersistTaps={'always'}
              messages={this.props.messages}
              // onSend={this.handleSendMessage}
              // alwaysShowSend={true}
              isKeyboardInternallyHandled={false}
              listViewProps={{
                contentContainerStyle: styles.giftedChatContainer,
                style: [styles.flex, extraChatViewStyle],
                ListEmptyComponent: EmptyChat
              }}
              scrollToBottom
              scrollToBottomComponent={this.renderScrollBottomComponent}
              {...this.props.giftedChatProps}
            />
          </Animated.View>
        </TouchableWithoutFeedback>

        <MasterToolBar
          ref={this.refMasterToolBar}
          selectedType={this.state.selectedType}
          galleryProps={{
            setHeader: this.props.setHeader,
            defaultStatusBarColor: this.props.defaultStatusBarColor,
            onExpandedBodyContent: this.handleExpandedGallery,
            onCollapsedBodyContent: this.handleCollapsedGallery,
            onCollapsingBodyContent: this.handleCollapsingGallery,
            onToggleImage: this.handleToggleImage,
            onSendImage: this.handleSendImage
          }}
          pinListProps={this.pinListProps}
          visible={this.state.showToolBar}
          baseViewHeight={this.state.keyboardInformation.height}
          durationShowGallery={this.state.keyboardInformation.duration}
          extraData={this.props.extraData}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  animatedChatView: {
    position: 'absolute',
    flex: 1,
    width: WIDTH,
    height:
      WINDOW_HEIGHT -
      HEADER_HEIGHT +
      ANDROID_EXTRA_DIMENSIONS_HEIGHT -
      BOTTOM_SPACE_IPHONE_X,
    left: 0,
    right: 0
  },
  sendWrapper: {
    height: 44,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 5
  },
  sendBtn: {
    height: '100%',
    width: BTN_IMAGE_WIDTH,
    marginLeft: 10
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
  inputToolbar: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    borderTopWidth: 1,
    borderTopColor: '#d9d9d9',
    backgroundColor: '#fff',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99
  },
  giftedChatContainer: {
    paddingBottom: 15,
    flexGrow: 1,
    backgroundColor: '#fff'
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
  emptyChatContainer: {
    paddingBottom: 60,
    transform: [{ rotateX: '180deg' }]
  },
  emptyChatText: {
    color: '#909090',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 20,
    fontWeight: '500'
  },
  badge: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: -10,
    right: -8,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden'
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default TickidChat;

const EmptyChat = () => (
  <View style={[styles.fullCenter, styles.emptyChatContainer]}>
    <IconFontisto name="comments" color={'#909090'} size={60} />
    <Text style={styles.emptyChatText}>Bắt đầu cuộc trò chuyện thôi!</Text>
  </View>
);
