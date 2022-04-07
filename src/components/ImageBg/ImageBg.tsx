import React from 'react';
import {View, StyleSheet} from 'react-native';
// types
import {ImageBgProps} from '.';
// custom components
import Image from 'src/components/Image';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
});

const ImageBackground = ({
  style,
  imageStyle,
  imageProps,
  source,
  children,
  ...props
}: ImageBgProps) => {
  return (
    <View {...props} style={[styles.container, style]}>
      <Image
        {...imageProps}
        source={source}
        style={[styles.image, imageStyle]}
      />
      {children}
    </View>
  );
};

export default ImageBackground;
