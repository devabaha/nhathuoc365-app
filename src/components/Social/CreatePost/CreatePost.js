import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  Alert,
  BackHandler,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import appConfig from 'app-config';

import ScreenWrapper from 'src/components/ScreenWrapper';
import {Actions} from 'react-native-router-flux';
import {renderGridImages} from 'app-helper/social';
import PleasePost from '../components/PleasePost';
import store from 'app-store';
import {reaction} from 'mobx';
import MultilineTextInput from './MultilineTextInput';
import {openCamera, openLibrary} from 'app-helper/image';
import {formatPostStoreData} from 'app-helper/social';
import ModalGalleryOptionAndroid from 'app-packages/tickid-chat/container/ModalGalleryOptionAndroid';
import {MAX_TOTAL_UPLOAD_IMAGES} from 'src/constants/social/post';

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },

  btnPostContainer: {
    padding: 10,
    paddingVertical: 5,
    borderRadius: 4,
    right: 12,
  },
  btnPost: {
    color: '#fff', 
    fontSize: 16
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

  overImagesContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.7)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  overImagesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  overImagesDescription: {
    textAlign: 'center',
    color: '#eee',
    marginTop: 15,
  },
});

const CreatePost = ({
  group = {},
  groupId,
  siteId = store?.store_data?.id,
  avatar = store.user_info.img,
  title,
  isOpenImagePicker: isOpenImagePickerProp = false,
}) => {
  const {t} = useTranslation(['common', 'social']);

  const isUnmounted = useRef(false);
  const now = useRef(0);
  const uploadRequest = useRef([]);
  const refScrollView = useRef();
  const startOffsetY = useRef(0);
  const offsetY = useRef(0);
  const containerHeight = useRef(0);
  const canBack = useRef(false);

  const [contentText, setContentText] = useState(
    'Cả nhà cùng tìm hiểu thông tin cơ bản về lịch sử ngày Phụ nữ Việt Nam 20/10 nhé!\r\rVào ngày 20 tháng 10 năm 1930, Hội Phụ nữ phản đế Việt Nam (nay đổi tên là Hội Liên hiệp Phụ nữ Việt Nam) chính thức được thành lập, để đánh dấu sự kiện này, Đảng Cộng sản Việt Nam đã quyết định chọn ngày 20 tháng 10 hằng năm làm ngày truyền thống của tổ chức này, đồng thời cũng xem đây là ngày kỷ niệm và tôn vinh phụ nữ Việt Nam, lấy tên là "Ngày Phụ nữ Việt Nam".\r\rTrước năm 1975 tại miền Nam Việt Nam, dưới chính thể Việt Nam Cộng Hòa, Ngày Phụ nữ Việt Nam cũng là ngày tưởng niệm Hai bà Trưng vào ngày 6 tháng 2 âm lịch.\r\rCả nhà cùng tìm hiểu thông tin cơ bản về lịch sử ngày Phụ nữ Việt Nam 20/10 nhé!\r\rVào ngày 20 tháng 10 năm 1930, Hội Phụ nữ phản đế Việt Nam (nay đổi tên là Hội Liên hiệp Phụ nữ Việt Nam) chính thức được thành lập, để đánh dấu sự kiện này, Đảng Cộng sản Việt Nam đã quyết định chọn ngày 20 tháng 10 hằng năm làm ngày truyền thống của tổ chức này, đồng thời cũng xem đây là ngày kỷ niệm và tôn vinh phụ nữ Việt Nam, lấy tên là "Ngày Phụ nữ Việt Nam".\r\rTrước năm 1975 tại miền Nam Việt Nam, dưới chính thể Việt Nam Cộng Hòa, Ngày Phụ nữ Việt Nam cũng là ngày tưởng niệm Hai bà Trưng vào ngày 6 tháng 2 âm lịch.',
  );
  const [images, setImages] = useState([]);
  const [isOpenImagePicker, setOpenImagePicker] = useState(
    isOpenImagePickerProp,
  );

  const [editable, setEditable] = useState(true);

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
    setTimeout(() =>
      Actions.refresh({
        right: () => renderPostBtn(),
      }),
    );
  }, [images, contentText, group]);

  useEffect(() => {
    const handlePop = () => {
      if (canBack.current || (!contentText && !images?.length)) {
        clearRequests();
        Actions.pop();
      } else {
        Alert.alert(
          t('social:discardPost'),
          t('social:discardPostDescription'),
          [
            {
              text: t('social:discardPostConfirm'),
              style: 'destructive',
              onPress: () => {
                clearRequests();
                Actions.pop();
              },
            },
            {
              text: t('social:continuePostConfirm'),
            },
          ],
          {
            cancelable: false,
          },
        );
      }
    };

    const backHandlerListener = () => {
      handlePop();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backHandlerListener);

    Actions.refresh({
      onBack: handlePop,
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandlerListener);
    };
  }, [clearRequests, contentText, images]);

  const handlePost = () => {
    if(!!images?.length && images.length > MAX_TOTAL_UPLOAD_IMAGES) return;
    const postData = {
      id: new Date().getTime(),
      group,
      user: store?.user_info
        ? {
            ...store.user_info,
            image: store.user_info.img,
          }
        : {},
      created: new Date(),
      group_id: groupId,
      site_id: siteId,
      content: contentText,
    };

    if (!!images?.length) {
      postData.images = images;
    }
    canBack.current = true;
    Actions.pop();

    store.socialCreatePost(postData, t, formatPostStoreData);
  };

  const renderPostBtn = () => {
    const isDisabled =
      (!contentText && !images?.length) ||
      images.length > MAX_TOTAL_UPLOAD_IMAGES;

    return (
      <TouchableOpacity
        onPress={handlePost}
        disabled={isDisabled}
        style={[
          styles.btnPostContainer,
          {
            backgroundColor: isDisabled ? '#ccc' : appConfig.colors.primary,
          },
        ]}>
        <Text style={styles.btnPost}>{t('social:post')}</Text>
      </TouchableOpacity>
    );
  };

  const clearRequests = useCallback(() => {
    uploadRequest.current.map((request) => request?.cancel && request.cancel());
  }, [uploadRequest.current]);

  const handleSelectImage = () => {
    setOpenImagePicker(true);
  };

  const handleOpenCamera = () => {
    openCamera((selectedImages) => {
      setImages(images.concat(selectedImages));
    }, closeModal);
  };

  const handleOpenLibrary = () => {
    openLibrary((selectedImages) => {
      setImages(images.concat(selectedImages));
    }, closeModal);
  };

  const closeModal = () => {
    setOpenImagePicker(false);
  };

  const goToEditImages = useCallback(() => {
    Actions.push(appConfig.routes.modalEditImages, {
      title: 'Chỉnh sửa',
      images,
      maxImages: MAX_TOTAL_UPLOAD_IMAGES,
      onOverMaxImages: (images, max) => {
        Alert.alert(
          t('social:maxTotalPostImagesWarning'),
          t('social:maxTotalPostImagesDescription', {max}),
          [
            {
              text: t('social:maxTotalPostImagesConfirm'),
            },
          ],
        );
      },
      onChangeImages: (images) => {
        setImages(images);
      },
    });
  }, [images]);

  const handleListLayout = (e) => {
    containerHeight.current = e.nativeEvent.layout.height;
  };

  const handleScrollBeginDrag = (e) => {
    now.current = new Date().getTime();
    startOffsetY.current = e.nativeEvent.contentOffset.y;
    if (editable && !keyboardHeight) {
      setEditable(false);
    }
  };

  const handleScrollEnd = (e) => {
    offsetY.current = e.nativeEvent.contentOffset.y;
    const velocity = now.current
      ? (offsetY.current - startOffsetY.current) /
        (new Date().getTime() - now.current)
      : 0;

    if (Math.abs(velocity) > 1.5) {
      Keyboard.dismiss();
    }

    if (!editable) {
      setEditable(true);
    }
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

  const renderOveImagesMessage = () => {
    return (
      !!images?.length &&
      images.length > MAX_TOTAL_UPLOAD_IMAGES && (
        <View style={styles.overImagesContainer}>
          <Text style={styles.overImagesTitle}>
            {t('social:maxTotalPostImagesWarning')}
          </Text>
          <Text style={styles.overImagesDescription}>
            {t('social:maxTotalPostImagesDescription', {
              max: MAX_TOTAL_UPLOAD_IMAGES,
            })}
          </Text>
        </View>
      )
    );
  };

  //   console.log('render');
  return (
    <ScreenWrapper>
      <ScrollView
        ref={refScrollView}
        scrollEventThrottle={16}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        onLayout={handleListLayout}
        onScrollBeginDrag={handleScrollBeginDrag}
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
            autoFocus={!isOpenImagePickerProp}
            editable={editable}
            value={contentText}
            onChangeText={setContentText}
            onContentLayout={handleInputCloneLayout}
          />
          <TouchableOpacity onPress={goToEditImages} style={{marginBottom: 15}}>
            <View pointerEvents="none">{renderGridImages(images)}</View>
            {renderOveImagesMessage()}
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
