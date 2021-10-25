import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {VideoProps} from '.';
import YoutubeVideoIframe from './YoutubeVideoIframe';

export class Video extends Component<VideoProps> {
  renderYoutubeIframe = () => {
    return (
      <View style={this.props.containerStyle}>
        <YoutubeVideoIframe
          videoId={this.props.videoId}
          height={this.props.height}
          width={this.props.width}
          webviewStyle={this.props.webviewStyle}
          containerStyle={this.props.containerStyle}
          autoAdjustLayout={this.props.autoAdjustLayout}
          onChangeState={this.props.onChangeState}
          onReady={this.props.onReady}
          onError={this.props.onError}
          youtubeIframeProps={this.props.youtubeIframeProps}
        />
      </View>
    );
  };
  render() {
    return this.props.type === 'youtube' ? this.renderYoutubeIframe() : null;
  }
}

export default Video;
