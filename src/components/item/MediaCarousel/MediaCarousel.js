import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {MEDIA_TYPE} from 'src/constants';
import {TypographyType} from 'src/components/base';
import {THUMB_SIZE} from 'src/components/Video/Controls/constants';
// custom components
import Carousel from 'src/components/Carousel';
import Video from 'src/components/Video';
import Image from 'src/components/Image';
import {BaseButton, Typography} from 'src/components/base';

const styles = StyleSheet.create({
  wrapper: {
    // height: appConfig.device.height / 2,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 22,
    right: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  paginationText: {},

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
  },
});

class MediaCarousel extends Component {
  static contextType = ThemeContext;

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

  get theme() {
    return getTheme(this);
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
    push(appConfig.routes.itemImageViewer, {
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
      <View pointerEvents="none" style={this.paginationContainerStyle}>
        <Typography
          type={TypographyType.LABEL_SEMI_MEDIUM}
          style={[styles.paginationText, this.paginationTextStyle]}>
          {pagingMess}
        </Typography>
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
      <BaseButton
        useTouchableHighlight
        useContentContainer
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
      </BaseButton>
    );
  };

  get videoContainerStyle() {
    return [
      styles.videoContainer,
      {
        backgroundColor: this.theme.color.black,
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

  get paginationContainerStyle() {
    return mergeStyles(styles.paginationContainer, {
      backgroundColor: this.theme.color.overlay30,
      borderRadius: this.theme.layout.borderRadiusGigantic,
    });
  }

  get paginationTextStyle() {
    return {
      color: this.theme.color.onOverlay,
    };
  }

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
