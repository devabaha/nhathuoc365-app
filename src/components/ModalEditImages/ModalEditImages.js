import {openCamera, openLibrary} from 'app-helper/image';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
// 3-party libs
import {Actions} from 'react-native-router-flux';
// configs
import appConfig from 'app-config';
// helpers
import {getImageRatio} from 'app-helper/social/post';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {mergeStyles} from 'src/Themes/helper';
import {TypographyType, BundleIconSetName} from 'src/components/base';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import Image from '../Image';
import NoResult from '../NoResult';
import {
  ScreenWrapper,
  FlatList,
  Container,
  IconButton,
  BaseButton,
  TextButton,
  Typography,
  Icon,
} from 'src/components/base';
import ModalGalleryOptionAndroid from 'app-packages/tickid-chat/container/ModalGalleryOptionAndroid';

const styles = StyleSheet.create({
  container: {},
  delContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  delIcon: {
    fontSize: 22,
  },
  icon: {
    fontSize: 22,
    marginRight: 10,
  },
  title: {},

  totalImagesContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 30,
    left: 15,
  },
  totalImages: {
    fontSize: 12,
  },
  totalImagesOver: {},

  imageContainer: {
    marginBottom: 10,
  },

  selectImageBtnContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
});

const ModalEditImages = ({
  navigation,
  images: imagesProp = [],
  maxImages,
  onOverMaxImages = () => {},
  onChangeImages = () => {},
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation();

  const [images, setImages] = useState(imagesProp);
  const [isOpenImagePicker, setOpenImagePicker] = useState(false);

  const [selectImageTypoProps] = useState({
    type: TypographyType.LABEL_LARGE_PRIMARY,
  });

  useEffect(() => {
    if (!navigation) return;

    const updateNavBarDisposer = updateNavbarTheme(navigation, theme);

    return updateNavBarDisposer;
  }, [theme]);

  useEffect(() => {
    const backHandlerListener = () => {
      onChangeImages(images);
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backHandlerListener);

    Actions.refresh({
      onBack: () => {
        onChangeImages(images);
        Actions.pop();
      },
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandlerListener);
    };
  }, [images]);

  const handleDelImage = useCallback(
    (index) => {
      const tempImages = [...images];
      tempImages.splice(index, 1);
      setImages(tempImages);
    },
    [images],
  );

  const checkOverImages = (newImages) => {
    if (!!maxImages && newImages.length > maxImages) {
      onOverMaxImages(newImages, maxImages);
    }
  };

  const handleSelectImage = () => {
    setOpenImagePicker(true);
  };

  const handleOpenCamera = () => {
    openCamera((selectedImages) => {
      const newImages = images.concat(selectedImages);
      setImages(newImages);
      checkOverImages(newImages);
    }, closeModal);
  };

  const handleOpenLibrary = () => {
    openLibrary((selectedImages) => {
      const newImages = images.concat(selectedImages);
      setImages(newImages);
      checkOverImages(newImages);
    }, closeModal);
  };

  const closeModal = () => {
    setOpenImagePicker(false);
  };

  const renderImage = ({item: image, index}) => {
    return (
      <Container style={styles.imageContainer}>
        <Image
          canTouch
          source={{uri: image.url || image.uri}}
          containerStyle={{
            width: appConfig.device.width,
            height: appConfig.device.width / getImageRatio(image),
          }}
        />
        <IconButton
          bundle={BundleIconSetName.IONICONS}
          name="close"
          hitSlop={HIT_SLOP}
          style={delContainerStyle}
          iconStyle={delIconStyle}
          onPress={() => handleDelImage(index)}
        />
      </Container>
    );
  };

  const renderEmpty = () => {
    return (
      <BaseButton
        style={{width: '100%', height: '100%'}}
        onPress={handleSelectImage}>
        <NoResult
          iconName="camera-plus-outline"
          message={t('addImagesDescription')}
        />
      </BaseButton>
    );
  };

  const renderImageIcon = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.IONICONS}
        name="ios-images"
        style={[styles.icon, titleStyle]}
      />
    );
  };

  const renderFooter = () => {
    return (
      <Container>
        <TextButton
          style={styles.selectImageBtnContainer}
          typoProps={selectImageTypoProps}
          onPress={handleSelectImage}
          renderIconLeft={renderImageIcon}>
          {t('addImages')}
        </TextButton>
      </Container>
    );
  };

  const delContainerStyle = useMemo(() => {
    return mergeStyles(styles.delContainer, {
      backgroundColor: theme.color.coreOverlay,
      borderRadius: theme.layout.borderRadiusExtraSmall,
      shadowColor: theme.color.shadow,
      ...theme.layout.shadow,
    });
  }, [theme]);

  const delIconStyle = useMemo(() => {
    return mergeStyles(styles.delIcon, {
      color: theme.color.onOverlay,
    });
  }, [theme]);

  const statusContainerStyle = useMemo(() => {
    return mergeStyles(styles.totalImagesContainer, {
      backgroundColor:
        images.length > maxImages ? theme.color.danger : theme.color.success,
      borderRadius: theme.layout.borderRadiusHuge,
      shadowColor: theme.color.shadow,
      ...theme.layout.shadow,
    });
  }, [theme, images.length, maxImages]);

  const totalImagesStyle = useMemo(() => {
    return mergeStyles(styles.totalImages, {color: theme.color.onOverlay});
  }, [theme]);

  return (
    <ScreenWrapper>
      {!!images.length ? (
        <>
          <FlatList
            safeLayout
            data={images}
            contentContainerStyle={{flexGrow: 1}}
            renderItem={renderImage}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={renderFooter()}
          />
          {!!maxImages && (
            <View style={statusContainerStyle}>
              <Typography
                type={TypographyType.LABEL_TINY}
                style={totalImagesStyle}>
                {images.length + '/' + maxImages}
              </Typography>
            </View>
          )}
        </>
      ) : (
        renderEmpty()
      )}

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

export default React.memo(ModalEditImages);
