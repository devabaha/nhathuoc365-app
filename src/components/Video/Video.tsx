import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {VideoProps} from '.';

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
  };

  refYoutubePlayer = React.createRef<any>();
  getYoutubeTimerInterval: any = () => {};

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isPlay !== this.props.isPlay && !this.state.isEnd) {
      this.setState({isPlay: nextProps.isPlay});
    }
    if (nextProps.isMute !== this.props.isMute) {
      this.setState({isMute: nextProps.isMute});
    }

    return true;
  }

  handleChangeState = (e) => {
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

  handlePressPlay = (isEnd = false) => {
    this.setState((prevState: any) => {
      return {
        isPlay: !prevState.isPlay,
        isEnd,
      };
    });
  };

  handlePressMute = () => {
    this.setState((prevState: any) => ({
      isMute: !prevState.isMute,
    }));
  };

  handleProgress = (progress) => {
    // console.log(progress);
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
          webviewStyle={this.props.webviewStyle}
          containerStyle={this.props.containerStyle}
          autoAdjustLayout={this.props.autoAdjustLayout}
          onChangeState={this.handleChangeState}
          onReady={this.props.onReady}
          onError={this.props.onError}
          onPressPlay={this.handlePressPlay}
          onPressMute={this.handlePressMute}
          onProgress={this.handleProgress}
          onPressFullscreen={this.props.onPressFullscreen}
          // onPressFullscreen={(isFullscreen, element) => this.props.onPressFullscreen(
          //   !isFullscreen?  cloneElement(<Video />, {...this.props, isFullscreen: true}, {...this.state}):null
          // )}
          // isFullscreen={this.props.isFullscreen}
          youtubeIframeProps={{
            ...this.props.youtubeIframeProps,
            play: this.state.isPlay,
            mute: this.state.isMute,
          }}
          isEnd={this.state.isEnd}
        />
      </View>
    );
  };
  render() {
    return this.props.type === 'youtube' ? this.renderYoutubeIframe() : null;
  }
}

export default Video;
