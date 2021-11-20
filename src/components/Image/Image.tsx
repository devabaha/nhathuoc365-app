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

const Image = ({
  errorColor = '',
  loadingColor = '',
  canTouch = false,
  style = {},
  containerStyle = {},
  onLoadError = () => {},
  onLoadEnd = () => {},
  renderError,
  ...props
}: ImageProps) => {
  const [isError, setError] = useState(false);
  const [isOpenLightBox, setOpenLightBox] = useState(false);
  const [isLoadEnd, setLoadEnd] = useState(false);

  const handleStartLoading = () => {
    setError(false);
    setLoadEnd(false);
  };

  const handleLoadEnd = () => {
    onLoadEnd();
    setLoadEnd(true);
  };

  const handleError = () => {
    onLoadError();
    setError(true);
  };

  const handleOpen = () => {
    setOpenLightBox(true);
  };

  const handleWillClose = () => {
    setOpenLightBox(false);
  };

  return isError && !!renderError ? (
    renderError()
  ) : canTouch ? (
    <View
      style={[styles.image, containerStyle]}
      pointerEvents={canTouch && !isError ? 'auto' : 'none'}>
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
            style,
            isError && {backgroundColor: errorColor || '#eee'},
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
        style,
        !isLoadEnd && {backgroundColor: loadingColor || '#eee'},
        isError && {backgroundColor: errorColor || '#eee'},
      ]}
    />
  );
};

export default React.memo(Image);
