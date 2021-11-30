import React, {Component} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import appConfig from 'app-config';

import Carousel from 'src/components/Carousel';
import Video from 'src/components/Video';
import Image from 'src/components/Image';
import {Actions} from 'react-native-router-flux';
import {MEDIA_TYPE} from 'src/constants';
import {THUMB_SIZE} from 'src/components/Video/Controls/constants';

const styles = StyleSheet.create({
  wrapper: {
    // height: appConfig.device.height / 2,
  },
  paginationContainer: {
    borderRadius: 20,
    position: 'absolute',
    bottom: 22,
    right: 15,
    backgroundColor: 'rgba(255,255,255,.6)',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  paginationText: {
    fontSize: 12,
    color: '#444',
  },

  mediaContainer: {
    width: appConfig.device.width,
  },
  imageContainer: {
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  videoContainer: {
    justifyContent: 'center',
    // height: appConfig.device.height / 2,
    backgroundColor: '#000',
  },
});

class MediaCarousel extends Component {
  static defaultProps = {
    initIndex: 0,
    showPagination: true,
    canPlayVideo: false,
  };
  state = {
    currentIndex: this.props.initIndex,
    stopVideo: false,
  };

  videosInfo = [];

  get videoContainerStyle() {
    return [
      styles.videoContainer,
      {
        height: this.props.height,
      },
    ];
  }

  get wrapperMixStyle() {
    return [
      styles.wrapper,
      this.props.wrapperStyle,
      {
        height: this.props.height + THUMB_SIZE,
      },
    ];
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.canPlayVideo !== this.props.canPlayVideo) {
      this.setState({stopVideo: !nextProps.canPlayVideo});
    }
    return true;
  }

  handleChangeImageIndex = (index, media) => {
    this.setState({currentIndex: index});
  };

  updateVideoCurrentTime = (index, currentTime) => {
    this.videosInfo[index] = {currentTime};
  };

  goToGallery = (index) => {
    this.setState({stopVideo: true});
    Actions.item_image_viewer({
      images: this.props.data,
      index: index,
      onBack: () => this.setState({stopVideo: false}),
      videosInfo: this.videosInfo,
    });
  };

  renderPagination = (index, total) => {
    if (!this.props.showPagination) return null;
    const pagingMess = total ? `${index + 1}/${total}` : '0/0';
    return (
      <View pointerEvents="none" style={styles.paginationContainer}>
        <Text style={styles.paginationText}>{pagingMess}</Text>
      </View>
    );
  };

  renderVideo = (media, index) => {
    return (
      <Video
        type="youtube"
        videoId={media.url}
        containerStyle={this.videoContainerStyle}
        height={this.props.height}
        autoAdjustLayout
        isPlay={!this.state.stopVideo && this.state.currentIndex === index}
        onPressFullscreen={() => this.goToGallery(index)}
        onChangeCurrentTime={(currentTime) =>
          this.updateVideoCurrentTime(index, currentTime)
        }
      />
    );
  };

  renderItem = ({item: media, index}) => {
    return (
      <TouchableHighlight
        disabled={media?.type === MEDIA_TYPE.YOUTUBE_VIDEO}
        underlayColor="transparent"
        onPress={() => this.goToGallery(index)}>
        <View style={styles.mediaContainer}>
          {media?.type !== MEDIA_TYPE.YOUTUBE_VIDEO ? (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{uri: media.url}}
                resizeMode="contain"
                {...media.mediaProps}
              />
            </View>
          ) : (
            this.renderVideo(media, index)
          )}
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <Carousel
        scrollEnabled={this.props.data?.length > 1}
        wrapperStyle={this.wrapperMixStyle}
        data={this.props.data}
        renderItem={this.renderItem}
        onChangeIndex={this.handleChangeImageIndex}
        renderPagination={(index, total) => this.renderPagination(index, total)}
      />
    );
  }
}

export default MediaCarousel;
