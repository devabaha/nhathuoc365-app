import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'src/components/Image';
import Container from 'src/components/Layout/Container';

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: Util.pixel,
    borderColor: '#ddd',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

const Avatar = ({url, containerStyle, imageStyle, imageProps, onPress}) => {
  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      <Container style={[styles.container, containerStyle]}>
        <Image
          source={{uri: url}}
          style={[styles.image, imageStyle]}
          {...imageProps}
        />
      </Container>
    </TouchableOpacity>
  );
};

export default React.memo(Avatar);
