import React, {useMemo} from 'react';
import {StyleSheet, TouchableNativeFeedback} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// routing
import {push} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {IMAGE_SPACING} from 'src/constants/social';
// components
import Image from 'src/components/Image';
import {Container} from 'src/components/base';
import Overlay from './Overlay';

const styles = StyleSheet.create({
  container: {
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
  const {theme} = useTheme();

  const images = useMemo(() => {
    return [...imagesProp].map((image) => {
      return image;
    });
  }, [imagesProp]);

  const containerStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.container,
        {
          borderWidth: theme.layout.borderWidthPixel,
          borderColor: theme.color.border,
        },
      ],
      style,
    );
  }, [theme, style]);

  const handlePress = () => {
    if (!!images?.length) {
      push(appConfig.routes.itemImageViewer, {
        images,
        index,
      });
    }
  };

  return (
    <TouchableNativeFeedback onPress={handlePress}>
      <Container key={index} style={containerStyle} {...containerProps}>
        <Image source={{uri}} style={styles.image} />
        {!!overlayTitle && <Overlay title={overlayTitle} />}
      </Container>
    </TouchableNativeFeedback>
  );
};

export default React.memo(GridImage);
