import React, {useCallback, useRef, useState, useEffect, useMemo} from 'react';
import {Alert, BackHandler, Keyboard, StyleSheet, View} from 'react-native';
import {reaction} from 'mobx';
import {Actions} from 'react-native-router-flux';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {openCamera, openLibrary} from 'app-helper/image';
import {formatPostStoreData} from 'app-helper/social';
import {renderGridImages} from 'app-helper/social';
import {mergeStyles} from 'src/Themes/helper';
// routing
import {push} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {MAX_TOTAL_UPLOAD_IMAGES} from 'src/constants/social/post';
import {TypographyType} from 'src/components/base';
// custom components
import {
  AppFilledButton,
  BaseButton,
  ButtonRoundedType,
  ScreenWrapper,
  ScrollView,
  Typography,
} from 'src/components/base';
import PleasePost from '../components/PleasePost';
import MultilineTextInput from './MultilineTextInput';
import ModalGalleryOptionAndroid from 'app-packages/tickid-chat/container/ModalGalleryOptionAndroid';

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
  },

  block: {
    marginBottom: 5,
  },

  btnPostContainer: {
    padding: 10,
    paddingVertical: 5,
    right: 12,
  },
  btnPost: {},

  extraListBottom: {
    width: '100%',
  },

  overImagesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  overImagesTitle: {
    fontWeight: 'bold',
  },
  overImagesDescription: {
    textAlign: 'center',
    marginTop: 15,
  },
});

const CreatePost = ({
  navigation,
  // group = {},
  groupId,
  postId,
  siteId = store?.store_data?.id,
  avatar = store.user_info.img,
  title,
  editMode,
  contentText: contentTextProp = '',
  images: imagesProp,
  isOpenImagePicker: isOpenImagePickerProp = false,
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation(['common', 'social']);

  const isUnmounted = useRef(false);
  const now = useRef(0);
  const uploadRequest = useRef([]);
  const refScrollView = useRef();
  const startOffsetY = useRef(0);
  const offsetY = useRef(0);
  const containerHeight = useRef(0);
  const canBack = useRef(false);

  const [contentText, setContentText] = useState(contentTextProp || '');
  const [images, setImages] = useState(imagesProp || []);
  const [isOpenImagePicker, setOpenImagePicker] = useState(
    isOpenImagePickerProp,
  );

  const [editable, setEditable] = useState(true);

  const [keyboardHeight, setKeyboardHeight] = useState(store.keyboardTop);

  useEffect(() => {
    if (!navigation) return;

    const updateNavBarDisposer = updateNavbarTheme(navigation, theme);

    return updateNavBarDisposer;
  }, [theme]);

  useEffect(() => {
    setTimeout(() => {
      Actions.refresh({
        right: () => renderPostBtn(),
      });
    });
  }, [
    images,
    contentText,
    groupId,
    siteId,
    contentTextProp,
    imagesProp,
    editMode,
  ]);

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
    if (!!images?.length && images.length > MAX_TOTAL_UPLOAD_IMAGES) return;
    const postData = editMode
      ? {
          ...(store.socialPosts.get(postId) || {}),
          content: contentText,
        }
      : {
          id: new Date().getTime(),
          // group,
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
    if (editMode) {
      store.socialCreatePost(postData, t, undefined, true);
    } else {
      store.socialCreatePost(postData, t, formatPostStoreData);
    }
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
    push(
      appConfig.routes.modalEditImages,
      {
        title: t('social:createPostEditImagesTitle'),
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
      },
      theme,
    );
  }, [images, theme]);

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

  const isOverNumberOfUploadImages =
    !!images?.length && images.length > MAX_TOTAL_UPLOAD_IMAGES;

  const renderPostBtn = () => {
    const isDisabled =
      (!contentText && !images?.length) ||
      images.length > MAX_TOTAL_UPLOAD_IMAGES;

    const isEditMode = !!contentTextProp || !!imagesProp;

    return (
      <AppFilledButton
        onPress={handlePost}
        disabled={isDisabled}
        rounded={ButtonRoundedType.EXTRA_SMALL}
        style={styles.btnPostContainer}>
        {isEditMode ? t('save') : t('social:post')}
      </AppFilledButton>
    );
  };

  const renderOverLengthImagesMessage = () => {
    return (
      isOverNumberOfUploadImages && (
        <View style={overImagesContainerStyle}>
          <Typography
            type={TypographyType.TITLE_LARGE}
            style={overImagesTitleStyle}>
            {t('social:maxTotalPostImagesWarning')}
          </Typography>
          <Typography
            type={TypographyType.DESCRIPTION_MEDIUM}
            style={overImagesDescriptionStyle}>
            {t('social:maxTotalPostImagesDescription', {
              max: MAX_TOTAL_UPLOAD_IMAGES,
            })}
          </Typography>
        </View>
      )
    );
  };

  const overImagesContainerStyle = useMemo(() => {
    return mergeStyles(styles.overImagesContainer, {
      backgroundColor: theme.color.overlay60,
    });
  }, [theme]);

  const overImagesTitleStyle = useMemo(() => {
    return mergeStyles(styles.overImagesTitle, {
      color: theme.color.onOverlay,
    });
  }, [theme]);

  const overImagesDescriptionStyle = useMemo(() => {
    return mergeStyles(styles.overImagesDescription, {
      color: theme.color.onOverlay,
    });
  }, [theme]);

  const listStyle = useMemo(() => {
    return mergeStyles(styles.list, {
      backgroundColor: theme.color.surface,
    });
  }, [theme]);

  return (
    <ScreenWrapper>
      <ScrollView
        safeLayout={!store.keyboardTop}
        ref={refScrollView}
        scrollEventThrottle={16}
        contentContainerStyle={listStyle}
        keyboardShouldPersistTaps="handled"
        onLayout={handleListLayout}
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}>
        <View style={{flex: 1}}>
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
            style={[
              styles.block,
              {
                flex: images?.length ? undefined : 1,
              },
            ]}
          />
          <BaseButton
            disabled={!isOverNumberOfUploadImages}
            onPress={goToEditImages}
            style={styles.block}>
            <View pointerEvents="none">{renderGridImages(images)}</View>
            {renderOverLengthImagesMessage()}
          </BaseButton>
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
