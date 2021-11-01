import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';

import appConfig from 'app-config';
import {formatTime} from 'app-helper';
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
  bufferTime,
  isMute = false,
  actionsContainerPointerEvents = 'auto',
  actionsContainerStyle = {},
  onPressMute = () => {},
  onPressFullscreen = () => {},
  onChangingProgress = (progress: number) => {},
  onProgress = (progress: number) => {},
}) => {

  return (
    <View style={{paddingHorizontal: 30}}>
      <ProgressBar
        progress={currentTime / (totalTime || 1)}
        total={totalTime}
        bufferProgress={bufferTime / (totalTime || 1)}
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
    </View>
  );
};

export default React.memo(Tracker);
