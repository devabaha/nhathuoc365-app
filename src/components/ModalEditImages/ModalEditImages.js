import {openCamera, openLibrary} from 'app-helper/image';
import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Image from '../Image';
import Container from '../Layout/Container';
import NoResult from '../NoResult';
import ScreenWrapper from '../ScreenWrapper';

import appConfig from 'app-config';
import ModalGalleryOptionAndroid from 'app-packages/tickid-chat/container/ModalGalleryOptionAndroid';
import {getImageRatio} from 'app-helper/social/post';

const styles = StyleSheet.create({
  delContainer: {
    width: 30,
    height: 30,
    backgroundColor: appConfig.colors.status.danger,
    borderRadius: 15,
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
});

const ModalEditImages = ({
  images: imagesProp = [],
  onChangeImages = () => {},
}) => {
  const [images, setImages] = useState(imagesProp);
  const [isOpenImagePicker, setOpenImagePicker] = useState(false);

  const handleDelImage = useCallback(
    (index) => {
      const tempImages = [...images];
      tempImages.splice(index, 1);
      setImages(tempImages);
      onChangeImages(tempImages);
    },
    [images],
  );

  const handleSelectImage = () => {
    setOpenImagePicker(true);
  };

  const handleOpenCamera = () => {
    openCamera((selectedImages) => {
      const newImages = images.concat(selectedImages);
      setImages(newImages);
      onChangeImages(images);
    }, closeModal);
  };

  const handleOpenLibrary = () => {
    openLibrary((selectedImages) => {
      const newImages = images.concat(selectedImages);
      setImages(newImages);
      onChangeImages(images);
    }, closeModal);
  };

  const closeModal = () => {
    setOpenImagePicker(false);
  };

  const renderImage = ({item: image, index}) => {
    console.log(getImageRatio(image));
    return (
      <Container centerVertical={false}>
        <Image
          canTouch
          source={{uri: image.uri}}
          containerStyle={{
            width: appConfig.device.width,
            height: appConfig.device.width / getImageRatio(image),
            marginBottom: 15,
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
    return <NoResult iconName="images" message="Chạm để thêm ảnh" />;
  };

  return (
    <ScreenWrapper>
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={renderEmpty()}
      />
      <TouchableOpacity onPress={handleSelectImage}>
        <Container
          row
          center
          paddingVertical={20}
          paddingHorizontal={15}
          style={{backgroundColor: '#fff', ...elevationShadowStyle(7)}}>
          <Ionicons name="ios-images" style={styles.icon} />
          <Text style={styles.title}>Thêm ảnh</Text>
        </Container>
      </TouchableOpacity>
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
