import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {convertSecondsToFormattedTimeData} from 'app-helper';
import {themes} from '../themes';

import {Container} from 'src/components/Layout';
import ProgressBar from './ProgressBar';
import Timer from './Timer';

const styles = StyleSheet.create({
  timerContainer: {
    paddingHorizontal: 30,
    position: 'absolute',
    bottom: 30,
    width: '100%',
    justifyContent: 'space-between',
  },
  timerTitle: {
    fontSize: 12,
    fontWeight: '500',
  },

  icon: {
    color: themes.colors.primary,
    fontSize: 22,
    marginLeft: 15,
  },
});

const Tracker = ({
  currentTime,
  totalTime,
  isMute = false,
  onPressMute = () => {},
  onPressFullscreen = () => {},
  onProgress = (value: number) => {},
}) => {
  const formattedCurrentTime = () => {
    const {hour, minute, second} = convertSecondsToFormattedTimeData(
      currentTime,
    );

    return [Number(hour) ? hour : '', minute, second]
      .join(':')
      .slice(Number(hour) ? 0 : 1);
  };

  const formattedTotalTime = () => {
    const {hour, minute, second} = convertSecondsToFormattedTimeData(totalTime);
    return [Number(hour) ? hour : '', minute, second]
      .join(':')
      .slice(Number(hour) ? 0 : 1);
  };

  return (
    <View>
      <ProgressBar progress={currentTime / totalTime} onProgress={onProgress} />

      <Container row style={styles.timerContainer}>
        <Timer
          current={formattedCurrentTime()}
          total={formattedTotalTime()}
          titleStyle={styles.timerTitle}
        />
        <Container row>
          {/* @ts-ignore */}
          <TouchableOpacity hitSlop={HIT_SLOP} onPress={onPressMute}>
            <Ionicons
              name={isMute ? 'ios-volume-mute' : 'ios-volume-high'}
              style={styles.icon}
            />
          </TouchableOpacity>
          {/* @ts-ignore */}
          <TouchableOpacity hitSlop={HIT_SLOP} onPress={onPressFullscreen}>
            <Ionicons name="ios-scan" style={styles.icon} />
          </TouchableOpacity>
        </Container>
      </Container>
    </View>
  );
};

export default React.memo(Tracker);
