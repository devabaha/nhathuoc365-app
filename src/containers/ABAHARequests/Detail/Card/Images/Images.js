import React, { useState } from 'react';
import { View, Image as RNImage, StyleSheet } from 'react-native';
import Lightbox from 'react-native-lightbox';
import appConfig from 'app-config';

const MAX_IMAGES = 4;
const IMAGE_SPACE = 12;
const WIDTH_IMAGES = appConfig.device.width - 60;
const IMAGE_SIZE = (WIDTH_IMAGES - IMAGE_SPACE * (MAX_IMAGES - 1)) / MAX_IMAGES;

const Images = ({ images = [] }) => {
  return (
    <View style={styles.images}>
      {images.map((image, index) => (
        <Image
          key={index}
          uri={image.url_image}
          style={[
            index !== images.length - 1 && {
              marginRight: IMAGE_SPACE
            }
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  images: {
    flexDirection: 'row',
    marginTop: 15
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee'
  },
  image: {
    width: '100%',
    height: '100%'
  }
});

export default Images;

const Image = ({ uri, style }) => {
  const [isOpenLightBox, setIsOpenLightBox] = useState(false);
  function handleOpen() {
    setIsOpenLightBox(true);
  }

  function handleWillClose() {
    setIsOpenLightBox(false);
  }

  return (
    <View style={[styles.imageContainer, style]}>
      <Lightbox
        springConfig={{ overshootClamping: true }}
        onOpen={handleOpen}
        willClose={handleWillClose}
      >
        <RNImage
          source={{ uri }}
          style={styles.image}
          resizeMode={isOpenLightBox ? 'contain' : 'cover'}
        />
      </Lightbox>
    </View>
  );
};