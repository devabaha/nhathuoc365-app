import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Image from 'src/components/Image';
import Container from 'src/components/Layout/Container';

import {
  IMAGES_WRAPPER_WIDTH,
  IMAGE_SPACING,
  IMAGES_WRAPPER_HEIGHT,
} from 'src/constants/social';
import GridImage from './GridImage';

const styles = StyleSheet.create({
  container: {
    width: IMAGES_WRAPPER_WIDTH,
    height: IMAGES_WRAPPER_HEIGHT,
  },
  imageContainer: {
    borderWidth: Util.pixel,
    borderColor: '#ddd',
    marginTop: IMAGE_SPACING,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

const NUM_OF_HIGHLIGHT = 2;

const V2o = ({images = []}) => {
  const imagesHighlight = useMemo(() => {
    return images.slice(0, NUM_OF_HIGHLIGHT);
  }, [images]);

  const renderImage = (uri, style, index, overlayTitle, containerProps) => {
    return (
      <GridImage
        overlayTitle={overlayTitle}
        images={images}
        index={index}
        uri={uri}
        style={style}
        containerProps={containerProps}
      />
    );
  };

  const renderHighlight = () => {
    return imagesHighlight.map((image, index) => {
      const imageStyle = {
        height:
          IMAGES_WRAPPER_WIDTH /
          ((image[0]?.width || 1) / (images[0]?.height || 1)),
      };

      return renderImage(image.url, imageStyle, index, null, {flex: true});
    });
  };

  return (
    <Container centerVertical={false} style={styles.container}>
      {renderHighlight()}
    </Container>
  );
};

export default React.memo(V2o);
