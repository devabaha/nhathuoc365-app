import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
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
      <GridImage images={images} uri={uri} style={style} containerProps={containerProps} />
    );
  };

  return (
    <Container centerVertical={false} style={[styles.container]}>
      {renderImage()}
    </Container>
  );
};

export default React.memo(S);
