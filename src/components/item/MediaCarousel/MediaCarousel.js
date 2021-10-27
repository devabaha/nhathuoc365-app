import React, {useCallback, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import appConfig from 'app-config';

import Carousel from 'src/components/Carousel';
import Video from 'src/components/Video';
import Image from 'src/components/Image';
import {Actions} from 'react-native-router-flux';
import {MEDIA_TYPE} from 'src/constants';

const styles = StyleSheet.create({
  wrapper: {
    height: appConfig.device.height / 2,
  },
  paginationContainer: {
    borderRadius: 20,
    position: 'absolute',
    bottom: 15,
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
    height: appConfig.device.height / 2,
    backgroundColor: '#000',
  },
});

const MediaCarousel = ({wrapperStyle, data, initIndex = 0}) => {
  const [currentIndex, setCurrentIndex] = useState(initIndex);

  const handleChangeImageIndex = useCallback((index, media) => {
    setCurrentIndex(index);
  }, []);

  const renderPagination = (index, total) => {
    const pagingMess = total ? `${index + 1}/${total}` : '0/0';
    return (
      <View pointerEvents="none" style={styles.paginationContainer}>
        <Text style={styles.paginationText}>{pagingMess}</Text>
      </View>
    );
  };

  const renderVideo = (media, index) => {
    return (
      <Video
        type="youtube"
        // videoId={media.url}
        videoId="VJDJs9dumZI"
        containerStyle={styles.videoContainer}
        height={appConfig.device.height / 2}
        autoAdjustLayout
        isPlay={currentIndex === index}
      />
    );
  };

  const renderItem = useCallback(
    ({item: media, index}) => {
      return (
        <>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => {
              Actions.item_image_viewer({
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
                  />
                </View>
              ) : (
                renderVideo(media, index)
              )}
            </View>
          </TouchableHighlight>
        </>
      );
    },
    [currentIndex],
  );

  return (
    <Carousel
      wrapperStyle={[styles.wrapper, wrapperStyle]}
      data={data}
      renderItem={renderItem}
      onChangeIndex={handleChangeImageIndex}
      renderPagination={(index, total) => renderPagination(index, total)}
    />
  );
};

export default React.memo(MediaCarousel);
