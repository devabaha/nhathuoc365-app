import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Animated,
  Image,
  Easing,
  TouchableOpacity,
  Text,
  ViewPropTypes
} from 'react-native';
import Lightbox from 'react-native-lightbox';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';
import { getBase64Image, setStater } from '../../helper';
import FastImage from 'react-native-fast-image';
import { isIos } from '../../constants';

const CONTAINER_WIDTH = 150;
const CONTAINER_HEIGHT = 100;
const UPLOAD_STATUS_TYPE = {
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
  DEFAULT: 'default'
};

class ImageMessageChat extends Component {
  static propTypes = {
    lowQualityUri: PropTypes.string.isRequired,
    highQualityUri: PropTypes.string,
    uploadURL: PropTypes.string,
    isUploadData: PropTypes.bool,
    image: PropTypes.any,
    containerStyle: ViewPropTypes.style
  };
  static defaultProps = {
    highQualityUri: '',
    isUploadData: false,
    containerStyle: {}
  };
  state = {
    isOpenLightBox: false,
    progress: new Animated.Value(0),
    hide: new Animated.Value(0),
    uploadStatus: UPLOAD_STATUS_TYPE.DEFAULT
  };
  unmounted = false;

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.lowQualityUri !== this.props.lowQualityUri ||
      nextProps.highQualityUri !== this.props.highQualityUri ||
      nextProps.isUploadData !== this.props.isUploadData ||
      nextProps.containerStyle !== this.props.containerStyle
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    if (this.props.isUploadData && this.props.image) {
      this.uploadImage();
    }
    EventTracker.logEvent('image_message_page');
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  async uploadImage(reUp = false) {
    this.setState({ uploadStatus: UPLOAD_STATUS_TYPE.UPLOADING });
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
          useNativeDriver: true,
          easing: Easing.in
        }).start();
      })
      .progress({ count: 10 }, (received, total) => {
        console.log('downloadprogress', received);
        Animated.timing(this.state.progress, {
          toValue: received / total,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.in
        }).start();
      })
      .then(response => {
        console.log(response);
        Animated.spring(this.state.hide, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          delay: 300
        }).start(() => {
          setStater(this, this.unmounted, {
            uploadStatus: UPLOAD_STATUS_TYPE.SUCCESS
          });
          this.props.onUploadedSuccess(JSON.parse(response.data), reUp);
        });
      })
      .catch(error => {
        console.log(error);
        Animated.spring(this.state.hide, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          delay: 300
        }).start(() => {
          setStater(this, this.unmounted, {
            uploadStatus: UPLOAD_STATUS_TYPE.ERROR
          });
          this.props.onUploadedFail();
        });
      });
  }

  handleOpen() {
    this.setState({ isOpenLightBox: true });
  }

  handleWillClose() {
    this.setState({ isOpenLightBox: false });
  }

  render() {
    const lowQualityUri = this.props.lowQualityUri;
    const highQualityUri =
      this.props.highQualityUri || this.props.lowQualityUri;

    let progress = null,
      opacity = null;
    if (this.props.image) {
      progress = this.state.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [-CONTAINER_WIDTH * 0.9, 0]
      });

      opacity = this.state.hide.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0]
      });
    }

    const ImageComponent = isIos ? Image : FastImage;

    return (
      <View
        style={[styles.image, this.props.containerStyle]}
        pointerEvents={
          this.state.uploadStatus !== UPLOAD_STATUS_TYPE.UPLOADING
            ? 'auto'
            : 'none'
        }
      >
        <Lightbox
          springConfig={{ overshootClamping: true }}
          onOpen={this.handleOpen.bind(this)}
          willClose={this.handleWillClose.bind(this)}
        >
          <ImageComponent
            resizeMode={this.state.isOpenLightBox ? 'contain' : 'cover'}
            source={{
              uri: this.state.isOpenLightBox ? highQualityUri : lowQualityUri
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </Lightbox>

        {!!this.props.image &&
          this.state.uploadStatus === UPLOAD_STATUS_TYPE.UPLOADING && (
            <>
              <Animated.View
                pointerEvents={'none'}
                style={[styles.mask, { opacity }]}
              />
              <Animated.View style={[styles.progessBar, { opacity }]}>
                <Animated.View
                  pointerEvents="none"
                  style={{
                    height: '100%',
                    transform: [
                      {
                        translateX: progress
                      }
                    ],
                    backgroundColor: '#909090'
                  }}
                />
              </Animated.View>
            </>
          )}
        {!!this.props.image &&
          this.state.uploadStatus === UPLOAD_STATUS_TYPE.ERROR && (
            <TouchableOpacity
              style={styles.errorContainer}
              onPress={this.uploadImage.bind(this, true)}
              activeOpacity={0.5}
            >
              <>
                <Icon name="ios-refresh" size={24} color="white" />
                <Text style={styles.errorText}>Lỗi! chạm để gửi lại</Text>
              </>
            </TouchableOpacity>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    borderRadius: 13,
    margin: 3,
    overflow: 'hidden'
  },
  imageActive: {
    flex: 1
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
    height: 3,
    width: '90%',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 5,
    zIndex: 2,
    backgroundColor: 'white',
    borderRadius: 3,
    overflow: 'hidden'
  },
  errorContainer: {
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    marginTop: 10
  }
});

export default ImageMessageChat;
