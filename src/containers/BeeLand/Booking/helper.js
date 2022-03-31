import React from 'react';
import { StyleSheet } from 'react-native';
import appConfig from 'app-config';
import { PROGRESS_DATA } from './constants';
import ProgressTracker from '../../../components/ProgressTracker';

const styles = StyleSheet.create({
  progressTracker: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderColor: '#ddd'
  }
});
/**
 * @todo active all checkpoint from 0 to the `lastActiveIndex`.
 *
 * @param {number} lastActiveIndex index of last actived checkpoint.
 * @returns {Array} progressData[]
 */
export const getProgressDataActivedComponent = (lastActiveIndex = 0) => {
  const progressData = [...PROGRESS_DATA].map((checkpoint, index) => {
    const tempCheckPoint = { ...checkpoint };
    if (index <= lastActiveIndex) {
      tempCheckPoint.active = true;
    }
    return tempCheckPoint;
  });

  return (
    <ProgressTracker
      checkPointDimensions={{ width: 25, height: 25 }}
      containerStyle={styles.progressTracker}
      data={progressData}
      activeColor={appConfig.colors.primary}
      activeLinkColor={appConfig.colors.primary}
      unActiveLinkColor="#f0f0f0"
    />
  );
};
