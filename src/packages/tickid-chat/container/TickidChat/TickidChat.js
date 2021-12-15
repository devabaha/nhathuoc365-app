import React, {Component} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewPropTypes,
  Animated,
  Easing,
  Keyboard,
  Dimensions,
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {
  GiftedChat,
  Message,
  Day,
  Bubble,
  Time,
  Avatar,
  InputToolbar,
  MessageText,
} from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import Communications from 'react-native-communications';
import Clipboard from '@react-native-community/clipboard';
// configs
import appConfig from 'app-config';
// helpers
import {getColorTheme, setStater} from '../../helper';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {
  WIDTH,
  HEIGHT,
  HIT_SLOP,
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
  MAX_PIN,
} from '../../constants';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import MasterToolBar from '../MasterToolBar';
import ModalGalleryOptionAndroid from '../ModalGalleryOptionAndroid';
import {
  BaseButton,
  Container,
  Icon,
  IconButton,
  Typography,
} from 'src/components/base';
import EmptyChat from 'app-packages/tickid-chat/component/EmptyChat';
import {ImageMessageChat, CustomComposer} from '../../component';

export const PATTERNS = {
  /**
   * Segments/Features:
   *  - http/https support https?
   *  - auto-detecting loose domains if preceded by `www.`
   *  - Localized & Long top-level domains \.(xn--)?[a-z0-9-]{2,20}\b
   *  - Allowed query parameters & values, it's two blocks of matchers
   *    ([-a-zA-Z0-9@:%_\+,.~#?&\/=]*[-a-zA-Z0-9@:%_\+~#?&\/=])*
   *    - First block is [-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]* -- this matches parameter names & values (including commas, dots, opening & closing brackets)
   *    - The first block must be followed by a closing block [-a-zA-Z0-9@:%_\+\]~#?&\/=] -- this doesn't match commas, dots, and opening brackets
   */
  URL: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/i,
  PHONE: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}/,
  EMAIL: /\S+@\S+\.\S+/,
  NUMBER: /\d{6,}/g,
  WWW_URL: /^www\./i,
};
const SCROLL_OFFSET_TOP = 100;
const BTN_IMAGE_WIDTH = 35;
const ANIMATED_TYPE_COMPOSER_BTN = Easing.in;
const defaultListener = () => {};

class TickidChat extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    showAllUserName: PropTypes.bool,
    showMainUserName: PropTypes.bool,
    useModalGallery: PropTypes.bool,
    blurWhenPressOutside: PropTypes.bool,
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
    onListViewPress: PropTypes.func,
  };

  static defaultProps = {
    showAllUserName: false,
    showMainUserName: false,
    useModalGallery: !isIos,
    blurWhenPressOutside: true,
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
    onListViewPress: defaultListener,
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

  refGiftedChat = React.createRef();
  refMasterToolBar = React.createRef();
  refImageGallery = React.createRef();
  refGestureWrapper = React.createRef();
  refListMessages = React.createRef();
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
  actionOptionForLongPressMessage = [
    this.props.t('copy'),
    this.props.t('cancel'),
  ];

  get theme() {
    return getTheme(this);
  }

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
      nextProps.blurWhenPressOutside !== this.props.blurWhenPressOutside ||
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
    this.props.refGiftedChat(GiftedChat, this.refGiftedChat.current);
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
      this.props.blurWhenPressOutside &&
      (this.state.selectedType !== COMPONENT_TYPE._NONE || this.state.editable)
    ) {
      this.props.onListViewPress();
      this.collapseComposer();
    }
  };

  collapseComposer = () => {
    this.setState({
      editable: !!this.state.text,
      showBackBtn: false,
      showSendBtn: !!this.state.text,
      showToolBar: false,
      selectedType: COMPONENT_TYPE._NONE,
    });
    this.handleBlur();
  };

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
      pattern: PATTERNS.URL,
      style: linkStyle,
      onPress: this.handlePressURL,
    },
    {
      pattern: PATTERNS.NUMBER,
      style: linkStyle,
      onPress: this.handlePressNumber,
    },
  ];

  handlePressNumber = (number) => {
    this.handlePressComposerButton(this.state.selectedType);
    push(appConfig.routes.modalActionSheet, {
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
        setTimeout(() => Toast.show(this.props.t('copied')));
        break;
      default:
        break;
    }
  };

  handlePressURL = (url) => {
    if (PATTERNS.WWW_URL.test(url)) {
      this.handlePressURL(`http://${url}`);
    } else {
      Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
          console.error('No handler for URL:', url);
        } else {
          // Linking.openURL(url);
          push(appConfig.routes.modalWebview, {
            url: url,
            title: url,
          });
        }
      });
    }
  };

  handleBubbleLongPress = (context, message) => {
    if (typeof this.props.onBubbleLongPress === 'function') {
      this.props.onBubbleLongPress(context, message);
      return;
    }
    if (message.text) {
      this.handlePressComposerButton(this.state.selectedType);
      push(appConfig.routes.modalActionSheet, {
        options: this.actionOptionForLongPressMessage,
        onPress: (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(message.text);
              setTimeout(() => Toast.show(this.props.t('copied')));
              break;
          }
        },
      });
    }
  };

  handleScrollToBottom = () => {
    if (this.refListMessages.current) {
      this.refListMessages.current.scrollToOffset({
        offset: 0,
        animated: true,
      });
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
      <Container style={styles.center}>
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
          <IconButton
            hitSlop={HIT_SLOP}
            bundle={BundleIconSetName.FONT_AWESOME}
            name="angle-left"
            iconStyle={{fontSize: 28}}
            onPress={this.handleBackPress}
          />
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
          <IconButton
            hitSlop={HIT_SLOP}
            bundle={BundleIconSetName.ANT_DESIGN}
            name="message1"
            iconStyle={{
              fontSize: 22,
              color:
                this.state.selectedType === COMPONENT_TYPE.EMOJI
                  ? getColorTheme(this.theme).focusColor
                  : getColorTheme(this.theme).blurColor,
            }}
            onPress={() => this.handlePressComposerButton(COMPONENT_TYPE.EMOJI)}
          />
        </Animated.View>
      </Container>
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
        autoFocus={this.props.autoFocus}
        refInput={this.refInput}
        animatedBtnBackValue={this.state.animatedBtnBackValue}
        onBackPress={this.handleBackPress}
        btnWidth={BTN_IMAGE_WIDTH}
        onBlurInput={() => {
          if (this.state.selectedType === COMPONENT_TYPE.EMOJI) {
            this.collapseComposer();
          }
        }}
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
    return <InputToolbar {...props} />;
  };

  renderSend = (props) => {
    if (typeof this.props.renderSend === 'function') {
      return this.props.renderSend(props);
    }
    return (
      <Container style={styles.sendWrapper}>
        <BaseButton hitSlop={HIT_SLOP} onPress={this.handleSendMessage}>
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
            <Icon
              bundle={BundleIconSetName.FONT_AWESOME}
              name="paper-plane"
              style={[styles.iconSend, this.iconSendStyle]}
            />
          </Animated.View>
        </BaseButton>

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
              <BaseButton
                onPress={() =>
                  this.handlePressComposerButton(COMPONENT_TYPE.PIN)
                }
                hitSlop={HIT_SLOP}
                style={[styles.fullCenter, {flex: 1}]}>
                <Icon
                  bundle={BundleIconSetName.ANT_DESIGN}
                  name="paperclip"
                  style={[styles.iconPin, this.iconPinStyle]}
                />
                <Animated.View
                  style={[
                    styles.badge,
                    this.badgeStyle,
                    {
                      opacity: this.state.animatedNotification.interpolate({
                        inputRange: [0, 0.1, 1],
                        outputRange: [0, 1, 1],
                      }),
                      transform: [{scale: this.state.animatedNotification}],
                    },
                  ]}>
                  <Typography
                    type={TypographyType.LABEL_TINY}
                    style={[styles.badgeText, this.badgeTextStyle]}>
                    {this.props.pinNotify > MAX_PIN
                      ? `${MAX_PIN}+`
                      : this.props.pinNotify}
                  </Typography>
                </Animated.View>
              </BaseButton>
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
              <IconButton
                hitSlop={HIT_SLOP}
                bundle={BundleIconSetName.ANT_DESIGN}
                name="picture"
                style={[styles.fullCenter]}
                iconStyle={[styles.iconGallery, this.iconGalleryStyle]}
                onPress={() =>
                  this.handlePressComposerButton(COMPONENT_TYPE.GALLERY)
                }
              />
            </Animated.View>
          )}
        </View>
      </Container>
    );
  };

  renderMessageImage = (props) => {
    if (typeof this.props.renderMessageImage === 'function') {
      return this.props.renderMessageImage(props);
    }

    return (
      <ImageMessageChat
        containerStyle={this.imageMessageChatContainerStyle}
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

  renderMessageText = (props) => {
    props.textStyle = {
      left: this.theme.typography[TypographyType.LABEL_LARGE],
      right: {
        ...this.theme.typography[TypographyType.LABEL_LARGE],
        color: this.theme.color.white,
      },
    };
    return <MessageText {...props} />;
  };

  renderBubble = (props) => {
    if (typeof this.props.renderBubble === 'function') {
      return this.props.renderBubble(props);
    }

    const isImage = !!props.currentMessage.image;
    const bgColor_left = isImage
      ? 'transparent'
      : this.theme.color.backgroundBubbleLeft;
    const bgColor_right = isImage
      ? 'transparent'
      : this.theme.color.backgroundBubbleRight;
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
    const color_left = this.theme.color.textSecondary;
    const color_right = isImage
      ? this.theme.color.textSecondary
      : this.theme.color.white;

    return (
      <>
        {this.props.giftedChatProps &&
          (this.props.showAllUserName ||
            (this.props.showMainUserName &&
              props.currentMessage.user._id ===
                this.props.giftedChatProps.user._id)) && (
            <View style={styles.userNameContainer}>
              <Typography
                type={TypographyType.LABEL_SMALL}
                style={[
                  styles.userName,
                  {
                    color: props.position === 'left' ? color_left : color_right,
                  },
                ]}>
                {props.currentMessage.user.name}
              </Typography>
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
    return (
      <IconButton
        bundle={BundleIconSetName.ANT_DESIGN}
        name="arrowdown"
        iconStyle={[styles.iconScrollBottom, this.iconScrollBottomStyle]}
        hitSlop={HIT_SLOP}
        onPress={this.handleScrollToBottom}
      />
    );
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

  get badgeStyle() {
    return {backgroundColor: this.theme.color.danger};
  }

  get badgeTextStyle() {
    return {color: this.theme.color.white};
  }

  get iconGalleryStyle() {
    return {
      color:
        this.state.selectedType === COMPONENT_TYPE.GALLERY
          ? getColorTheme(this.theme).focusColor
          : getColorTheme(this.theme).blurColor,
    };
  }

  get iconPinStyle() {
    return {
      color:
        this.state.selectedType === COMPONENT_TYPE.PIN
          ? getColorTheme(this.theme).focusColor
          : getColorTheme(this.theme).blurColor,
    };
  }

  get iconSendStyle() {
    return {
      color: getColorTheme(this.theme).focusColor,
    };
  }

  get imageMessageChatContainerStyle() {
    return {
      borderWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.border,
    };
  }

  get iconScrollBottomStyle() {
    return {
      color: this.theme.color.iconInactive,
    };
  }

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
      <Container flex style={[styles.container]}>
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
              message={this.props.t('chat:makeConversation')}
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
                ref={this.refGiftedChat}
                renderAvatar={this.renderAvatar}
                renderDay={this.renderDay}
                renderMessage={this.renderMessage}
                renderMessageText={this.renderMessageText}
                renderMessageImage={this.renderMessageImage}
                renderActions={this.renderLeftComposer}
                renderComposer={this.renderComposer}
                renderSend={this.renderSend}
                renderInputToolbar={this.renderInputToolbar}
                renderBubble={this.renderBubble}
                renderTime={this.renderTime}
                renderAccessory={this.props.renderAccessory}
                // renderChatFooter={this.renderFooter.bind(this)}
                keyboardShouldPersistTaps={'always'}
                messages={this.props.messages}
                // onSend={this.handleSendMessage}
                // alwaysShowSend={true}
                isKeyboardInternallyHandled={!isIos}
                onLongPress={this.handleBubbleLongPress}
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
                      <BaseButton
                        activeOpacity={1}
                        onPress={this.onListViewPress}
                        style={styles.maskList}
                      />
                      {this.props.listFooterComponent}
                    </>
                  ),
                  renderScrollComponent: this.props.renderScrollComponent,
                  // onScroll: this.props.onListScroll,
                  onLayout: this.props.onListLayout,
                  ref: (inst) => {
                    this.refListMessages.current = inst;
                    this.props.refListMessages(inst);
                  },
                  onScrollToIndexFailed: (e) => console.log(e),
                  ...this.props.listChatProps,
                }}
                scrollToBottom
                scrollToBottomComponent={this.renderScrollBottomComponent}
                scrollToBottomStyle={{right: 15}}
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
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
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
  },
  sendBtn: {
    height: 44,
    width: BTN_IMAGE_WIDTH,
    marginLeft: 10,
    marginRight: 5,
  },
  dayStyle: {
    marginTop: 10,
  },
  messageStyle: {
    marginBottom: 10,
  },
  giftedChatContainer: {
    paddingBottom: 15,
    flexGrow: 1,
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

  badge: {
    position: 'absolute',
    width: 22,
    height: 22,
    top: -10,
    right: -8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: 11,
    overflow: 'hidden',
  },
  badgeText: {
    fontWeight: 'bold',
  },
  userNameContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  userName: {
    textAlign: 'left',
  },
  maskList: {
    flex: 1,
    bottom: 0,
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT,
  },

  iconSend: {
    fontSize: 20,
  },
  iconPin: {
    fontSize: 23,
  },
  iconGallery: {
    fontSize: 25,
  },
  iconScrollBottom: {
    fontSize: 20,
  },
});

export default withTranslation(['common', 'chat'], {withRef: true})(TickidChat);
