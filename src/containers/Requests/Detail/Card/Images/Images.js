import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Lightbox from 'react-native-lightbox';
import appConfig from 'app-config';

const MAX_IMAGES = 4;
const IMAGE_SPACE = 12;
const WIDTH_IMAGES = appConfig.device.width - 60;
const IMAGE_SIZE = (WIDTH_IMAGES - IMAGE_SPACE * (MAX_IMAGES - 1)) / MAX_IMAGES;

const Images = ({ images = [] }) => {
  const [isOpenLightBox, setIsOpenLightBox] = useState(false);
  function handleOpen() {
    setIsOpenLightBox(true);
  }

  function handleWillClose() {
    setIsOpenLightBox(false);
  }
  return (
    <View style={styles.images}>
      {images.map((image, index) => (
        <View
          style={[
            styles.imageContainer,
            index !== images.length - 1 && {
              marginRight: IMAGE_SPACE
            }
          ]}
        >
          <Lightbox key={index} onOpen={handleOpen} willClose={handleWillClose}>
            <Image
              source={{ uri: image.url_image }}
              style={styles.image}
              resizeMode={isOpenLightBox ? 'contain' : 'cover'}
            />
          </Lightbox>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  images: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 15
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 4,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  }
});

export default Images;
