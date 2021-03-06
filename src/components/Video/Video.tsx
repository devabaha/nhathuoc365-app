import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import {debounce} from 'lodash';
// types
import {VideoProps} from '.';
// custom components
import YoutubeVideoIframe from './YoutubeVideoIframe';

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
});
export class Video extends Component<VideoProps> {
  state = {
    isPlay: !!this.props.isPlay,
    isEnd: false,
    isMute: !!this.props.isMute,
    isFullscreenWithoutModal: !!this.props.isFullscreenWithoutModal,
  };

  refYoutubePlayer = React.createRef<any>();
  getYoutubeTimerInterval: any = () => {};

  playerState = '';

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isPlay !== this.props.isPlay && !this.state.isEnd) {
      this.setState({isPlay: nextProps.isPlay});
    }
    if (nextProps.isMute !== this.props.isMute) {
      this.setState({isMute: nextProps.isMute});
    }
    if (
      nextProps.isFullscreenWithoutModal !== this.props.isFullscreenWithoutModal
    ) {
      this.setState({
        isFullscreenWithoutModal: nextProps.isFullscreenWithoutModal,
      });
    }

    if (!nextState.isPlay) {
      if (this.refYoutubePlayer.current) {
        // this.refYoutubePlayer.current.pauseVideo();
      }
    }

    return true;
  }

  handleChangeState = (e) => {
    this.playerState = e;

    this.props.onChangeState && this.props.onChangeState(e);
    switch (e) {
      case 'playing':
        if (!this.state.isPlay) {
          this.handlePressPlay();
        }
        break;
      case 'paused':
        if (this.state.isPlay || this.state.isEnd) {
          this.handlePressPlay();
        }
        break;
      case 'ended':
        if (this.state.isPlay) {
          this.handlePressPlay(true);
        }
        break;
    }
  };

  handlePressPlay = debounce((isEnd = false) => {
    this.setState((prevState: any) => {
      return {
        isPlay: !prevState.isPlay,
        isEnd,
      };
    });
  }, 100);

  handlePressMute = () => {
    this.setState((prevState: any) => ({
      isMute: !prevState.isMute,
    }));
  };

  handleProgress = (progress) => {
    // console.log(progress);
    if (this.state.isEnd && this.playerState === 'unstarted') {
      this.handlePressPlay();
    }
  };

  containerStyle = [styles.container, this.props.containerStyle];

  renderYoutubeIframe = () => {
    return (
      <View style={this.containerStyle}>
        <YoutubeVideoIframe
          //@ts-ignore
          refPlayer={(inst) => (this.refYoutubePlayer.current = inst)}
          videoId={this.props.videoId}
          height={this.props.height}
          width={this.props.width}
          currentTime={this.props.currentTime}
          webviewStyle={this.props.webviewStyle}
          containerStyle={this.props.containerStyle}
          controlsContainerStyle={this.props.controlsContainerStyle}
          trackerContainerStyle={this.props.trackerContainerStyle}
          autoAdjustLayout={this.props.autoAdjustLayout}
          onChangeState={this.handleChangeState}
          onReady={this.props.onReady}
          onError={this.props.onError}
          onPressPlay={() => this.handlePressPlay()}
          onPressMute={this.handlePressMute}
          onProgress={this.handleProgress}
          onPressFullscreen={this.props.onPressFullscreen}
          onRotateFullscreen={this.props.onRotateFullscreen}
          onChangeControlsVisible={this.props.onChangeControlsVisible}
          onChangeCurrentTime={this.props.onChangeCurrentTime}
          youtubeIframeProps={{
            ...this.props.youtubeIframeProps,
            play: this.state.isPlay,
            mute: this.state.isMute,
          }}
          isEnd={this.state.isEnd}
          isFullscreenWithoutModal={this.state.isFullscreenWithoutModal}
          renderVideo={this.props.renderVideo}
        />
      </View>
    );
  };
  render() {
    return this.props.type === 'youtube' ? this.renderYoutubeIframe() : null;
  }
}

export default Video;
