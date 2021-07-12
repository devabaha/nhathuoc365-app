import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  Animated,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import NoResult from 'src/components/NoResult';
import ImageItem from './ImageItem';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';
import ProfileContext from '../ProfileContext';

const MAX_IMAGE_UPLOADED = 9;
const ORIGIN_PADDING = 15;
const ORIGIN_HEIGHT =
  appConfig.device.height -
  (StatusBar.currentHeight || 0) -
  appConfig.device.bottomSpace;

const CHOOSE_PHOTO_TYPE = {
  CAMERA: 'camera',
  LIBRARY: 'library'
};

const CHOOSE_PHOTO_DATA = [
  {
    type: CHOOSE_PHOTO_TYPE.CAMERA,
    title: 'Máy ảnh'
  },
  {
    type: CHOOSE_PHOTO_TYPE.LIBRARY,
    title: 'Thư viện'
  }
];

class Gallery extends Component {
  static contextType = ProfileContext;
  state = {
    headingHeight: undefined,
    galleryHeight: undefined,
    isModalOpen: false,
    animatedScroll: new Animated.Value(0)
  };
  refModal = React.createRef();
  unmounted = false;
  uploaded = false;

  get imagesLength() {
    return this.props.data ? this.props.data.length : -1;
  }

  get paddingAnimatedArea() {
    const { upperLayout } = this.context;
    return upperLayout
      ? ORIGIN_HEIGHT * 0.8 - (ORIGIN_HEIGHT - upperLayout)
      : 0;
  }

  get containerHeight() {
    let currentheight = ORIGIN_HEIGHT * 0.8;
    if (this.state.headingHeight && this.state.galleryHeight) {
      currentheight = this.state.headingHeight + this.state.galleryHeight;
    }
    if (currentheight >= ORIGIN_HEIGHT * 0.8) {
      currentheight = ORIGIN_HEIGHT * 0.8;
    }
    return currentheight - (this.state.headingHeight || 0);
  }

  componentWillUnmount() {
    if (this.uploaded) {
      ImagePicker.clean();
    }
    this.unmounted = true;
  }

  handleOpenUploadSelection = () => {
    if (this.imagesLength >= MAX_IMAGE_UPLOADED) {
      Alert.alert('Bạn chỉ có thể upload tối đa 9 ảnh');
      return;
    }

    Actions.push(appConfig.routes.modalList, {
      onPressItem: this.onPressChoosePhotoType,
      data: CHOOSE_PHOTO_DATA,
      onCloseModal: Actions.pop,
      modalStyle: { height: undefined },
      heading: 'Chọn ảnh'
    });
  };

  onPressChoosePhotoType = ({ type }) => {
    switch (type) {
      case CHOOSE_PHOTO_TYPE.CAMERA:
        this.openCamera();
        break;
      case CHOOSE_PHOTO_TYPE.LIBRARY:
        this.openLibrary();
        break;
    }
  };

  openLibrary() {
    ImagePicker.openPicker({
      includeExif: true,
      multiple: true,
      includeBase64: true,
      mediaType: 'photo'
    }).then(images => {
      Actions.pop();
      this.uploaded = true;
      const imgs = this.nomarlizeImages(images);
      this.props.uploadMultiTempImage(imgs);
    });
  }

  openCamera() {
    ImagePicker.openCamera({
      includeExif: true,
      includeBase64: true
    }).then(image => {
      Actions.pop();
      this.uploaded = true;
      const img = this.nomarlizeImages([image])[0];
      this.props.uploadTempImage(img);
    });
  }

  nomarlizeImages(images) {
    return images.map(img => {
      if (!img.filename) {
        img.filename = `${new Date().getTime()}`;
      }
      return img;
    });
  }

  renderItem = ({ item: img, index }) => {
    const size = (appConfig.device.width - ORIGIN_PADDING * 4) / 3;
    const sizeStyle = {
      width: size,
      height: size,
      marginRight: ORIGIN_PADDING
    };
    const paddingHorizontalStyle =
      index % 2 !== 0
        ? { paddingRight: ORIGIN_PADDING }
        : { paddingLeft: ORIGIN_PADDING };

    const paddingTopStyle = index < 3 && { marginTop: ORIGIN_PADDING };

    return (
      <ImageItem
        style={[sizeStyle, paddingTopStyle]}
        originPadding={ORIGIN_PADDING}
        img={img.name}
        onDelete={() => this.props.onDeleteImage(img.id)}
      />
    );
  };

  onHeadingLayout = e => {
    this.setState({ headingHeight: e.nativeEvent.layout.height });
  };

  onGalleryLayout = e => {
    this.setState({ galleryHeight: e.nativeEvent.layout.height });
  };

  render() {
    const { isMainUser } = this.context;
    // const containerStyle = {
    //   height: this.containerHeight,
    //   transform: [{ translateY: -this.paddingAnimatedArea }]
    // };
    // const animatedStyle = this.state.headingHeight && {
    //   transform: [
    //     {
    //       translateY: this.state.animatedScroll.interpolate({
    //         inputRange: [0, this.paddingAnimatedArea],
    //         outputRange: [0, -this.paddingAnimatedArea],
    //         extrapolate: 'clamp'
    //       })
    //     }
    //   ]
    // };
    const emptyContainerStyle = {
      flex: 1,
      marginTop: 100,
      // marginTop: this.state.headingHeight || 0,
      // width: '100%',
      // height: '100%',
      backgroundColor: '#fafafa',
      justifyContent: 'center',
      alignItems: 'center'
      // paddingTop: this.paddingAnimatedArea,
    };

    return (
      <>
        <Animated.View
          onLayout={this.onHeadingLayout}
          style={[
            styles.headerContainer
            // animatedStyle
          ]}
        >
          {this.props.headerComponent}

          <View style={[styles.row]}>
            <Text style={styles.title}>Ảnh ({this.imagesLength})</Text>
            {isMainUser && (
              <TouchableOpacity onPress={this.handleOpenUploadSelection}>
                <Text style={styles.uploadText}>
                  <Icon name="upload" /> Tải thêm ảnh
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
        <View
          onLayout={this.onGalleryLayout}
          style={[
            styles.container
            // containerStyle
          ]}
        >
          {this.imagesLength === 0 ? (
            <View style={emptyContainerStyle}>
              <NoResult
                iconName="image-broken-variant"
                message="Chưa có ảnh tải lên"
              />
            </View>
          ) : (
            <View>
              <Animated.FlatList
                showsVerticalScrollIndicator={false}
                data={this.props.data}
                scrollEventThrottle={16}
                // onScroll={Animated.event(
                //   [
                //     {
                //       nativeEvent: {
                //         contentOffset: {
                //           y: this.state.animatedScroll
                //         }
                //       }
                //     }
                //   ],
                //   { useNativeDriver: true }
                // )}
                renderItem={this.renderItem}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                columnWrapperStyle={styles.columnWrapperStyle}
                // contentContainerStyle={{ paddingTop: this.paddingAnimatedArea }}
              />
            </View>
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1
  },
  headerContainer: {
    zIndex: 2
  },
  row: {
    backgroundColor: '#f1f1f1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5
  },
  title: {
    fontWeight: '600',
    color: '#444'
  },
  uploadText: {
    color: '#777'
  },
  columnWrapperStyle: {
    // justifyContent: 'space-between',
    paddingLeft: ORIGIN_PADDING,
    backgroundColor: '#fcfcfc'
  }
});

export default withTranslation(['account', 'common'])(Gallery);
