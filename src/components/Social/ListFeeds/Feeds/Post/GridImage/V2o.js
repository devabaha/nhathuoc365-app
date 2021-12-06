import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// constants
import {
  IMAGES_WRAPPER_WIDTH,
  IMAGES_WRAPPER_HEIGHT,
} from 'src/constants/social';
// custom components
import {Container} from 'src/components/base';
import GridImage from './GridImage';

const NUM_OF_HIGHLIGHT = 2;

const styles = StyleSheet.create({
  container: {
    width: IMAGES_WRAPPER_WIDTH,
    height: IMAGES_WRAPPER_HEIGHT,
  },
});

const V2o = ({images = []}) => {
  const imagesHighlight = useMemo(() => {
    return images.slice(0, NUM_OF_HIGHLIGHT);
  }, [images]);

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
        height:
          IMAGES_WRAPPER_WIDTH /
          ((image[0]?.width || 1) / (images[0]?.height || 1)),
      };

      return renderImage(image.url, imageStyle, index, null, {flex: true});
    });
  };

  return <Container style={styles.container}>{renderHighlight()}</Container>;
};

export default React.memo(V2o);
