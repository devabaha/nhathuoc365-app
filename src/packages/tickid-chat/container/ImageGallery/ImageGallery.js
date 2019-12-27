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
  PanResponder,
  PermissionsAndroid,
  ViewPropTypes,
  Platform,
  ActivityIndicator
} from 'react-native';
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
import ImageItem from '../../component/ImageItem';
import AlbumItem from '../../component/AlbumItem';
import GestureWrapper from '../../component/GestureWrapper';
import { willUpdateState, setStater } from '../../helper';

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
    defaultStatusBarColor: '#fff',
    onExpandedBodyContent: defaultListener,
    onCollapsedBodyContent: defaultListener,
    onSendImage: defaultListener,
    setHeader: defaultListener,
    onToggleImage: defaultListener
  };

  state = {
    photos: [],
    scrollable: false,
    showAlbumPicker: false,
    chosenAlbumTitle: '',
    albums: [],
    selectedPhotos: [],
    openAlbum: false,
    animatedAlbumHeight: new Animated.Value(0),
    openLightBox: false,
    openPanel: false
  };

  animatedTranslateYScrollView = new Animated.Value(-this.props.baseViewHeight);
  rotateValue = new Animated.Value(0);
  animatedShowUpValue = new Animated.Value(0);

  unmounted = false;
  timerGetAlbum = null;
  offset = 0;
  aninmatedValue = 0;
  isAnimating = false;
  isScrolling = false;
  direction = 'down';
  refScrollView = null;
  actualScrollViewHeight = 0;
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
    onMoveShouldSetResponder: () => true,
    onMoveShouldSetResponderCapture: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      return dx > 2 || dx < -2 || dy > 2 || dy < -2;
    },
    onPanResponderMove: (evt, ges) => {
      if (this.state.scrollable) {
        if (!this.isScrolling) {
          // console.log('M.O.V.E', this.offset);
        }
        return false;
      }

      if (
        ges.dy < 0 &&
        this.offset <= 0 &&
        this.state.openPanel &&
        this.scrollable()
      ) {
        // console.log('can scroll');
        this.setState({ scrollable: true });
      }
      if (ges.dy < 0 && !this.state.openPanel && !this.isAnimating) {
        this.isAnimating = true;

        Animated.timing(this.animatedTranslateYScrollView, {
          toValue: this.actualScrollViewHeight,
          duration: this.props.durationShowGallery,
          easing: Easing.in,
          useNativeDriver: true
        }).start(res => {
          this.isAnimating = false;
          // console.log('expanded');
          setStater(this, this.unmounted, {
            openPanel: true
          });
        });
      }
      if (ges.dy > 0 && this.state.openPanel && !this.isAnimating) {
        this.isAnimating = false;
        // console.log('collapsing');

        this.setState(
          {
            openPanel: false,
            scrollable: false
          },
          () => {
            Animated.timing(this.animatedTranslateYScrollView, {
              toValue: 0,
              duration: this.props.durationShowGallery,
              easing: Easing.in,
              useNativeDriver: true
            }).start();
          }
        );
      }
    }
    // onPanResponderTerminationRequest: (evt, gestureState) => true,
    // onPanResponderGrant: (e) => { this.offset = e.nativeEvent.locationY },
    // onPanResponderTerminate: evt => true,
    // onPanResponderRelease: evt => this.handlePanResponderEnd(evt.nativeEvent),
  });

  get selectedPhotos() {
    return this.state.selectedPhotos;
  }

  updateActualScrollViewHeight(otherHeight = this.props.headerHeight) {
    this.actualScrollViewHeight =
      HEIGHT - otherHeight - (isAndroid ? ANDROID_STATUS_BAR : 0);
  }

  clearSelectedPhotos() {
    this.setState({ selectedPhotos: [] });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.itemPerRow !== this.props.itemPerRow ||
      nextProps.itemHeight !== this.props.itemHeight ||
      nextProps.headerHeight !== this.props.headerHeight ||
      nextProps.btnCloseAlbum !== this.props.btnCloseAlbum ||
      nextProps.btnCloseAlbumStyle !== this.props.btnCloseAlbumStyle ||
      nextProps.albumTitleStyle !== this.props.albumTitle ||
      nextProps.iconToggleAlbum !== this.props.iconToggleAlbum ||
      nextProps.iconSelectedAlbum !== this.props.iconSelectedAlbum ||
      nextProps.baseViewHeight !== this.props.baseViewHeight ||
      nextProps.defaultStatusBarColor !== this.props.defaultStatusBarColor ||
      nextProps.visible !== this.props.visible
    ) {
      if (nextProps.headerHeight !== this.props.headerHeight) {
        this.updateActualScrollViewHeight();
      }
      if (nextProps.visible !== this.props.visible) {
        Animated.parallel([
          Animated.timing(this.animatedShowUpValue, {
            toValue: nextProps.visible ? nextProps.baseViewHeight : 0,
            duration: this.props.durationShowGallery,
            easing: Easing.in
          }),
          Animated.timing(this.animatedTranslateYScrollView, {
            toValue: nextProps.visible ? 0 : -nextProps.baseViewHeight,
            duration: this.props.durationShowGallery,
            easing: Easing.in,
            useNativeDriver: true
          })
        ]).start();
      }

      return true;
    }

    return false;
  }

  componentDidMount() {
    this.updateActualScrollViewHeight();
    this.animatedTranslateYScrollView.addListener(
      this.onAnimatedValueChange.bind(this)
    );
    this.requestPermissions();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.animatedTranslateYScrollView.removeListener(
      this.onAnimatedValueChange.bind(this)
    );
    clearTimeout(this.timerGetAlbum);
  }

  requestPermissions = async () => {
    let permission = true;
    if (isAndroid) {
      permission = await this.requestExternalStoreageRead();
    }
    if (permission) {
      this.getAlbum();
    }
  };

  async requestExternalStoreageRead() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Cool App ...',
          message: 'App needs access to external storage'
        }
      );

      return granted == PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      //Handle this error
      console.log(err);
      return false;
    }
  }

  onAnimatedValueChange({ value }) {
    const bottom = 0;
    if (value === this.actualScrollViewHeight) {
      if (isAndroid) {
        StatusBar.setBackgroundColor('black', true);
      }
      // console.log('top');
      this.props.onExpandedBodyContent();
    }

    if (value === bottom) {
      if (this.aninmatedValue !== bottom && isAndroid) {
        StatusBar.setBackgroundColor(this.props.defaultStatusBarColor, true);
      }
      this.props.onCollapsedBodyContent();

      this.offset = 0;
      // console.log('bottom');
      this.setState({ scrollable: false, openPanel: false });
    }
    this.aninmatedValue = value;
  }

  getAlbum() {
    if (this.state.photos.length === 0) {
      this.setState({ loading: true });
    }
    clearTimeout(this.timerGetAlbum);
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
            .then(async r => {
              // this.timerGetAlbum = setTimeout(
              //   () => this.getAlbum(),
              //   DELAY_GET_ALBUM
              // );
              rawPhotoData = rawPhotoData.concat(r.edges);
              const { albums, photos } = await this.filterPhoto(rawPhotoData);
              const chosenAlbumTitle =
                this.state.chosenAlbumTitle || albums[0].name;
              setStater(this, this.unmounted, {
                albums,
                photos,
                chosenAlbumTitle: chosenAlbumTitle,
                loading: false
              });
            })
            .catch(err => {
              //Error Loading Images
              setStater(this, this.unmounted, { loading: false });
              console.log('get other album', err);
            });
        })
        .catch(err => {
          //Error Loading Images
          console.log('get recent photo album', err);
          setStater(this, this.unmounted, { loading: false });
        });
    } else {
      CameraRoll.getPhotos({
        first: 9999,
        assetType: 'Photos',
        groupTypes: 'All'
      })
        .then(async r => {
          // this.timerGetAlbum = setTimeout(
          //   () => this.getAlbum(),
          //   DELAY_GET_ALBUM
          // );
          const { albums, photos } = await this.filterPhoto(r.edges);
          const chosenAlbumTitle =
            this.state.chosenAlbumTitle || albums[0].name;
          setStater(this, this.unmounted, {
            albums,
            photos,
            chosenAlbumTitle: chosenAlbumTitle,
            loading: false
          });
        })
        .catch(err => {
          //Error Loading Images
          setStater(this, this.unmounted, { loading: false });
          console.log('get album', err);
        });
    }
  }

  async filterPhoto(edges) {
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

  showAlbumPicker() {
    this.setState({ showAlbumPicker: true });
  }
  hideAlbumPicker() {
    this.setState({ showAlbumPicker: false });
  }
  toggleAlbum() {
    Animated.parallel([
      Animated.timing(this.rotateValue, {
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

  scrollable(data = this.state.photos) {
    return (
      Math.ceil(data.length / this.props.itemPerRow) * this.props.itemHeight >
      HEIGHT
    );
  }

  captureImage() {
    const options = {
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

  //START - handle everything about gallery scroll event
  handleScrollBeginDrag(e) {
    // console.log('dragBegin', this.offset);
    this.offset = e.nativeEvent.contentOffset.y;
    this.isScrolling = false;
  }
  handleMomentumScrollBegin(e) {
    this.offset = e.nativeEvent.contentOffset.y;
    // console.log('momentBegin', this.offset);
  }
  handleScroll(e) {
    let y = e.nativeEvent.contentOffset.y;
    // console.log('scrolling', y);
    this.isScrolling = true;
    this.offset = e.nativeEvent.contentOffset.y;
  }
  handleScrollEndDrag(e) {
    this.offset = e.nativeEvent.contentOffset.y;
    // console.log('endDrag', this.offset);
  }
  handleMomentumScrollEnd(e) {
    this.isScrolling = false;
    this.offset = e.nativeEvent.contentOffset.y;
    console.log('momentEnd', this.offset, this.isScrolling);
    if (this.offset <= 0 && !this.isScrolling) {
      // this.refScrollView && this.refScrollView.scrollTo({ x: 0, y: 0 });
      this.refScrollView && this.refScrollView.scrollToOffset(0);
      setTimeout(() => {
        willUpdateState(this.unmounted, () =>
          this.setState(
            {
              openPanel: false,
              scrollable: false
            },
            () => {
              Animated.timing(this.animatedTranslateYScrollView, {
                toValue: 0,
                duration: this.props.durationShowGallery,
                easing: Easing.in,
                useNativeDriver: true
              }).start();
            }
          )
        );
      });
    }
  }
  //END - handle everything about gallery scroll event

  handleCloseModal() {
    if (this.state.openAlbum) {
      this.toggleAlbum();
    } else {
      this.isAnimating = true;
      this.offset = 0;
      this.setState({
        openPanel: false,
        scrollable: false
      });

      setTimeout(() => {
        Animated.timing(this.animatedTranslateYScrollView, {
          toValue: 0,
          duration: this.props.durationShowGallery,
          easing: Easing.in,
          useNativeDriver: true
        }).start(() => {
          this.isAnimating = false;
        });
      });
    }
  }

  handleSendImage() {
    // this.isAnimating = true;
    this.offset = 0;
    this.setState(
      {
        openPanel: false,
        scrollable: false
      },
      () => this.props.onSendImage(this.state.selectedPhotos)
    );

    // setTimeout(() => {
    //   Animated.timing(this.animatedTranslateYScrollView, {
    //     toValue: 0,
    //     duration: this.props.durationShowGallery,
    //     easing: Easing.in,
    //     useNativeDriver: true
    //   }).start(() => {
    //     this.isAnimating = false;
    //   });
    //   this.props.onSendImage(this.state.selectedPhotos);
    // })
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
    // console.log(this.state.openPanel, 'scrollable');
    // const opacity = this.animatedTranslateYScrollView.interpolate({
    //   inputRange: [0, this.actualScrollViewHeight],
    //   outputRange: [0, 1]
    // });
    // const scrollPan = !this.state.scrollable &&
    //   !this.state.openLightBox && {
    //     ...this.panResponder.panHandlers
    //   };

    const rotate = this.rotateValue.interpolate({
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
      // <>
      //   <Animated.View
      //     style={[
      //       styles.center,
      //       styles.header,
      //       {
      //         opacity,
      //         height: this.props.headerHeight
      //       }
      //     ]}
      //     pointerEvents={this.state.openPanel ? 'auto' : 'none'}
      //   >
      //     <TouchableOpacity
      //       hitSlop={HIT_SLOP}
      //       style={[styles.btnCloseAlbum, this.props.btnCloseAlbumStyle]}
      //       onPress={this.handleCloseModal.bind(this)}
      //     >
      //       {this.props.btnCloseAlbum}
      //     </TouchableOpacity>
      //     <TouchableOpacity
      //       hitSlop={HIT_SLOP}
      //       onPress={this.toggleAlbum.bind(this)}
      //     >
      //       <View style={[styles.albumHeader]}>
      //         <Text
      //           style={[
      //             styles.center,
      //             styles.albumTitle,
      //             this.props.albumTitleStyle
      //           ]}
      //         >
      //           {this.state.chosenAlbumTitle}
      //         </Text>
      //         <Animated.View
      //           style={[
      //             styles.center,
      //             styles.iconToggleAlbum,
      //             { transform: [{ rotate }] }
      //           ]}
      //         >
      //           {this.props.iconToggleAlbum}
      //         </Animated.View>
      //       </View>
      //     </TouchableOpacity>
      //   </Animated.View>

      //   <Animated.View
      //     style={[
      //       styles.center,
      //       styles.albumContainer,
      //       {
      //         height: this.actualScrollViewHeight,
      //         transform: [{ translateY }]
      //       }
      //     ]}
      //   >
      //     <FlatList
      //       data={this.state.albums}
      //       ItemSeparatorComponent={() => (
      //         <View style={{ border: 'none', height: 0 }}></View>
      //       )}
      //       renderItem={({ item, index }) => (
      //         <AlbumItem
      //           title={item.name}
      //           coverSource={{ uri: item.cover }}
      //           subTitle={item.count}
      //           onPress={() => this.onSelectAlbum(item)}
      //           leftStyle={{ width: WIDTH / 6 }}
      //           rightComponent={
      //             item.name === this.state.chosenAlbumTitle &&
      //             this.props.iconSelectedAlbum
      //           }
      //         />
      //       )}

      //       keyExtractor={(item, index) => String(item.date)}
      //     />
      //   </Animated.View>

      //   <Animated.View
      //     style={{
      //       width: WIDTH,
      //       backgroundColor: 'rgba(0,0,0,0)',
      //       height: this.animatedShowUpValue
      //     }}
      //   />

      //   <Animated.View
      //     style={[
      //       styles.container,
      //       {
      //         zIndex: 1,
      //         position: 'absolute',
      //         top: 0,
      //         width: '100%',
      //         height: this.actualScrollViewHeight,
      //         borderTopWidth: 0.5,
      //         borderColor: '#d9d9d9',
      //         transform: [
      //           {
      //             translateY: this.animatedTranslateYScrollView.interpolate({
      //               inputRange: [
      //                 -this.props.baseViewHeight,
      //                 0,
      //                 this.actualScrollViewHeight
      //               ],
      //               outputRange: [
      //                 HEIGHT,
      //                 HEIGHT - (isAndroid ? 24 : 0) -
      //                 (this.props.visible ? this.props.baseViewHeight : 0),
      //                 this.props.headerHeight
      //               ]
      //             })
      //           }
      //         ]
      //       }
      //     ]}
      //   >
      //     <View
      //       style={[
      //         styles.container,
      //         {
      //           flexDirection: 'column'
      //         }
      //       ]}
      //       {...scrollPan}
      //     >
      //       <FlatList
      //         contentContainerStyle={{ flexGrow: 1 }}
      //         data={this.state.photos}
      //         // extraData={this.state.photos}
      //         initialNumToRender={50}
      //         numColumns={3}
      //         ref={inst => (this.refScrollView = inst)}
      //         onContentSizeChange={() => {
      //           if (this.state.openAlbum) {
      //             if (this.scrollable()) {
      //               // console.log('b1');
      //               this.setState({ scrollable: true });
      //             } else {
      //               this.setState({ scrollable: false });
      //             }
      //           }
      //         }}
      //         onScrollBeginDrag={this.handleScrollBeginDrag.bind(this)}
      //         onMomentumScrollBegin={this.handleMomentumScrollBegin.bind(this)}
      //         onScroll={this.handleScroll.bind(this)}
      //         onMomentumScrollEnd={this.handleMomentumScrollEnd.bind(this)}
      //         onScrollEndDrag={this.handleScrollEndDrag.bind(this)}
      //         scrollEnabled={this.state.openPanel && !this.state.openLightBox}
      //         style={[styles.scrollViewStyle]}
      //         renderItem={({ item: photo, index }) => {
      //           let selectedIndex = this.state.selectedPhotos.findIndex(
      //             p => p.id === photo.id
      //           );

      //           return <TouchableOpacity
      //             style={[styles.center, wrapperItemStyle, { zIndex: 1 }]}
      //             onPress={() => {
      //               photo.path === 'camera' && this.captureImage();
      //             }}
      //           >
      //             <View style={{ flex: 1, width: '100%', height: '100%' }} {...this.testPanResponder}>
      //               {photo.path === 'camera' ? (
      //                 this.props.iconCameraPicker
      //               ) : (
      //                   <ImageItem
      //                     onOpenLightBox={() => this.setState({ openLightBox: true })}
      //                     onCloseLightBox={() => this.setState({ openLightBox: false })}
      //                     source={{
      //                       uri: photo.path
      //                     }}
      //                     onToggleItem={() => this.onTogglePhoto(photo, selectedIndex)}
      //                     isSelected={selectedIndex !== -1}
      //                     selectedMessage={selectedIndex !== -1 ? selectedIndex + 1 : 0}
      //                     containerStyle={{
      //                       width: '100%',
      //                       height: '100%'
      //                     }}
      //                   />
      //                 )}
      //             </View>
      //           </TouchableOpacity>
      //         }}
      //         keyExtractor={(item) => String(item.id)}
      //       />
      //     </View>
      //     {this.state.openPanel && !this.state.openAlbum && (
      //       <View style={styles.btnSend}>
      //         <TouchableOpacity
      //           onPress={this.handleSendImage.bind(this)}
      //           style={[styles.iconSend]}
      //         >
      //           {this.props.iconSendImage}
      //         </TouchableOpacity>
      //         {this.state.selectedPhotos.length !== 0 && (
      //           <View style={styles.totalSeletedPhotos}>
      //             <Text style={styles.selectedMessage}>
      //               {this.state.selectedPhotos.length}
      //             </Text>
      //           </View>
      //         )}
      //       </View>
      //     )}
      //   </Animated.View>
      // </>
      <GestureWrapper
        setHeader={this.props.setHeader}
        openHeader={this.state.openAlbum}
        visible={this.props.visible}
        isActivePanResponder={!this.state.openLightBox}
        startExpandingBodyContent={this.handleExpandedGallery.bind(this)}
        startCollapsingBodyContent={this.handleCollapsedGallery.bind(this)}
        bodyData={this.state.photos}
        collapsedBodyHeight={this.props.baseViewHeight}
        defaultStatusBarColor={this.props.defaultStatusBarColor}
        contentScrollEnabled={this.state.openPanel && !this.state.openLightBox}
        contentFlatListProps={{
          initialNumToRender: 30,
          numColumns: 3,
          // onContentSizeChange: () => {
          //   if (this.state.openAlbum) {
          //     this.setState({ scrollable: this.scrollable() });
          //   }
          // },
          ListHeaderComponent: this.state.loading && (
            <View
              style={{
                flex: 1,
                height: this.props.baseViewHeight,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          ),
          getItemLayout: (data, index) => ({
            length: this.props.itemHeight,
            offset: this.props.itemHeight * index,
            index
          }),
          renderItem: ({ item: photo, index }) => {
            let selectedIndex = this.state.selectedPhotos.findIndex(
              p => p.id === photo.id
            );

            return (
              <TouchableOpacity
                style={[styles.center, wrapperItemStyle, { zIndex: 1 }]}
                onPress={() => {
                  photo.path === 'camera' && this.captureImage();
                }}
              >
                <View style={{ flex: 1, width: '100%', height: '100%' }}>
                  {photo.path === 'camera' ? (
                    this.props.iconCameraPicker
                  ) : (
                    <ImageItem
                      onOpenLightBox={() =>
                        this.setState({ openLightBox: true })
                      }
                      onCloseLightBox={() =>
                        this.setState({ openLightBox: false })
                      }
                      source={{
                        uri: photo.path
                      }}
                      onToggleItem={() =>
                        this.onTogglePhoto(photo, selectedIndex)
                      }
                      isSelected={selectedIndex !== -1}
                      selectedMessage={
                        selectedIndex !== -1 ? selectedIndex + 1 : 0
                      }
                      containerStyle={{
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          },
          keyExtractor: (item, index) => String(index)
        }}
        onHeaderClosePress={this.handleCloseModal.bind(this)}
        btnHeaderClose={this.props.btnCloseAlbum}
        header={
          <TouchableOpacity
            hitSlop={HIT_SLOP}
            onPress={this.toggleAlbum.bind(this)}
          >
            <View style={[styles.albumHeader]}>
              <Text
                style={[
                  styles.center,
                  styles.albumTitle,
                  this.props.albumTitleStyle
                ]}
              >
                {this.state.chosenAlbumTitle}
              </Text>
              <Animated.View
                style={[
                  styles.center,
                  styles.iconToggleAlbum,
                  { transform: [{ rotate }] }
                ]}
              >
                {this.props.iconToggleAlbum}
              </Animated.View>
            </View>
          </TouchableOpacity>
        }
        headerContent={
          <Animated.View
            style={[
              styles.center,
              styles.albumContainer,
              {
                height: '100%',
                transform: [{ translateY }]
              }
            ]}
          >
            <FlatList
              data={this.state.albums}
              ItemSeparatorComponent={() => (
                <View style={{ border: 'none', height: 0 }}></View>
              )}
              renderItem={({ item, index }) => (
                <AlbumItem
                  title={item.name}
                  coverSource={{ uri: item.cover }}
                  subTitle={item.count}
                  onPress={() => this.onSelectAlbum(item)}
                  leftStyle={{ width: WIDTH / 6 }}
                  rightComponent={
                    item.name === this.state.chosenAlbumTitle &&
                    this.props.iconSelectedAlbum
                  }
                />
              )}
              keyExtractor={(item, index) => String(item.date)}
            />
          </Animated.View>
        }
        extraBodyContent={
          this.state.openPanel && !this.state.openAlbum ? (
            <View style={[styles.btnSend]}>
              <TouchableOpacity
                onPress={this.handleSendImage.bind(this)}
                style={[styles.iconSend]}
                disabled={this.state.selectedPhotos.length === 0}
              >
                {this.props.iconSendImage}
              </TouchableOpacity>
              {this.state.selectedPhotos.length !== 0 && (
                <View style={styles.totalSeletedPhotos}>
                  <Text style={styles.selectedMessage}>
                    {this.state.selectedPhotos.length}
                  </Text>
                </View>
              )}
            </View>
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
    backgroundColor: 'white',
    position: 'absolute'
  },
  iconSend: {
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30
  },
  selectedMessage: {
    color: 'white',
    fontSize: 14,
    lineHeight: 15,
    fontWeight: '600'
  }
});

export default ImageGallery;
