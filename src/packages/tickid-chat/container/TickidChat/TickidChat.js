import React, { Component } from 'react';
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
  Text
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

const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');
const DURATION_SHOW_GALLERY = 300;
const SCROLL_OFFSET_TOP = 100;
const BOTTOM_OFFFSET_GALLERY = HEIGHT - HEIGHT / 1.5;
const BTN_IMAGE_WIDTH = 35;
const ANIMATED_TYPE_COMPOSER_BTN = Easing.in;

class TickidChat extends Component {
  static propTypes = {
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
    expandedGallery: () => {},
    collapsedGallery: () => {},
    onSendText: () => {},
    onSendImage: () => {},
    onUploadedImage: () => {},
    refListMessages: () => {},
    onScrollOffsetTop: () => {},
    refGiftedChat: () => {},
    containerStyle: {},
    durationShowGallery: DURATION_SHOW_GALLERY,
    bottomOffsetGallery: BOTTOM_OFFFSET_GALLERY,
    animatedTypeComposerBtn: ANIMATED_TYPE_COMPOSER_BTN,
    scrollOffsetTop: SCROLL_OFFSET_TOP,
    uploadURL: '',
    messages: []
  };

  state = {
    // messages: [
    //   {
    //     _id: 1,
    //     text: 'Hello developer',
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: 'React Native',
    //       avatar: 'https://placeimg.com/140/140/any'
    //     },
    //     image: 'https://placeimg.com/140/140/any'
    //   }
    // ],
    showImageGallery: false,
    editable: false,
    showImageBtn: true,
    showSendBtn: false,
    showBackBtn: false,
    selectedImages: [],
    uploadImages: [],
    text: ''
  };

  animatedBtnImageValue = new Animated.Value(BTN_IMAGE_WIDTH);
  animatedBtnSendValue = new Animated.Value(0);
  animatedBtnBackValue = new Animated.Value(0);
  refImageGallery = React.createRef();
  refInput = React.createRef();
  unmounted = false;

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.showImageGallery !== this.state.showImageGallery ||
      nextState.editable !== this.state.editable ||
      nextState.showImageBtn !== this.state.showImageBtn ||
      nextState.showSendBtn !== this.state.showSendBtn ||
      nextState.showBackBtn !== this.state.showBackBtn ||
      nextState.selectedImages !== this.state.selectedImages ||
      nextState.uploadImages !== this.state.uploadImages ||
      nextState.text !== this.state.text
    ) {
      if (nextState.showImageBtn !== this.state.showImageBtn) {
        Animated.parallel([
          Animated.timing(this.animatedBtnImageValue, {
            toValue: nextState.showImageBtn ? BTN_IMAGE_WIDTH : 0,
            easing: nextProps.animatedTypeComposerBtn,
            duration: nextProps.durationShowGallery,
            useNativeDriver: true
          }),
          Animated.timing(this.animatedBtnSendValue, {
            toValue: nextState.showImageBtn ? 0 : BTN_IMAGE_WIDTH,
            easing: nextProps.animatedTypeComposerBtn,
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

  animate(target, duration, toValue, easing, useNativeDriver = false) {
    return Animated.timing(target, {
      useNativeDriver,
      duration,
      toValue,
      easing
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
      if (!this.unmounted) {
        const state = { ...this.state };
        if (!state.showImageGallery && state.selectedImages.length !== 0) {
          state.showImageBtn = false;
          state.showBackBtn = true;
          state.showSendBtn = true;
          Animated.timing(this.animatedBtnBackValue, {
            toValue: 1,
            duration: this.props.durationShowGallery,
            useNativeDriver: true,
            easing: this.props.animatedTypeComposerBtn
          }).start();
        }
        state.showImageGallery = !state.showImageGallery;
        state.editable = false;
        this.setState({ ...state });
      }
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
      Animated.timing(this.animatedBtnBackValue, {
        toValue: 1,
        duration: this.props.durationShowGallery,
        useNativeDriver: true,
        easing: this.props.animatedTypeComposerBtn
      }).start();
    } else if (
      selectedImages.length === 0 &&
      this.state.selectedImages.length === 1
    ) {
      state.showBackBtn = false;
      state.showImageBtn = true;
      Animated.timing(this.animatedBtnBackValue, {
        toValue: 0,
        duration: this.props.durationShowGallery,
        useNativeDriver: true,
        easing: this.props.animatedTypeComposerBtn
      }).start();
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

    state.uploadImages = images;
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
        animatedBtnBackValue={this.animatedBtnBackValue}
        onBackPress={this.handleBackPress.bind(this)}
        btnWidth={BTN_IMAGE_WIDTH}
        placeholder="Nhập nội dung chat..."
        value={this.state.text}
      />
    );
  }

  renderFooter() {
    return this.state.uploadImages.length !== 0 ? (
      <View
        style={{
          width: WIDTH,
          height: 100,
          flexDirection: 'row',
          marginTop: 15,
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0)'
        }}
      >
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
    return (
      <View
        style={{
          height: 44,
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexDirection: 'row',
          marginRight: 5
        }}
      >
        <Send {...props}>
          <TouchableOpacity onPress={this.handleSendMessage.bind(this)}>
            <Animated.View
              pointerEvents={this.state.showImageBtn ? 'auto' : 'none'}
              style={{
                width: BTN_IMAGE_WIDTH,
                opacity: this.animatedBtnSendValue.interpolate({
                  inputRange: [0, BTN_IMAGE_WIDTH],
                  outputRange: [0, 1]
                }),
                transform: [
                  {
                    scale: this.animatedBtnSendValue.interpolate({
                      inputRange: [0, BTN_IMAGE_WIDTH],
                      outputRange: [0, 1]
                    })
                  }
                ],
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconFontAwesome size={20} name="paper-plane" color={'blue'} />
            </Animated.View>
          </TouchableOpacity>
        </Send>

        <Animated.View
          pointerEvents={this.state.showImageBtn ? 'auto' : 'none'}
          style={{
            position: 'absolute',
            width: BTN_IMAGE_WIDTH,
            opacity: this.animatedBtnImageValue.interpolate({
              inputRange: [0, BTN_IMAGE_WIDTH],
              outputRange: [0, 1]
            }),
            transform: [
              {
                scale: this.animatedBtnImageValue.interpolate({
                  inputRange: [0, BTN_IMAGE_WIDTH],
                  outputRange: [2, 1]
                })
              }
            ],
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <TouchableOpacity
            onPress={this.handlePressGallery.bind(this)}
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
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
      style = { marginBottom: 10 };
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
      <View style={{ marginTop: 10 }}>
        <Day {...props} />
      </View>
    );
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableWithoutFeedback
          style={styles.touchWrapper}
          onPress={this.onListViewPress.bind(this)}
        >
          <View style={{ flex: 1 }}>
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
                contentContainerStyle: {
                  paddingBottom: 15,
                  flexGrow: 1
                },
                style: {
                  flex: 1
                }
                // onScroll:
                //     (event) =>
                //         this.onContentOffsetChanged(event.nativeEvent.contentOffset.y)
              }}
              scrollToBottom
              scrollToBottomComponent={this.renderScrollBottomComponent.bind(
                this
              )}
              {...this.props.giftedChatProps}
            />
          </View>
        </TouchableWithoutFeedback>
        <ImageGallery
          ref={this.refImageGallery}
          visible={this.state.showImageGallery}
          defaultStatusBarColor={this.props.defaultStatusBarColor}
          baseViewHeight={BOTTOM_OFFFSET_GALLERY}
          durattionShowGallery={DURATION_SHOW_GALLERY}
          onExpandedBodyContent={this.props.expandedGallery}
          onCollapsedBodyContent={this.props.collapsedGallery}
          onSendImage={this.handleSendImage.bind(this)}
          onToggleImage={this.handleToggleImage.bind(this)}
          btnCloseAlbum={
            <CenterIcon
              iconType="IconAntDesign"
              name="close"
              size={18}
              color="white"
            />
          }
          iconToggleAlbum={
            <CenterIcon
              iconType="IconAntDesign"
              name="down"
              size={18}
              color="white"
            />
          }
          iconSelectedAlbum={<CenterIcon name="check" size={20} color="blue" />}
          iconSendImage={
            <CenterIcon name="paper-plane" size={20} color="blue" />
          }
          iconCameraPicker={
            <View
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CenterIcon name="camera" size={28} color="black" />
              <Text style={{ color: 'black', marginTop: 15 }}>Chụp ảnh</Text>
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  touchWrapper: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT
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
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      {iconComponent}
    </View>
  );
};
