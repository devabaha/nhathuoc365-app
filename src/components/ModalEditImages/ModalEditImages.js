import {openCamera, openLibrary} from 'app-helper/image';
import React, {useCallback, useEffect, useState} from 'react';
import {
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Image from '../Image';
import Container from '../Layout/Container';
import NoResult from '../NoResult';
import ScreenWrapper from '../ScreenWrapper';

import appConfig from 'app-config';
import ModalGalleryOptionAndroid from 'app-packages/tickid-chat/container/ModalGalleryOptionAndroid';
import {getImageRatio} from 'app-helper/social/post';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  delContainer: {
    width: 30,
    height: 30,
    backgroundColor: '#242424',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    ...elevationShadowStyle(5),
  },
  delIcon: {
    color: '#fff',
    fontSize: 22,
  },
  icon: {
    color: appConfig.colors.primary,
    fontSize: 22,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    color: appConfig.colors.primary,
  },

  totalImagesContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 30,
    left: 15,
    borderRadius: 15,
    backgroundColor: appConfig.colors.status.success,
    ...elevationShadowStyle(3),
  },
  totalImages: {
    color: '#fff',
    // color: appConfig.colors.status.success,
    fontSize: 12,
  },
  totalImagesOver: {
    backgroundColor: appConfig.colors.status.danger,
  },
});

const ModalEditImages = ({
  images: imagesProp = [],
  maxImages,
  onOverMaxImages = () => {},
  onChangeImages = () => {},
}) => {
  const {t} = useTranslation();
  
  const [images, setImages] = useState(imagesProp);
  const [isOpenImagePicker, setOpenImagePicker] = useState(false);

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
    if(!!maxImages && newImages.length > maxImages){
      onOverMaxImages(newImages, maxImages)
    }
  }

  const handleSelectImage = () => {
    setOpenImagePicker(true);
  };

  const handleOpenCamera = () => {
    openCamera((selectedImages) => {
      const newImages = images.concat(selectedImages);
      setImages(newImages);
      checkOverImages(newImages)
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
      <Container centerVertical={false}>
        <Image
          canTouch
          source={{uri: image.url || image.uri}}
          containerStyle={{
            width: appConfig.device.width,
            height: appConfig.device.width / getImageRatio(image),
            marginBottom: 10,
          }}
        />

        <View style={styles.delContainer}>
          <TouchableOpacity
            hitSlop={HIT_SLOP}
            onPress={() => handleDelImage(index)}>
            <Ionicons name="ios-close" style={styles.delIcon} />
          </TouchableOpacity>
        </View>
      </Container>
    );
  };

  const renderEmpty = () => {
    return (
      <TouchableOpacity
        style={{width: '100%', height: '100%'}}
        onPress={handleSelectImage}>
        <NoResult iconName="camera-plus-outline" message={t('addImagesDescription')} />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    return (
      <TouchableOpacity onPress={handleSelectImage}>
        <Container row center paddingVertical={20} paddingHorizontal={15}>
          <Ionicons name="ios-images" style={styles.icon} />
          <Text style={styles.title}>{t('addImages')}</Text>
        </Container>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper style={styles.container}>
      {!!images.length ? (
        <>
          <FlatList
            data={images}
            contentContainerStyle={{flexGrow: 1}}
            renderItem={renderImage}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={renderFooter()}
          />
          {!!maxImages && (
            <View
              style={[
                styles.totalImagesContainer,
                images.length > maxImages && styles.totalImagesOver,
              ]}>
              <Text style={[styles.totalImages]}>
                {images.length + '/' + maxImages}
              </Text>
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
