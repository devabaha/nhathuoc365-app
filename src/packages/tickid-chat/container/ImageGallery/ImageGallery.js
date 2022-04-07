import React, {Component} from 'react';
import {
  StyleSheet,
  Easing,
  Animated,
  ViewPropTypes,
  AppState,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-picker';
// helpers
import {setStater, willUpdateState} from '../../helper';
import {getTheme} from 'src/Themes/Theme.context';
// constants
import {
  HEIGHT,
  HEADER_HEIGHT,
  isAndroid,
  isIos,
  DURATION_SHOW_GALLERY,
  BOTTOM_OFFSET_GALLERY,
  ANDROID_STATUS_BAR_HEIGHT,
} from '../../constants';
// custom components
import {FlatList} from 'src/components/base';
import {
  IconCameraPicker,
  IconCameraOff,
  IconSendImage,
  IconSelectedAlbum,
  IconToggleAlbum,
  IconCloseAlbum,
} from './CenterIcon';
import Loading from 'src/components/Loading';
import LoadMore from './LoadMore';
import HeaderContent from './HeaderContent';
import HeaderLayout from './HeaderLayout';
import SendImage from './SendImage';
import PermissionLibraryNotGranted from './PermissionLibraryNotGranted';
import ImageItemContainer from './ImageItemContainer';

const PERMISSIONS_TYPE = {
  CAMERA: 'camera-permission',
  LIBRARY: 'library-permission',
};
const CAMERA_PERMISSIONS_TYPE = {
  CHECK: 'check-camera-permission',
  REQUEST: 'request-camera-permission',
};
const LIBRARY_PERMISSIONS_TYPE = {
  CHECK: 'check-library-permission',
  REQUEST: 'request-library-permission',
};

//-----
const ITEMS_PER_ROW = 3;
const ITEMS_HEIGHT = 150;
const DURATION_SHOW_ALBUM = 200;
const OFFSET_TOP = 0;
const defaultListener = () => {};

class ImageGallery extends Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    animatedEffectValue: PropTypes.any,
    refGestureWrapper: PropTypes.any,
    visible: PropTypes.bool,
    expandContent: PropTypes.bool,
    itemPerRow: PropTypes.number,
    itemHeight: PropTypes.number,
    headerHeight: PropTypes.number,
    baseViewHeight: PropTypes.number,
    offsetTop: PropTypes.number,
    durationShowAlbum: PropTypes.number,
    durationShowGallery: PropTypes.number,
    btnCloseAlbumStyle: ViewPropTypes.style,
    albumTitleStyle: ViewPropTypes.style,
    iconSelectedAlbum: PropTypes.node,
    btnCloseAlbum: PropTypes.node,
    iconToggleAlbum: PropTypes.node,
    iconSendImage: PropTypes.node,
    iconCameraPicker: PropTypes.node,
    iconCameraOff: PropTypes.node,
    onExpandedBodyContent: PropTypes.func,
    onExpandingBodyContent: PropTypes.func,
    onCollapsedBodyContent: PropTypes.func,
    onCollapsingBodyContent: PropTypes.func,
    onSendImage: PropTypes.func,
    setHeader: PropTypes.func,
    onToggleImage: PropTypes.func,
  };

  static defaultProps = {
    containerStyle: {},
    animatedEffectValue: 0,
    refGestureWrapper: null,
    visible: false,
    expandContent: false,
    itemPerRow: ITEMS_PER_ROW,
    itemHeight: ITEMS_HEIGHT,
    headerHeight: HEADER_HEIGHT,
    baseViewHeight: BOTTOM_OFFSET_GALLERY,
    offsetTop: OFFSET_TOP,
    durationShowAlbum: DURATION_SHOW_ALBUM,
    durationShowGallery: DURATION_SHOW_GALLERY,
    btnCloseAlbumStyle: {},
    albumTitleStyle: {},
    btnCloseAlbum: <IconCloseAlbum />,
    iconToggleAlbum: <IconToggleAlbum />,
    iconSelectedAlbum: <IconSelectedAlbum />,
    iconSendImage: IconSendImage,
    iconCameraPicker: <IconCameraPicker />,
    iconCameraOff: <IconCameraOff />,
    onExpandedBodyContent: defaultListener,
    onExpandingBodyContent: defaultListener,
    onCollapsedBodyContent: defaultListener,
    onCollapsingBodyContent: defaultListener,
    onSendImage: defaultListener,
    setHeader: defaultListener,
    onToggleImage: defaultListener,
  };

  state = {
    chosenAlbumTitle: '',
    photos: [],
    albums: [],
    selectedPhotos: [],
    openAlbum: false,
    loading: false,
    deepLoading: false,
    openLightBox: false,
    scrollable: false,
    permissionLibraryGranted: undefined,
    permissionCameraGranted: undefined,
    animatedAlbumHeight: new Animated.Value(0),
    rotateValue: new Animated.Value(0),
    animatedShowUpValue: new Animated.Value(0),
    animatedLoadingTitle: new Animated.Value(0),
  };

  didVisible = false;
  unmounted = false;
  appState = '';
  offset = 0;
  momentActive = false;
  isAnimating = false;
  isScrolling = false;

  refGestureWrapper = React.createRef();
  refPhotosView = React.createRef();

  get theme() {
    return getTheme(this);
  }

  get selectedPhotos() {
    return this.state.selectedPhotos;
  }

  clearSelectedPhotos() {
    if (this.state.selectedPhotos.length !== 0) {
      this.setState({selectedPhotos: []});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //---- Check library permissions when visible gallery first time!!!!!!

    // if (
    //   nextProps.visible &&
    //   !this.didVisible &&
    //   !this.state.permissionLibraryGranted
    // ) {
    //   this.didVisible = true;
    //   this.callPermissions(
    //     PERMISSIONS_TYPE.LIBRARY,
    //     LIBRARY_PERMISSIONS_TYPE.REQUEST,
    //     permissionGranted => {
    //       if (permissionGranted) {
    //         this.getAlbum(true);
    //       }
    //     }
    //   );
    // }

    // merge with masterToolBar
    if (
      nextProps.visible &&
      !nextState.openLightBox &&
      nextState.photos.length !== 0 &&
      (!nextState.scrollable || !nextProps.expandContent)
    ) {
      this.props.onChangePanActivationStatus(true);
    } else {
      this.props.onChangePanActivationStatus(false);
    }

    //end merge
    if (
      nextState.photos !== this.state.photos ||
      nextState.albums !== this.state.albums ||
      nextState.selectedPhotos !== this.state.selectedPhotos ||
      nextState.openAlbum !== this.state.openAlbum ||
      nextState.loading !== this.state.loading ||
      nextState.deepLoading !== this.state.deepLoading ||
      nextState.scrollable !== this.state.scrollable ||
      nextState.openLightBox !== this.state.openLightBox ||
      nextState.permissionLibraryGranted !==
        this.state.permissionLibraryGranted ||
      nextState.permissionCameraGranted !== this.state.permissionCameraGranted
    ) {
      // galleryLogger('state change');
      // nextState.photos !== this.state.photos && console.log('photos', nextState.photos);
      // nextState.albums !== this.state.albums && console.log('albums', nextState.albums);
      // nextState.selectedPhotos !== this.state.selectedPhotos && console.log('selectedPhotos', nextState.selectedPhotos);
      // nextState.openAlbum !== this.state.openAlbum && console.log('openAlbum', nextState.openAlbum);
      // nextState.loading !== this.state.loading && console.log('loading', nextState.loading);
      // nextState.deepLoading !== this.state.deepLoading && console.log('deepLoading', nextState.deepLoading);
      // nextState.scrollable !== this.state.scrollable && console.log('scrollable', nextState.scrollable);
      // nextState.openLightBox !== this.state.openLightBox && console.log('openLightBox', nextState.openLightBox);
      // nextState.permissionLibraryGranted !== this.state.permissionLibraryGranted && console.log('permissionLibraryGranted', nextState.permissionLibraryGranted);
      // nextState.permissionCameraGranted !== this.state.permissionCameraGranted && console.log('permissionCameraGranted', nextState.permissionCameraGranted);

      return true;
    }

    if (
      nextProps.itemPerRow !== this.props.itemPerRow ||
      nextProps.itemHeight !== this.props.itemHeight ||
      nextProps.headerHeight !== this.props.headerHeight ||
      nextProps.btnCloseAlbum !== this.props.btnCloseAlbum ||
      nextProps.iconSendImage !== this.props.iconSendImage ||
      nextProps.iconCameraPicker !== this.props.iconCameraPicker ||
      nextProps.iconCameraOff !== this.props.iconCameraOff ||
      nextProps.btnCloseAlbumStyle !== this.props.btnCloseAlbumStyle ||
      nextProps.albumTitleStyle !== this.props.albumTitleStyle ||
      nextProps.iconToggleAlbum !== this.props.iconToggleAlbum ||
      nextProps.iconSelectedAlbum !== this.props.iconSelectedAlbum ||
      nextProps.baseViewHeight !== this.props.baseViewHeight ||
      nextProps.visible !== this.props.visible ||
      nextProps.expandContent !== this.props.expandContent ||
      nextProps.containerStyle !== this.props.containerStyle
    ) {
      // nextProps.itemPerRow !== this.props.itemPerRow && console.log('itemPerRow', nextProps.itemPerRow);
      // nextProps.itemHeight !== this.props.itemHeight && console.log('itemHeight', nextProps.itemHeight);
      // nextProps.headerHeight !== this.props.headerHeight && console.log('headerHeight', nextProps.headerHeight);
      // nextProps.btnCloseAlbum !== this.props.btnCloseAlbum && console.log('btnCloseAlbum', nextProps.btnCloseAlbum);
      // nextProps.iconSendImage !== this.props.iconSendImage && console.log('iconSendImage', nextProps.iconSendImage);
      // nextProps.iconCameraPicker !== this.props.iconCameraPicker && console.log('iconCameraPicker', nextProps.iconCameraPicker);
      // nextProps.iconCameraOff !== this.props.iconCameraOff && console.log('iconCameraOff', nextProps.iconCameraOff);
      // nextProps.btnCloseAlbumStyle !== this.props.btnCloseAlbumStyle && console.log('btnCloseAlbumStyle', nextProps.btnCloseAlbumStyle);
      // nextProps.albumTitleStyle !== this.props.albumTitleStyle && console.log('albumTitleStyle', nextProps.albumTitleStyle);
      // nextProps.iconToggleAlbum !== this.props.iconToggleAlbum && console.log('iconToggleAlbum', nextProps.iconToggleAlbum);
      // nextProps.iconSelectedAlbum !== this.props.iconSelectedAlbum && console.log('iconSelectedAlbum', nextProps.iconSelectedAlbum);
      // nextProps.baseViewHeight !== this.props.baseViewHeight && console.log('baseViewHeight', nextProps.baseViewHeight);
      // nextProps.visible !== this.props.visible && console.log('visible', nextProps.visible);
      // nextProps.expandContent !== this.props.expandContent && console.log('expandContent', nextProps.expandContent);
      // nextProps.containerStyle !== this.props.containerStyle && console.log('containerStyle', nextProps.containerStyle);
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.callPermissions(
      PERMISSIONS_TYPE.LIBRARY,
      // LIBRARY_PERMISSIONS_TYPE.CHECK,
      LIBRARY_PERMISSIONS_TYPE.REQUEST,
      (permissionGranted) => {
        if (permissionGranted) {
          this.getAlbum(false);
        }
      },
    );
    this.callPermissions(
      PERMISSIONS_TYPE.CAMERA,
      CAMERA_PERMISSIONS_TYPE.CHECK,
    );
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentDidUpdate(prevProps, prevState) {
    let opacity = 0;
    if (this.props.refGestureWrapper) {
      opacity = this.props.visible
        ? this.props.refGestureWrapper.current.animatedTranslateYScrollView.interpolate(
            {
              inputRange: [
                this.props.headerHeight,
                this.props.headerHeight * 2,
              ],
              outputRange: [1, 0],
            },
          )
        : 0;
    }

    const rotate = this.state.rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.openAlbum ? '0deg' : '360deg', '180deg'],
    });

    const headerHeight =
      this.props.headerHeight - ANDROID_STATUS_BAR_HEIGHT + (isAndroid ? 2 : 0);
    this.props.setHeader(
      <HeaderLayout
        opacity={opacity}
        rotate={rotate}
        headerHeight={headerHeight}
        handleCloseModal={this.handleCloseModal}
        btnHeaderClose={this.props.btnCloseAlbum}
        btnHeaderCloseStyle={this.props.btnCloseAlbumStyle}
        toggleAlbum={this.toggleAlbum}
        albumTitleStyle={this.props.albumTitleStyle}
        chosenAlbumTitle={this.state.chosenAlbumTitle}
        iconToggleAlbum={this.props.iconToggleAlbum}
        pointerEvents={this.props.expandContent ? 'auto' : 'none'}
      />,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.props.setHeader(null);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      !this.state.deepLoading &&
      !this.state.loading
    ) {
      if (this.state.permissionLibraryGranted) {
        this.getAlbum(true);
      } else {
        {
          this.callPermissions(
            PERMISSIONS_TYPE.LIBRARY,
            LIBRARY_PERMISSIONS_TYPE.CHECK,
            (permissionGranted) => {
              if (this.state.permissionLibraryGranted !== permissionGranted) {
                this.setState({
                  permissionLibraryGranted: permissionGranted,
                });
              }
              if (permissionGranted) {
                this.getAlbum(false);
              }
            },
          );
        }
        if (
          this.state.permissionCameraGranted === RESULTS.DENIED ||
          this.state.permissionCameraGranted === RESULTS.BLOCKED
        ) {
          this.callPermissions(
            PERMISSIONS_TYPE.CAMERA,
            CAMERA_PERMISSIONS_TYPE.CHECK,
          );
        }
      }
    }
    this.appState = nextAppState;
  };

  callPermissions = async (
    generalType,
    specificType,
    callBack = defaultListener,
  ) => {
    let permissionGranted = null;
    switch (generalType) {
      case PERMISSIONS_TYPE.LIBRARY:
        permissionGranted = await this.handleLibraryPermission(specificType);
        if (permissionGranted !== this.state.permissionLibraryGranted) {
          setStater(this, this.unmounted, {
            permissionLibraryGranted: permissionGranted,
          });
        }
        callBack(permissionGranted);
        break;
      case PERMISSIONS_TYPE.CAMERA:
        permissionGranted = await this.handleCameraPermission(specificType);
        if (permissionGranted !== this.state.permissionCameraGranted) {
          setStater(this, this.unmounted, {
            permissionCameraGranted: permissionGranted,
          });
        }
        callBack(permissionGranted);
        break;
    }
  };

  handleLibraryPermission = async (type) => {
    if (!isAndroid && !isIos) {
      Alert.alert(this.props.t('imageGallery.noSupportLibrary'));
      return;
    }

    const permissionLibraryRequest = isAndroid
      ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      : PERMISSIONS.IOS.PHOTO_LIBRARY;

    let permissionHandler = null;
    switch (type) {
      case LIBRARY_PERMISSIONS_TYPE.CHECK:
        permissionHandler = check;
        break;
      case LIBRARY_PERMISSIONS_TYPE.REQUEST:
        permissionHandler = request;
        break;
    }

    try {
      const result = await permissionHandler(permissionLibraryRequest);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert(
            this.props.t('imageGallery.libraryAccessRequestUnavailable'),
          );
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          return false;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          return false;
        case RESULTS.GRANTED:
          console.log('The library permission is granted');
          return true;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          return false;
      }
    } catch (error) {
      console.log(error);
      Alert.alert(this.props.t('imageGallery.libraryAccessRequestError'));
      return false;
    }
  };

  handleCameraPermission = async (type) => {
    if (!isAndroid && !isIos) {
      Alert.alert(this.props.t('imageGallery.noSupportCamera'));
      return false;
    }

    const permissionCameraRequest = isAndroid
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA;

    let permissionHandler = null;
    switch (type) {
      case CAMERA_PERMISSIONS_TYPE.CHECK:
        permissionHandler = check;
        break;
      case CAMERA_PERMISSIONS_TYPE.REQUEST:
        permissionHandler = request;
        break;
    }

    try {
      const result = await permissionHandler(permissionCameraRequest);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert(
            this.props.t('imageGallery.cameraAccessRequestUnavailable'),
          );
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          return RESULTS.UNAVAILABLE;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          return RESULTS.DENIED;
        case RESULTS.GRANTED:
          console.log('The camera permission is granted');
          return RESULTS.GRANTED;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          return RESULTS.BLOCKED;
      }
    } catch (error) {
      console.log(error);
      Alert.alert(this.props.t('imageGallery.cameraAccessRequestError'));
      return RESULTS.DENIED;
    }
  };

  handleOpenAllowPermission = () => {
    openSettings().catch(() =>
      Alert.alert(this.props.t('imageGallery.cantAccessSetting')),
    );
  };

  getAlbum(isUpdate, first = 100, after = null, index = 0, groupTypes = 'All') {
    willUpdateState(this.unmounted, () => {
      if (this.state.photos.length === 0) {
        this.setState({loading: true});
      }

      const extraOpt = after ? {after} : {};

      CameraRoll.getPhotos({
        first,
        assetType: 'Photos',
        groupTypes,
        ...extraOpt,
      })
        .then((r) => {
          let page_info = r.page_info;

          let {albums, photos, chosenAlbumTitle} = this.filterPhoto(
            r.edges,
            isUpdate,
          );

          setStater(
            this,
            this.unmounted,
            {
              albums,
              photos,
              chosenAlbumTitle,
              loading: false,
            },
            () => {
              willUpdateState(this.unmounted, () => {
                if (page_info.has_next_page) {
                  index++;
                  this.getAlbum(isUpdate, 9999, r.page_info.end_cursor, index);

                  this.setState({
                    deepLoading: true,
                  });
                } else {
                  if (isIos) {
                    if (groupTypes === 'Album') {
                      this.setState({
                        deepLoading: false,
                      });
                    } else {
                      this.getAlbum(true, 9999, null, 0, 'Album');
                    }
                  } else {
                    this.setState({
                      deepLoading: false,
                    });
                  }
                }
              });
            },
          );
        })
        .catch((err) => {
          //Error Loading Images
          console.log('get recent photo album', err.message);
          setStater(this, this.unmounted, {
            loading: false,
            deepLoading: false,
          });
        });
    });
  }

  filterPhoto(edges, isUpdate) {
    let albums = this.state.albums,
      photos = this.state.photos,
      chosenAlbumTitle = this.state.chosenAlbumTitle;

    edges.forEach((edge) => {
      const img = edge.node;
      edge.node.path = img.image.uri;
      edge.node.id = img.path;
      edge.node.fileName = img.image.filename;

      if (!chosenAlbumTitle) {
        chosenAlbumTitle = img.group_name;
      }

      if (!albums.find((alb) => alb.name === img.group_name)) {
        albums.push({
          name: img.group_name,
          cover: img.path,
        });
      }

      albums.forEach((album, index) => {
        if (!album.photos) {
          album.photos = [{id: '-1', path: 'camera'}];
          album.count = 0;
        }
        if (album.name === img.group_name) {
          if (!isUpdate) {
            album.photos.push(img);
            album.count++;
          } else {
            const isExisted = album.photos.find(
              (photo) => photo.image && photo.image.uri === img.image.uri,
            );
            if (!isExisted) {
              album.photos.splice(1, -1, img);
              album.count++;
              album.cover = img.image.uri;
            }
          }
        }
        if (album.name === chosenAlbumTitle) {
          photos = album.photos;
        }
      });
    });

    if (albums.length === 0) {
      albums.push({name: '', photo: [{id: '-1', path: 'camera'}]});
    }
    return {albums, photos, chosenAlbumTitle};
  }

  toggleAlbum = () => {
    Animated.parallel([
      Animated.timing(this.state.rotateValue, {
        toValue: !this.state.openAlbum ? 1 : 0,
        duration: this.props.durationShowAlbum,
        easing: Easing.in,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.animatedAlbumHeight, {
        toValue: !this.state.openAlbum ? HEIGHT : 0,
        duration: this.props.durationShowAlbum,
        easing: Easing.in,
        useNativeDriver: true,
      }),
    ]).start();
    this.setState({openAlbum: !this.state.openAlbum});
  };

  onSelectAlbum = (album) => {
    this.toggleAlbum();
    this.setState({
      chosenAlbumTitle: album.name,
      photos: album.photos,
    });
  };

  onTogglePhoto = (photo, selectedIndex) => {
    const selectedPhotos = [...this.state.selectedPhotos];

    if (selectedIndex !== -1) {
      selectedPhotos.splice(selectedIndex, 1);
    } else {
      selectedPhotos.push(photo);
    }
    this.setState({selectedPhotos});
    this.props.onToggleImage(selectedPhotos);
  };

  captureImage = async () => {
    const permissionCameraGranted = await this.handleCameraPermission(
      CAMERA_PERMISSIONS_TYPE.REQUEST,
    );

    willUpdateState(this.unmounted, () => {
      if (permissionCameraGranted === RESULTS.GRANTED) {
        const options = {
          quality: 1,
          storageOptions: {
            cameraRoll: isIos,
            skipBackup: true,
            path: 'images',
          },
        };

        ImagePicker.launchCamera(options, (response) => {
          if (response.data) {
            const id = new Date().getTime();
            const formattedImage = {
              path: 'data:image/png;base64,' + response.data,
              uploadPath: response.data,
              id,
              fileName: `image-picker-${id}`,
              isBase64: true,
            };
            this.handleSendImage([formattedImage]);
            this.getAlbum(true);
          }
        });
      }

      if (this.state.permissionCameraGranted === RESULTS.BLOCKED) {
        this.handleOpenAllowPermission();
      }

      if (permissionCameraGranted !== this.state.permissionCameraGranted) {
        this.setState({permissionCameraGranted});
      }
    });
  };

  handleCloseModal = () => {
    if (this.state.openAlbum) {
      this.toggleAlbum();
    } else {
      this.isAnimating = true;
      this.offset = 0;
      this.handleCollapsingGallery();
    }
  };

  handleSendImage = (images) => {
    if (!Array.isArray(images)) {
      images = this.state.selectedPhotos;
    }
    this.props.onSendImage(images);
    this.clearSelectedPhotos();
  };

  handleCollapsingGallery = () => {
    this.refPhotosView.current &&
      this.refPhotosView.current
        .getNode()
        .scrollToOffset({animated: false, offset: 0});
    this.props.onCollapsingBodyContent();
  };

  //START - handle everything about gallery scroll event
  handleScrollBeginDrag = (e) => {
    // console.log('dragBegin', this.offset);
    this.offset = e.nativeEvent.contentOffset.y;
    this.isScrolling = false;
    this.momentActive = this.offset > 0;
  };
  handleMomentumScrollBegin = (e) => {
    this.offset = e.nativeEvent.contentOffset.y;
    this.momentActive = true;
    // console.log('momentBegin', this.offset);
  };
  handleScroll = (e) => {
    let y = e.nativeEvent.contentOffset.y;
    // console.log('scrolling', y);
    this.isScrolling = true;
    if (!this.momentActive) {
      this.offset = y;
      if (this.offset <= 0 && this.props.expandContent) {
        this.handleCollapsingGallery();
      }
    }
  };
  handleScrollEndDrag = (e) => {
    this.offset = e.nativeEvent.contentOffset.y;
    // console.log('endDrag', this.offset);
  };
  handleMomentumScrollEnd = (e) => {
    this.isScrolling = false;
    // console.log('momentEnd', this.offset);
    this.momentActive = false;

    if (this.offset <= 0 && this.props.expandContent) {
      this.handleCollapsingGallery();
    }
  };
  //END - handle everything about gallery scroll event

  scrollable(data = this.state.photos) {
    let actualScrollViewHeight = 0;
    if (this.props.refGestureWrapper) {
      actualScrollViewHeight = this.props.refGestureWrapper.current
        .actualScrollViewHeightValue;
    }

    return (
      Math.ceil(data.length / ITEMS_PER_ROW) * ITEMS_HEIGHT >
      actualScrollViewHeight
    );
  }

  render() {
    console.log('>>> render gallery');
    const scrollEnabled =
      this.state.scrollable &&
      this.props.expandContent &&
      !this.state.openLightBox;

    const translateY = this.state.animatedAlbumHeight.interpolate({
      inputRange: [0, HEIGHT],
      outputRange: [-HEIGHT * 3, 0],
    });
    const wrapperItemStyle = {
      height: this.props.itemHeight,
      width: `${100 / this.props.itemPerRow}%`,
      borderWidth: 2,
      borderColor: 'white',
    };

    const extraStyle = {
      zIndex: this.props.visible ? 1 : 0,
    };

    const animatedTranslateY = {
      transform: [{translateY: this.props.animatedEffectValue}],
    };

    return (
      <>
        <HeaderContent
          loading={this.state.deepLoading}
          translateY={translateY}
          albums={this.state.albums}
          onSelectAlbum={this.onSelectAlbum}
          iconSelectedAlbum={this.props.iconSelectedAlbum}
          chosenAlbumTitle={this.state.chosenAlbumTitle}
        />
        <FlatList
          safeLayout
          animated
          style={[
            styles.scrollViewStyle,
            extraStyle,
            animatedTranslateY,
            this.props.containerStyle,
          ]}
          contentContainerStyle={styles.contentContainerStyle}
          data={this.state.photos}
          ref={this.refPhotosView}
          onScrollBeginDrag={this.handleScrollBeginDrag}
          onMomentumScrollBegin={this.handleMomentumScrollBegin}
          onScroll={this.handleScroll}
          onMomentumScrollEnd={this.handleMomentumScrollEnd}
          onScrollEndDrag={this.handleScrollEndDrag}
          onContentSizeChange={() => {
            const scrollable = this.scrollable();
            if (scrollable !== this.state.scrollable) {
              this.setState({
                scrollable: this.scrollable(),
              });
            }
          }}
          scrollEnabled={scrollEnabled}
          initialNumToRender={20}
          numColumns={ITEMS_PER_ROW}
          ListHeaderComponent={
            this.state.loading && (
              <Loading
                center
                wrapperStyle={[
                  styles.loading,
                  {
                    height: this.props.baseViewHeight,
                  },
                ]}
              />
            )
          }
          ListFooterComponent={
            <LoadMore bottom loading={this.state.deepLoading} />
          }
          getItemLayout={(data, index) => ({
            length: this.props.itemHeight,
            offset: this.props.itemHeight * index,
            index,
          })}
          renderItem={({item: photo}) => {
            return (
              <ImageItemContainer
                photo={photo}
                selectedPhotos={this.state.selectedPhotos}
                iconCameraPicker={this.props.iconCameraPicker}
                iconCameraOff={this.props.iconCameraOff}
                wrapperItemStyle={wrapperItemStyle}
                onOpenLightBox={() => this.setState({openLightBox: true})}
                onCloseLightBox={() => this.setState({openLightBox: false})}
                captureImage={this.captureImage}
                onTogglePhoto={this.onTogglePhoto}
                permissionCameraGranted={this.state.permissionCameraGranted}
              />
            );
          }}
          keyExtractor={(item, index) => String(index)}
        />

        {this.state.permissionLibraryGranted === false ? (
          <PermissionLibraryNotGranted
            containerStyle={[
              extraStyle,
              animatedTranslateY,
              this.props.containerStyle,
            ]}
            height={this.props.baseViewHeight}
            onPress={this.handleOpenAllowPermission}
          />
        ) : this.props.expandContent && !this.state.openAlbum ? (
          <SendImage
            containerStyle={extraStyle}
            selectedPhotos={this.state.selectedPhotos}
            iconSendImage={this.props.iconSendImage}
            onSendImage={this.handleSendImage}
          />
        ) : null}
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollViewStyle: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  loading: {
    position: undefined,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ImageGallery;
