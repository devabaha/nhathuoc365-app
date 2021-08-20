import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import ImageItem from './ImageItem';
import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';
import ProfileContext from '../ProfileContext';

const MAX_IMAGE_UPLOADED = 9;
const ORIGIN_PADDING = 5;
const ORIGIN_HEIGHT =
  appConfig.device.height -
  (StatusBar.currentHeight || 0) -
  appConfig.device.bottomSpace;

const CHOOSE_PHOTO_TYPE = {
  CAMERA: 'camera',
  LIBRARY: 'library',
};

const CHOOSE_PHOTO_DATA = [
  {
    type: CHOOSE_PHOTO_TYPE.CAMERA,
    title: 'Máy ảnh',
  },
  {
    type: CHOOSE_PHOTO_TYPE.LIBRARY,
    title: 'Thư viện',
  },
];

class Gallery extends Component {
  static defaultProps = {
    renderHeader: () => {},
  };
  static contextType = ProfileContext;

  state = {
    headingHeight: undefined,
    galleryHeight: undefined,
    isModalOpen: false,
    animatedScroll: new Animated.Value(0),
  };
  refModal = React.createRef();
  unmounted = false;
  uploaded = false;

  moreActions = [this.props.t('common:delete'), this.props.t('common:cancel')];
  destructiveButtonIndex = 0; // index of delete action.

  get imagesLength() {
    return this.props.data?.length || 0;
  }

  get paddingAnimatedArea() {
    const {upperLayout} = this.context;
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
      modalStyle: {height: undefined},
      heading: 'Chọn ảnh',
    });
  };

  onPressChoosePhotoType = ({type}) => {
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
      mediaType: 'photo',
    }).then((images) => {
      Actions.pop();
      this.uploaded = true;
      const imgs = this.nomarlizeImages(images);
      this.props.uploadMultiTempImage(imgs);
    });
  }

  openCamera() {
    ImagePicker.openCamera({
      includeExif: true,
      includeBase64: true,
    }).then((image) => {
      Actions.pop();
      this.uploaded = true;
      const img = this.nomarlizeImages([image])[0];
      this.props.uploadTempImage(img);
    });
  }

  nomarlizeImages(images) {
    return images.map((img) => {
      if (!img.filename) {
        img.filename = `${new Date().getTime()}`;
      }
      return img;
    });
  }

  handlePressAction = (image, actionIndex) => {
    switch (actionIndex) {
      case this.destructiveButtonIndex:
        Actions.pop();
        this.props.onDeleteImage(image.id);
        break;
    }
  };

  handlePressImage = (image, index) => {
    Actions.push(appConfig.routes.itemImageViewer, {
      images: this.props.data,
      index,
      moreActionSheetOptions: {
        options: this.moreActions,
        destructiveButtonIndex: this.destructiveButtonIndex,
        onPress: (actionIndex) => this.handlePressAction(image, actionIndex),
      },
    });
  };

  renderItem = ({item: img, index}) => {
    const size = (appConfig.device.width - ORIGIN_PADDING * 4) / 3;
    const sizeStyle = {
      width: size,
      height: size,
      marginRight: ORIGIN_PADDING,
    };
    const paddingHorizontalStyle =
      index % 2 !== 0
        ? {paddingRight: ORIGIN_PADDING}
        : {paddingLeft: ORIGIN_PADDING};

    const paddingTopStyle = index < 3 && {marginTop: ORIGIN_PADDING};

    return (
      <ImageItem
        style={[sizeStyle, paddingTopStyle]}
        originPadding={ORIGIN_PADDING}
        img={img.name}
        onPress={() => this.handlePressImage(img, index)}
        // onDelete={() => this.props.onDeleteImage(img.id)}
      />
    );
  };

  onHeadingLayout = (e) => {
    this.setState({headingHeight: e.nativeEvent.layout.height});
  };

  onGalleryLayout = (e) => {
    this.setState({galleryHeight: e.nativeEvent.layout.height});
  };

  renderHeader = () => {
    const {isMainUser} = this.context;

    return (
      <>
        {this.props.renderHeader()}
        <Animated.View
          onLayout={this.onHeadingLayout}
          style={[styles.headerContainer]}>
          {this.props.headerComponent}

          <View style={[styles.row]}>
            <Text style={styles.title}>Ảnh {`(${this.imagesLength})`}</Text>
            {isMainUser && (
              <TouchableOpacity onPress={this.handleOpenUploadSelection}>
                <Text style={styles.uploadText}>
                  <Icon name="upload" size={13} />
                  {`  `}Tải thêm ảnh
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </>
    );
  };

  renderEmpty = () => {
    return (
      <View style={styles.emptyContainerStyle}>
        <Text style={styles.noImage}>Chưa có ảnh</Text>
      </View>
    );
  };

  render() {
    console.log(this.props.data)
    return (
      <>
        <View onLayout={this.onGalleryLayout} style={[styles.container]}>
          <Animated.FlatList
            showsVerticalScrollIndicator={false}
            data={this.props.data || []}
            scrollEventThrottle={16}
            renderItem={this.renderItem}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={styles.columnWrapperStyle}
            ListHeaderComponent={this.renderHeader}
            {...this.props.listProps}
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  emptyContainerStyle: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    backgroundColor: '#f5f5f5',
    zIndex: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 15,
    borderTopColor: appConfig.colors.border,
    borderTopWidth: 0.5,
  },
  title: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
    letterSpacing: 1,
  },
  uploadText: {
    color: '#777',
  },
  columnWrapperStyle: {
    // justifyContent: 'space-between',
    paddingLeft: ORIGIN_PADDING,
    backgroundColor: '#fcfcfc',
  },
  noImage: {
    padding: 15,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#666',
    fontWeight: '300',
    textAlign: 'center',
  },
});

export default withTranslation(['account', 'common'])(Gallery);
