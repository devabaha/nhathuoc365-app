import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Shimmer from 'react-native-shimmer';

import appConfig from 'app-config';
import {
  SKELETON_COLOR,
  CONTENT_SKELETON_COLOR,
} from 'src/components/SkeletonLoading/constants';

import {Container} from 'src/components/Layout';

const styles = StyleSheet.create({
  shimmer: {
    marginBottom: 6,
    flex: 1,
  },
  title: {
    width: 100,
    height: 20,
    borderRadius: 15,
    marginBottom: 15,
    marginLeft: 15,
  },
  wrapper: {
    flex: 1,
  },
  container: {
    width: appConfig.device.width,
    flex: 1,
  },
  block: {
    marginBottom: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  bodyBlock: {
    paddingBottom: '100%',
  },

  trackContainer: {
    height: '100%',
    width: 5,
    borderRadius: 5,
  },

  contentWrapper: {
    paddingLeft: 15,
  },
  contentContainer: {
    backgroundColor: SKELETON_COLOR,
  },
  padContainer: {
    padding: 15,
    borderRadius: 8,
    width: appConfig.device.width - 50,
    marginBottom: 10,
  },
  content: {
    backgroundColor: CONTENT_SKELETON_COLOR,
    height: 7,
    width: 70,
    borderRadius: 4,
  },
  pad: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 15,
    left: -7.5,
  },
  description1: {
    marginTop: 5,
    width: 100,
    height: 12,
    borderRadius: 6,
  },
  description2: {
    marginTop: 10,
    width: 150,
  },
});

const ProgressTrackingBarSkeleton = () => {
  return (
    <Container centerVertical={false} style={styles.container}>
      <Shimmer style={styles.shimmer}>
        <Text style={styles.wrapper}>
          <Container centerVertical={false} style={styles.block}>
            <View style={[styles.content, styles.title]} />
            <Container row>
              <View style={[styles.contentContainer, styles.trackContainer]} />
              <View>
                {Array.from({length: 5}).map((_, index) => (
                  <View style={styles.contentWrapper}>
                    <View style={[styles.content, styles.pad]} />
                    <Container
                      key={index}
                      centerVertical={false}
                      style={[styles.contentContainer, styles.padContainer]}>
                      <View style={[styles.content, styles.description1]} />
                      <View style={[styles.content, styles.description2]} />
                    </Container>
                  </View>
                ))}
              </View>
            </Container>
          </Container>
        </Text>
      </Shimmer>
    </Container>
  );
};

export default React.memo(ProgressTrackingBarSkeleton);
