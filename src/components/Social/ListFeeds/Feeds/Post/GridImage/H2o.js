import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import Image from 'src/components/Image';
import Container from 'src/components/Layout/Container';

import {IMAGES_WRAPPER_WIDTH, IMAGE_SPACING} from 'src/constants/social';
import GridImage from './GridImage';

const styles = StyleSheet.create({
  container: {
    width: IMAGES_WRAPPER_WIDTH,
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

const H2o = ({images = []}) => {
  const imagesHighlight = useMemo(() => {
    return images.slice(0, NUM_OF_HIGHLIGHT);
  }, [images]);

  const imageHighlightDimensions = useMemo(() => {
    return (IMAGES_WRAPPER_WIDTH - IMAGE_SPACING) / 2;
  }, []);

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
        height:
          imageHighlightDimensions /
          ((images[0].width || 1) / (images[0].height || 1)),
        marginLeft: index > 0 ? IMAGE_SPACING : 0,
      };

      return renderImage(image.url, imageStyle, index, null, {flex: true});
    });
  };

  return (
    <Container centerVertical={false} style={styles.container}>
      <Container row>{renderHighlight()}</Container>
    </Container>
  );
};

export default React.memo(H2o);
