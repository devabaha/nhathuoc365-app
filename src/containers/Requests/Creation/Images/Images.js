import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Lightbox from 'react-native-lightbox';
import Icon from 'react-native-vector-icons/FontAwesome';

import appConfig from 'app-config';
import Header from './Header';
import Loading from '../../../../components/Loading';

const PADDING = 15;
const IMAGE_SPACE = 10;
const Images = ({
  images = [],
  max = 4,
  onOpenImageSelector,
  onDelete = () => {},
  uploadImageLoading = false,
  ...props
}) => {
  const IMAGE_SIZE =
    (appConfig.device.width - PADDING * 2 - IMAGE_SPACE * (max - 1)) / max;

  const [isOpenLightBox, setIsOpenLightBox] = useState(false);
  const [gallery, setGallery] = useState(images);

  useEffect(() => {
    let temp = [...images];
    if (images.length < max) {
      temp.push({ btn: true });
    } else {
      temp = temp.filter(t => !t.btn);
    }
    setGallery(temp);
  }, [images]);

  function handleOpenLightBox() {
    setIsOpenLightBox(true);
  }

  function handleCloseLightBox() {
    setIsOpenLightBox(false);
  }

  function handleDeleteImage(image) {
    onDelete(image);
  }

  function renderHeader(close, image) {
    return (
      <Header
        isEdit={false}
        onClose={close}
        onDelete={() => handleDeleteImage(image)}
      />
    );
  }

  function renderImages() {
    return gallery.map((image, index) => {
      const addImageBtnContainerStyle = [
        styles.imageContainer,
        {
          marginLeft: index !== 0 ? IMAGE_SPACE : 0,
          width: IMAGE_SIZE,
          height: IMAGE_SIZE
        }
      ];
      const imageContainerStyle = [
        styles.imageContainer,
        {
          marginRight: index !== images.length - 1 ? IMAGE_SPACE : 0,
          width: IMAGE_SIZE,
          height: IMAGE_SIZE
        }
      ];
      if (image.btn) {
        return (
          <View key={index} style={addImageBtnContainerStyle}>
            {uploadImageLoading ? (
              <Loading style={{ height: '100%' }} />
            ) : (
              <TouchableOpacity
                style={styles.addImageBtnContainer}
                onPress={onOpenImageSelector}
              >
                <Icon name="photo" style={styles.icon} />
                <Text style={styles.text}>Thêm ảnh</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      }
      return (
        <View key={index} style={imageContainerStyle}>
          <Lightbox
            renderHeader={close => renderHeader(close, image)}
            springConfig={{ overshootClamping: true }}
            onOpen={handleOpenLightBox}
            willClose={handleCloseLightBox}
          >
            <Image
              resizeMode={isOpenLightBox ? 'contain' : 'cover'}
              style={styles.image}
              source={{ uri: image.url }}
            />
          </Lightbox>
        </View>
      );
    });
  }

  return <View style={styles.container}>{renderImages()}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: 'row',
    paddingHorizontal: PADDING,
    flex: 1
  },
  imageContainer: {
    backgroundColor: '#eee',
    borderRadius: 4,
    borderStyle: 'dashed',
    borderWidth: 1
  },
  addImageBtnContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    fontSize: 20,
    marginBottom: 7
  },
  text: {
    fontSize: 12
  },
  image: {
    width: '100%',
    height: '100%'
  }
});

export default Images;
