import React, {Component} from 'react';
import {StyleSheet, View, Modal, StatusBar} from 'react-native';
// 3-party libs
import YoutubeIframe, {getYoutubeMeta} from 'react-native-youtube-iframe';
import equal from 'deep-equal';
import {withTranslation} from 'react-i18next';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {concat, Easing} from 'react-native-reanimated';
// types
import {YoutubeVideoIframeProps} from '.';
import {Style} from 'src/Themes/interface';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {Container, Typography, Icon} from 'src/components/base';
import Loading from 'src/components/Loading';
import Controls from '../Controls';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 36,
  },
  errorMessage: {
    marginTop: 15,
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});

class YoutubeVideoIframe extends Component<YoutubeVideoIframeProps> {
  static contextType = ThemeContext;

  static defaultProps = {
    autoAdjustLayout: false,
    onProgress: () => {},
    currentTime: 0,
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

    currentTime: this.props.currentTime,
    totalTime: 0,
    bufferTime: 0,

    isFullscreen: !!this.props.isFullscreenWithoutModal,
    isFullscreenLandscape: false,

    playerState: '',
  };
  currentTime = this.props.currentTime;
  isAnimateFullscreenLandscape = false;
  isUnmounted = false;

  getYoutubeTimerInterval: any = '';
  getYoutubeLoadedFractionInterval: any = '';
  animatedFullscreenLandscapeValue = new Animated.Value(
    this.state.isFullscreenLandscape ? 1 : 0,
  );

  get containerWidth() {
    return this.state.isFullscreenLandscape
      ? appConfig.device.height
      : this.state.isFullscreen
      ? appConfig.device.width
      : this.state.width;
  }

  get containerHeight() {
    return this.state.isFullscreenLandscape
      ? appConfig.device.width
      : this.state.isFullscreen
      ? appConfig.device.height
      : this.state.height;
  }

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps: YoutubeVideoIframeProps, nextState) {
    if (nextState !== this.state) {
      if (
        nextState.isFullscreenLandscape !== this.state.isFullscreenLandscape
      ) {
        this.isAnimateFullscreenLandscape = true;
        this.setState({isAnimateFullscreenLandscape: true});
        Animated.timing(this.animatedFullscreenLandscapeValue, {
          toValue: nextState.isFullscreenLandscape ? 1 : 0,
          easing: Easing.ease,
          duration: 300,
        }).start(({finished}) => {
          if (finished) {
            this.setState({
              isAnimateFullscreenLandscape: false,
            });
          }
          this.isAnimateFullscreenLandscape = !finished;
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

      if (nextProps.currentTime !== this.props.currentTime) {
        this.currentTime = nextProps.currentTime;
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
    this.isUnmounted = true;
    clearInterval(this.getYoutubeTimerInterval);
    clearInterval(this.getYoutubeLoadedFractionInterval);
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

        this.getCurrentTime();
        this.getVideoLoadedFraction(totalTime);
      } catch (error) {
        console.log('youtube_iframe_get_timer', error);
      }
    }
  };

  getCurrentTime = () => {
    clearInterval(this.getYoutubeTimerInterval);
    this.getYoutubeTimerInterval = setInterval(async () => {
      if (!this.refPlayer.current) {
        clearInterval(this.getYoutubeTimerInterval);
        return;
      }

      const currentTime = await this.refPlayer.current.getVideoCurrentTime();
      if (!this.isUnmounted && currentTime > this.currentTime) {
        this.setState({currentTime});
        this.props.onChangeCurrentTime &&
          this.props.onChangeCurrentTime(currentTime);
        this.currentTime = 0;
      }
    }, 100);
  };

  getVideoLoadedFraction = (totalTime = this.state.totalTime) => {
    clearInterval(this.getYoutubeLoadedFractionInterval);
    this.getYoutubeLoadedFractionInterval = setInterval(async () => {
      if (!this.refPlayer.current) {
        clearInterval(this.getYoutubeLoadedFractionInterval);
        return;
      }

      const bufferFraction = await this.refPlayer.current.getVideoLoadedFraction();
      !this.isUnmounted &&
        !this.isAnimateFullscreenLandscape &&
        this.setState({bufferTime: bufferFraction * totalTime});
    }, 100);
  };

  /**
   * @todo Youtube iframe ratio always is 16:9 (even if the actual video ratio is a different ratio).
   * -> update iframe size to fit with actual video size to make it display in shape, fitted, centered.
   */
  updateIframeSize = () => {
    const iframeHeight = this.state.isFullscreenLandscape
      ? appConfig.device.width
      : this.state.height;
    const iframeWidth = this.state.isFullscreenLandscape
      ? appConfig.device.height
      : this.state.width;

    //@ts-ignore
    this.refWebview.current =
      this.refPlayer.current && this.refPlayer.current.getWebViewRef();
    this.refWebview.current &&
      this.refWebview.current.injectJavaScript(
        `
        var iframe = document.getElementsByTagName('iframe')[0];
        iframe.style.height = '${iframeHeight}px';
        iframe.style.width = '${iframeWidth}px';
        true;
      `,
      );
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

  handleChangeState = (e) => {
    this.setState({playerState: e}, () => {
      // When isFullscreen true, components in renderVideo() will be re-mounted
      // state of player will be set to 'unstarted' by default of youtube iframe
      // => current time will not be updated if any changes
      // => have to force the player play to update current time.
      if (this.state.playerState === 'unstarted') {
        if (this.refPlayer.current) {
          this.refPlayer.current.playVideo();
        }
      }
      this.props.onChangeState && this.props.onChangeState(e);
    });

    switch (e) {
      case 'playing':
        if (
          this.props.currentTime &&
          this.currentTime &&
          this.state.totalTime
        ) {
          this.handleProgress(this.currentTime / this.state.totalTime);
          this.currentTime = 0;
        }
        break;
    }
  };

  handleReady = () => {
    if (this.currentTime) {
      this.handleProgress(this.currentTime / this.state.totalTime);
    }
    this.setState({isError: false, loading: false});
    this.props.onReady && this.props.onReady();
    this.getTimer();
    this.updateIframeSize();
  };

  handleError = (error) => {
    console.log('youtube iframe', error);
    this.setState({
      isError: true,
      loading: false,
    });
    this.props.onError && this.props.onError(error);
  };

  handleFullscreen = () => {
    if (this.props.onPressFullscreen) {
      this.props.onPressFullscreen();
      return;
    }
    this.currentTime = this.state.currentTime;
    clearInterval(this.getYoutubeTimerInterval);
    clearInterval(this.getYoutubeLoadedFractionInterval);
    this.setState((prevState: any) => {
      const isFullscreen = !prevState.isFullscreen;
      const isFullscreenLandscape = isFullscreen
        ? prevState.isFullscreenLandscape
        : false;
      StatusBar.setHidden(isFullscreen);

      return {
        isFullscreen,
        isFullscreenLandscape,
      };
    });
  };

  handleRotateFullscreen = () => {
    this.setState(
      (prevState: any) => ({
        isFullscreenLandscape: !prevState.isFullscreenLandscape,
      }),
      () => {
        this.props.onRotateFullscreen &&
          this.props.onRotateFullscreen(this.state.isFullscreenLandscape);
        this.updateIframeSize();
      },
    );
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
          this.setState({width, height, metaData}, () => {
            this.updateIframeSize();
          });
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

  renderErrorIcon = (titleStyle, fontStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.ANT_DESIGN}
        name="exclamationcircle"
        style={[fontStyle, styles.errorIcon]}
      />
    );
  };

  get maskStyle(): Style {
    return {
      backgroundColor: this.theme.color.coreOverlay,
    };
  }

  renderVideo() {
    return (
      <View
        onLayout={this.handleContainerLayout}
        style={[styles.container, this.props.containerStyle]}>
        <View>
          <YoutubeIframe
            ref={this.refPlayer}
            videoId={this.props.videoId}
            height={
              this.state.isFullscreenLandscape
                ? appConfig.device.width
                : this.state.height
            }
            width={
              this.state.isFullscreenLandscape
                ? appConfig.device.height
                : this.state.width
            }
            webViewStyle={this.props.webviewStyle}
            onChangeState={this.handleChangeState}
            onReady={this.handleReady}
            onError={this.handleError}
            forceAndroidAutoplay
            {...this.props.youtubeIframeProps}
            initialPlayerParams={{
              controls: false,
              ...this.props.youtubeIframeProps?.initialPlayerParams,
            }}
          />
          {(this.state.isError || this.state.loading) && (
            <View style={[styles.mask, this.maskStyle]}>
              {this.state.isError ? (
                <Container noBackground center>
                  <Typography
                    type={TypographyType.LABEL_LARGE_TERTIARY}
                    style={styles.errorMessage}
                    renderIconBefore={this.renderErrorIcon}>
                    {this.props.t('api.error.message') as string}
                  </Typography>
                </Container>
              ) : null}
            </View>
          )}
        </View>
      </View>
    );
  }

  renderVideoContainer = () => {
    return (
      <Animated.View
        style={[
          {
            flex: 1,
            width: this.containerWidth,
            height: this.containerHeight,
          },
          this.state.isFullscreen && {
            ...StyleSheet.absoluteFillObject,
            zIndex: 999,
          },
          {
            transform: [
              {
                translateX: this.animatedFullscreenLandscapeValue.interpolate({
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
                translateY: this.animatedFullscreenLandscapeValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    0,
                    (appConfig.device.height -
                      (this.state.containerHeight || 0)) /
                      2,
                  ],
                }),
              },

              {
                rotate: concat(
                  this.animatedFullscreenLandscapeValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 90],
                  }),
                  'deg',
                ),
              },

              {
                translateX: this.props.isFullscreenWithoutModal
                  ? this.animatedFullscreenLandscapeValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        0,
                        (appConfig.device.width -
                          (this.state.containerWidth || 0)) /
                          2,
                      ],
                    })
                  : 0,
              },
              {
                translateY: this.props.isFullscreenWithoutModal
                  ? this.animatedFullscreenLandscapeValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        0,
                        (appConfig.device.height -
                          (this.state.containerHeight || 0)) /
                          2,
                      ],
                    })
                  : 0,
              },
            ],
          },
        ]}>
        {this.props.renderVideo
          ? this.props.renderVideo(this.renderVideo())
          : this.renderVideo()}

        {this.state.loading ? (
          <Loading center />
        ) : (
          <View style={styles.controlsContainer}>
            <Controls
              currentTime={this.state.currentTime}
              totalTime={this.state.totalTime}
              bufferTime={this.state.bufferTime}
              isPlay={!!this.props.youtubeIframeProps?.play}
              isMute={!!this.props.youtubeIframeProps?.mute}
              isEnd={this.props.isEnd}
              isFullscreen={this.state.isFullscreen}
              isFullscreenLandscape={this.state.isFullscreenLandscape}
              containerStyle={this.props.controlsContainerStyle}
              trackerContainerStyle={this.props.trackerContainerStyle}
              onPressPlay={this.handlePressPlay}
              onPressMute={this.props.onPressMute}
              onChangedProgress={this.handleProgress}
              onSkippingTime={this.handleSkip}
              onPressFullscreen={this.handleFullscreen}
              onRotateFullscreen={this.handleRotateFullscreen}
              onChangeControlsVisible={this.props.onChangeControlsVisible}
            />
          </View>
        )}
      </Animated.View>
    );
  };

  render() {
    return this.state.isFullscreen && !this.props.isFullscreenWithoutModal ? (
      <Modal transparent>
        <GestureHandlerRootView style={{flex: 1}}>
          {this.renderVideoContainer()}
        </GestureHandlerRootView>
      </Modal>
    ) : (
      <GestureHandlerRootView style={{flex: 1}}>
        {this.renderVideoContainer()}
      </GestureHandlerRootView>
    );
  }
}

export default withTranslation()(YoutubeVideoIframe);
export {getYoutubeMeta};
