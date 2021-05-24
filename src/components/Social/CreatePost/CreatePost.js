import ModalGalleryOptionAndroid from 'app-packages/tickid-chat/container/ModalGalleryOptionAndroid';
import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import appConfig from 'app-config';

import ScreenWrapper from 'src/components/ScreenWrapper';
import {ImageMessageChat} from 'app-packages/tickid-chat/component';
import Loading from 'src/components/Loading';
import {Actions} from 'react-native-router-flux';
import {renderGridImages} from 'app-helper/social';
import PleasePost from '../components/PleasePost';
import store from 'app-store';
import {reaction} from 'mobx';
import MultilineTextInput from './MultilineTextInput';
import {openCamera, openLibrary} from 'app-helper/image';

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

  const [contentText, setContentText] = useState(
    'Cả nhà cùng tìm hiểu thông tin cơ bản về lịch sử ngày Phụ nữ Việt Nam 20/10 nhé!\r\rVào ngày 20 tháng 10 năm 1930, Hội Phụ nữ phản đế Việt Nam (nay đổi tên là Hội Liên hiệp Phụ nữ Việt Nam) chính thức được thành lập, để đánh dấu sự kiện này, Đảng Cộng sản Việt Nam đã quyết định chọn ngày 20 tháng 10 hằng năm làm ngày truyền thống của tổ chức này, đồng thời cũng xem đây là ngày kỷ niệm và tôn vinh phụ nữ Việt Nam, lấy tên là "Ngày Phụ nữ Việt Nam".\r\rTrước năm 1975 tại miền Nam Việt Nam, dưới chính thể Việt Nam Cộng Hòa, Ngày Phụ nữ Việt Nam cũng là ngày tưởng niệm Hai bà Trưng vào ngày 6 tháng 2 âm lịch.\r\rCả nhà cùng tìm hiểu thông tin cơ bản về lịch sử ngày Phụ nữ Việt Nam 20/10 nhé!\r\rVào ngày 20 tháng 10 năm 1930, Hội Phụ nữ phản đế Việt Nam (nay đổi tên là Hội Liên hiệp Phụ nữ Việt Nam) chính thức được thành lập, để đánh dấu sự kiện này, Đảng Cộng sản Việt Nam đã quyết định chọn ngày 20 tháng 10 hằng năm làm ngày truyền thống của tổ chức này, đồng thời cũng xem đây là ngày kỷ niệm và tôn vinh phụ nữ Việt Nam, lấy tên là "Ngày Phụ nữ Việt Nam".\r\rTrước năm 1975 tại miền Nam Việt Nam, dưới chính thể Việt Nam Cộng Hòa, Ngày Phụ nữ Việt Nam cũng là ngày tưởng niệm Hai bà Trưng vào ngày 6 tháng 2 âm lịch.',
  );
  const [images, setImages] = useState([]);
  const [isOpenImagePicker, setOpenImagePicker] = useState(
    isOpenImagePickerProp,
  );
  const [isUploadData, setUploadData] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [keyboardHeight, setKeyboardHeight] = useState(store.keyboardTop);

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
      right: () => renderPostBtn(),
    });
  }, [images, contentText]);

  useEffect(() => {
    Actions.refresh({
      onBack: () => {
        clearRequests();
        Actions.pop();
      },
    });
  }, [clearRequests, uploadedSuccess.current, images]);

  const handlePost = () => {
    console.log(contentText, images);
  };

  const renderPostBtn = () => {
    return (
      <TouchableOpacity
        onPress={handlePost}
        style={{
          backgroundColor: appConfig.colors.primary,
          padding: 10,
          paddingVertical: 5,
          borderRadius: 4,
          right: 12,
        }}>
        <Text style={{color: '#fff', fontSize: 16}}>Đăng</Text>
      </TouchableOpacity>
    );
  };

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

  const handleOpenCamera = () => {
    openCamera((selectedImages) => {
      setImages(selectedImages);
    }, closeModal);
  };

  const handleOpenLibrary = () => {
    openLibrary((selectedImages) => {
      setImages(selectedImages);
    }, closeModal);
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

  const goToEditImages = useCallback(() => {
    Actions.push(appConfig.routes.modalEditImages, {
      title: 'Chỉnh sửa',
      images,
      onChangeImages: (images) => setImages(images),
    });
  }, [images]);

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

  //   console.log('render');
  return (
    <ScreenWrapper>
      {isLoading && <Loading center />}
      <ScrollView
        ref={refScrollView}
        scrollEventThrottle={16}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        // keyboardDismissMode="on-drag"
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
          <MultilineTextInput
            value={contentText}
            onChangeText={setContentText}
            onContentLayout={handleInputCloneLayout}
          />
          <TouchableOpacity
            onPress={goToEditImages}
            style={{paddingBottom: 15}}>
            {renderGridImages(images)}
          </TouchableOpacity>
        </View>

        <View style={[styles.extraListBottom, {height: keyboardHeight}]} />
      </ScrollView>

      <ModalGalleryOptionAndroid
        visible={isOpenImagePicker}
        onClose={closeModal}
        onRequestClose={closeModal}
        onPressCamera={handleOpenCamera}
        onPressLibrary={handleOpenLibrary}
      />
    </ScreenWrapper>
  );
};

export default React.memo(CreatePost);
