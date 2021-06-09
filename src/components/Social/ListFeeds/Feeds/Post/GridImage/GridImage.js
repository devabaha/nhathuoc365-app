import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Image from 'src/components/Image';
import Container from 'src/components/Layout/Container';
import {IMAGE_SPACING} from 'src/constants/social';
import Overlay from './Overlay';

const styles = StyleSheet.create({
  container: {
    borderWidth: Util.pixel,
    borderColor: '#ddd',
    marginTop: IMAGE_SPACING,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

const GridImage = ({
  images: imagesProp = [],
  index = 0,
  uri,
  style,
  overlayTitle,
  containerProps = {},
}) => {
  const images = useMemo(() => {
    return [...imagesProp].map((image) => {
      return image;
    });
  }, [imagesProp]);

  const handlePress = () => {
    if (!!images?.length) {
      Actions.item_image_viewer({
        images,
        index,
      });
    }
  };

  return (
    <TouchableNativeFeedback onPress={handlePress}>
      <Container key={index} style={[styles.container, style]} {...containerProps}>
        <Image source={{uri}} style={styles.image} />
        {!!overlayTitle && <Overlay title={overlayTitle} />}
      </Container>
    </TouchableNativeFeedback>
  );
};

export default React.memo(GridImage);
