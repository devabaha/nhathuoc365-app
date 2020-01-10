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
  Send,
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
import { willUpdateState, logger, setStater } from '../../helper';
import {
  WIDTH,
  HEIGHT,
  HIT_SLOP,
  config,
  COMPONENT_TYPE,
  BOTTOM_OFFSET_GALLERY,
  DURATION_SHOW_GALLERY
} from '../../constants';
import MasterToolBar from '../MasterToolBar';
import { getBottomSpace } from 'react-native-iphone-x-helper';

const tickidChatLogger = logger('tickidChat');
const SCROLL_OFFSET_TOP = 100;
const BTN_IMAGE_WIDTH = 35;
const ANIMATED_TYPE_COMPOSER_BTN = Easing.in;
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
    paddingTop: 0,
    //merge with masterToolBar
    selectedType: COMPONENT_TYPE._NONE
  };

  refMasterToolBar = React.createRef();
  refImageGallery = React.createRef();
  refGestureWrapper = React.createRef();
  refInput = React.createRef();
  unmounted = false;
  test = 0;

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.showSendBtn !== this.state.showSendBtn) {
      Animated.spring(this.state.animatedBtnSendValue, {
        toValue: !nextState.showSendBtn ? 0 : BTN_IMAGE_WIDTH,
        duration: nextProps.durationShowGallery,
        useNativeDriver: true
      }).start();
    }

    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.messages.length !== this.props.messages.length ||
      nextProps.pinList !== this.props.pinList ||
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
      console.log(nextProps.messages.length, '1');

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

  handleFocus = () => {
    this.setState(
      {
        showToolBar: this.refInput.current ? false : true,
        editable: this.refInput.current ? true : false
      },
      () => {
        setTimeout(
          () => {
            willUpdateState(this.unmounted, () => {
              if (this.refInput.current) {
                this.refInput.current.focus();
              }
            });
          },
          this.state.editable ? this.props.durationShowGallery : 0
        );
      }
    );

    // this.handlePressGallery()
  };

  handleBlur = () => {
    // this.collapseComposer();
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

  handlePressGallery = state => {
    if (!state.showToolBar && state.selectedImages.length !== 0) {
      this.animateBtnBack(1).start();
      state.showBackBtn = true;
      state.showSendBtn = true;
    }
  };

  handlePressPin = state => {
    if (state.showBackBtn) {
      this.animateBtnBack(0).start();
    }
  };

  handlePressComposerButton = componentType => {
    const state = { ...this.state };
    state.editable = false;

    Keyboard.dismiss();
    if (this.refInput.current) {
      this.refInput.current.blur();
    }
    switch (componentType.id) {
      case COMPONENT_TYPE.GALLERY.id:
        this.handlePressGallery(state);
        break;
      case COMPONENT_TYPE.PIN.id:
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

    setTimeout(
      () => {
        setStater(this, this.unmounted, { ...state });
      },
      this.state.editable ? this.props.durationShowGallery : 0
    );
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
    this.setState({ ...state });
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
    if (this.state.selectedType !== COMPONENT_TYPE._NONE) {
      this.collapseComposer();
    }
  };

  collapseComposer() {
    if (this.refInput.current) {
      this.refInput.current.blur();
    }

    this.setState({
      editable: this.state.text ? true : false,
      showBackBtn: false,
      showSendBtn: this.state.text ? true : false,
      showToolBar: false,
      selectedType: COMPONENT_TYPE._NONE
    });
  }

  onContentOffsetChanged = distanceFromTop => {
    if (distanceFromTop < this.props.scrollOffsetTop) {
      this.props.onScrollOffsetTop();
    }
  };

  renderComposer = () => {
    const animatedValue = this.refGestureWrapper.current
      ? this.refGestureWrapper.current.animatedShowUpFake
      : 0;
    return (
      <CustomComposer
        showInput={
          this.state.selectedImages.length === 0 || !this.state.showBackBtn
        }
        onFocusInput={this.handleFocus}
        refInput={this.refInput}
        animatedValue={animatedValue}
        editable={this.state.editable}
        onTyping={this.onTyping}
        onBlurInput={this.handleBlur}
        animatedBtnBackValue={this.state.animatedBtnBackValue}
        onBackPress={this.handleBackPress}
        btnWidth={BTN_IMAGE_WIDTH}
        placeholder="Nhập nội dung chat..."
        value={this.state.text}
      />
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
    const dimensions = {
      height: '100%',
      width: BTN_IMAGE_WIDTH,
      marginLeft: 10
    };
    return (
      <View style={styles.sendWrapper}>
        <Send {...props}>
          <TouchableOpacity hitSlop={HIT_SLOP} onPress={this.handleSendMessage}>
            <Animated.View
              pointerEvents={this.state.showSendBtn ? 'auto' : 'none'}
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
              <IconFontAwesome
                size={20}
                name="paper-plane"
                color={config.focusColor}
              />
            </Animated.View>
          </TouchableOpacity>
        </Send>

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
              {
                ...dimensions,
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
              style={[styles.fullCenter]}
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
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              styles.center,
              {
                ...dimensions,
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
    console.log('@_@ renderTickidChat');
    const extraData = this.props.pinList ? this.props.pinList.length : null;

    return (
      <SafeAreaView style={[styles.container, this.props.containerStyle]}>
        <TouchableWithoutFeedback
          style={styles.touchWrapper}
          onPress={this.onListViewPress}
        >
          <Animated.View
            style={[
              styles.flex,
              {
                paddingTop: this.refGestureWrapper.current
                  ? this.refGestureWrapper.current.animatedShowUpFake
                  : 0,
                transform: [
                  {
                    translateY: this.refGestureWrapper.current
                      ? this.refGestureWrapper.current.animatedShowUpValue.interpolate(
                          {
                            inputRange: [0, BOTTOM_OFFSET_GALLERY],
                            outputRange: [0, -BOTTOM_OFFSET_GALLERY]
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
              renderSend={this.renderSend}
              renderComposer={this.renderComposer}
              renderBubble={this.renderBubble}
              renderTime={this.renderTime}
              // renderChatFooter={this.renderFooter.bind(this)}
              keyboardShouldPersistTaps={'never'}
              messages={this.props.messages}
              onSend={this.handleSendMessage}
              alwaysShowSend={true}
              // isKeyboardInternallyHandled={false}
              listViewProps={{
                contentContainerStyle: styles.giftedChatContainer,
                style: styles.flex,
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
          extraData={extraData}
          pinListProps={{
            pinList: this.props.pinList,
            itemsPerRow: 4
          }}
          visible={this.state.showToolBar}
          baseViewHeight={BOTTOM_OFFSET_GALLERY}
          durationShowGallery={DURATION_SHOW_GALLERY}
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
  sendWrapper: {
    height: 44,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  }
});

export default TickidChat;

const EmptyChat = () => (
  <View style={[styles.fullCenter, styles.emptyChatContainer]}>
    <IconFontisto name="comments" color={'#909090'} size={60} />
    <Text style={styles.emptyChatText}>Bắt đầu cuộc trò chuyện thôi!</Text>
  </View>
);
