import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import Animated from 'react-native-reanimated';
// helpers
import {formatTime} from 'app-helper';
import {getThemes} from '../themes';
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {Container, IconButton} from 'src/components/base';
import ProgressBar from './ProgressBar';
import Timer from './Timer';

const styles = StyleSheet.create({
  actionsContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    paddingHorizontal: 30,
    width: '100%',
    justifyContent: 'space-between',
  },

  icon: {
    fontSize: 24,
    marginLeft: 20,
  },
});

const Tracker = ({
  currentTime,
  totalTime,
  bufferTime,
  isMute = false,
  isFullscreen = false,
  isFullscreenLandscape = false,
  actionsContainerPointerEvents = 'auto',
  actionsContainerStyle = {},
  containerStyle = {},
  progressBarStyle = {},
  progressBarThumbStyle = {},
  animatedVisibleValue = undefined,
  onPressMute = () => {},
  onPressFullscreen = () => {},
  onRotateFullscreen = () => {},
  onChangingProgress = (progress: number) => {},
  onChangedProgress = (progress: number) => {},
}) => {
  const {theme} = useTheme();

  const themes = useMemo(() => {
    return getThemes(theme);
  }, [theme]);

  const extraProgressBarStyle = useMemo(() => {
    return {
      paddingHorizontal: isFullscreen ? 30 : 0,
    };
  }, [isFullscreen]);

  const extractionsContainerStyle = useMemo(() => {
    return {
      bottom: isFullscreen ? 60 : 30,
    };
  }, [isFullscreen]);

  const iconStyle = useMemo(() => {
    return mergeStyles(styles.icon, {
      color: themes.colors.primary,
    });
  }, [themes]);

  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={[extraProgressBarStyle, progressBarStyle]}>
        <ProgressBar
          isFullscreen={isFullscreen}
          progress={currentTime / (totalTime || 1)}
          total={totalTime}
          bufferProgress={bufferTime / (totalTime || 1)}
          animatedVisibleValue={animatedVisibleValue}
          thumbStyle={progressBarThumbStyle}
          onChangedProgress={onChangedProgress}
          onChangingProgress={onChangingProgress}
        />
      </Animated.View>

      <Container
        noBackground
        row
        reanimated
        style={[
          styles.actionsContainer,
          extractionsContainerStyle,
          actionsContainerStyle,
        ]}
        //@ts-ignore
        pointerEvents={actionsContainerPointerEvents}>
        <Timer
          current={formatTime(currentTime)}
          total={formatTime(totalTime)}
        />
        <Container row noBackground>
          <IconButton
            useGestureHandler
            bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
            name={isMute ? 'volume-off' : 'volume-high'}
            iconStyle={iconStyle}
            // @ts-ignore
            disallowInterruption
            onPress={onPressMute}
          />
          {isFullscreen && (
            <IconButton
              useGestureHandler
              bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
              name={isFullscreenLandscape ? 'crop-portrait' : 'crop-landscape'}
              iconStyle={iconStyle}
              // @ts-ignore
              disallowInterruption
              onPress={onRotateFullscreen}
            />
          )}
          <IconButton
            useGestureHandler
            bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
            name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
            iconStyle={iconStyle}
            // @ts-ignore
            disallowInterruption
            onPress={onPressFullscreen}
          />
        </Container>
      </Container>
    </Animated.View>
  );
};

export default React.memo(Tracker);
