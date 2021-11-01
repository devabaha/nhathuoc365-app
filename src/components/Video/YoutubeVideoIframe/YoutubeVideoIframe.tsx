import React, {Component} from 'react';
import {StyleSheet, View, Text, Modal} from 'react-native';

import equal from 'deep-equal';
import {withTranslation} from 'react-i18next';
import YoutubeIframe, {getYoutubeMeta} from 'react-native-youtube-iframe';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import {YoutubeVideoIframeProps} from '.';

import appConfig from 'app-config';

import Loading from 'src/components/Loading';
import {Container} from 'src/components/Layout';
import Controls from '../Controls';

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
    onProgress: () => {},
    onPressFullscreen: () => {},
  };

  refWebview = React.createRef<any>();
  refPlayer = React.createRef<any>();

  state = {
    isError: false,
    loading: true,
    height: this.props.height,
    width: this.props.width,
    metaData: undefined,
    containerWidth: undefined,
    containerHeight: undefined,

    currentTime: 0,
    totalTime: 0,
    bufferTime: 0,

    isFullScreen: false,
  };
  currentTime = 0;

  getYoutubeTimerInterval: any = () => {};

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

  componentDidMount() {
    if (this.refPlayer.current) {
      //@ts-ignore
      this.refWebview.current = this.refPlayer.current.getWebViewRef();

      if (this.props.refPlayer) {
        this.props.refPlayer(this.refPlayer.current);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.getYoutubeTimerInterval);
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

  getTimer = async () => {
    if (this.refPlayer.current) {
      try {
        const totalTime = await this.refPlayer.current?.getDuration();

        // Sometimes getDuration() do not work correctly (usual get 1 seconds more than the actual video duration)
        // if seek to time exceeding the actual time of video, seekTo() will not work.
        // So, to make sure it work, minus 1 second if you want to seek to end of the video.
        this.setState({totalTime: totalTime - 1});

        this.getYoutubeTimerInterval = setInterval(async () => {
          if (!this.refPlayer.current) {
            clearInterval(this.getYoutubeTimerInterval);
            return;
          }

          const currentTime = await this.refPlayer.current.getCurrentTime();
          this.setState({currentTime});

          this.refPlayer.current
            .getVideoLoadedFraction()
            .then((bufferFraction) => {
              this.setState({bufferTime: bufferFraction * totalTime});
            });
        }, 100);
      } catch (error) {
        console.log('youtube_iframe_get_timer', error);
      }
    }
  };

  handleProgress = (progress) => {
    this.props.onProgress(progress);

    if (this.refPlayer.current) {
      const seekToTime = Math.floor(
        progress * (Number(this.state.totalTime) || 0),
      );

      this.refPlayer.current.seekTo(seekToTime);
    }
  };

  handlePressPlay = () => {
    if (this.props.isEnd) {
      this.handleProgress(0);
    } else {
      this.props.onPressPlay && this.props.onPressPlay();
    }
  };

  handleReady = () => {
    if (this.currentTime) {
      this.handleProgress(this.currentTime/this.state.totalTime);
      this.currentTime = 0;
    }
    this.setState({isError: false, loading: false});
    this.props.onReady && this.props.onReady();
    this.getTimer();
  };

  handleError = (error) => {
    console.log('youtube iframe', error);
    this.setState({
      isError: true,
      loading: false,
    });
    this.props.onError && this.props.onError(error);
  };

  handleFullScreen = () => {
    this.currentTime = this.state.currentTime;
    this.props.onPressFullscreen();
    this.setState((prevState: any) => ({
      isFullScreen: !prevState.isFullScreen,
    }));
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

  renderVideo = () => {
    return (
      <View
        style={[
          {
            flex: 1,
          },
          this.state.isFullScreen && {
            ...StyleSheet.absoluteFillObject,
            width: appConfig.device.height,
            height: appConfig.device.width,
            transform: [
              {translateY: appConfig.device.height / 2},
              {translateX: appConfig.device.width / 2},
              {rotate: '90deg'},
              {translateX: -appConfig.device.width / 2},
              {translateY: appConfig.device.height / 2},
            ],
          },
        ]}>
        <View
          onLayout={this.handleContainerLayout}
          style={[styles.container, this.props.containerStyle]}>
          <View>
            <YoutubeIframe
              ref={this.refPlayer}
              videoId={this.props.videoId}
              height={
                this.state.isFullScreen
                  ? appConfig.device.width
                  : this.state.height
              }
              width={
                this.state.isFullScreen
                  ? appConfig.device.height
                  : this.state.width
              }
              webViewStyle={this.props.webviewStyle}
              onChangeState={this.props.onChangeState}
              onReady={this.handleReady}
              onError={this.handleError}
              forceAndroidAutoplay
              {...this.props.youtubeIframeProps}
              initialPlayerParams={{
                controls: false,
                ...this.props.youtubeIframeProps?.initialPlayerParams,
              }}
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

        <View
          style={[
            {
              ...StyleSheet.absoluteFillObject,
            },
            this.state.isFullScreen &&
              {
                // width: appConfig.device.height,
                // height: appConfig.device.width,
                // transform: [
                //   {translateY: appConfig.device.height / 2},
                //   {translateX: appConfig.device.width / 2},
                //   {rotate: '90deg'},
                //   {translateX: -appConfig.device.width / 2},
                //   {translateY: appConfig.device.height / 2},
                // ],
              },
          ]}>
          <Controls
            currentTime={this.state.currentTime}
            totalTime={this.state.totalTime}
            bufferTime={this.state.bufferTime}
            isPlay={!!this.props.youtubeIframeProps?.play}
            isMute={!!this.props.youtubeIframeProps?.mute}
            isEnd={this.props.isEnd}
            isFullscreen={this.state.isFullScreen}
            onPressPlay={this.handlePressPlay}
            onPressMute={this.props.onPressMute}
            onChangedProgress={this.handleProgress}
            onPressFullScreen={this.handleFullScreen}
          />
        </View>
      </View>
    );
  };

  render() {
    return this.state.isFullScreen ? (
      <Modal transparent>{this.renderVideo()}</Modal>
    ) : (
      this.renderVideo()
    );
  }
}

export default withTranslation()(YoutubeVideoIframe);
export {getYoutubeMeta};
