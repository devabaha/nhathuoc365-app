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
const NUM_OF_NORMAL = 3;
const MAX_NUM_OF_VISIBLE = NUM_OF_HIGHLIGHT + NUM_OF_NORMAL;

const V2 = ({images = []}) => {
  const imagesHighlight = useMemo(() => {
    return images.slice(0, NUM_OF_HIGHLIGHT);
  }, [images]);

  const imagesNormal = useMemo(() => {
    return images.slice(NUM_OF_HIGHLIGHT, MAX_NUM_OF_VISIBLE);
  }, [images]);

  const imageHighlightDimensions = useMemo(() => {
    return imagesNormal.length
      ? (IMAGES_WRAPPER_WIDTH - IMAGE_SPACING) / 2
      : IMAGES_WRAPPER_WIDTH;
  }, [imagesHighlight, imagesNormal.length]);

  const imageNormalDimensions = useMemo(() => {
    return (IMAGES_WRAPPER_WIDTH - IMAGE_SPACING) / 2;
  }, [imagesNormal]);

  const renderImage = (uri, style, index, overlayTitle, containerProps) => {
    return (
      <GridImage
        key={index}
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
        width: imageHighlightDimensions,
      };

      return renderImage(image.url, imageStyle, index, null, {flex: true});
    });
  };

  const renderNormal = () => {
    return imagesNormal.map((image, index) => {
      const imageStyle = {
        width: imageNormalDimensions,
        marginLeft: IMAGE_SPACING,
      };

      const overlayTitle =
        index === imagesNormal.length - 1 && images.length > MAX_NUM_OF_VISIBLE
          ? images.length - MAX_NUM_OF_VISIBLE
          : 0;

      return renderImage(
        image.url,
        imageStyle,
        index + NUM_OF_HIGHLIGHT,
        overlayTitle,
        {flex: true},
      );
    });
  };

  return (
    <Container row style={styles.container}>
      <Container>{renderHighlight()}</Container>
      {!!imagesNormal.length && <Container>{renderNormal()}</Container>}
    </Container>
  );
};

export default React.memo(V2);
