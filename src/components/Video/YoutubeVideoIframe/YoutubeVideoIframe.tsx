import React, {Component} from 'react';
import {StyleSheet, View, Text, Modal, StatusBar} from 'react-native';

import equal from 'deep-equal';
import {withTranslation} from 'react-i18next';
import YoutubeIframe, {getYoutubeMeta} from 'react-native-youtube-iframe';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import {YoutubeVideoIframeProps} from '.';

import appConfig from 'app-config';

import Loading from 'src/components/Loading';
import {Container} from 'src/components/Layout';
import Controls from '../Controls';
import Animated, {concat, Easing} from 'react-native-reanimated';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

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
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
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

    isFullscreen: false,
  };
  currentTime = 0;
  isAnimateFullscreen = false;

  getYoutubeTimerInterval: any = () => {};
  animatedFullscreenValue = new Animated.Value(this.state.isFullscreen ? 1 : 0);

  shouldComponentUpdate(nextProps: YoutubeVideoIframeProps, nextState) {
    if (nextState !== this.state) {
      if (nextState.isFullscreen !== this.state.isFullscreen) {
        this.isAnimateFullscreen = true;
        this.setState({isAnimateFullscreen: true});
        Animated.timing(this.animatedFullscreenValue, {
          toValue: nextState.isFullscreen ? 1 : 0,
          easing: Easing.ease,
          duration: 300,
        }).start(({finished}) => {
          if (finished) {
            this.setState({
              isAnimateFullscreen: false,
            });
          }
          this.isAnimateFullscreen = !finished;
        });
      }
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
          if (currentTime > this.currentTime) {
            this.setState({currentTime});
            this.currentTime = 0;
          }

          this.refPlayer.current
            .getVideoLoadedFraction()
            .then((bufferFraction) => {
              !this.isAnimateFullscreen &&
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

  handleSkip = (skipTime) => {
    let progress =
      (this.state.currentTime + skipTime) / (this.state.totalTime || 1);
    progress > 1 && (progress = 1);
    progress < 0 && (progress = 0);

    this.handleProgress(progress);
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
      this.handleProgress(this.currentTime / this.state.totalTime);
      // this.currentTime = 0;
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
    clearInterval(this.getYoutubeTimerInterval);
    this.setState((prevState: any) => {
      const isFullscreen = !prevState.isFullscreen;
      StatusBar.setHidden(isFullscreen);

      return {
        isFullscreen,
      };
    });
  };

  handleContainerLayout = (e) => {
    const {
      width: containerWidth,
      height: containerHeight,
    } = e.nativeEvent.layout;
    if (
      this.props.autoAdjustLayout &&
      this.props.videoId &&
      !this.state.width
    ) {
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
      <Animated.View
        style={[
          {
            flex: 1,
          },
          this.state.isFullscreen && {
            ...StyleSheet.absoluteFillObject,
            zIndex: 999,
            width: appConfig.device.height,
            height: appConfig.device.width,
            // width: this.animatedFullscreenValue.interpolate({
            //   inputRange: [0, 1],
            //   outputRange: [this.state.width, appConfig.device.height],
            // }),
            // height: this.animatedFullscreenValue.interpolate({
            //   inputRange: [0, 1],
            //   outputRange: [this.state.height, appConfig.device.width],
            // }),
          },
          {
            transform: [
              {
                translateX: this.animatedFullscreenValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    0,
                    (appConfig.device.width -
                      (this.state.containerWidth || 0)) /
                      2,
                  ],
                }),
              },
              {
                translateY: this.animatedFullscreenValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    0,
                    (appConfig.device.height -
                      (this.state.containerHeight || 0)) /
                      2,
                  ],
                }),
              },
              // {
              //   translateX: this.animatedFullscreenValue.interpolate({
              //     inputRange: [0, 1],
              //     outputRange: [
              //       0,
              //       -(appConfig.device.height - (appConfig.device.width || 0)) / 2,
              //     ],
              //   }),
              // },

              {
                rotate: concat(
                  this.animatedFullscreenValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 90],
                  }),
                  'deg',
                ),
              },
              {
                scaleX: this.animatedFullscreenValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    1,
                    appConfig.device.height / (this.state.containerWidth || 1),
                  ],
                }),
              },
              {
                scaleY: this.animatedFullscreenValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    1,
                    appConfig.device.width / (this.state.containerHeight || 1),
                  ],
                }),
              },
              //  {
              //   translateX: this.animatedFullscreenValue.interpolate({
              //     inputRange: [0, 1],
              //     outputRange: [
              //       0,
              //       (appConfig.device.height/2 -((appConfig.device.width - (this.state.containerHeight || 0)/2))),
              //     ],
              //   }),
              // },
              // {
              //   translateX: this.animatedFullscreenValue.interpolate({
              //     inputRange: [0, 1],
              //     outputRange: [
              //       0,
              //       appConfig.device.height / 2 - appConfig.device.width / 2,
              //     ],
              //   }),
              // },
              // {
              //   translateY: this.animatedFullscreenValue.interpolate({
              //     inputRange: [0, 1],
              //     outputRange: [0, appConfig.device.width/2],
              //   }),
              // },
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
                this.state.isFullscreen
                  ? appConfig.device.width
                  : this.state.height
              }
              width={
                this.state.isFullscreen
                  ? appConfig.device.height
                  : this.state.width
              }
              // height={this.state.height
              // }
              // width={this.state.width
              // }
              webViewStyle={[this.props.webviewStyle]}
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

        <View style={styles.controlsContainer}>
          <Controls
            currentTime={this.state.currentTime}
            totalTime={this.state.totalTime}
            bufferTime={this.state.bufferTime}
            isPlay={!!this.props.youtubeIframeProps?.play}
            isMute={!!this.props.youtubeIframeProps?.mute}
            isEnd={this.props.isEnd}
            isFullscreen={this.state.isFullscreen}
            onPressPlay={this.handlePressPlay}
            onPressMute={this.props.onPressMute}
            onChangedProgress={this.handleProgress}
            onSkippingTime={this.handleSkip}
            onPressFullScreen={this.handleFullScreen}
          />
        </View>
      </Animated.View>
    );
  };

  render() {
    return this.state.isFullscreen ? (
      <Modal transparent>
        <GestureHandlerRootView style={{flex: 1}}>
          {this.renderVideo()}
        </GestureHandlerRootView>
      </Modal>
    ) : (
      this.renderVideo()
    );
  }
}

export default withTranslation()(YoutubeVideoIframe);
export {getYoutubeMeta};
