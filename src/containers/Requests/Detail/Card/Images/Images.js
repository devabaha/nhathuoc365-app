import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import appConfig from 'app-config';
import {push} from 'app-helper/routing';
import {IMAGE_SPACE} from './constants';
import ImageItem from './ImageItem';

const Images = ({images = []}) => {
  const handlePressImage = (index) => {
    push(appConfig.routes.itemImageViewer, {
      images: images.map((image) => ({...image, url: image.url_image})),
      index,
    });
  };

  return (
    <View style={styles.images}>
      {images.map((image, index) => (
        <ImageItem
          key={index}
          uri={image.url_image}
          style={[
            index !== images.length - 1 && {
              marginRight: IMAGE_SPACE,
            },
          ]}
          onPress={() => handlePressImage(index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  images: {
    flexDirection: 'row',
    marginTop: 15,
  },
});

export default memo(Images);
