import React, {useState, useMemo} from 'react';
import {StyleSheet, Image as RNImage, View} from 'react-native';
// 3-party libs
import FastImage from 'react-native-fast-image';
import Lightbox from 'react-native-lightbox';
// types
import {ImageProps} from '.';
// context
import {useTheme} from 'src/Themes/Theme.context';

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
  useNative = false,
  style = {},
  containerStyle = {},
  onLoadError = () => {},
  onLoadEnd = () => {},
  renderError,
  lightBoxProps = {},
  ...props
}: ImageProps) => {
  const {theme} = useTheme();

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

  const isErrorStyle = useMemo(() => {
    return {backgroundColor: errorColor || theme.color.disabled};
  }, [theme, errorColor]);

  const isLoadEndStyle = useMemo(() => {
    return {backgroundColor: loadingColor || theme.color.disabled};
  }, [theme, loadingColor]);

  const ImageComponent: any = useMemo(() => {
    return useNative ? RNImage : FastImage;
  }, [useNative]);

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
        willClose={handleWillClose}
        {...lightBoxProps}>
        <ImageComponent
          onLoadStart={handleStartLoading}
          onError={handleError}
          onLoadEnd={handleLoadEnd}
          resizeMode={isOpenLightBox ? 'contain' : 'cover'}
          {...props}
          // @ts-ignore
          style={[styles.image, style, isError && isErrorStyle]}
        />
      </Lightbox>
    </View>
  ) : (
    // @ts-ignore
    <ImageComponent
      onLoadStart={handleStartLoading}
      onError={handleError}
      onLoadEnd={handleLoadEnd}
      {...props}
      style={[
        styles.image,
        style,
        !isLoadEnd && isLoadEndStyle,
        isError && isErrorStyle,
      ]}
    />
  );
};

export default React.memo(Image);
