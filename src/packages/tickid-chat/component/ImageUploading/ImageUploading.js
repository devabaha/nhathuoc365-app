import React, { Component } from 'react';
import { View, StyleSheet, Image, Animated, Easing } from 'react-native';
import PropTypes from 'prop-types';
import appConfig from 'app-config';
import RNFetchBlob from 'rn-fetch-blob';
import { getBase64Image } from '../../helper';

class ImageUploading extends Component {
  static propTypes = {
    image: PropTypes.any.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    onUploadedSuccess: PropTypes.func,
    onUploadedFail: PropTypes.func,
    uploadURL: PropTypes.string.isRequired
  };

  static defaultProps = {
    width: appConfig.device.width / 4,
    height: 100,
    onUploadedSuccess: () => {},
    onUploadedFail: () => {}
  };

  state = {
    progress: new Animated.Value(0),
    fade: new Animated.Value(0)
  };
  umounted = false;

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.image !== this.props.image ||
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height ||
      nextProps.uploadURL !== this.props.uploadURL
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    setTimeout(() => !this.umounted && this.uploadImage(), 1000);
  }

  componentWillUnmount() {
    this.umounted = true;
  }

  async uploadImage() {
    console.log(this.props, 'abc');

    let base64 = this.props.image.uploadPath;
    if (!this.props.image.isBase64) {
      base64 = await getBase64Image(this.props.image.path);
    }
    const image = {
      name: 'upload',
      filename: this.props.image.fileName,
      data: base64
    };

    RNFetchBlob.fetch(
      'POST',
      this.props.uploadURL,
      {
        'Content-Type': 'multipart/form-data'
      },
      [image]
    )
      .uploadProgress({ interval: 250 }, (written, total) => {
        console.log('uploadprogress', written);
        Animated.timing(this.state.progress, {
          toValue: written / total,
          duration: 100,
          easing: Easing.in
        }).start();
      })
      .progress({ count: 10 }, (received, total) => {
        console.log('downloadprogress', received);
        Animated.timing(this.state.progress, {
          toValue: received / total,
          duration: 100,
          easing: Easing.in
        }).start();
      })
      .then(response => {
        console.log(response);
        Animated.spring(this.state.fade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          delay: 300
        }).start(() => this.props.onUploadedSuccess(JSON.parse(response.data)));
      })
      .catch(error => {
        console.log(error);
        Animated.spring(this.state.fade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          delay: 300
        }).start(() => this.props.onUploadedFail());
      });
  }

  render() {
    const opacity = this.state.fade.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    });
    const progress = this.state.progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%']
    });

    return (
      <Animated.View
        style={[
          styles.container,
          {
            width: this.props.width * 0.9,
            height: this.props.height * 0.9,
            marginHorizontal: this.props.width * 0.05,
            opacity
          }
        ]}
      >
        <View style={styles.mask} />
        <Image
          source={{ uri: this.props.image.path }}
          resizeMode="cover"
          style={{ width: '100%', height: '100%' }}
        />
        <View style={styles.progessBar}>
          <Animated.View
            style={{
              height: '100%',
              width: progress,
              backgroundColor: '#909090'
            }}
          />
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    overflow: 'hidden'
  },
  mask: {
    backgroundColor: 'rgba(0,0,0,.5)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    flex: 1
  },
  progessBar: {
    height: 6,
    width: '85%',
    position: 'absolute',
    bottom: 5,
    zIndex: 2,
    backgroundColor: 'white',
    borderRadius: 3,
    overflow: 'hidden'
  }
});

export default ImageUploading;
