import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {getYoutubeMeta} from 'react-native-youtube-iframe';

import {VideoProps} from '.';
import {convertSecondsToFormattedTimeData} from 'app-helper';

import Controls from './Controls';
import YoutubeVideoIframe from './YoutubeVideoIframe';

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
});
export class Video extends Component<VideoProps> {
  state = {
    isPlay: !!this.props.isPlay,
    isMute: !!this.props.isMute,
    currentTime: '',
    totalTime: '',
  };

  refYoutubePlayer = React.createRef<any>();
  getYoutubeTimerInterval: any = () => {};

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isPlay !== this.props.isPlay) {
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
        if (this.state.isPlay) {
          this.handlePressPlay();
        }
        break;
    }
  };

  handlePressPlay = () => {
    this.setState((prevState: any) => ({
      isPlay: !prevState.isPlay,
    }));
  };

  handlePressMute = () => {
    this.setState((prevState: any) => ({
      isMute: !prevState.isMute,
    }));
  };

  handleProgress = (progress) => {
    console.log(progress)
  }

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
          youtubeIframeProps={{
            play: this.state.isPlay,
            mute: this.state.isMute,
            ...this.props.youtubeIframeProps,
          }}
        />
      </View>
    );
  };
  render() {
    return this.props.type === 'youtube' ? this.renderYoutubeIframe() : null;
  }
}

export default Video;
