import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// constants
import {
  IMAGES_WRAPPER_WIDTH,
  IMAGE_SPACING,
  IMAGES_WRAPPER_HEIGHT,
  IMAGE_HORIZONTAL_HIGHLIGHT_DIMENSIONS,
} from 'src/constants/social';
// custom components
import {Container} from 'src/components/base';
import GridImage from './GridImage';

const NUM_OF_HIGHLIGHT = 1;
const NUM_OF_NORMAL = 3;
const MAX_NUM_OF_VISIBLE = NUM_OF_HIGHLIGHT + NUM_OF_NORMAL;

const styles = StyleSheet.create({
  container: {
    width: IMAGES_WRAPPER_WIDTH,
    height: IMAGES_WRAPPER_HEIGHT,
  },
});

const V1 = ({images = []}) => {
  const imagesHighlight = useMemo(() => {
    return images.slice(0, NUM_OF_HIGHLIGHT);
  }, [images]);

  const imagesNormal = useMemo(() => {
    return images.slice(NUM_OF_HIGHLIGHT, MAX_NUM_OF_VISIBLE);
  }, [images]);

  const imageHighlightDimensions = useMemo(() => {
    return IMAGE_HORIZONTAL_HIGHLIGHT_DIMENSIONS;
  }, []);

  const imageNormalDimensions = useMemo(() => {
    return IMAGES_WRAPPER_WIDTH - IMAGE_SPACING - imageHighlightDimensions;
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
        {
          flex: true,
        },
      );
    });
  };

  return (
    <Container row style={styles.container}>
      <Container>{renderHighlight()}</Container>
      <Container>{renderNormal()}</Container>
    </Container>
  );
};

export default React.memo(V1);
