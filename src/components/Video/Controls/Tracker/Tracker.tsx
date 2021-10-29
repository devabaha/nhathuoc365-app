import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';

import appConfig from 'app-config';
import {convertSecondsToFormattedTimeData} from 'app-helper';
import {themes} from '../themes';

import {Container} from 'src/components/Layout';
import ProgressBar from './ProgressBar';
import Timer from './Timer';

const styles = StyleSheet.create({
  actionsContainer: {
    paddingHorizontal: 30,
    position: 'absolute',
    bottom: 30,
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
  isMute = false,
  actionsContainerPointerEvents = 'auto',
  actionsContainerStyle = {},
  onPressMute = () => {},
  onPressFullscreen = () => {},
  onChangingProgress = (progress: number) => {},
  onProgress = (progress: number) => {},
}) => {
  const formattedTime = (timeInSeconds) => {
    const {hours, minutes, seconds} = convertSecondsToFormattedTimeData(
      timeInSeconds,
    );
    return [Number(hours) ? hours : '', minutes, seconds]
      .join(':')
      .slice(Number(hours) ? 0 : 1);
  };

  const getPopOverData = useMemo(() => {
    const popoverLength = appConfig.device.width / totalTime;

    const popovers = Array.from({length: totalTime}, (_, index) => ({
      start: index * popoverLength,
      end: popoverLength * (index + 1),
      value: formattedTime(index),
    }));

    return popovers;
  }, [totalTime]);

  return (
    <View>
      <ProgressBar
        progress={currentTime / (totalTime || 1)}
        popovers={getPopOverData}
        onProgress={onProgress}
        onChangingProgress={onChangingProgress}
      />

      <Container
        row
        reanimated
        style={[styles.actionsContainer, actionsContainerStyle]}
        //@ts-ignore
        pointerEvents={actionsContainerPointerEvents}>
        <Timer
          current={formattedTime(currentTime)}
          total={formattedTime(totalTime)}
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
    </View>
  );
};

export default React.memo(Tracker);
