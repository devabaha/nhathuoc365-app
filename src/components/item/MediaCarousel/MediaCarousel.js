import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {hexToRgba} from 'app-helper';
// routing
import {push} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {MEDIA_TYPE} from 'src/constants';
import {TypographyType} from 'src/components/base';
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
    bottom: 15,
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

const MediaCarousel = ({
  wrapperStyle,
  height,
  data,
  showPagination = true,
  initIndex = 0,
}) => {
  const {theme} = useTheme();

  const [currentIndex, setCurrentIndex] = useState(initIndex);

  const videoContainerStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.videoContainer,
        {
          height,
        },
      ],
      {backgroundColor: theme.color.black},
    );
  }, [height, theme]);

  const wrapperMixStyle = useMemo(() => {
    return [
      styles.wrapper,
      wrapperStyle,
      {
        height,
      },
    ];
  }, [height, wrapperStyle]);

  const paginationContainerStyle = useMemo(() => {
    return mergeStyles(styles.paginationContainer, {
      backgroundColor: hexToRgba(theme.color.white, 0.6),
      borderRadius: theme.layout.borderRadiusGigantic,
    });
  }, [theme]);

  const handleChangeImageIndex = useCallback((index, media) => {
    setCurrentIndex(index);
  }, []);

  const renderPagination = (index, total) => {
    if (!showPagination) return null;
    const pagingMess = total ? `${index + 1}/${total}` : '0/0';
    return (
      <View pointerEvents="none" style={paginationContainerStyle}>
        <Typography
          type={TypographyType.LABEL_SEMI_MEDIUM}
          style={styles.paginationText}>
          {pagingMess}
        </Typography>
      </View>
    );
  };

  const renderVideo = (media, index) => {
    return (
      <Video
        type="youtube"
        videoId={media.url}
        containerStyle={videoContainerStyle}
        height={appConfig.device.height / 2}
        autoAdjustLayout
        youtubeIframeProps={{
          play: currentIndex === index,
        }}
      />
    );
  };

  const renderItem = useCallback(
    ({item: media, index}) => {
      return (
        <BaseButton
          useTouchableHighlight
          onPress={() => {
            push(appConfig.routes.itemImageViewer, {
              images: data,
              index: index,
            });
          }}>
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
              renderVideo(media, index)
            )}
          </View>
        </BaseButton>
      );
    },
    [currentIndex],
  );

  return (
    <Carousel
      scrollEnabled={data?.length > 1}
      wrapperStyle={wrapperMixStyle}
      data={data}
      renderItem={renderItem}
      onChangeIndex={handleChangeImageIndex}
      renderPagination={(index, total) => renderPagination(index, total)}
    />
  );
};

export default React.memo(MediaCarousel);
