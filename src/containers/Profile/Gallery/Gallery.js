import React, {Component} from 'react';
import {View, StyleSheet, StatusBar, Animated, Alert} from 'react-native';
// 3-party libs
import ImagePicker from 'react-native-image-crop-picker';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
import {getPickerOptions} from 'app-helper/image';
// routing
import {pop, push} from 'app-helper/routing';
// context
import ProfileContext from 'src/containers/Profile/ProfileContext';
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
import {IMAGE_PICKER_TYPE} from 'src/constants/image';
// custom components
import ImageItem from './ImageItem';
import {
  Typography,
  Icon,
  Container,
  FlatList,
  TextButton,
} from 'src/components/base';

const MAX_IMAGE_UPLOADED = 30;
const ORIGIN_PADDING = 5;
const ORIGIN_HEIGHT =
  appConfig.device.height -
  (StatusBar.currentHeight || 0) -
  appConfig.device.bottomSpace;

const CHOOSE_PHOTO_TYPE = {
  CAMERA: 'camera',
  LIBRARY: 'library',
};

class Gallery extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    renderHeader: () => {},
  };

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
  destructiveButtonIndex = this.moreActions.length - 2; // index of delete action.

  choosePhotoData = [
    {
      type: CHOOSE_PHOTO_TYPE.CAMERA,
      title: this.props.t('common:cameraLabel'),
    },
    {
      type: CHOOSE_PHOTO_TYPE.LIBRARY,
      title: this.props.t('common:photoLibraryLabel'),
    },
  ];

  headerButtonTypoProps = {type: TypographyType.LABEL_MEDIUM_TERTIARY};

  get theme() {
    return getTheme(this);
  }

  get imagesLength() {
    return this.props.data?.length || 0;
  }

  componentWillUnmount() {
    if (this.uploaded) {
      ImagePicker.clean();
    }
    this.unmounted = true;
  }

  handleOpenUploadSelection = () => {
    if (this.imagesLength >= MAX_IMAGE_UPLOADED) {
      Alert.alert(
        this.props.t('profileDetail:limitPhotosUploadNoti', {
          maxImagesUpload: MAX_IMAGE_UPLOADED,
        }),
      );
      return;
    }

    push(appConfig.routes.modalList, {
      onPressItem: this.onPressChoosePhotoType,
      data: this.choosePhotoData,
      onCloseModal: pop,
      modalStyle: {height: undefined},
      heading: this.props.t('common:selectPhotoLabel'),
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
    const options = getPickerOptions(IMAGE_PICKER_TYPE.RN_IMAGE_CROP_PICKER, {
      includeExif: true,
      multiple: true,
      includeBase64: true,
      mediaType: 'photo',
    });

    ImagePicker.openPicker(options).then((images) => {
      pop();
      this.uploaded = true;
      const imgs = this.nomarlizeImages(images);
      this.props.uploadMultiTempImage(imgs);
    });
  }

  openCamera() {
    const options = getPickerOptions(IMAGE_PICKER_TYPE.RN_IMAGE_CROP_PICKER, {
      includeExif: true,
      includeBase64: true,
    });

    ImagePicker.openCamera(options).then((image) => {
      pop();
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
        pop();
        this.props.onDeleteImage(image.id);
        break;
    }
  };

  handlePressImage = (image, index) => {
    push(appConfig.routes.itemImageViewer, {
      images: this.props.data,
      index,
      moreActionSheetOptions: (selectedImage) => {
        return {
          options: this.moreActions,
          destructiveButtonIndex: this.destructiveButtonIndex,
          onPress: (actionIndex) =>
            this.handlePressAction(selectedImage, actionIndex),
        };
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

  renderHeaderBtnIconLeft = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.ANT_DESIGN}
        name="upload"
        size={13}
        style={titleStyle}
      />
    );
  };

  renderHeader = () => {
    return (
      <>
        {this.props.renderHeader()}
        <Container
          animated
          onLayout={this.onHeadingLayout}
          style={styles.headerContainer}>
          {this.props.headerComponent}

          <View style={this.headerRowStyle}>
            <Typography type={TypographyType.LABEL_LARGE} style={styles.title}>
              {this.props.t('profileDetail:photoLabel')}{' '}
              {`(${this.imagesLength})`}
            </Typography>
            <ProfileContext.Consumer>
              {({isMainUser}) =>
                isMainUser && (
                  <TextButton
                    onPress={this.handleOpenUploadSelection}
                    typoProps={this.headerButtonTypoProps}
                    renderIconLeft={this.renderHeaderBtnIconLeft}>
                    {this.props.t('profileDetail:uploadPhotos')}
                  </TextButton>
                )
              }
            </ProfileContext.Consumer>
          </View>
        </Container>
      </>
    );
  };

  renderEmpty = () => {
    return (
      <Container flex center>
        <Typography
          type={TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY}
          style={styles.noImage}>
          {this.props.t('profileDetail:noPhoto')}
        </Typography>
      </Container>
    );
  };

  get headerRowStyle() {
    return mergeStyles(styles.row, {
      borderTopWidth: this.theme.layout.borderWidthSmall,
      borderTopColor: this.theme.color.border,
    });
  }

  render() {
    return (
      <>
        <Container flex>
          <FlatList
            animated
            safeLayout
            onLayout={this.onGalleryLayout}
            showsVerticalScrollIndicator={false}
            data={this.props.data || []}
            scrollEventThrottle={16}
            renderItem={this.renderItem}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={styles.columnWrapperStyle}
            ListHeaderComponent={this.renderHeader}
            // {...this.props.listProps}
          />
        </Container>
      </>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 15,
  },
  title: {
    fontWeight: '600',
    letterSpacing: 1,
  },
  columnWrapperStyle: {
    paddingLeft: ORIGIN_PADDING,
  },
  noImage: {
    padding: 15,
    fontStyle: 'italic',
    fontWeight: '300',
    textAlign: 'center',
  },
});

export default withTranslation(['account', 'common', 'profileDetail'])(Gallery);
