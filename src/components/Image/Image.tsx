import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Lightbox from 'react-native-lightbox';
import {ImageProps} from '.';

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

const Image = (props: ImageProps) => {
  const [isError, setError] = useState(false);
  const [isOpenLightBox, setOpenLightBox] = useState(false);
  const [isLoadEnd, setLoadEnd] = useState(false);

  const handleStartLoading = () => {
    setError(false);
    setLoadEnd(false);
  };

  const handleLoadEnd = () => {
    setLoadEnd(true);
  };

  const handleError = () => {
    setError(true);
  };

  const handleOpen = () => {
    setOpenLightBox(true);
  };

  const handleWillClose = () => {
    setOpenLightBox(false);
  };

  return isError && !!props.renderError ? (
    props.renderError()
  ) : props.canTouch ? (
    <View
      style={[styles.image, props.containerStyle]}
      pointerEvents={props.canTouch ? 'auto' : 'none'}>
      <Lightbox
        underlayColor="transparent"
        springConfig={{overshootClamping: true}}
        onOpen={handleOpen}
        willClose={handleWillClose}>
        <FastImage
          onLoadStart={handleStartLoading}
          onError={handleError}
          onLoadEnd={handleLoadEnd}
          resizeMode={isOpenLightBox ? 'contain' : 'cover'}
          {...props}
          style={[
            styles.image,
            props.style,
            isError && {backgroundColor: props.errorColor || '#eee'},
          ]}
        />
      </Lightbox>
    </View>
  ) : (
    <FastImage
      onLoadStart={handleStartLoading}
      onError={handleError}
      onLoadEnd={handleLoadEnd}
      {...props}
      style={[
        styles.image,
        props.style,
        !isLoadEnd && {backgroundColor: props.loadingColor || '#eee'},
        isError && {backgroundColor: props.errorColor || '#eee'},
      ]}
    />
  );
};

export default React.memo(Image);
