import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, Animated, View} from 'react-native';
// 3-party libs
import useIsMounted from 'react-is-mounted-hook';
import ImageZoom from 'react-native-image-pan-zoom';
// configs
import appConfig from 'app-config';
// routing
import {pop} from 'app-helper/routing';
// constants
import {MEDIA_TYPE} from 'src/constants';
// custom components
import Video from 'src/components/Video';
import Image from 'src/components/Image';

const DOUBLE_PRESS_INTERVAL = 300;
const PRESS_DELTA = 50;

const styles = StyleSheet.create({
  videoContainer: {
    width: appConfig.device.width,
    height: appConfig.device.height,
    justifyContent: 'center',
  },
});

const ItemImage = ({
  url,
  index,
  selectedIndex,
  type,
  currentTime,
  onRotateFullscreen,
  onChangeVideoControlsVisible,
  onMove = () => {},
  onPress = () => {},
}) => {
  const useMounted = useIsMounted();
  const refImage = useRef();
  const numOfPointer = useRef(1);
  const lastPressedTime = useRef(Date.now());
  const timeoutPress = useRef();
  const isDoubleClicked = useRef(false);
  const isPress = useRef(true);
  const lastEvent = useRef(null);
  const scaleValue = useRef(1);
  const [isFullscreenLandscape, setFullscreenLandscape] = useState(false);

  const handleStartShouldSetPanResponder = useCallback((e) => {
    let refImg = refImage.current;
    const currentPressedTime = Date.now();
    isDoubleClicked.current =
      currentPressedTime - lastPressedTime.current < DOUBLE_PRESS_INTERVAL;
    lastPressedTime.current = currentPressedTime;

    if (!lastEvent.current) {
      lastEvent.current = e.nativeEvent;
    }

    const deltaX = Math.abs(e.nativeEvent.pageX - lastEvent.current.pageX);
    const deltaY = Math.abs(e.nativeEvent.pageY - lastEvent.current.pageY);
    lastEvent.current = e.nativeEvent;

    if (isDoubleClicked.current) {
      if (
        deltaX <= 100 &&
        deltaY <= 100 &&
        refImg &&
        scaleValue.current === 1
      ) {
        const beforeScale = refImg.scale;
        refImg.scale = 2;

        const diffScale = refImg.scale - beforeScale;
        refImg.positionX =
          ((refImg.props.cropWidth / 2 - e.nativeEvent.pageX) * diffScale) /
          refImg.scale;

        refImg.positionY =
          ((refImg.props.cropHeight / 2 - e.nativeEvent.pageY) * diffScale) /
          refImg.scale;

        Animated.parallel([
          Animated.timing(refImg.animatedScale, {
            toValue: refImg.scale,
            duration: 100,
            useNativeDriver: !!refImg.props.useNativeDriver,
          }),
          Animated.timing(refImg.animatedPositionX, {
            toValue: refImg.positionX,
            duration: 100,
            useNativeDriver: !!refImg.props.useNativeDriver,
          }),
          Animated.timing(refImg.animatedPositionY, {
            toValue: refImg.positionY,
            duration: 100,
            useNativeDriver: !!refImg.props.useNativeDriver,
          }),
        ]).start(() => {
          if (refImg.props.onMove) {
            refImg.props.onMove({
              type: 'centerOn',
              positionX: refImg.positionX,
              positionY: refImg.positionY,
              scale: refImg.scale,
              zoomCurrentDistance: refImg.zoomCurrentDistance,
            });
          }
        });
      }
    }
    return e.nativeEvent.touches.length > 1 || scaleValue.current > 1;
  }, []);

  const handleMove = useCallback((position) => {
    scaleValue.current = position.scale;
    onMove(position);
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (!lastEvent.current) {
      lastEvent.current = e.nativeEvent;
    }
    numOfPointer.current = e.nativeEvent.touches.length;
    isPress.current = e.nativeEvent.touches.length === 1;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const deltaX = Math.abs(e.nativeEvent.pageX - lastEvent.current.pageX);
    const deltaY = Math.abs(e.nativeEvent.pageY - lastEvent.current.pageY);

    numOfPointer.current = e.nativeEvent.touches.length;
    isPress.current =
      e.nativeEvent.touches.length === 1 &&
      deltaY <= PRESS_DELTA &&
      deltaX <= PRESS_DELTA;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    clearTimeout(timeoutPress.current);

    const isPressing = isPress.current;
    timeoutPress.current = setTimeout(() => {
      if (
        !isDoubleClicked.current &&
        numOfPointer.current === 1 &&
        scaleValue.current === 1 &&
        isPressing
      ) {
        onPress();
      }
    }, DOUBLE_PRESS_INTERVAL / 2);
    isPress.current = true;
  }, []);

  const handleRotateFullscreen = useCallback((isFullscreenLandscape) => {
    onRotateFullscreen(isFullscreenLandscape);
    setFullscreenLandscape(isFullscreenLandscape);
  }, []);

  const trackerContainerStyle = useMemo(() => {
    return (
      isFullscreenLandscape && {
        // avoid header
        paddingLeft: 80,
      }
    );
  }, [isFullscreenLandscape]);

  return (
    <View
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      {type === MEDIA_TYPE.YOUTUBE_VIDEO ? (
        <Video
          type="youtube"
          videoId={url}
          containerStyle={styles.videoContainer}
          trackerContainerStyle={trackerContainerStyle}
          autoAdjustLayout
          isFullscreenWithoutModal
          height={appConfig.device.height}
          isPlay={index === selectedIndex}
          onPressFullscreen={pop}
          onRotateFullscreen={handleRotateFullscreen}
          onChangeControlsVisible={onChangeVideoControlsVisible}
          currentTime={currentTime}
        />
      ) : (
        <ImageZoom
          ref={(inst) => (refImage.current = inst)}
          onStartShouldSetPanResponder={handleStartShouldSetPanResponder}
          onMove={handleMove}
          onClick={onPress}
          cropHeight={appConfig.device.height}
          cropWidth={appConfig.device.width}
          imageHeight={appConfig.device.height}
          imageWidth={appConfig.device.width}>
          <Image source={{uri: url}} resizeMode="contain" />
        </ImageZoom>
      )}
    </View>
  );
};

export default React.memo(ItemImage);
