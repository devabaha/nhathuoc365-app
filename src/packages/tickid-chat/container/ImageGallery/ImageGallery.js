import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Easing,
  StatusBar,
  Dimensions,
  Animated,
  FlatList,
  TouchableOpacity,
  ViewPropTypes,
  Platform,
  ActivityIndicator,
  AppState,
  Alert
} from 'react-native';
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings
} from 'react-native-permissions';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
import ImageItem from '../../component/ImageItem';
import AlbumItem from '../../component/AlbumItem';
import GestureWrapper from '../../component/GestureWrapper';
import { setStater, willUpdateState } from '../../helper';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PERMISSIONS_TYPE = {
  CAMERA: 'camera-permission',
  LIBRARY: 'library-permission'
};
const CAMERA_PERMISSIONS_TYPE = {
  CHECK: 'check-camera-permission',
  REQUEST: 'request-camera-permission'
};
const LIBRARY_PERMISSIONS_TYPE = {
  CHECK: 'check-library-permission',
  REQUEST: 'request-library-permission'
};
const isAndroid = Platform.OS === 'android';
const isIos = Platform.OS === 'ios';
const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');
const ANDROID_STATUS_BAR = StatusBar.currentHeight;
const HIT_SLOP = { right: 15, top: 15, left: 15, bottom: 15 };
const ITEMS_PER_ROW = 3;
const ITEMS_HEIGHT = 150;
const HEADER_HEIGHT = isIos ? (isIphoneX ? getStatusBarHeight() + 64 : 64) : 56;
const BASE_VIEW_HEIGHT = HEIGHT / 2.5;
const DURATION_SHOW_ALBUM = 200;
const DURATION_SHOW_GALLERY = 300;
const DELAY_GET_ALBUM = 3000;
const OFFSET_TOP = 0;
const defaultListener = () => {};
const defaultIconSendImage = <Text style={{ color: 'blue' }}>></Text>;
const defaultIconSelectedAlbum = <Text style={{ color: 'black' }}>/</Text>;
const defaultIconToggleAlbum = <Text style={{ color: 'white' }}>\/</Text>;
const defaultBtnCloseAlbum = <Text style={{ color: 'white' }}>x</Text>;
const defaultIconCameraPicker = null;
const defaultIconCameraOff = null;

class ImageGallery extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    itemPerRow: PropTypes.number,
    itemHeight: PropTypes.number,
    headerHeight: PropTypes.number,
    baseViewHeight: PropTypes.number,
    offsetTop: PropTypes.number,
    durationShowAlbum: PropTypes.number,
    durationShowGallery: PropTypes.number,
    btnCloseAlbumStyle: ViewPropTypes.style,
    albumTitleStyle: ViewPropTypes.style,
    defaultStatusBarColor: PropTypes.string,
    iconSelectedAlbum: PropTypes.node,
    btnCloseAlbum: PropTypes.node,
    iconToggleAlbum: PropTypes.node,
    iconSendImage: PropTypes.node,
    iconCameraPicker: PropTypes.node,
    iconCameraOff: PropTypes.node,
    onExpandedBodyContent: PropTypes.func,
    onCollapsedBodyContent: PropTypes.func,
    onSendImage: PropTypes.func,
    setHeader: PropTypes.func,
    onToggleImage: PropTypes.func
  };

  static defaultProps = {
    visible: false,
    itemPerRow: ITEMS_PER_ROW,
    itemHeight: ITEMS_HEIGHT,
    headerHeight: HEADER_HEIGHT,
    baseViewHeight: BASE_VIEW_HEIGHT,
    offsetTop: OFFSET_TOP,
    durationShowAlbum: DURATION_SHOW_ALBUM,
    durationShowGallery: DURATION_SHOW_GALLERY,
    btnCloseAlbumStyle: {},
    albumTitleStyle: {},
    btnCloseAlbum: defaultBtnCloseAlbum,
    iconToggleAlbum: defaultIconToggleAlbum,
    iconSelectedAlbum: defaultIconSelectedAlbum,
    iconSendImage: defaultIconSendImage,
    iconCameraPicker: defaultIconCameraPicker,
    iconCameraOff: defaultIconCameraOff,
    defaultStatusBarColor: '#fff',
    onExpandedBodyContent: defaultListener,
    onCollapsedBodyContent: defaultListener,
    onSendImage: defaultListener,
    setHeader: defaultListener,
    onToggleImage: defaultListener
  };

  state = {
    photos: [],
    chosenAlbumTitle: '',
    albums: [],
    selectedPhotos: [],
    openAlbum: false,
    loading: false,
    animatedAlbumHeight: new Animated.Value(0),
    rotateValue: new Animated.Value(0),
    animatedShowUpValue: new Animated.Value(0),
    openLightBox: false,
    openPanel: false,
    permissionLibraryGranted: undefined,
    permissionCameraGranted: undefined
  };

  didVisible = false;
  unmounted = false;
  appState = '';

  get selectedPhotos() {
    return this.state.selectedPhotos;
  }

  clearSelectedPhotos() {
    this.setState({ selectedPhotos: [] });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.visible &&
      !this.didVisible &&
      !this.state.permissionLibraryGranted
    ) {
      this.didVisible = true;
      this.callPermissions(
        PERMISSIONS_TYPE.LIBRARY,
        LIBRARY_PERMISSIONS_TYPE.REQUEST,
        permissionGranted => {
          if (permissionGranted) {
            this.getAlbum();
          }
        }
      );
    }

    if (nextState !== this.state) {
      // galleryLogger('state change');
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
      nextProps.defaultStatusBarColor !== this.props.defaultStatusBarColor ||
      nextProps.visible !== this.props.visible
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.callPermissions(
      PERMISSIONS_TYPE.LIBRARY,
      LIBRARY_PERMISSIONS_TYPE.CHECK,
      permissionGranted => {
        if (permissionGranted) {
          this.getAlbum();
        }
      }
    );
    this.callPermissions(
      PERMISSIONS_TYPE.CAMERA,
      CAMERA_PERMISSIONS_TYPE.CHECK
    );
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    this.unmounted = true;
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (this.state.permissionLibraryGranted) {
        this.getAlbum();
      } else {
        this.callPermissions(
          PERMISSIONS_TYPE.LIBRARY,
          LIBRARY_PERMISSIONS_TYPE.CHECK,
          permissionGranted => {
            if (this.state.permissionLibraryGranted !== permissionGranted) {
              this.setState({
                permissionLibraryGranted: permissionGranted
              });
            }
            if (permissionGranted) {
              this.getAlbum();
            }
          }
        );
      }
      if (
        this.state.permissionCameraGranted === RESULTS.DENIED ||
        this.state.permissionCameraGranted === RESULTS.BLOCKED
      ) {
        this.callPermissions(
          PERMISSIONS_TYPE.CAMERA,
          CAMERA_PERMISSIONS_TYPE.CHECK
        );
      }
    }
    this.appState = nextAppState;
  };

  callPermissions = async (
    generalType,
    specificType,
    callBack = defaultListener
  ) => {
    let permissionGranted = null;
    switch (generalType) {
      case PERMISSIONS_TYPE.LIBRARY:
        permissionGranted = await this.handleLibraryPermission(specificType);
        if (permissionGranted !== this.state.permissionLibraryGranted) {
          setStater(this, this.unmounted, {
            permissionLibraryGranted: permissionGranted
          });
        }
        callBack(permissionGranted);
        break;
      case PERMISSIONS_TYPE.CAMERA:
        permissionGranted = await this.handleCameraPermission(specificType);
        if (permissionGranted !== this.state.permissionCameraGranted) {
          setStater(this, this.unmounted, {
            permissionCameraGranted: permissionGranted
          });
        }
        callBack(permissionGranted);
        break;
    }
  };

  handleLibraryPermission = async type => {
    if (!isAndroid && !isIos) {
      Alert.alert('Nền tảng không hỗ trợ truy cập thư viện');
      return;
    }

    const permissonLibraryRequest = isAndroid
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
      const result = await permissionHandler(permissonLibraryRequest);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert('Quyền truy cập Thư viện không khả dụng');
          console.log(
            'This feature is not available (on this device / in this context)'
          );
          return false;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable'
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
      Alert.alert('Lỗi yêu cầu quyền truy cập Thư viện');
      return false;
    }
  };

  handleCameraPermission = async type => {
    if (!isAndroid && !isIos) {
      Alert.alert('Nền tảng không hỗ trợ truy cập Camera');
      return false;
    }

    const permissonCameraRequest = isAndroid
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
      const result = await permissionHandler(permissonCameraRequest);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert('Quyền truy cập Camera không khả dụng');
          console.log(
            'This feature is not available (on this device / in this context)'
          );
          return RESULTS.UNAVAILABLE;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable'
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
      Alert.alert('Lỗi yêu cầu quyền truy cập Camera');
      return RESULTS.DENIED;
    }
  };

  handleOpenAllowPermission = () => {
    openSettings().catch(() =>
      Alert.alert('Ứng dụng không thể truy cập vào Cài đặt!')
    );
  };

  getAlbum() {
    if (this.state.photos.length === 0) {
      this.setState({ loading: true });
    }
    if (isIos) {
      CameraRoll.getPhotos({
        first: 9999,
        assetType: 'Photos',
        groupTypes: 'All'
      })
        .then(r => {
          let rawPhotoData = r.edges;
          CameraRoll.getPhotos({
            first: 9999,
            assetType: 'Photos',
            groupTypes: 'Album'
          })
            .then(r => {
              rawPhotoData = rawPhotoData.concat(r.edges);
              const { albums, photos } = this.filterPhoto(rawPhotoData);
              const chosenAlbumTitle =
                this.state.chosenAlbumTitle || albums[0].name;
              setStater(this, this.unmounted, {
                albums,
                photos,
                chosenAlbumTitle: chosenAlbumTitle,
                loading: false,
                permissionLibraryGranted: true
              });
            })
            .catch(err => {
              //Error Loading Images
              setStater(this, this.unmounted, {
                loading: false,
                permissionLibraryGranted: false
              });
              console.log('get other album', err);
            });
        })
        .catch(err => {
          //Error Loading Images
          console.log('get recent photo album', err.message);
          setStater(this, this.unmounted, {
            loading: false,
            permissionLibraryGranted: false
          });
        });
    } else {
      CameraRoll.getPhotos({
        first: 9999,
        assetType: 'Photos',
        groupTypes: 'All'
      })
        .then(r => {
          const { albums, photos } = this.filterPhoto(r.edges);
          if (albums.length === 0) {
            albums.push({ name: '' });
          }
          const chosenAlbumTitle =
            this.state.chosenAlbumTitle || albums[0].name;
          setStater(this, this.unmounted, {
            albums,
            photos,
            chosenAlbumTitle: chosenAlbumTitle,
            loading: false,
            permissionLibraryGranted: true
          });
        })
        .catch(err => {
          //Error Loading Images
          setStater(this, this.unmounted, {
            loading: false,
            permissionLibraryGranted: false
          });
          console.log('get album', err);
        });
    }
  }

  filterPhoto(edges) {
    let albums = [],
      photos = [],
      chosenAlbumTitle = this.state.chosenAlbumTitle;

    edges.forEach(edge => {
      const img = edge.node;
      edge.node.path = img.image.uri;
      edge.node.id = img.timestamp;
      edge.node.fileName = img.image.filename;

      if (!chosenAlbumTitle) {
        chosenAlbumTitle = img.group_name;
      }

      if (!albums.find(alb => alb.name === img.group_name)) {
        albums.push({
          name: img.group_name,
          cover: img.path
        });
      }
    });

    edges.forEach(edge => {
      const img = edge.node;

      albums.forEach((album, index) => {
        album.date = index;
        if (!album.photos) {
          album.photos = [];
        }
        if (album.name === img.group_name) {
          album.photos.push(img);
        }
      });
    });

    albums.forEach(album => {
      album.count = album.photos.length;
      album.photos.unshift({ id: '-1', path: 'camera' });
    });

    const chosenAlbum = albums.find(alb => alb.name === chosenAlbumTitle);
    if (chosenAlbum) {
      photos = chosenAlbum.photos;
    }

    return { albums, photos };
  }

  toggleAlbum() {
    Animated.parallel([
      Animated.timing(this.state.rotateValue, {
        toValue: !this.state.openAlbum ? 1 : 0,
        duration: this.props.durationShowAlbum,
        easing: Easing.in,
        useNativeDriver: true
      }),
      Animated.timing(this.state.animatedAlbumHeight, {
        toValue: !this.state.openAlbum ? HEIGHT : 0,
        duration: this.props.durationShowAlbum,
        easing: Easing.in,
        useNativeDriver: true
      })
    ]).start();
    this.setState({ openAlbum: !this.state.openAlbum });
  }

  onSelectAlbum(album) {
    this.toggleAlbum();
    setTimeout(() =>
      this.setState({
        chosenAlbumTitle: album.name,
        photos: album.photos
      })
    );
  }

  onTogglePhoto(photo, selectedIndex) {
    const selectedPhotos = [...this.state.selectedPhotos];

    if (selectedIndex !== -1) {
      selectedPhotos.splice(selectedIndex, 1);
    } else {
      selectedPhotos.push(photo);
    }
    this.setState({ selectedPhotos });
    this.props.onToggleImage(selectedPhotos);
  }

  async captureImage() {
    const permissionCameraGranted = await this.handleCameraPermission(
      CAMERA_PERMISSIONS_TYPE.REQUEST
    );

    willUpdateState(this.unmounted, () => {
      if (permissionCameraGranted === RESULTS.GRANTED) {
        const options = {
          quality: 1,
          storageOptions: {
            cameraRoll: isIos,
            skipBackup: true,
            path: 'images'
          }
        };

        ImagePicker.launchCamera(options, response => {
          if (response.data) {
            const id = new Date().getTime();
            const formattedImage = {
              path: 'data:image/png;base64,' + response.data,
              uploadPath: response.data,
              id,
              fileName: `image-picker-${id}`,
              isBase64: true
            };

            setTimeout(() => {
              this.props.onSendImage([formattedImage]);
              this.getAlbum(this.state.chosenAlbumTitle);
            });
          }
        });
      }

      if (this.state.permissionCameraGranted === RESULTS.BLOCKED) {
        this.handleOpenAllowPermission();
      }

      if (permissionCameraGranted !== this.state.permissionCameraGranted) {
        this.setState({ permissionCameraGranted });
      }
    });
  }

  handleCloseModal() {
    if (this.state.openAlbum) {
      this.toggleAlbum();
    } else {
      this.isAnimating = true;
      this.offset = 0;
      this.setState({
        openPanel: false
      });
    }
  }

  handleSendImage() {
    this.offset = 0;
    this.setState(
      {
        openPanel: false
      },
      () => this.props.onSendImage(this.state.selectedPhotos)
    );
  }

  handleExpandedGallery() {
    this.props.onExpandedBodyContent();
    this.setState({ openPanel: true });
  }

  handleCollapsedGallery() {
    this.props.onCollapsedBodyContent();
    this.setState({ openPanel: false });
  }

  render() {
    console.log('render gallery');
    const rotate = this.state.rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.openAlbum ? '0deg' : '360deg', '180deg']
    });

    const translateY = this.state.animatedAlbumHeight.interpolate({
      inputRange: [0, HEIGHT],
      outputRange: [-HEIGHT, 0]
    });
    const wrapperItemStyle = {
      height: this.props.itemHeight,
      width: `${100 / this.props.itemPerRow}%`,
      borderWidth: 2,
      borderColor: 'white'
    };

    return (
      <GestureWrapper
        ref={this.props.refGestureWrapper}
        setHeader={this.props.setHeader}
        openHeader={this.state.openAlbum}
        visible={this.props.visible}
        isActivePanResponder={
          !this.state.openLightBox && this.state.photos.length !== 0
        }
        startExpandingBodyContent={this.handleExpandedGallery.bind(this)}
        startCollapsingBodyContent={this.handleCollapsedGallery.bind(this)}
        bodyData={this.state.photos}
        collapsedBodyHeight={this.props.baseViewHeight}
        defaultStatusBarColor={this.props.defaultStatusBarColor}
        contentScrollEnabled={this.state.openPanel && !this.state.openLightBox}
        contentFlatListProps={{
          initialNumToRender: 30,
          numColumns: 3,
          ListHeaderComponent: this.state.loading && (
            <Loading height={this.props.baseViewHeight} />
          ),
          getItemLayout: (data, index) => ({
            length: this.props.itemHeight,
            offset: this.props.itemHeight * index,
            index
          }),
          renderItem: ({ item: photo }) => {
            return (
              <ImageItemContainer
                photo={photo}
                selectedPhotos={this.state.selectedPhotos}
                iconCameraPicker={this.props.iconCameraPicker}
                iconCameraOff={this.props.iconCameraOff}
                wrapperItemStyle={wrapperItemStyle}
                onOpenLightBox={() => this.setState({ openLightBox: true })}
                onCloseLightBox={() => this.setState({ openLightBox: false })}
                captureImage={this.captureImage.bind(this)}
                onTogglePhoto={this.onTogglePhoto.bind(this)}
                permissionCameraGranted={this.state.permissionCameraGranted}
              />
            );
          },
          keyExtractor: (item, index) => String(index)
        }}
        onHeaderClosePress={this.handleCloseModal.bind(this)}
        btnHeaderClose={this.props.btnCloseAlbum}
        header={
          <Header
            toggleAlbum={this.toggleAlbum.bind(this)}
            albumTitleStyle={this.props.albumTitleStyle}
            chosenAlbumTitle={this.state.chosenAlbumTitle}
            iconToggleAlbum={this.props.iconToggleAlbum}
            rotate={rotate}
          />
        }
        headerContent={
          <HeaderContent
            translateY={translateY}
            albums={this.state.albums}
            onSelectAlbum={item => this.onSelectAlbum(item)}
            iconSelectedAlbum={this.props.iconSelectedAlbum}
          />
        }
        extraBodyContent={
          this.state.permissionLibraryGranted === false ? (
            <PermissonLibraryNotGranted
              height={this.props.baseViewHeight}
              onPress={this.handleOpenAllowPermission.bind(this)}
            />
          ) : this.state.openPanel && !this.state.openAlbum ? (
            <SendImage
              selectedPhotos={this.state.selectedPhotos}
              iconSendImage={this.props.iconSendImage}
              handleSendImage={this.handleSendImage.bind(this)}
            />
          ) : null
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  btnCloseAlbum: {
    position: 'absolute',
    paddingTop: isIos ? 20 : 0,
    left: 15
  },
  header: {
    zIndex: 999,
    width: WIDTH,
    paddingTop: isIos ? 20 : 0,
    top: 0,
    left: 0,
    backgroundColor: 'black',
    position: 'absolute'
  },
  iconToggleAlbum: {
    marginLeft: 10,
    alignItems: 'flex-end'
  },
  scrollViewStyle: {
    flex: 1,
    position: 'relative'
  },
  image: {
    height: '95%',
    width: '95%',
    left: 0,
    resizeMode: 'cover',
    top: 0
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  itemsRow: {
    flex: 1,
    flexDirection: 'row'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnSend: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 60,
    height: 60,
    bottom: 60,
    right: 15,
    borderRadius: 30,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  totalSeletedPhotos: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 30,
    height: 22,
    borderRadius: 8,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center'
  },
  albumHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  albumTitle: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18
  },
  albumContainer: {
    zIndex: 990,
    width: WIDTH,
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute'
  },
  iconSend: {
    bottom: 0,
    right: 0,
    borderRadius: 30
  },
  fullCenter: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedMessage: {
    color: 'white',
    fontSize: 14,
    lineHeight: 15,
    fontWeight: '600'
  },
  permissionNotGranted: {
    position: 'absolute',
    width: WIDTH,
    alignItems: 'center',
    justifyContent: 'center'
  },
  permissionNotGrantedBtn: {
    backgroundColor: '#d9d9d9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5
  },
  permissionNotGrantedSetting: {
    fontSize: 14,
    color: '#404040'
  },
  permissionNotGrantedMess: {
    color: '#404040',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 15
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  captureText: {
    textAlign: 'center',
    color: 'black',
    paddingHorizontal: 5,
    marginTop: 15
  }
});

export default ImageGallery;

const Loading = props => (
  <View
    style={[
      styles.loading,
      {
        height: props.height
      }
    ]}
  >
    <ActivityIndicator size="large" />
  </View>
);

class ImageItemContainer extends Component {
  state = {};

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.selectedPhotos !== this.props.selectedPhotos ||
      nextProps.photo !== this.props.photo ||
      nextProps.wrapperItemStyle !== this.props.wrapperItemStyle ||
      nextProps.iconCameraPicker !== this.props.iconCameraPicker ||
      nextProps.iconCameraOff !== this.props.iconCameraOff ||
      nextProps.permissionCameraGranted !== this.props.permissionCameraGranted
    ) {
      return true;
    }

    return false;
  }

  render() {
    const { photo, selectedPhotos } = this.props;
    let selectedIndex = selectedPhotos.findIndex(p => p.id === photo.id);
    return (
      <TouchableOpacity
        style={[styles.center, this.props.wrapperItemStyle]}
        onPress={() => {
          photo.path === 'camera' && this.props.captureImage();
        }}
      >
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
          {photo.path === 'camera' ? (
            <CameraPicker
              iconCameraPicker={this.props.iconCameraPicker}
              iconCameraOff={this.props.iconCameraOff}
              permissionGranted={this.props.permissionCameraGranted}
            />
          ) : (
            <ImageItem
              onOpenLightBox={this.props.onOpenLightBox}
              onCloseLightBox={this.props.onCloseLightBox}
              source={{
                uri: photo.path
              }}
              onToggleItem={() =>
                this.props.onTogglePhoto(photo, selectedIndex)
              }
              isSelected={selectedIndex !== -1}
              selectedMessage={selectedIndex !== -1 ? selectedIndex + 1 : 0}
              containerStyle={styles.imageItem}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const PermissonLibraryNotGranted = props => (
  <View
    style={[
      styles.permissionNotGranted,
      {
        height: props.height || '100%'
      }
    ]}
  >
    <Icon name="folder-multiple-image" size={40} />
    <Text style={styles.permissionNotGrantedMess}>
      Ứng dụng cần quyền truy cập vào thư viện.
    </Text>
    <Button
      containerStyle={styles.permissionNotGrantedBtn}
      style={styles.permissionNotGrantedSetting}
      onPress={props.onPress}
    >
      Cài đặt
    </Button>
  </View>
);

const Header = props => (
  <TouchableOpacity hitSlop={HIT_SLOP} onPress={props.toggleAlbum}>
    <View style={[styles.albumHeader]}>
      <Text style={[styles.center, styles.albumTitle, props.albumTitleStyle]}>
        {props.chosenAlbumTitle}
      </Text>
      <Animated.View
        style={[
          styles.center,
          styles.iconToggleAlbum,
          { transform: [{ rotate: props.rotate }] }
        ]}
      >
        {props.iconToggleAlbum}
      </Animated.View>
    </View>
  </TouchableOpacity>
);

const HeaderContent = props => (
  <Animated.View
    style={[
      styles.center,
      styles.albumContainer,
      {
        transform: [{ translateY: props.translateY }]
      }
    ]}
  >
    <FlatList
      data={props.albums}
      ItemSeparatorComponent={() => (
        <View style={{ border: 'none', height: 0 }}></View>
      )}
      renderItem={({ item, index }) => (
        <AlbumItem
          title={item.name}
          coverSource={{ uri: item.cover }}
          subTitle={item.count}
          onPress={() => props.onSelectAlbum(item)}
          leftStyle={{ width: WIDTH / 6 }}
          rightComponent={
            item.name === props.chosenAlbumTitle && props.iconSelectedAlbum
          }
        />
      )}
      keyExtractor={(item, index) => String(item.date)}
    />
  </Animated.View>
);

const SendImage = props => (
  <View style={[styles.btnSend]}>
    <TouchableOpacity
      onPress={props.handleSendImage}
      style={[styles.iconSend, styles.fullCenter]}
      disabled={props.selectedPhotos.length === 0}
    >
      {props.iconSendImage}
    </TouchableOpacity>
    {props.selectedPhotos.length !== 0 && (
      <View style={styles.totalSeletedPhotos}>
        <Text style={styles.selectedMessage}>
          {props.selectedPhotos.length}
        </Text>
      </View>
    )}
  </View>
);

const CameraPicker = props => (
  <View style={styles.fullCenter}>
    {props.permissionGranted === RESULTS.GRANTED
      ? props.iconCameraPicker
      : props.iconCameraOff}

    <Text style={styles.captureText}>
      {props.permissionGranted === RESULTS.GRANTED
        ? 'Chụp ảnh'
        : 'Ứng dụng cần quyền truy cập Camera'}
    </Text>
  </View>
);
