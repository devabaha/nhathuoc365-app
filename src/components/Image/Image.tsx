import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ImageProps} from '.';

const styles = StyleSheet.create({});

const Image = (props: ImageProps) => {
  const [isError, setError] = useState(false);

  const handleStartLoading = () => {
    setError(false);
  };

  const handleError = () => {
    setError(true);
  };

  return isError && !!props.renderError ? (
    props.renderError()
  ) : (
    <FastImage
      onLoadStart={handleStartLoading}
      onError={handleError}
      {...props}
      style={[
        props.style,
        isError && {backgroundColor: props.errorColor || '#eee'},
      ]}
    />
  );
};

export default React.memo(Image);
