import React, {ClassAttributes, Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import YoutubeIframe, {getYoutubeMeta} from 'react-native-youtube-iframe';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import equal from 'deep-equal';
import {withTranslation} from 'react-i18next';

import {YoutubeVideoIframeProps} from '.';

import appConfig from 'app-config';
import Loading from 'src/components/Loading';
import {Container} from 'src/components/Layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 36,
    color: appConfig.colors.disabled,
  },
  errorMessage: {
    fontSize: 16,
    color: appConfig.colors.disabled,
    marginTop: 15,
  },
});

class YoutubeVideoIframe extends Component<YoutubeVideoIframeProps> {
  static defaultProps = {
    autoAdjustLayout: false,
  };

  refPlayer = React.createRef();

  state = {
    isError: false,
    loading: true,
    height: this.props.height,
    width: this.props.width,
    metaData: undefined,
    containerWidth: undefined,
    containerHeight: undefined,
  };

  shouldComponentUpdate(nextProps: YoutubeVideoIframeProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (!equal(nextProps, this.props)) {
      if (
        nextProps.autoAdjustLayout &&
        (nextProps.height !== this.props.height ||
          nextProps.width !== this.props.width)
      ) {
        const {width, height} = this.getAdjustedVideoLayout(
          nextState.metaData,
          nextState.containerWidth,
          nextProps.width,
          nextProps.height,
        );

        this.setState({width, height});
      }

      if (
        nextProps.autoAdjustLayout !== this.props.autoAdjustLayout &&
        !nextProps.autoAdjustLayout
      ) {
        this.setState({width: nextProps.width, height: nextProps.height});
      }
      return true;
    }

    return false;
  }

  getAdjustedVideoLayout = (
    metaData = this.state.metaData,
    containerWidth = this.state.containerWidth,
    widthProps = this.props.width,
    heightProps = this.props.height,
  ) => {
    const {width: actualWidth, height: actualHeight} = metaData;
    const actualRatio = actualWidth / actualHeight;

    let width = typeof widthProps === 'number' ? widthProps : containerWidth;
    let height = heightProps;
    const heightBasedOnWidth = width / actualRatio;
    if (heightBasedOnWidth > height) {
      width = height * actualRatio;
    } else {
      height = heightBasedOnWidth;
    }

    return {width, height, metaData};
  };

  handleReady = () => {
    this.setState({isError: false, loading: false});
    this.props.onReady && this.props.onReady();
  };

  handleError = (error) => {
    console.log(error);
    this.setState({
      isError: true,
      loading: false,
    });
    this.props.onError && this.props.onError(error);
  };

  handleContainerLayout = (e) => {
    const {
      width: containerWidth,
      height: containerHeight,
    } = e.nativeEvent.layout;
    if (this.props.autoAdjustLayout && this.props.videoId) {
      getYoutubeMeta(this.props.videoId)
        .then((meta) => {
          const {width, height, metaData} = this.getAdjustedVideoLayout(
            meta,
            containerWidth,
          );
          this.setState({width, height, metaData});
        })
        .catch((error) => {
          console.log('get_youtube_video_meta_data', error);
          const {width, height} = this.getAdjustedVideoLayout(
            {width: 16, height: 9},
            this.state.width || containerWidth,
          );
          this.setState({width, height});
        });
    }
    this.setState({
      containerWidth,
      containerHeight,
    });
  };

  handleStartShouldSetResponder = () => {
    return true;
  };

  render() {
    return (
      <View
        onLayout={this.handleContainerLayout}
        style={[styles.container, this.props.containerStyle]}>
        <View onStartShouldSetResponder={this.handleStartShouldSetResponder}>
          <YoutubeIframe
            ref={this.props.refPlayer}
            videoId={this.props.videoId}
            height={this.state.height}
            width={this.state.width}
            webViewStyle={this.props.webviewStyle}
            onChangeState={this.props.onChangeState}
            onReady={this.handleReady}
            onError={this.handleError}
            forceAndroidAutoplay
            {...this.props.youtubeIframeProps}
          />
        </View>
        {(this.state.isError || this.state.loading) && (
          <View style={styles.mask}>
            {this.state.isError ? (
              <Container center>
                <AntDesignIcon
                  name="exclamationcircle"
                  style={styles.errorIcon}
                />
                <Text style={styles.errorMessage}>
                  {this.props.t('api.error.message')}
                </Text>
              </Container>
            ) : (
              this.state.loading && <Loading center />
            )}
          </View>
        )}
      </View>
    );
  }
}

export default withTranslation()(YoutubeVideoIframe);
export {getYoutubeMeta};
