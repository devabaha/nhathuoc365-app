import React, {Component} from 'react';
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
  Text,
  Dimensions,
  Clipboard,
} from 'react-native';
import {
  GiftedChat,
  Message,
  Day,
  Bubble,
  Time,
  Avatar,
  InputToolbar,
} from 'react-native-gifted-chat';
import {ImageMessageChat, CustomComposer} from '../../component';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import ActionSheet from 'react-native-actionsheet';
import Communications from 'react-native-communications';
import {setStater} from '../../helper';
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
  ANDROID_STATUS_BAR_HEIGHT,
  isIos,
  HAS_NOTCH,
} from '../../constants';
import MasterToolBar from '../MasterToolBar';
import ModalGalleryOptionAndroid from '../ModalGalleryOptionAndroid';
import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';

const SCROLL_OFFSET_TOP = 100;
const BTN_IMAGE_WIDTH = 35;
const ANIMATED_TYPE_COMPOSER_BTN = Easing.in;
const MAX_PIN = 9;
const defaultListener = () => {};
const ACTIONABLE_NUMERIC_PATTERN = /\d{6,}/g;

class TickidChat extends Component {
  static propTypes = {
    showAllUserName: PropTypes.bool,
    showMainUserName: PropTypes.bool,
    useModalGallery: PropTypes.bool,
    listHeaderComponent: PropTypes.node,
    listFooterComponent: PropTypes.node,
    renderEmpty: PropTypes.any,
    galleryVisible: PropTypes.bool,
    renderScrollComponent: PropTypes.any,
    onListScroll: PropTypes.func,
    onListLayout: PropTypes.func,
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
    listContainerStyle: ViewPropTypes.style,
    listContentContainerStyle: ViewPropTypes.style,
    durationShowGallery: PropTypes.number,
    bottomOffsetGallery: PropTypes.number,
    scrollOffsetTop: PropTypes.number,
    animatedTypeComposerBtn: PropTypes.any,
    uploadURL: PropTypes.string,
    messages: PropTypes.array,
    pinListVisible: PropTypes.bool,
    pinList: PropTypes.array,
    pinNotify: PropTypes.number,
    pinListNotify: PropTypes.object,
    giftedChatProps: PropTypes.any,
    defaultStatusBarColor: PropTypes.string,
    placeholder: PropTypes.string,
    extraData: PropTypes.any,

    renderDay: PropTypes.func,
    renderTime: PropTypes.func,
    renderBubble: PropTypes.func,
    renderMessageImage: PropTypes.func,
    renderMessage: PropTypes.func,
    renderActions: PropTypes.func,
    renderSend: PropTypes.func,

    listChatProps: PropTypes.object,
    renderMessageFullControl: PropTypes.bool,
    isMultipleImagePicker: PropTypes.bool,
    alwaysShowInput: PropTypes.bool,
    handlePickedImages: PropTypes.func,
    onKeyPress: PropTypes.func,
  };

  static defaultProps = {
    showAllUserName: false,
    showMainUserName: false,
    useModalGallery: !isIos,
    listFooterComponent: null,
    listHeaderComponent: null,
    renderEmpty: null,
    galleryVisible: true,
    onListScroll: defaultListener,
    onListLayout: defaultListener,
    renderScrollComponent: null,
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
    listContainerStyle: {},
    listContentContainerStyle: {},
    durationShowGallery: DURATION_SHOW_GALLERY,
    bottomOffsetGallery: BOTTOM_OFFSET_GALLERY,
    animatedTypeComposerBtn: ANIMATED_TYPE_COMPOSER_BTN,
    scrollOffsetTop: SCROLL_OFFSET_TOP,
    uploadURL: '',
    messages: [],
    pinList: [],
    pinNotify: 0,
    pinListNotify: {},
    extraData: null,
    placeholder: 'Nhập nội dung chat...',

    listChatProps: {},
    renderMessageFullControl: false,
    isMultipleImagePicker: true,
    alwaysShowInput: false,
  };

  state = {
    showToolBar: false,
    editable: false,
    showSendBtn: false,
    showBackBtn: false,
    selectedImages: [],
    uploadImages: [],
    text: '',
    androidGalleryModalOptionVisible: false,
    animatedBtnSendValue: new Animated.Value(0),
    animatedBtnBackValue: new Animated.Value(0),
    animatedNotification: new Animated.Value(0),
    animatedChatView: new Animated.Value(0),
    keyboardInformation: {
      height: this.props.bottomOffsetGallery,
      duration: this.props.durationShowGallery,
    },
    selectedType: COMPONENT_TYPE._NONE,
    chatViewMarginTop: 0,
    animatedChatViewHeight: '100%',
    animatedChatViewWithoutKeyboardHeight: '100%',
    animatedChatViewWithKeyboardHeight: '100%',
    isFullscreenGestureMode: false,
  };

  refMasterToolBar = React.createRef();
  refImageGallery = React.createRef();
  refGestureWrapper = React.createRef();
  refInput = React.createRef();
  unmounted = false;
  animatedShowUpValue = 0;
  pinListProps = {
    visible: this.props.pinListVisible,
    pinList: this.props.pinList,
    pinListNotify: this.props.pinListNotify,
    itemsPerRow: 4,
    onPinPress: this.props.onPinPress,
  };
  getLayoutDidMount = false;
  actionOptionForNumeric = [
    this.props.t('call'),
    this.props.t('sendSMS'),
    this.props.t('copy'),
    this.props.t('cancel'),
  ];
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.pinNotify !== this.props.pinNotify) {
      if (nextProps.pinNotify > 0) {
        this.state.animatedNotification.setValue(
          this.props.pinNotify === 0 ? 0 : 0.7,
        );
      }
      const isHidden = this.props.pinNotify > 0 && nextProps.pinNotify === 0;
      Animated.spring(this.state.animatedNotification, {
        toValue: isHidden ? 0 : 1,
        useNativeDriver: true,
        friction: 5,
        overshootClamping: isHidden,
      }).start();
    }

    if (nextState.showSendBtn !== this.state.showSendBtn) {
      Animated.spring(this.state.animatedBtnSendValue, {
        toValue: !nextState.showSendBtn ? 0 : BTN_IMAGE_WIDTH,
        duration: this.state.keyboardInformation.duration,
        useNativeDriver: true,
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
      nextProps.renderMessageFullControl !==
        this.props.renderMessageFullControl ||
      nextProps.isMultipleImagePicker !== this.props.isMultipleImagePicker ||
      nextProps.alwaysShowInput !== this.props.alwaysShowInput ||
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
      nextProps.extraData !== this.props.extraData ||
      nextProps.listContainerStyle !== this.props.listContainerStyle ||
      nextProps.listContentContainerStyle !==
        this.props.listContentContainerStyle
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
        COMPONENT_TYPE.GALLERY.id,
      );

      this.refGestureWrapper = refsImageGallery.refGesture;
      this.refImageGallery = refsImageGallery.refGallery;
    }
    //end merge

    this.keyboardListener = Keyboard.addListener('keyboardDidShow', (e) =>
      this.handleShowKeyboard(e),
    );
    Dimensions.addEventListener('change', this.dimensionsListener);

    if (this.refGestureWrapper.current) {
      this.refGestureWrapper.current.animatedShowUpValue.addListener(
        this.animatedShowUpListener,
      );
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.keyboardListener.remove();
    if (this.refGestureWrapper.current) {
      this.refGestureWrapper.current.animatedShowUpValue.removeListener(
        this.animatedShowUpListener,
      );
    }
    Dimensions.removeEventListener('change', this.dimensionsListener);
  }

  dimensionsListener = ({window, screen}) => {
    const animatedChatViewHeight = window.height - HEADER_HEIGHT;
    const extraBottom =
      screen.height -
      window.height -
      ANDROID_STATUS_BAR_HEIGHT -
      BOTTOM_SPACE_IPHONE_X;
    this.setState((prevState) => ({
      animatedChatViewHeight,
      keyboardInformation: {
        ...prevState.keyboardInformation,
        height: prevState.keyboardInformation.height + extraBottom,
      },
    }));
  };

  animatedShowUpListener = ({value}) => {
    if (
      value === this.state.keyboardInformation.height &&
      this.state.chatViewMarginTop !== this.state.keyboardInformation.height
    ) {
      this.setState({
        chatViewMarginTop: this.state.keyboardInformation.height,
      });
    }

    if (
      value < this.state.keyboardInformation.height &&
      this.state.chatViewMarginTop !== 0
    ) {
      this.setState({
        chatViewMarginTop: 0,
      });
    }

    this.animatedShowUpValue = value;
  };

  handleShowKeyboard = (e) => {
    let isUpdate = false;
    const state = {...this.state};

    if (
      e.endCoordinates.height &&
      e.endCoordinates.height !== this.state.keyboardInformation.height
    ) {
      state.keyboardInformation.height =
        e.endCoordinates.height - BOTTOM_SPACE_IPHONE_X;
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
      useNativeDriver: true,
    });
  }

  handleFocus = (selectedType = COMPONENT_TYPE._NONE) => {
    if (this.refInput.current) {
      this.refInput.current.focus();
    }

    setTimeout(() =>
      setStater(this, this.unmounted, {
        editable: true,
        showToolBar: true,
        selectedType,
      }),
    );
  };

  handleBlur = () => {
    if (this.refInput.current) {
      this.refInput.current.blur();
      this.setState({editable: false});
    }
  };

  handleBackPress = () => {
    this.clearSelectedPhotos();

    this.setState({
      showBackBtn: false,
      showSendBtn: false,
      selectedImages: [],
      uploadImages: [],
    });
  };

  openLibrary = () => {
    ImageCropPicker.openPicker({
      includeExif: true,
      multiple: this.props.isMultipleImagePicker,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then((images) => {
        console.log(images);
        this.closeModal();
        if (!Array.isArray(images)) {
          images = [images];
        }
        const selectedImages = this.normalizeImages(images);

        this.setState(
          {
            selectedImages,
          },
          () => {
            if (this.props.handlePickedImages) {
              this.props.handlePickedImages(selectedImages);
              return;
            }
            this.handleSendMessage();
          },
        );
      })
      .catch((err) => {
        console.log('open_picker_err', err);
        this.closeModal();
      });
  };

  openCamera = async () => {
    const options = {
      rotation: 360,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      if (response.error) {
        console.log(response);
        this.closeModal();
      } else if (response.didCancel) {
        console.log(response);
        this.closeModal();
      } else {
        // console.log(response);
        this.closeModal();
        response.path = response.uri;
        const selectedImages = this.normalizeImages([response]);
        console.log(selectedImages);
        this.setState(
          {
            selectedImages,
          },
          () => {
            if (this.props.handlePickedImages) {
              this.props.handlePickedImages(selectedImages);
              return;
            }
            this.handleSendMessage();
          },
        );
      }
    });
  };

  closeModal = () => {
    this.setState({androidGalleryModalOptionVisible: false});
  };

  handlePressGallery = (state = this.state) => {
    if (isIos) {
      if (state.selectedImages.length !== 0) {
        this.animateBtnBack(1).start();
        state.showBackBtn = true;
        state.showSendBtn = true;
      }
    }
  };

  normalizeImages(images) {
    return images.map((img, index) => {
      img.index = index;
      if (!img.filename) {
        img.filename = `${new Date().getTime()}`;
      }
      if (!img.fileName) {
        img.fileName = `${new Date().getTime()}`;
      }
      if (img.data) {
        img.uploadPath = img.data;
        img.isBase64 = true;
      }
      return img;
    });
  }

  handlePressPin = (state = this.state) => {
    if (state.showBackBtn) {
      this.animateBtnBack(0).start();
    }
  };

  handlePressComposerButton = (componentType, forceFocus) => {
    const state = {...this.state};

    switch (componentType.id) {
      case COMPONENT_TYPE.EMOJI.id:
        if (!state.editable || !!forceFocus) {
          state.editable = true;
          this.handleFocus(componentType);
        } else {
          state.editable = false;
          this.handleBlur();
        }
        break;
      case COMPONENT_TYPE.GALLERY.id:
        Keyboard.dismiss();
        this.handlePressGallery(state);
        state.editable = false;
        if (this.props.useModalGallery) {
          state.selectedType = COMPONENT_TYPE._NONE;
          state.showToolBar = false;
          state.androidGalleryModalOptionVisible = true;
          this.setState(state);
          return;
        }
        break;
      case COMPONENT_TYPE.PIN.id:
        state.editable = false;
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

  onTyping = (text) => {
    this.setState({
      showSendBtn: text !== '',
      text,
    });
  };

  handleToggleImage = (selectedImages) => {
    let state = {...this.state};

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
    state.editable = !!selectedImages.length;
    state.selectedImages = selectedImages;
    this.setState(state);
  };

  handleSendImage = (images) => {
    const state = {...this.state};
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
        showSendBtn: false,
        editable: !!this.state.showToolBar,
      });
    }
  }

  handleMixSend() {
    const state = {...this.state};
    if (!!state.text) {
      state.text = '';
      state.editable = !!state.showToolBar;
    }
    if (!!state.selectedImages?.length) {
      state.selectedImages = [];
    }

    // state.uploadImages = images;
    state.showBackBtn = false;
    state.showSendBtn = false;
    this.setState(state);
  }

  handleSendMessage = () => {
    if (
      this.props.mixSend &&
      !!this.state.text &&
      !!this.state.selectedImages.length
    ) {
      this.props.mixSend({
        text: this.state.text,
        images: this.state.selectedImages,
      });
      this.handleMixSend();
    } else if (
      (this.state.editable || !!this.state.text) &&
      this.state.selectedImages.length === 0
    ) {
      this.handleSendText();
    } else if (this.state.selectedImages.length !== 0) {
      this.handleSendImage();
    }
  };

  handleExpandedGallery = () => {
    this.props.expandedGallery();
  };

  handleCollapsingGallery = () => {
    this.setState({
      editable: !!this.state.text || !!this.state.selectedImages?.length,
    });
    this.props.collapsingGallery();
  };

  handleCollapsedGallery = () => {
    this.setState({selectedType: COMPONENT_TYPE._NONE});
  };

  onListViewPress = (e) => {
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
        selectedType: COMPONENT_TYPE._NONE,
      },
      () => {
        setTimeout(() => this.handleBlur(), 100);
      },
    );
  }

  handleContainerLayout = (e) => {
    if (!this.getLayoutDidMount) {
      this.setState({
        animatedChatViewHeight:
          e.nativeEvent.layout.height - BOTTOM_SPACE_IPHONE_X,
      });
      this.getLayoutDidMount = true;
    }

    if (HAS_NOTCH && this.refInput.current) {
      if (this.refInput.current.isFocused()) {
        if (
          this.state.animatedChatViewWithKeyboardHeight !==
          e.nativeEvent.layout.height
        ) {
          this.setState({
            animatedChatViewHeight:
              e.nativeEvent.layout.height +
              this.state.keyboardInformation.height +
              (this.state.isFullscreenGestureMode
                ? ANDROID_EXTRA_DIMENSIONS_HEIGHT
                : ANDROID_STATUS_BAR_HEIGHT),
            animatedChatViewWithKeyboardHeight: e.nativeEvent.layout.height,
          });
        }
      } else {
        if (
          this.state.animatedChatViewWithoutKeyboardHeight !==
          e.nativeEvent.layout.height
        ) {
          this.setState({
            animatedChatViewHeight: e.nativeEvent.layout.height,
            animatedChatViewWithoutKeyboardHeight: e.nativeEvent.layout.height,
          });
        }
      }
    }
  };

  handleInputToolbarLayout = (e) => {
    const bottomIndex = e.nativeEvent.layout.y + e.nativeEvent.layout.height;

    if (Math.abs(bottomIndex - WINDOW_HEIGHT) < 10 && HAS_NOTCH) {
      // full screen gesture on android notch device
      this.setState({isFullscreenGestureMode: true});
    } else {
      this.setState({isFullscreenGestureMode: false});
    }
  };

  handleParsePatterns = (linkStyle) => [
    {
      pattern: ACTIONABLE_NUMERIC_PATTERN,
      style: linkStyle,
      onPress: this.handlePressNumber,
    },
  ];

  handlePressNumber = (number) => {
    Actions.push(appConfig.routes.modalActionSheet, {
      title: number,
      options: this.actionOptionForNumeric,
      onPress: (index) => this.handlePressChatNumberActionOption(number, index),
    });
  };

  handlePressChatNumberActionOption = (number, index) => {
    switch (index) {
      case 0:
        Communications.phonecall(number, true);
        break;
      case 1:
        Communications.text(number);
        break;
      case 2:
        Clipboard.setString(number);
        Toast.show('Đã sao chép thành công')
        break;
      default:
        break;
    }
  };

  renderLeftComposer = (props) => {
    if (typeof this.props.renderActions === 'function') {
      return this.props.renderActions(props);
    }

    const showBackCondition =
      this.state.showSendBtn &&
      this.state.selectedImages.length !== 0 &&
      !this.state.text;

    const backAnimated =
      this.state.selectedImages.length !== 0 &&
      this.state.selectedType?.id === COMPONENT_TYPE.GALLERY.id
        ? {
            opacity: this.state.animatedBtnSendValue.interpolate({
              inputRange: [0, BTN_IMAGE_WIDTH],
              outputRange: [0, 1],
            }),
            transform: [
              {
                scale: this.state.animatedBtnSendValue.interpolate({
                  inputRange: [0, BTN_IMAGE_WIDTH],
                  outputRange: [0, 1],
                }),
              },
            ],
          }
        : {
            opacity: 0,
          };

    const otherAnimated = showBackCondition && {
      opacity: this.state.animatedBtnSendValue.interpolate({
        inputRange: [0, BTN_IMAGE_WIDTH],
        outputRange: [1, 0],
      }),
      transform: [
        {
          scale: this.state.animatedBtnSendValue.interpolate({
            inputRange: [0, BTN_IMAGE_WIDTH],
            outputRange: [1, 2],
          }),
        },
      ],
    };

    return (
      <View style={styles.center}>
        <Animated.View
          pointerEvents={showBackCondition ? 'auto' : 'none'}
          style={[
            styles.center,
            styles.sendBtn,
            backAnimated,
            {
              left: -10,
            },
          ]}>
          <TouchableOpacity hitSlop={HIT_SLOP} onPress={this.handleBackPress}>
            <IconFontAwesome name="angle-left" color="#404040" size={28} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          pointerEvents={!showBackCondition ? 'auto' : 'none'}
          style={[
            styles.center,
            styles.sendBtn,
            otherAnimated,
            {
              position: 'absolute',
              flexDirection: 'row',
            },
            {},
          ]}>
          <TouchableOpacity
            hitSlop={HIT_SLOP}
            onPress={() =>
              this.handlePressComposerButton(COMPONENT_TYPE.EMOJI)
            }>
            <IconAntDesign
              size={22}
              name="message1"
              color={
                this.state.selectedType === COMPONENT_TYPE.EMOJI
                  ? config.focusColor
                  : config.blurColor
              }
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  renderComposer = (props) => {
    return (
      <CustomComposer
        showInput={
          this.props.alwaysShowInput ||
          this.state.selectedImages.length === 0 ||
          !this.state.showBackBtn
        }
        onFocusInput={() =>
          this.handlePressComposerButton(COMPONENT_TYPE.EMOJI, true)
        }
        refInput={this.refInput}
        animatedBtnBackValue={this.state.animatedBtnBackValue}
        onBackPress={this.handleBackPress}
        btnWidth={BTN_IMAGE_WIDTH}
        {...props}
        editable={this.state.editable}
        onTyping={this.onTyping}
        placeholder={this.props.placeholder}
        value={this.state.text}
        onKeyPress={this.props.onKeyPress}
      />
    );
  };

  renderInputToolbar = (props) => {
    if (typeof this.props.renderInputToolbar === 'function') {
      return this.props.renderInputToolbar(props);
    }
    return (
      <InputToolbar {...props} />
      // <View
      //   onLayout={this.handleInputToolbarLayout}
      //   style={styles.inputToolbar}>
      //   {this.renderLeftComposer()}
      //   {this.renderComposer()}
      //   {this.renderSend()}
      // </View>
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

  renderSend = (props) => {
    if (typeof this.props.renderSend === 'function') {
      return this.props.renderSend(props);
    }

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
                  outputRange: [0, 1],
                }),
                transform: [
                  {
                    scale: this.state.animatedBtnSendValue.interpolate({
                      inputRange: [0, BTN_IMAGE_WIDTH],
                      outputRange: [0, 1],
                    }),
                  },
                ],
              },
            ]}>
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
            flexDirection: 'row',
          }}>
          {this.props.pinListVisible && (
            <Animated.View
              style={[
                styles.center,
                styles.sendBtn,
                {
                  opacity: this.state.animatedBtnSendValue.interpolate({
                    inputRange: [0, BTN_IMAGE_WIDTH],
                    outputRange: [1, 0],
                  }),
                  transform: [
                    {
                      scale: this.state.animatedBtnSendValue.interpolate({
                        inputRange: [0, BTN_IMAGE_WIDTH],
                        outputRange: [1, 2],
                      }),
                    },
                  ],
                },
              ]}>
              <TouchableOpacity
                onPress={() =>
                  this.handlePressComposerButton(COMPONENT_TYPE.PIN)
                }
                hitSlop={HIT_SLOP}
                style={[styles.fullCenter, {flex: 1}]}>
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
                        outputRange: [0, 1, 1],
                      }),
                      transform: [{scale: this.state.animatedNotification}],
                    },
                  ]}>
                  <Text style={styles.badgeText}>
                    {this.props.pinNotify > MAX_PIN
                      ? `${MAX_PIN}+`
                      : this.props.pinNotify}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          )}

          {(this.props.galleryVisible || this.props.useModalGallery) && (
            <Animated.View
              style={[
                styles.center,
                styles.sendBtn,
                {
                  opacity: this.state.animatedBtnSendValue.interpolate({
                    inputRange: [0, BTN_IMAGE_WIDTH],
                    outputRange: [1, 0],
                  }),
                  transform: [
                    {
                      scale: this.state.animatedBtnSendValue.interpolate({
                        inputRange: [0, BTN_IMAGE_WIDTH],
                        outputRange: [1, 2],
                      }),
                    },
                  ],
                },
              ]}>
              <TouchableOpacity
                hitSlop={HIT_SLOP}
                onPress={() =>
                  this.handlePressComposerButton(COMPONENT_TYPE.GALLERY)
                }
                style={[styles.fullCenter]}>
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
          )}
        </View>
      </View>
    );
  };

  renderMessageImage = (props) => {
    if (typeof this.props.renderMessageImage === 'function') {
      return this.props.renderMessageImage(props);
    }

    return (
      <ImageMessageChat
        containerStyle={{borderWidth: 1, borderColor: '#d9d9d9'}}
        uploadURL={this.props.uploadURL}
        isUploadData={props.currentMessage.isUploadData}
        image={props.currentMessage.rawImage}
        lowQualityUri={props.currentMessage.image}
        onUploadedSuccess={(response, isReUp) => {
          if (!isReUp) {
            this.props.onUploadedImage(response);
          }
        }}
        onUploadedFail={(err) => {
          console.log(err);
        }}
      />
    );
  };

  renderMessage = (props) => {
    let style = {};
    if (
      this.props.messages.length !== 0 &&
      props.currentMessage._id === this.props.messages[0]._id
    ) {
      style = styles.messageStyle;
    }

    if (
      this.props.renderMessageFullControl &&
      typeof this.props.renderMessage === 'function'
    ) {
      return this.props.renderMessage(props);
    }

    return (
      <TouchableWithoutFeedback onPress={this.onListViewPress.bind(this)}>
        <View style={style}>
          {typeof this.props.renderMessage === 'function' ? (
            this.props.renderMessage(props)
          ) : (
            <Message {...props} />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderBubble = (props) => {
    if (typeof this.props.renderBubble === 'function') {
      return this.props.renderBubble(props);
    }

    const isImage = !!props.currentMessage.image;
    const bgColor_left = isImage ? 'transparent' : '#e5e5ea';
    const bgColor_right = isImage ? 'transparent' : '#198bfe';
    let bottomContainerStyle = {};
    if (this.props.showAllUserName) {
      bottomContainerStyle = {
        left: {
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        },
        right: {
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        },
      };
    }
    if (this.props.showMainUserName) {
      bottomContainerStyle = {
        right: {
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        },
      };
    }

    return (
      <Bubble
        {...props}
        bottomContainerStyle={bottomContainerStyle}
        wrapperStyle={{
          left: {backgroundColor: bgColor_left},
          right: {backgroundColor: bgColor_right},
        }}
      />
    );
  };

  renderTime = (props) => {
    if (typeof this.props.renderTime === 'function') {
      return this.props.renderTime(props);
    }

    const isImage = !!props.currentMessage.image;
    const color_left = '#aaa';
    const color_right = isImage ? '#aaa' : '#fff';

    return (
      <>
        {this.props.giftedChatProps &&
          (this.props.showAllUserName ||
            (this.props.showMainUserName &&
              props.currentMessage.user._id ===
                this.props.giftedChatProps.user._id)) && (
            <View style={styles.userNameContainer}>
              <Text
                style={[
                  styles.userName,
                  {
                    color: props.position === 'left' ? color_left : color_right,
                  },
                ]}>
                {props.currentMessage.user.name}
              </Text>
            </View>
          )}

        <Time
          {...props}
          timeTextStyle={{
            left: {
              color: color_left,
            },
            right: {
              color: color_right,
            },
          }}
        />
      </>
    );
  };

  renderScrollBottomComponent = () => {
    return <IconAntDesign name="arrowdown" color="#404040" size={20} />;
  };

  renderDay = (props) => {
    if (typeof this.props.renderDay === 'function') {
      return this.props.renderDay(props);
    }

    return (
      <View style={styles.dayStyle}>
        <Day {...props} />
      </View>
    );
  };

  renderAvatar = (props) => {
    if (typeof this.props.renderAvatar === 'function') {
      return this.props.renderAvatar(props);
    }

    return <Avatar {...props} />;
  };

  render() {
    console.log('@_@ renderTickidChat');
    const extraChatViewStyle = {
      marginTop: isIos ? this.state.chatViewMarginTop : 0,
    };
    const extraHeight = HAS_NOTCH
      ? this.state.isFullscreenGestureMode
        ? ANDROID_EXTRA_DIMENSIONS_HEIGHT
        : ANDROID_STATUS_BAR_HEIGHT
      : 0;

    return (
      <SafeAreaView style={[styles.container, this.props.containerStyle]}>
        <ModalGalleryOptionAndroid
          visible={this.state.androidGalleryModalOptionVisible}
          onClose={this.closeModal}
          onRequestClose={this.closeModal}
          onPressCamera={this.openCamera}
          onPressLibrary={this.openLibrary}
        />
        {!!this.props.messages &&
          this.props.messages.length === 0 &&
          (this.props.renderEmpty || (
            <EmptyChat
              iconName="comments"
              message="Bắt đầu cuộc trò chuyện thôi!"
              onPress={this.onListViewPress}
            />
          ))}
        <View style={{flex: 1}} onLayout={this.handleContainerLayout}>
          <TouchableWithoutFeedback
            style={styles.touchWrapper}
            onPress={this.onListViewPress}>
            <Animated.View
              style={[
                styles.flex,
                isIos && styles.animatedChatView,
                isIos && {
                  height: this.state.animatedChatViewHeight,
                  transform: [
                    {
                      translateY: this.refGestureWrapper.current
                        ? this.refGestureWrapper.current.animatedShowUpValue.interpolate(
                            {
                              inputRange: [
                                0,
                                this.state.keyboardInformation.height,
                              ],
                              outputRange: [
                                0,
                                -this.state.keyboardInformation.height -
                                  (HAS_NOTCH
                                    ? this.state.isFullscreenGestureMode
                                      ? ANDROID_EXTRA_DIMENSIONS_HEIGHT
                                      : ANDROID_STATUS_BAR_HEIGHT
                                    : 0),
                              ],
                            },
                          )
                        : 0,
                    },
                  ],
                },
              ]}>
              <GiftedChat
                renderAvatar={this.renderAvatar}
                renderDay={this.renderDay}
                renderMessage={this.renderMessage}
                renderMessageImage={this.renderMessageImage}
                renderActions={this.renderLeftComposer}
                renderComposer={this.renderComposer}
                renderSend={this.renderSend}
                renderInputToolbar={this.renderInputToolbar}
                renderBubble={this.renderBubble}
                renderTime={this.renderTime}
                // renderChatFooter={this.renderFooter.bind(this)}
                keyboardShouldPersistTaps={'always'}
                messages={this.props.messages}
                // onSend={this.handleSendMessage}
                // alwaysShowSend={true}
                isKeyboardInternallyHandled={!isIos}
                listViewProps={{
                  contentContainerStyle: [
                    styles.giftedChatContainer,
                    this.props.listContentContainerStyle,
                  ],
                  style: [
                    styles.flex,
                    this.props.listContainerStyle,
                    extraChatViewStyle,
                  ],
                  ListHeaderComponent: this.props.listHeaderComponent,
                  // ListFooterComponent: this.props.listFooterComponent,
                  ListFooterComponent: () => (
                    <>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.onListViewPress}
                        style={styles.maskList}></TouchableOpacity>
                      {this.props.listFooterComponent}
                    </>
                  ),
                  renderScrollComponent: this.props.renderScrollComponent,
                  // onScroll: this.props.onListScroll,
                  onLayout: this.props.onListLayout,
                  ref: this.props.refListMessages,
                  onScrollToIndexFailed: (e) => console.log(e),
                  ...this.props.listChatProps,
                }}
                scrollToBottom
                scrollToBottomComponent={this.renderScrollBottomComponent}
                parsePatterns={this.handleParsePatterns}
                {...this.props.giftedChatProps}
              />
            </Animated.View>
          </TouchableWithoutFeedback>

          <MasterToolBar
            ref={this.refMasterToolBar}
            selectedType={this.state.selectedType}
            defaultStatusBarColor={this.props.defaultStatusBarColor}
            galleryProps={{
              visible: this.props.galleryVisible,
              setHeader: this.props.setHeader,
              onExpandedBodyContent: this.handleExpandedGallery,
              onCollapsedBodyContent: this.handleCollapsedGallery,
              onCollapsingBodyContent: this.handleCollapsingGallery,
              onToggleImage: this.handleToggleImage,
              onSendImage: this.handleSendImage,
            }}
            pinListProps={this.pinListProps}
            visible={isIos ? this.state.showToolBar : false}
            baseViewHeight={this.state.keyboardInformation.height}
            extraHeight={extraHeight}
            durationShowGallery={this.state.keyboardInformation.duration}
            extraData={this.props.extraData}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  animatedChatView: {
    position: 'absolute',
    flex: 1,
    width: WIDTH,
    left: 0,
    right: 0,
  },
  sendWrapper: {
    height: 44,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 5,
  },
  sendBtn: {
    height: 44,
    width: BTN_IMAGE_WIDTH,
    marginLeft: 10,
  },
  dayStyle: {
    marginTop: 10,
  },
  messageStyle: {
    marginBottom: 10,
  },
  footerStyle: {
    width: WIDTH,
    height: 100,
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0)',
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
    zIndex: 99,
  },
  giftedChatContainer: {
    paddingBottom: 15,
    flexGrow: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  flex: {
    flex: 1,
  },
  touchWrapper: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT,
  },
  fullCenter: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChatContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: '50%',
    height: WINDOW_HEIGHT,
    position: 'absolute',
    zIndex: 0,
  },
  emptyChatText: {
    color: '#909090',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 20,
    fontWeight: '500',
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
    overflow: 'hidden',
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  userNameContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  userName: {
    fontSize: 12,
    textAlign: 'left',
  },
  maskList: {
    flex: 1,
    bottom: 0,
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT,
  },
});

export default withTranslation('common')(TickidChat);

export const EmptyChat = ({
  onPress,
  style,
  message,
  icon,
  iconName = 'comments',
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={[styles.emptyChatContainer, style]}>
      {icon || <IconFontisto name={iconName} color={'#909090'} size={60} />}
      <Text style={styles.emptyChatText}>{message}</Text>
    </View>
  </TouchableWithoutFeedback>
);
