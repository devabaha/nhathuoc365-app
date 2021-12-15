import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Animated, Easing, ViewPropTypes} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
import RNFetchBlob from 'rn-fetch-blob';
// configs
import appConfig from 'app-config';
// helpers
import {getBase64Image, setStater} from '../../helper';
import {push} from 'app-helper/routing';
// constants
import {
  BundleIconSetName,
  TextButton,
  TypographyType,
} from 'src/components/base';
// custom components
import {Icon, ImageButton, Container} from 'src/components/base';
import {mergeStyles} from 'src/Themes/helper';
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';

const CONTAINER_WIDTH = 150;
const CONTAINER_HEIGHT = 100;
const UPLOAD_STATUS_TYPE = {
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
  DEFAULT: 'default',
};

class ImageMessageChat extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    lowQualityUri: PropTypes.string.isRequired,
    highQualityUri: PropTypes.string,
    uploadURL: PropTypes.string,
    isUploadData: PropTypes.bool,
    image: PropTypes.any,
    containerStyle: ViewPropTypes.style,
  };
  static defaultProps = {
    highQualityUri: '',
    isUploadData: false,
    containerStyle: {},
  };
  state = {
    isOpenLightBox: false,
    progress: new Animated.Value(0),
    hide: new Animated.Value(0),
    uploadStatus: UPLOAD_STATUS_TYPE.DEFAULT,
  };
  unmounted = false;

  imageProps = {
    resizeMode: this.state.isOpenLightBox ? 'contain' : 'cover',
  };
  errorTypoProps = {
    type: TypographyType.LABEL_SMALL,
  };

  get theme() {
    return getTheme(this);
  }

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
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  async uploadImage(reUp = false) {
    this.setState({uploadStatus: UPLOAD_STATUS_TYPE.UPLOADING});
    let base64 = this.props.image.uploadPath;
    if (!this.props.image.isBase64) {
      base64 = await getBase64Image(this.props.image.path);
    }
    const image = {
      name: 'upload',
      filename: this.props.image.fileName,
      data: base64,
    };

    RNFetchBlob.fetch(
      'POST',
      this.props.uploadURL,
      {
        'Content-Type': 'multipart/form-data',
      },
      [image],
    )
      .uploadProgress({interval: 250}, (written, total) => {
        console.log('uploadprogress', written);
        Animated.timing(this.state.progress, {
          toValue: written / total,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.in,
        }).start();
      })
      .progress({count: 10}, (received, total) => {
        console.log('downloadprogress', received);
        Animated.timing(this.state.progress, {
          toValue: received / total,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.in,
        }).start();
      })
      .then((response) => {
        console.log(response);
        Animated.spring(this.state.hide, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          delay: 300,
        }).start(() => {
          setStater(this, this.unmounted, {
            uploadStatus: UPLOAD_STATUS_TYPE.SUCCESS,
          });
          this.props.onUploadedSuccess(JSON.parse(response.data), reUp);
        });
      })
      .catch((error) => {
        console.log(error);
        Animated.spring(this.state.hide, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          delay: 300,
        }).start(() => {
          setStater(this, this.unmounted, {
            uploadStatus: UPLOAD_STATUS_TYPE.ERROR,
          });
          this.props.onUploadedFail();
        });
      });
  }

  handleOpen() {
    this.setState({isOpenLightBox: true});
  }

  handleWillClose() {
    this.setState({isOpenLightBox: false});
  }

  handleViewImage() {
    push(appConfig.routes.itemImageViewer, {
      images: [{url: this.props.lowQualityUri}],
    });
  }

  renderErrorIcon = (titleStyle) => (
    <Icon
      bundle={BundleIconSetName.IONICONS}
      name="ios-refresh"
      style={[titleStyle, styles.errorIcon]}
    />
  );

  get imageStyle() {
    return mergeStyles(styles.image, {
      borderRadius: this.theme.layout.borderRadiusHuge,
    });
  }

  get maskStyle() {
    return mergeStyles(styles.mask, {
      backgroundColor: this.theme.color.overlay60,
    });
  }

  get progressBarForegroundStyle() {
    return {
      backgroundColor: this.theme.color.grey700,
    };
  }

  get progressBarBackgroundStyle() {
    return mergeStyles(styles.progressBar, {
      backgroundColor: this.theme.color.grey400,
    });
  }

  get errorTitleStyle() {
    return mergeStyles(styles.errorText, {
      color: this.theme.color.onOverlay,
    });
  }

  render() {
    const lowQualityUri = this.props.lowQualityUri;
    const highQualityUri =
      this.props.highQualityUri || this.props.lowQualityUri;

    let progress = 0,
      opacity = 1;
    if (this.props.image) {
      progress = this.state.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [-CONTAINER_WIDTH * 0.9, 0],
      });

      opacity = this.state.hide.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      });
    }

    return (
      <View
        style={[this.imageStyle, this.props.containerStyle]}
        pointerEvents={
          this.state.uploadStatus !== UPLOAD_STATUS_TYPE.UPLOADING
            ? 'auto'
            : 'none'
        }>
        <ImageButton
          useTouchableHighlight
          imageStyle={this.props.imageStyle}
          onLongPress={this.props.onLongPress}
          imageProps={this.imageProps}
          source={{
            uri: this.state.isOpenLightBox ? highQualityUri : lowQualityUri,
          }}
          onPress={this.handleViewImage.bind(this)}
        />

        {!!this.props.image &&
          this.state.uploadStatus === UPLOAD_STATUS_TYPE.UPLOADING && (
            <>
              <Animated.View
                pointerEvents={'none'}
                style={[this.maskStyle, {opacity}]}
              />
              <Container
                animated
                style={[this.progressBarBackgroundStyle, {opacity}]}>
                <Container
                  animated
                  pointerEvents="none"
                  style={[
                    this.progressBarForegroundStyle,
                    {
                      height: '100%',
                      transform: [
                        {
                          translateX: progress,
                        },
                      ],
                    },
                  ]}
                />
              </Container>
            </>
          )}

        {!!this.props.image &&
          this.state.uploadStatus === UPLOAD_STATUS_TYPE.ERROR && (
            <TextButton
              column
              bundle={BundleIconSetName.IONICONS}
              name="ios-refresh"
              style={this.maskStyle}
              titleStyle={this.errorTitleStyle}
              typoProps={this.errorTypoProps}
              onPress={this.uploadImage.bind(this, true)}
              renderIconLeft={this.renderErrorIcon}>
              {this.props.t('errorAndTryAgain')}
            </TextButton>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    margin: 3,
    overflow: 'hidden',
  },
  imageActive: {
    flex: 1,
  },
  mask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    flex: 1,
  },
  progressBar: {
    height: 3,
    width: '90%',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 5,
    zIndex: 2,
    borderRadius: 3,
    overflow: 'hidden',
  },
  errorContainer: {
    zIndex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  errorIcon: {
    fontSize: 24,
  },
});

export default withTranslation()(ImageMessageChat);
