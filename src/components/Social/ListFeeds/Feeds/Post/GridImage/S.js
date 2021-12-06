import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// constants
import {IMAGES_WRAPPER_WIDTH} from 'src/constants/social';
// custom components
import {Container} from 'src/components/base';
import GridImage from './GridImage';

const styles = StyleSheet.create({
  container: {
    width: IMAGES_WRAPPER_WIDTH,
  },
});

const S = ({images = []}) => {
  const imagesHighlight = useMemo(() => {
    return images[0];
  }, [images]);

  const imageStyle = {
    height:
      IMAGES_WRAPPER_WIDTH /
      ((imagesHighlight?.width || 1) / (imagesHighlight?.height || 1)),
  };

  const renderImage = (uri, style, containerProps) => {
    return (
      <GridImage
        images={images}
        uri={uri}
        style={style}
        containerProps={containerProps}
      />
    );
  };

  return (
    <Container style={[styles.container]}>
      {renderImage(imagesHighlight.url, imageStyle)}
    </Container>
  );
};

export default React.memo(S);
