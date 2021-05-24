import ModalGalleryOptionAndroid from 'app-packages/tickid-chat/container/ModalGalleryOptionAndroid';
import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import appConfig from 'app-config';

import NoResult from 'src/components/NoResult';
import ScreenWrapper from 'src/components/ScreenWrapper';
import Button from 'src/components/Button';
import {ImageMessageChat} from 'app-packages/tickid-chat/component';
import Loading from 'src/components/Loading';
import {Actions} from 'react-native-router-flux';
import API from 'src/network/API';
import {renderGridImages} from 'app-helper/social';
import PleasePost from '../components/PleasePost';
import store from 'app-store';
import {reaction} from 'mobx';
import MultilineTextInput from './MultilineTextInput';

const NUM_COLUMNS = 3;
const IMAGE_PADDING = 15;
const IMAGE_WIDTH =
  (appConfig.device.width - IMAGE_PADDING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    margin: -15,
    flex: 1,
    backgroundColor: appConfig.colors.sceneBackground,
  },

  imageWrapper: {
    alignSelf: 'center',
    marginBottom: 15,

    borderWidth: 1,
    borderColor: appConfig.colors.sceneBackground,
    borderRadius: 15,
    backgroundColor: '#eee',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    margin: 0,
  },

  addMoreBtn: {
    flex: 1,
    backgroundColor: appConfig.colors.sceneBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: IMAGE_PADDING,
    padding: 15,
    paddingVertical: 30,
    borderRadius: 15,
  },
  addMoreIcon: {
    fontSize: 30,
    color: appConfig.colors.primary,
  },
  addMoreTitle: {
    marginTop: 15,
    color: '#333',
    textAlign: 'center',
  },

  delBtn: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: appConfig.colors.status.danger,
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevationShadowStyle(5),
  },
  delIcon: {
    fontSize: 18,
    color: '#fff',
  },

  list: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },

  extraListBottom: {
    width: '100%',
    backgroundColor: 'red',
  },

  input: {
    backgroundColor: '#fff',
    fontSize: 16,
    padding: 15,
  },
  inputClone: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
  },
});

const CreatePost = ({
  avatar = store.user_info.img,
  title,
  isOpenImagePicker: isOpenImagePickerProp = false,
  btnTitle = 'Tải ảnh',
  onSuccess = () => {},
}) => {
  const {t} = useTranslation(['common', 'social']);

  const isUnmounted = useRef(false);
  const uploadedSuccess = useRef(0);
  const uploaded = useRef(0);
  const uploadRequest = useRef([]);
  const refScrollView = useRef();
  const offsetY = useRef(0);
  const containerHeight = useRef(0);
  const contentHeight = useRef(0);
  const textInputOffsetY = useRef(0);
  const textInputCursorEnd = useRef(0);

  const [images, setImages] = useState([]);
  const [isOpenImagePicker, setOpenImagePicker] = useState(
    isOpenImagePickerProp,
  );
  const [isUploadData, setUploadData] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [keyboardHeight, setKeyboardHeight] = useState(store.keyboardTop);
  const [contentText, setContentText] = useState('');
  const [contentVisibleText, setContentVisibleText] = useState('');

  useEffect(() => {
    if (!title) {
      Actions.refresh({
        title: t('screen.createPost.mainTitle'),
      });
    }

    let disposer = reaction(
      () => store.keyboardTop,
      (height) => {
        setKeyboardHeight(height);
      },
    );

    return () => {
      isUnmounted.current = true;
      clearRequests();
      disposer();
    };
  }, []);

  useEffect(() => {
    Actions.refresh({
      onBack: () => {
        clearRequests();
        Actions.pop();
      },
    });
  }, [clearRequests, uploadedSuccess.current, images]);

  const clearRequests = useCallback(() => {
    uploadRequest.current.map((request) => request?.cancel && request.cancel());
  }, [uploadRequest.current]);

  const getImages = () => {
    return images.length ? images.concat([{isAddMore: true}]) : images;
  };

  const isDisabledUploadData = () => {
    return (
      !images?.length || uploaded.current === images.length || isUploadData
    );
  };

  const handleDelImage = (index) => {
    const temp = [...images];
    temp.splice(index, 1);
    setImages(temp);
  };

  const handleUploadData = () => {
    setLoading(true);
    setUploadData(true);
  };

  const handleSelectImage = () => {
    setOpenImagePicker(true);
  };

  const openLibrary = () => {
    ImageCropPicker.openPicker({
      includeExif: true,
      multiple: true,
      includeBase64: true,
      mediaType: 'photo',
      maxFiles: 10,
    })
      .then((response) => {
        // console.log(response);
        closeModal();
        const selectedImages = normalizeImages(response);
        console.log(selectedImages);
        setImages(images.concat(selectedImages));
      })
      .catch((err) => {
        console.log('open_picker_err', err);
        closeModal();
      });
  };

  const openCamera = async () => {
    const options = {
      rotation: 360,
      storageOptions: {
        skipBackup: false,
        path: 'images',
      },
    };

    ImagePicker.launchCamera(options, (response) => {
      if (response.error) {
        console.log(response);
        closeModal();
      } else if (response.didCancel) {
        console.log(response);
        closeModal();
      } else {
        // console.log(response);
        closeModal();
        response.path = response.uri;
        const selectedImages = normalizeImages([response]);
        setImages(images.concat(selectedImages));
        // console.log(selectedImages);
      }
    });
  };

  const normalizeImages = (images) => {
    return images.map((img) => {
      img.id = new Date().getTime();
      if (!img.filename) {
        img.filename = `${new Date().getTime()}`;
      }
      if (!img.fileName) {
        img.fileName = `${new Date().getTime()}`;

        if (img.mime) {
          img.fileName += '.' + img.mime.split('image/')[1];
        } else {
          img.fileName += '.jpeg';
        }
      }
      if (img.data) {
        img.uploadPath = img.data;
        img.isBase64 = true;
      }

      if (img.sourceURL) {
        img.uri = img.sourceURL;
      }

      if (img.sourceURL) {
        img.url = img.sourceURL;
      }
      return img;
    });
  };

  const closeModal = () => {
    setOpenImagePicker(false);
  };

  const updateUploadedTotal = () => {
    if (uploaded.current === images.length) {
      uploaded.current = uploadedSuccess.current;
      setLoading(false);
      setUploadData(false);
      if (isUnmounted && uploadedSuccess.current !== images.length) {
        flashShowMessage({
          type: 'danger',
          message: `Chưa hoàn tất tải ảnh (${uploadedSuccess.current}/${images.length})`,
        });
      }
    }
  };

  const handleUploadedSuccess = (response, isReUp, index) => {
    console.log(response);
    const temp = [...images];
    temp[index].uploaded = true;
    temp[index].url = response[0];
    setImages(images);

    uploadedSuccess.current++;
    uploaded.current++;
    updateUploadedTotal();
    if (uploadedSuccess.current === images.length) {
      Alert.alert('Tải thành công', 'Tất cả ảnh đã được tải thành công', [
        {
          text: 'OK',
          onPress: () => onSuccess(images),
        },
      ]);
    }
  };

  const handleUploadFail = (error) => {
    console.log('upload_image', error);
    uploaded.current++;
    updateUploadedTotal();
  };

  const handleListLayout = (e) => {
    containerHeight.current = e.nativeEvent.layout.height;
  };

  const handleScrollEnd = (e) => {
    offsetY.current = e.nativeEvent.contentOffset.y;
  };

  const handleInputCloneLayout = (contentOffset) => {
    if (
      contentOffset >=
      offsetY.current + containerHeight.current - store.keyboardTop
    ) {
      if (refScrollView.current) {
        refScrollView.current.scrollTo({
          y: contentOffset - containerHeight.current + store.keyboardTop,
          //   animated: false
        });
      }
    }
  };

  const renderEmpty = () => {
    return (
      <TouchableOpacity
        style={styles.emptyContainer}
        onPress={handleSelectImage}>
        <NoResult iconName="camera-plus-outline" message="Bấm để chọn ảnh" />
      </TouchableOpacity>
    );
  };

  const renderImage = ({item: image, index}) => {
    if (image.isAddMore) {
      return (
        <TouchableOpacity onPress={handleSelectImage} style={styles.addMoreBtn}>
          <MaterialCommunityIcons
            name="camera-plus-outline"
            style={styles.addMoreIcon}
          />
          <Text style={styles.addMoreTitle}>Bấm để chọn ảnh</Text>
        </TouchableOpacity>
      );
    }
    return (
      <ImageItem
        image={image}
        index={index}
        uploadURL={APIHandler.url_user_upload_image()}
        isUploaded={image.uploaded}
        startUploading={isUploadData}
        handleUploadedSuccess={handleUploadedSuccess}
        handleUploadFail={handleUploadFail}
        handleDelImage={handleDelImage}
        getUploadRequest={(request) => {
          uploadRequest.current[index] = request;
        }}
      />
    );
  };

//   console.log('render');
  return (
    <ScreenWrapper>
      {isLoading && <Loading center />}
      {/* <FlatList
        contentContainerStyle={styles.contentContainer}
        data={getImages()}
        renderItem={renderImage}
        ListEmptyComponent={renderEmpty}
        numColumns={3}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
      /> */}
      <ScrollView
        ref={refScrollView}
        scrollEventThrottle={16}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onLayout={handleListLayout}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}>
        <View>
          <PleasePost
            title={store.user_info.name}
            avatar={avatar}
            placeholder={null}
            onPressImages={handleSelectImage}
          />
          <MultilineTextInput onContentLayout={handleInputCloneLayout} />
          {renderGridImages(images)}
        </View>

        <View style={[styles.extraListBottom, {height: keyboardHeight}]} />
      </ScrollView>

      <ModalGalleryOptionAndroid
        visible={isOpenImagePicker}
        onClose={closeModal}
        onRequestClose={closeModal}
        onPressCamera={openCamera}
        onPressLibrary={openLibrary}
      />
    </ScreenWrapper>
  );
};

export default React.memo(CreatePost);

const ImageItem = React.memo(
  ({
    isUploaded: isUploadedProp,
    startUploading,
    uploadURL,
    image,
    index,
    getUploadRequest = () => {},
    handleUploadedSuccess = () => {},
    handleUploadFail = () => {},
    handleDelImage = () => {},
  }) => {
    const [isUploaded, setUploaded] = useState(isUploadedProp);
    const aspectRatio = (image.width || 1) / (image.height || 1);

    useEffect(() => {
      setUploaded(isUploadedProp);
    }, [isUploadedProp]);

    return (
      <View
        style={[
          styles.imageWrapper,
          {
            flex: 1,
            aspectRatio,
            maxWidth: IMAGE_WIDTH,
            marginLeft:
              (index + 1) % NUM_COLUMNS === 0 &&
              (index + NUM_COLUMNS - 1) % NUM_COLUMNS === 0
                ? IMAGE_PADDING
                : 0,
            marginRight:
              (index + NUM_COLUMNS) % NUM_COLUMNS === 0 ||
              (index + NUM_COLUMNS - 1) % NUM_COLUMNS === 0
                ? IMAGE_PADDING
                : 0,
          },
        ]}>
        <ImageMessageChat
          containerStyle={styles.imageContainer}
          uploadURL={uploadURL}
          isUploadData={image.uploaded ? false : startUploading}
          image={image}
          lowQualityUri={image.uri}
          getUploadRequest={getUploadRequest}
          onUploadedSuccess={(response, isReUp) => {
            setUploaded(true);
            handleUploadedSuccess(response, isReUp, index);
          }}
          onUploadedFail={(error) => {
            setUploaded(false);
            handleUploadFail(error);
          }}
        />
        <TouchableOpacity
          hitSlop={HIT_SLOP}
          disabled={isUploaded}
          style={[
            styles.delBtn,
            isUploaded && {
              backgroundColor: appConfig.colors.status.success,
            },
          ]}
          onPress={() => handleDelImage(index)}>
          <MaterialCommunityIcons
            name={isUploaded ? 'check' : 'close'}
            style={[styles.delIcon]}
          />
        </TouchableOpacity>
      </View>
    );
  },
);
