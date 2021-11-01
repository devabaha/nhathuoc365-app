import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import {formatTime} from 'app-helper';
import {themes} from '../themes';

import {Container} from 'src/components/Layout';
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
    color: themes.colors.primary,
    fontSize: 22,
    marginLeft: 20,
  },
});

const Tracker = ({
  currentTime,
  totalTime,
  bufferTime,
  isMute = false,
  isFullscreen = false,
  actionsContainerPointerEvents = 'auto',
  actionsContainerStyle = {},
  containerStyle = {},
  progressBarStyle = {},
  onPressMute = () => {},
  onPressFullscreen = () => {},
  onChangingProgress = (progress: number) => {},
  onChangedProgress = (progress: number) => {},
}) => {
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

  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={[extraProgressBarStyle, progressBarStyle]}>
        <ProgressBar
          isFullscreen={isFullscreen}
          progress={currentTime / (totalTime || 1)}
          total={totalTime}
          bufferProgress={bufferTime / (totalTime || 1)}
          onChangedProgress={onChangedProgress}
          onChangingProgress={onChangingProgress}
        />
      </Animated.View>

      <Container
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
        <Container row>
          <TouchableOpacity
            activeOpacity={0.5}
            // @ts-ignore
            disallowInterruption
            // @ts-ignore
            hitSlop={HIT_SLOP}
            onPress={onPressMute}>
            <Ionicons
              name={isMute ? 'ios-volume-mute' : 'ios-volume-high'}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            // @ts-ignore
            disallowInterruption
            // @ts-ignore
            // hitSlop={HIT_SLOP}
            onPress={onPressFullscreen}>
            <Ionicons name="ios-scan" style={styles.icon} />
          </TouchableOpacity>
        </Container>
      </Container>
    </Animated.View>
  );
};

export default React.memo(Tracker);
